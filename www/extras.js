/* =========================================================================
   AMAZING NACIONALIDAD · extras.js
   -------------------------------------------------------------------------
   Trucos para estudiar, plan de 30 días, consejos para el día del examen
   y glosario de palabras difíciles (con emoji para entenderlas mejor).
   ========================================================================= */
(function () {

  /* ---------- Trucos generales ---------- */
  const TRUCOS = [
    { titulo: "Estudia poco, pero cada día", icono: "📅",
      texto: "Es mejor estudiar 20 minutos cada día que 3 horas un solo día. Tu cabeza recuerda mejor así." },
    { titulo: "Repite los fallos", icono: "🔁",
      texto: "La app guarda las preguntas que fallas. Repásalas cada día en 'Repasar fallos' hasta que salgan todas bien." },
    { titulo: "Escucha y repite en voz alta", icono: "🔊",
      texto: "Pulsa el altavoz, escucha la pregunta y repítela en voz alta. Así aprendes a la vez contenido y pronunciación." },
    { titulo: "Usa los trucos de memoria", icono: "💡",
      texto: "Busca la bombilla 💡 en las preguntas. Una frase divertida o una relación entre palabras ayuda a no olvidar." },
    { titulo: "Estudia con otra persona", icono: "👥",
      texto: "Pregunta a un amigo o familiar que también se examina. Explicar algo a otra persona es la mejor forma de aprenderlo." },
    { titulo: "Pon el móvil en español", icono: "📱",
      texto: "Cambia el idioma del móvil a español. Cada día vas a leer muchas palabras nuevas sin darte cuenta." },
    { titulo: "Radio y tele en español", icono: "📻",
      texto: "Pon la radio o la tele en español mientras cocinas o limpias. Tu oído se acostumbra aunque no entiendas todo." },
    { titulo: "Haz simulacros con reloj", icono: "⏱️",
      texto: "Una semana antes del examen, haz un simulacro cada día. Así no te pones nervioso con el tiempo." }
  ];

  /* ---------- Trucos solo para el CCSE ---------- */
  const TRUCOS_CCSE = [
    "Son 25 preguntas y necesitas 15 bien. Puedes fallar 10. ¡Es mucho margen!",
    "La tarea 1 (Gobierno y leyes) tiene 10 preguntas: es la más importante. Empieza por ella.",
    "La tarea 5 (Vida diaria) tiene 7 preguntas y es la más fácil porque es tu vida en España.",
    "Lee la pregunta dos veces. Cuidado con palabras como 'NO', 'nunca' o 'siempre'.",
    "En verdadero/falso, si una frase dice algo exagerado ('siempre', 'todos', 'nunca'), muchas veces es falsa.",
    "No dejes ninguna pregunta en blanco: si no sabes, elige la que te parece más lógica.",
    "Cuando aciertas todas las preguntas de práctica 2 veces seguidas, estás listo/a."
  ];

  /* ---------- Plan de 30 días (cada semana es una lista de casillas) ---------- */
  const PLAN = [
    { semana: 1, titulo: "Empezar y conocer el examen", tareas: [
      "Leer 'Cómo es el examen' del CCSE y del DELE",
      "Estudiar la tarea 5 del CCSE (vida diaria)",
      "Estudiar la tarea 2 del CCSE (derechos y deberes)",
      "Hacer la práctica de lectura 1 y 2",
      "Escuchar las audiciones 1 a 4",
      "Escribir el correo de práctica 1",
      "Preparar tu presentación oral (tarea 1)"
    ]},
    { semana: 2, titulo: "Lo más importante", tareas: [
      "Estudiar la tarea 1 del CCSE (gobierno y leyes) — primera mitad",
      "Estudiar la tarea 1 del CCSE — segunda mitad",
      "Repasar fallos del CCSE",
      "Hacer la práctica de lectura 3",
      "Escuchar las audiciones 5 a 8",
      "Escribir el correo de práctica 2",
      "Describir la foto 1 en voz alta con el reloj"
    ]},
    { semana: 3, titulo: "Completar el temario", tareas: [
      "Estudiar la tarea 3 del CCSE (geografía)",
      "Estudiar la tarea 4 del CCSE (cultura e historia)",
      "Primer simulacro del CCSE",
      "Hacer la práctica de lectura 4 y 5",
      "Escribir el texto de práctica 3",
      "Describir la foto 2 en voz alta",
      "Practicar la conversación en el médico"
    ]},
    { semana: 4, titulo: "Simulacros y repaso final", tareas: [
      "Simulacro del CCSE (objetivo: 20 aciertos o más)",
      "Repasar todos los fallos",
      "Escribir el texto de práctica 4",
      "Repetir todas las audiciones sin mirar el texto",
      "Practicar la conversación en la tienda",
      "Leer los consejos del día del examen",
      "Último simulacro y ¡a descansar!"
    ]}
  ];

  /* ---------- Día del examen ---------- */
  const DIA_EXAMEN = [
    { icono: "🪪", texto: "Lleva el documento de identidad que usaste para inscribirte (pasaporte o NIE). Sin él no puedes entrar." },
    { icono: "📧", texto: "Lleva impresa o en el móvil la confirmación de inscripción con la hora y el lugar." },
    { icono: "✏️", texto: "Lleva bolígrafo y lápiz. Normalmente las respuestas se marcan en una hoja especial: sigue las instrucciones del examinador." },
    { icono: "⏰", texto: "Llega al menos 30 minutos antes. Busca el centro el día anterior si no lo conoces." },
    { icono: "📵", texto: "El móvil debe estar apagado durante el examen." },
    { icono: "😴", texto: "Duerme bien la noche anterior y desayuna. No estudies cosas nuevas el último día." },
    { icono: "🙋", texto: "Si no entiendes una instrucción, levanta la mano y pregunta al examinador." },
    { icono: "🧘", texto: "Si te pones nervioso: respira despacio 3 veces. Tú has estudiado. ¡Puedes hacerlo!" }
  ];

  /* ---------- Glosario de palabras difíciles ---------- */
  const GLOSARIO = [
    { p: "Constitución", i: "📜", d: "La ley más importante de España. Todas las demás leyes deben respetarla." },
    { p: "Cortes Generales", i: "🏛️", d: "El Parlamento de España: Congreso de los Diputados + Senado." },
    { p: "Congreso de los Diputados", i: "🗳️", d: "Cámara de 350 diputados elegidos por el pueblo. Vota las leyes y elige al presidente del Gobierno." },
    { p: "Senado", i: "🏛️", d: "La otra cámara de las Cortes. Representa a los territorios." },
    { p: "Gobierno", i: "👔", d: "El presidente y los ministros. Dirigen el país." },
    { p: "Monarquía parlamentaria", i: "👑", d: "País con Rey, pero gobiernan el Parlamento y el Gobierno elegidos por el pueblo." },
    { p: "Comunidad autónoma", i: "🗺️", d: "Región con su propio parlamento y gobierno. En España hay 17." },
    { p: "Provincia", i: "📍", d: "Parte de una comunidad autónoma. España tiene 50. Ejemplo: Alicante." },
    { p: "Municipio", i: "🏘️", d: "Un pueblo o una ciudad, con su Ayuntamiento." },
    { p: "Ayuntamiento", i: "🏢", d: "El gobierno del pueblo o ciudad. Allí te empadronas." },
    { p: "Alcalde / alcaldesa", i: "🧑‍💼", d: "La persona que dirige el Ayuntamiento." },
    { p: "Empadronarse", i: "📝", d: "Apuntarte en el Ayuntamiento como vecino del lugar donde vives." },
    { p: "Ley", i: "⚖️", d: "Norma que todos deben cumplir." },
    { p: "Derecho", i: "✅", d: "Algo que puedes hacer o recibir. Ejemplo: derecho a la educación." },
    { p: "Deber", i: "📌", d: "Algo que tienes que hacer. Ejemplo: pagar impuestos." },
    { p: "Impuesto", i: "💶", d: "Dinero que pagamos al Estado para escuelas, hospitales, carreteras…" },
    { p: "Elecciones", i: "🗳️", d: "Día en que la gente vota para elegir a sus representantes." },
    { p: "Referéndum", i: "☑️", d: "Votación en la que la gente dice sí o no a una pregunta. La Constitución se aprobó así." },
    { p: "Juez / jueza", i: "👩‍⚖️", d: "Persona que decide en los juicios aplicando la ley." },
    { p: "Tribunal", i: "🏛️", d: "Lugar u órgano donde trabajan los jueces." },
    { p: "Sindicato", i: "🤝", d: "Organización que defiende a los trabajadores." },
    { p: "Huelga", i: "✋", d: "Cuando los trabajadores dejan de trabajar para protestar." },
    { p: "Seguridad Social", i: "🏥", d: "Sistema público de sanidad, paro y pensiones. Cuando trabajas, te dan de alta." },
    { p: "Tarjeta sanitaria", i: "💳", d: "Tarjeta para ir al médico de la sanidad pública." },
    { p: "Centro de salud", i: "🩺", d: "Lugar donde está tu médico de familia." },
    { p: "Paro (desempleo)", i: "📉", d: "No tener trabajo. También el dinero que recibes si pierdes el trabajo." },
    { p: "Cita previa", i: "📆", d: "Pedir día y hora antes de ir a una oficina." },
    { p: "Trámite", i: "📂", d: "Gestión con papeles en una oficina pública." },
    { p: "Nacionalidad", i: "🇪🇸", d: "Ser ciudadano de un país, con sus derechos y deberes." },
    { p: "Residencia", i: "🏠", d: "Vivir legalmente en un país." },
    { p: "Verdadero / Falso", i: "✔️", d: "Verdadero = es así, es correcto. Falso = no es así, es incorrecto." },
    { p: "Simulacro", i: "🎯", d: "Examen de práctica, igual que el real, para entrenar." }
  ];

  window.EXTRAS = { trucos: TRUCOS, trucosCCSE: TRUCOS_CCSE, plan: PLAN, diaExamen: DIA_EXAMEN, glosario: GLOSARIO };
})();
