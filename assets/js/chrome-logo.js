/* Logo cromado en 3D (WebGL, sin dependencias).
   Usa assets/img/logo-height.png: canal L = relieve, canal A = silueta del logo. */
(function(){
  const VS = `attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;uv.y=1.-uv.y;gl_Position=vec4(p,0.,1.);}`;
  const FS = `precision highp float;
varying vec2 uv;
uniform sampler2D T;uniform vec2 tx;uniform vec2 tilt;uniform float t;uniform vec2 lp;
float A(vec2 q){return texture2D(T,q).a;}
float H(vec2 q){return texture2D(T,q).r;}
vec3 env(vec3 r){
  float w=.07*sin(r.x*4.+t*.6)+.04*sin(r.x*9.-t*.9);
  float y=r.y*1.5+.1+tilt.y*.22-tilt.x*.12+w;
  vec3 sky=mix(vec3(.42,.42,.47),vec3(1.,.99,1.),pow(clamp(y,0.,1.),.55));
  sky=mix(sky,vec3(1.,.86,.9),.18*smoothstep(.55,1.,y));
  vec3 gnd=mix(vec3(.015,.015,.02),vec3(.52,.47,.5),pow(clamp(-y*1.25,0.,1.),.7));
  return mix(gnd,sky,smoothstep(-.012,.012,y));
}
void main(){
  vec2 d=tilt*vec2(1.,-1.)*22.*tx;
  float a0=A(uv);
  vec3 col=vec3(0.);float al=0.;
  float hit=0.;float kh=0.;
  for(int i=1;i<=22;i++){float k=float(i)/22.;if(hit<.5&&A(uv-d*k)>.5){hit=1.;kh=k;}}
  if(hit>.5){
    vec3 s=mix(vec3(.30,.29,.32),vec3(.035,.03,.04),kh);
    s+=vec3(.25,.14,.17)*pow(1.-kh,6.);
    col=s;al=1.;
  }
  float fm=smoothstep(.3,.7,a0);
  if(fm>0.){
    vec2 e=tx*1.6;
    float hx=H(uv+vec2(e.x,0.))-H(uv-vec2(e.x,0.));
    float hy=H(uv+vec2(0.,e.y))-H(uv-vec2(0.,e.y));
    vec3 n=normalize(vec3(-hx*6.5,hy*6.5,1.));
    n.xy+=tilt*vec2(.22,-.22);n=normalize(n);
    vec3 r=reflect(vec3(0.,0.,-1.),n);
    vec3 c=env(r);
    vec3 L=normalize(vec3(lp,.9));
    c+=pow(max(dot(r,L),0.),70.)*1.1;
    c+=vec3(.98,.55,.67)*pow(1.-n.z,2.2)*.55;
    col=mix(col,c,fm);al=max(al,fm);
  }
  gl_FragColor=vec4(col*al,al);
}`;
  const MOBILE=matchMedia('(max-width: 820px)');
  function init(wrap){
    // En móvil se muestra el logo blanco estático; el cromado solo se activa en escritorio.
    if(MOBILE.matches){ const h=()=>{ if(!MOBILE.matches){ MOBILE.removeEventListener('change',h); init(wrap); } }; MOBILE.addEventListener('change',h); return; }
    const cv=wrap.querySelector('canvas');
    const gl=cv&&cv.getContext('webgl',{premultipliedAlpha:true,antialias:false,alpha:true});
    if(!gl) return;
    const sh=(ty,src)=>{const s=gl.createShader(ty);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(s);return s};
    let pr;
    try{pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw 0;}catch(e){return}
    gl.useProgram(pr);
    const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    const U=n=>gl.getUniformLocation(pr,n);
    const img=new Image();
    img.onload=()=>{
      const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.LUMINANCE_ALPHA,gl.LUMINANCE_ALPHA,gl.UNSIGNED_BYTE,img);
      [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(p=>gl.texParameteri(gl.TEXTURE_2D,p,gl.CLAMP_TO_EDGE));
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.uniform2f(U('tx'),1/img.width,1/img.height);
      wrap.classList.add('gl-on');
      start();
    };
    img.src=wrap.dataset.height;
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let tgt=[0,0],cur=[0,0],mouse=false,visible=true,raf=0,t0=performance.now();
    addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;mouse=true;tgt=[(e.clientX/innerWidth-.5)*1.6,(e.clientY/innerHeight-.5)*1.4];},{passive:true});
    document.addEventListener('mouseleave',()=>mouse=false);
    new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible&&!raf)raf=requestAnimationFrame(frame)}).observe(wrap);
    function size(){const dpr=Math.min(devicePixelRatio||1,1.75);const r=cv.getBoundingClientRect();cv.width=Math.max(1,Math.round(r.width*dpr));cv.height=Math.max(1,Math.round(r.height*dpr));gl.viewport(0,0,cv.width,cv.height);}
    addEventListener('resize',size);
    function frame(now){
      raf=0;if(!visible||document.hidden||MOBILE.matches)return;
      const t=(now-t0)/1000;
      if(!mouse) tgt=[Math.sin(t*.45)*.55,Math.cos(t*.33)*.35];
      cur[0]+=(tgt[0]-cur[0])*.06;cur[1]+=(tgt[1]-cur[1])*.06;
      gl.uniform2f(U('tilt'),cur[0],cur[1]);gl.uniform1f(U('t'),reduce?0:t);
      gl.uniform2f(U('lp'),-cur[0]*.8+.25,cur[1]*.8+.35);
      wrap.style.setProperty('--rx',(-cur[1]*7).toFixed(2)+'deg');wrap.style.setProperty('--ry',(cur[0]*9).toFixed(2)+'deg');
      gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      if(!reduce) raf=requestAnimationFrame(frame);
    }
    function start(){size();raf=requestAnimationFrame(frame);MOBILE.addEventListener('change',()=>{if(!MOBILE.matches&&!raf){size();raf=requestAnimationFrame(frame)}});document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!raf)raf=requestAnimationFrame(frame)});}
  }
  document.querySelectorAll('[data-chrome-logo]').forEach(init);
})();
