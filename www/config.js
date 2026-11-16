/* =========================================================================
   AMAZING NACIONALIDAD · config.js
   -------------------------------------------------------------------------
   Datos que puedes cambiar sin tocar la lógica de la app.
   Revísalos cada año: el Instituto Cervantes puede cambiar el examen.
   ========================================================================= */
window.CONFIG = {
  nombreApp: "Amazing Nacionalidad",
  version: "0.1 (prueba)",
  anioContenido: 2026,

  /* --- Examen CCSE --- */
  ccse: {
    preguntas: 25,          // preguntas del examen real
    minutos: 45,            // tiempo del examen real
    aprobado: 15,           // aciertos necesarios para aprobar
    // Cuántas preguntas salen de cada tarea en el examen (deben sumar 25)
    reparto: { 1: 10, 2: 3, 3: 2, 4: 3, 5: 7 },
    // Una pregunta cuenta como "dominada" cuando se acierta estas veces seguidas
    aciertosParaDominar: 2,
    preguntasPorPractica: 10
  },

  /* --- Examen DELE A2 --- */
  dele: {
    puntosPorPrueba: 25,
    minimoPorGrupo: 30,     // grupo 1: lectura + escritura · grupo 2: audición + oral
    minimoTotal: 60
  },

  /* --- Voz (lectura en voz alta) --- */
  voz: {
    idioma: "es-ES",
    velocidadNormal: 0.9,   // 1 = normal; más bajo = más despacio
    velocidadLenta: 0.65
  },

  /* --- Enlaces oficiales (se abren en el navegador del móvil) --- */
  enlaces: {
    cervantes: "https://examenes.cervantes.es",
    ccse: "https://examenes.cervantes.es/es/ccse/preparar-prueba",
    dele: "https://examenes.cervantes.es/es/dele/preparar-prueba"
  }
};
