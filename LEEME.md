# Amazing Nacionalidad – CCSE y DELE A2

App Android para preparar los dos exámenes de la nacionalidad española, en español fácil, con audio, trucos y simulacros. Funciona sin internet y no recoge datos personales.

## Qué hay en esta carpeta

| Archivo | Para qué sirve | ¿Lo tocarás? |
| --- | --- | --- |
| `www/config.js` | Reglas del examen (25 preguntas, 45 min, 15 para aprobar, reparto por tareas), velocidad de la voz y enlaces oficiales | Sí, cada año |
| `www/ccse.js` | Las 131 preguntas propias del CCSE, con explicación y truco | Sí, para revisar o añadir |
| `www/dele.js` | Ejercicios del DELE A2: leer, escuchar, escribir y hablar | Sí, para añadir |
| `www/extras.js` | Trucos, plan de 30 días, día del examen y glosario | A veces |
| `www/app.js` | La lógica de la app | Normalmente no |
| `www/styles.css` | Colores y diseño | Normalmente no |
| `www/index.html`, `manifest.webmanifest`, `sw.js`, `icons/` | Página principal, icono y modo sin internet | No |
| `assets/` | Icono y pantalla de carga del APK | No |
| `package.json`, `capacitor.config.json` | Configuración para convertir la web en app Android | No |
| `.github/workflows/apk.yml` | Receta para que GitHub fabrique el APK solo | No |

## Cómo conseguir el APK (igual que con Amazing Jesús)

1. En github.com (cuenta robert347-coder) pulsa **New repository**. Nombre: `amazing-nacionalidad`. Márcalo **Public**. Crear.
2. Pulsa **uploading an existing file** y arrastra TODO el contenido de esta carpeta (incluidas `www`, `assets` y `.github`). Pulsa **Commit changes**.
   - Ojo: `.github` es una carpeta "oculta". Si no la ves en tu ordenador, en GitHub usa **Add file → Create new file**, escribe como nombre `.github/workflows/apk.yml` y pega dentro el contenido de ese archivo.
3. Ve a la pestaña **Actions**. Verás "Construir APK" en marcha (tarda unos 5-8 minutos).
4. Cuando termine con ✅, ve a **Releases** y descarga `AmazingNacionalidad-prueba.apk` desde tu móvil.
5. Ábrelo en el móvil. Android pedirá permiso para "instalar apps de origen desconocido": acéptalo solo para esta instalación.

## Cómo probarla en el ordenador (sin móvil)

En una terminal, dentro de la carpeta `www`:

```
python3 -m http.server 8000
```

Abre `http://localhost:8000` en Chrome. La voz usará la del navegador.

## Cómo cambiar contenido

1. Edita `ccse.js`, `dele.js` o `extras.js` (en GitHub, pulsa el lápiz ✏️ sobre el archivo).
2. En las preguntas, `c` es la respuesta correcta **contando desde 0** (0 = primera opción).
3. Sube el número de `VERSION` en `sw.js` (`an-v1` → `an-v2`).
4. Al guardar, GitHub fabrica un APK nuevo automáticamente.

## Antes de publicar en Google Play (pendiente)

- **Revisar todas las preguntas con el Manual CCSE del año** (el Instituto Cervantes lo actualiza cada año).
- No usar el logo ni el nombre del Instituto Cervantes como si fuera oficial. Mantener el aviso de "app no oficial".
- Política de privacidad breve (la app no recoge datos: es fácil de redactar).
- Cuenta de desarrollador de Google Play (25 $, pago único) y el periodo de prueba cerrada con probadores que exige Google a las cuentas personales nuevas.
- Firmar el APK/AAB de publicación (el APK de esta receta es solo "de prueba").

## Privacidad (RGPD / LOPDGDD)

No pide nombre ni datos, no tiene publicidad ni analíticas, no envía nada a internet. Progreso y textos escritos se guardan solo en el móvil (localStorage). La voz usa el motor de texto a voz del propio Android.
