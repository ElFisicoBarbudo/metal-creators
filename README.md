# Metal CREATORS · Landing page

Web estática (un solo `index.html`, sin instalar nada) del hub Metal CREATORS, pensada para enviar a marcas.
Se publica sola con GitHub Pages cada vez que se guarda un cambio en la rama `main`.

## La forma fácil: la hoja de Google Sheets

Los creadores, los reels y los textos principales (cifras, cita, email, enlace al dossier) se leen en vivo de la hoja
**MCW: Datos de la web** (carpeta METAL CREATORS WEEKEND en Drive). Cambia una celda y la web lo muestra al recargar.
La hoja tiene que estar compartida como «Cualquier persona con el enlace: lector».

- Pestaña **Creadores**: una fila por creador. Seguidores en miles (`181` = 181k). Para uno nuevo, añade una fila y sube su foto a `assets/creators/` con el nombre de la columna `foto`.
- Pestaña **Contenido**: una fila por reel. Para uno nuevo, sube la portada vertical a `assets/content/`.
- Pestaña **Textos**: no cambies la columna `clave`, solo `valor`.

Si la hoja no se puede leer, la web usa los datos guardados en `index.html`.

## Cómo editar el código desde el navegador

1. Abre `index.html` en GitHub y pulsa el lápiz ✏️ (*Edit this file*).
2. Haz el cambio y pulsa **Commit changes…** → **Commit changes**.
3. En 1-2 minutos la web se actualiza sola.

### Números y datos (al final del archivo, bloque `DATOS`)

Busca (Ctrl+F) estas palabras:

- `const CREATORS` → un creador por línea. `ig`, `tt` y `yt` son seguidores **en miles** (`181` = 181k, `0.25` = 250).
  El total de seguidores de la cabecera se calcula solo. Para añadir a alguien, copia una línea, cambia los datos
  y sube su foto cuadrada a `assets/creators/` con el nombre que pongas en `img`.
- `const CONTENT` → los reels. `v` es el número tal cual se muestra (`"160k"`), `url` el enlace al reel.
  Para uno nuevo, copia una línea y sube la portada vertical a `assets/content/`.

### Textos

Todo el texto visible está en el HTML. Busca con Ctrl+F la frase que quieras cambiar y sustitúyela.
Cifras que están escritas a mano en el texto (no se calculan solas): `+750k` (cabecera y sección de contenido)
y las de la sección de marcas (`+300k`, `+80k`, `+56k`, `+260k`).

### Colores

Al principio del archivo, en `:root`: `--red` es el color de acento (ahora rosa `#fab4c5`).

## Logo 3D de la cabecera

El logo cromado se dibuja con `assets/js/chrome-logo.js` a partir de `assets/img/logo-height.png` (relieve + silueta del logo). Si algún día cambia el logo, hay que regenerar esa imagen; si el navegador no soporta WebGL, se muestra una versión plana del logo.

## Playlist de Spotify

Para cambiar la playlist de la sección «Banda sonora», añade en la pestaña **Textos** de la hoja una fila con la clave `spotify_url` y el enlace de la playlist como valor.
