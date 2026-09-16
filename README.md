# Constante de Catalán — PWA

Aplicación web progresiva (PWA) para calcular la constante de Catalán
G = Σ_{k≥0} (−1)^k/(2k+1)² truncando la serie en k = K y comparando el error
cometido con el valor exacto. Es responsiva, funciona en móvil, tablet y
escritorio, y opera **sin conexión** una vez visitada o instalada.

## Estructura de archivos

```
catalan-g-pwa/
├── index.html              Aplicación completa (HTML + CSS + JS)
├── manifest.webmanifest    Manifiesto PWA (nombre, iconos, colores, instalación)
├── sw.js                   Service worker (caché offline)
├── favicon.ico             Favicon multiplataforma
└── icons/                  Iconos e imágenes
    ├── icon.svg                            Icono vectorial
    ├── favicon-16.png / favicon-32.png     Favicons PNG
    ├── icon-48/72/96/144/192/512.png       Iconos estándar PWA
    ├── icon-maskable-192.png               Icono adaptativo con zona segura
    ├── icon-maskable-512.png
    ├── apple-touch-icon.png                Icono para iOS (180×180)
    ├── screenshot-mobile.png               Captura para instalación enriquecida
    └── screenshot-desktop.png
```

## Despliegue en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `catalan-g`).

2. Sube **el contenido** de esta carpeta a la raíz del repositorio
   (`index.html` debe quedar en la raíz, no dentro de una subcarpeta):

   - Opción web: en el repositorio, «Add file → Upload files» y arrastra
     todos los archivos y la carpeta `icons/`.
   - Opción con git:

     ```bash
     git init
     git add .
     git commit -m "PWA: constante de Catalán"
     git branch -M main
     git remote add origin https://github.com/TU-USUARIO/catalan-g.git
     git push -u origin main
     ```

3. Activa GitHub Pages: **Settings → Pages → Build and deployment →
   Source: Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.

4. En uno o dos minutos la app estará disponible en:

   `https://TU-USUARIO.github.io/catalan-g/`

   GitHub Pages sirve por HTTPS, requisito imprescindible para que el
   service worker y la instalación como app funcionen.

5. Comprobación: en Chrome DevTools, pestaña «Lighthouse», ejecuta una
   auditoría; la app debe aparecer como instalable y operativa sin conexión.

> Nota: todas las rutas son relativas (`./`, `icons/…`), por lo que la app
> funciona igualmente en `usuario.github.io/repo/` o en un dominio propio.

## Probar en local

Los service workers necesitan HTTP; abriendo `index.html` con doble clic
(protocolo `file://`) la app funciona, pero sin caché offline ni instalación:

```bash
cd catalan-g-pwa
python3 -m http.server 8080
# abre http://localhost:8080
```

## Instalación en dispositivos

- **Android (Chrome) / escritorio (Chrome, Edge)**: aparece el botón
  «Instalar aplicación» en la propia página, o el icono de instalación en la
  barra de direcciones.
- **iPhone / iPad (Safari)**: botón Compartir → «Añadir a pantalla de
  inicio». La app muestra un aviso con estos pasos la primera vez.
- La app instalada se abre en su propia ventana, sin barra del navegador, y
  funciona completamente sin conexión.

## Actualizar la app

Si modificas `index.html` u otros archivos, incrementa el nombre de la
constante `CACHE` al principio de `sw.js` (por ejemplo,
`catalan-g-v1.0.1`) y vuelve a subir los archivos. Así los visitantes
recibirán la nueva versión al volver a conectarse.
