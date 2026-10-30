# TravelAI - Asistente inteligente de turismo

## Archivos incluidos
- `index.html`: página principal de turismo.
- `styles.css`: diseño adaptable a computadora, tablet y celular.
- `script.js`: chat, validación, historial de sesión, sugerencias y modo oscuro.
- `backend/server.js`: servidor que conecta el chat con OpenAI.
- `backend/package.json`: dependencias del servidor.
- `backend/.env.example`: ejemplo de variables privadas.

## Subir la página a GitHub Pages
1. Creá un repositorio en GitHub.
2. Subí `index.html`, `styles.css`, `script.js` y `README.md` a la raíz del repositorio.
3. Entrá en Settings > Pages.
4. Elegí Deploy from a branch, seleccioná `main` y `/ (root)`, y guardá.

## Conectar el asistente con IA
GitHub Pages publica la parte visual, pero no ejecuta Node.js. Para que el chat responda con IA real:
1. Publicá la carpeta `backend` en un servicio que ejecute Node.js.
2. Configurá las variables `OPENAI_API_KEY` y `OPENAI_MODEL` en ese servicio.
3. Dentro de `backend`, ejecutá `npm install` y luego `npm start`.
4. Copiá la URL pública del servidor y reemplazá `API_URL` al comienzo de `script.js` por `https://TU-SERVIDOR/api/chat`.

No subas la clave privada ni un archivo `.env` a GitHub. La API puede tener costos independientes de ChatGPT.
