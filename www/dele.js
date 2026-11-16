/* =========================================================================
   AMAZING NACIONALIDAD · dele.js
   -------------------------------------------------------------------------
   Contenido para preparar el DELE A2. Los textos, audios y temas son
   PROPIOS: imitan el tipo de tarea del examen, pero no copian los modelos
   oficiales del Instituto Cervantes.

   En las preguntas, "c" es la opción correcta empezando a contar en 0.
   ========================================================================= */
(function () {

  /* ---------- 1. CÓMO ES CADA PRUEBA (explicación muy sencilla) ---------- */
  const PRUEBAS = [
    {
      id: "lectura", icono: "📖", titulo: "Leer", oficial: "Comprensión de lectura",
      minutos: 60, puntos: 25, grupo: 1,
      como: [
        "Lees textos cortos: correos, anuncios, carteles y una historia.",
        "Hay 4 tareas y 25 preguntas. Cada pregunta tiene 3 respuestas (a, b, c).",
        "Tienes 60 minutos para todo."
      ],
      trucos: [
        "Lee primero las preguntas y después el texto. Así sabes qué buscar.",
        "No necesitas entender todas las palabras. Busca las palabras de la pregunta en el texto.",
        "Cuidado con las trampas: la respuesta incorrecta muchas veces usa palabras del texto, pero dice otra cosa.",
        "Si no sabes una respuesta, marca una. No restan puntos los errores.",
        "Mira el reloj: unos 15 minutos por tarea."
      ]
    },
    {
      id: "audicion", icono: "🎧", titulo: "Escuchar", oficial: "Comprensión auditiva",
      minutos: 40, puntos: 25, grupo: 2,
      como: [
        "Escuchas conversaciones, mensajes de voz y anuncios de radio.",
        "Hay 4 tareas y 25 preguntas.",
        "Cada audio se escucha DOS veces. Tienes unos 40 minutos."
      ],
      trucos: [
        "Antes de escuchar, lee las preguntas y las opciones.",
        "Primera escucha: marca la respuesta que crees. Segunda escucha: comprueba.",
        "Atención a los números, horas, días y lugares: salen mucho.",
        "Escucha palabras como 'pero', 'al final' o 'mejor': muchas veces cambian la respuesta.",
        "Practica cada día con la radio o la tele en español, aunque no entiendas todo."
      ]
    },
    {
      id: "escritura", icono: "✍️", titulo: "Escribir", oficial: "Expresión e interacción escritas",
      minutos: 45, puntos: 25, grupo: 1,
      como: [
        "Tarea 1: contestas a un mensaje o correo (60-70 palabras).",
        "Tarea 2: eliges un tema entre dos y escribes un texto (70-80 palabras).",
        "Tienes 45 minutos para las dos tareas."
      ],
      trucos: [
        "Responde a TODO lo que pide el enunciado. Haz una lista y táchalo al escribir.",
        "Usa siempre la misma estructura: saludo, motivo, información, despedida.",
        "Frases cortas y claras son mejores que frases largas con errores.",
        "Cuenta las palabras. Ni muchas menos ni muchas más.",
        "Guarda 5 minutos al final para revisar acentos, mayúsculas y verbos."
      ]
    },
    {
      id: "oral", icono: "🗣️", titulo: "Hablar", oficial: "Expresión e interacción orales",
      minutos: 12, puntos: 25, grupo: 2,
      como: [
        "Antes de entrar tienes un tiempo para preparar con papel (unos 12 minutos).",
        "Tarea 1: hablas de un tema durante 2-3 minutos.",
        "Tarea 2: describes una foto durante 2-3 minutos.",
        "Tarea 3: haces una conversación con el examinador (3-4 minutos)."
      ],
      trucos: [
        "Prepara antes en casa: tu presentación, tu familia, tu trabajo, tu barrio y tu día normal.",
        "Si no sabes una palabra, explícala con otras: 'es una cosa para…'.",
        "Si no entiendes, pide: '¿Puede repetir, por favor?'. No pasa nada.",
        "Habla despacio. Es mejor despacio y claro que rápido y con errores.",
        "Usa conectores: 'primero', 'después', 'también', 'porque', 'al final'."
      ]
    }
  ];

  /* ---------- 2. PRÁCTICA DE LECTURA ---------- */
  const LECTURA = [
    {
      id: "l1", titulo: "Un correo de una amiga",
      texto:
`Hola, Amina:

¿Qué tal estás? Te escribo porque el sábado es mi cumpleaños y quiero hacer una comida en mi casa. Va a venir mi familia y algunos compañeros del trabajo. Empezamos a las dos de la tarde.

Mi casa está cerca de la estación de autobuses, en la calle Mayor, número 15, tercer piso. Si vienes en autobús, baja en la última parada.

No tienes que traer nada, pero si quieres, puedes hacer ese pastel de dátiles tan rico.

Ah, y el domingo voy a la playa con mi hermana. ¿Quieres venir?

Un beso,
Lucía`,
      preguntas: [
        { p: "¿Por qué escribe Lucía?", o: ["Para invitar a Amina a su cumpleaños", "Para pedir ayuda con el trabajo", "Para vender su casa"], c: 0,
          e: "Lucía dice: 'el sábado es mi cumpleaños y quiero hacer una comida'." },
        { p: "¿A qué hora empieza la comida?", o: ["A las 12:00", "A las 14:00", "A las 20:00"], c: 1,
          e: "'A las dos de la tarde' = 14:00." },
        { p: "¿Qué tiene que llevar Amina?", o: ["Un pastel, obligatoriamente", "Nada, no es necesario", "Bebidas para todos"], c: 1,
          e: "Lucía dice 'No tienes que traer nada'. El pastel es solo 'si quieres'. ¡Cuidado con esta trampa!" },
        { p: "¿Qué hace Lucía el domingo?", o: ["Trabaja", "Va a la playa con su hermana", "Hace otra comida"], c: 1,
          e: "'El domingo voy a la playa con mi hermana'." }
      ]
    },
    {
      id: "l2", titulo: "Anuncios y carteles",
      texto:
`A) FARMACIA LÓPEZ
Lunes a viernes: 9:00 - 14:00 y 17:00 - 21:00.
Sábados: solo por la mañana. Domingos: cerrado.

B) SE ALQUILA HABITACIÓN
En piso compartido, cerca del hospital. 300 € al mes con agua y luz. No se admiten animales. Llamar por la tarde: 600 000 000.

C) AYUNTAMIENTO – AVISO
La oficina de empadronamiento cambia de lugar. Desde el 1 de marzo está en la Plaza de España, 2. Es necesario pedir cita previa por teléfono o internet.

D) CURSO GRATIS DE ESPAÑOL
Para personas adultas. Martes y jueves de 18:00 a 20:00 en la biblioteca. Inscripción en la biblioteca hasta el 15 de septiembre.`,
      preguntas: [
        { p: "A) ¿Cuándo está cerrada la farmacia?", o: ["El sábado por la tarde y el domingo", "Todos los días a mediodía", "Solo el lunes"], c: 0,
          e: "El sábado abre solo por la mañana (cerrado por la tarde) y el domingo está cerrada." },
        { p: "B) En la habitación…", o: ["se pueden tener perros", "el precio incluye agua y luz", "hay que llamar por la mañana"], c: 1,
          e: "'300 € al mes con agua y luz'. No se admiten animales y hay que llamar por la tarde." },
        { p: "C) Para empadronarse ahora…", o: ["hay que ir sin cita a la oficina antigua", "hay que pedir cita y ir a la Plaza de España", "solo se puede hacer en la biblioteca"], c: 1,
          e: "La oficina nueva está en la Plaza de España y 'es necesario pedir cita previa'." },
        { p: "D) El curso de español…", o: ["cuesta dinero", "es dos días a la semana", "es para niños"], c: 1,
          e: "Es 'martes y jueves': dos días. Es gratis y para adultos." }
      ]
    },
    {
      id: "l3", titulo: "Tres personas buscan curso",
      texto:
`KARIM: Trabajo de lunes a viernes por la mañana. Quiero mejorar mi español para hablar con los clientes de la tienda.

OLENA: Tengo dos hijos pequeños y solo puedo estudiar cuando están en el colegio, por la mañana. Necesito aprender a escribir correos.

MAMADOU: Voy a hacer el examen DELE A2 en mayo. Busco un curso intensivo los fines de semana.

Cursos:
1. Español para el examen: sábados y domingos, 4 horas al día.
2. Conversación: lunes y miércoles, de 18:00 a 20:00.
3. Escribir en español: de lunes a jueves, de 10:00 a 12:00.`,
      preguntas: [
        { p: "¿Qué curso es mejor para Karim?", o: ["El curso 1", "El curso 2", "El curso 3"], c: 1,
          e: "Karim trabaja por la mañana y quiere hablar: el curso 2 es de conversación y es por la tarde." },
        { p: "¿Qué curso es mejor para Olena?", o: ["El curso 1", "El curso 2", "El curso 3"], c: 2,
          e: "Olena solo puede por la mañana y quiere escribir: el curso 3." },
        { p: "¿Qué curso es mejor para Mamadou?", o: ["El curso 1", "El curso 2", "El curso 3"], c: 0,
          e: "Mamadou quiere preparar el examen los fines de semana: el curso 1." }
      ]
    },
    {
      id: "l4", titulo: "Una historia: mi primer año en España",
      texto:
`Me llamo Rachid y llegué a Alicante hace cinco años. Al principio no hablaba nada de español y todo era difícil: comprar en el mercado, ir al médico o hablar con los vecinos.

Mi primer trabajo fue en el campo, recogiendo naranjas. Mis compañeros eran de muchos países y hablábamos en español, aunque con muchos errores. Por las tardes iba a clases gratis en una asociación del barrio. Mi profesora, Carmen, me enseñó una cosa muy importante: no tener miedo a equivocarme.

Después conseguí trabajo en un restaurante. Allí aprendí mucho vocabulario porque tenía que hablar con los clientes todos los días. Ahora soy cocinero y mi plato favorito es el arroz con verduras.

El año pasado aprobé el DELE A2 y el CCSE. Ahora estoy esperando la respuesta de la nacionalidad.`,
      preguntas: [
        { p: "Cuando llegó a España, Rachid…", o: ["ya hablaba un poco de español", "no hablaba español", "hablaba muy bien español"], c: 1,
          e: "'No hablaba nada de español'." },
        { p: "¿Dónde aprendió Rachid más vocabulario?", o: ["En el campo", "En el restaurante", "En el mercado"], c: 1,
          e: "'En un restaurante… aprendí mucho vocabulario'." },
        { p: "¿Qué le enseñó su profesora Carmen?", o: ["A cocinar arroz", "A no tener miedo a equivocarse", "A recoger naranjas"], c: 1,
          e: "'Me enseñó… no tener miedo a equivocarme'." },
        { p: "¿Cuál es la situación de Rachid ahora?", o: ["Ya es español", "Espera la respuesta de la nacionalidad", "Va a hacer el examen DELE"], c: 1,
          e: "'Ahora estoy esperando la respuesta de la nacionalidad'. Ya aprobó los exámenes." }
      ]
    },
    {
      id: "l5", titulo: "Mensajes del móvil",
      texto:
`1) PAPÁ: Hoy salgo tarde del trabajo. ¿Puedes recoger tú a los niños del colegio a las 5? Gracias.

2) CENTRO DE SALUD: Le recordamos su cita con el doctor Ruiz el jueves 12 a las 9:30. Si no puede venir, llame para cancelar.

3) MARTA: El cine de esta noche no puede ser, me encuentro mal. ¿Vamos el viernes mejor?

4) BANCO: Su nueva tarjeta está lista. Puede recogerla en su oficina con el DNI o NIE.`,
      preguntas: [
        { p: "1) ¿Qué pide el padre?", o: ["Que alguien recoja a los niños", "Que alguien vaya al trabajo", "Que los niños salgan tarde"], c: 0,
          e: "'¿Puedes recoger tú a los niños del colegio?'" },
        { p: "2) Si no puedes ir al médico, tienes que…", o: ["ir otro día sin avisar", "llamar para cancelar", "enviar un correo al doctor"], c: 1,
          e: "'Si no puede venir, llame para cancelar'." },
        { p: "3) Marta quiere…", o: ["ir al cine hoy", "cambiar el cine al viernes", "ir al médico el viernes"], c: 1,
          e: "'¿Vamos el viernes mejor?'" },
        { p: "4) Para recoger la tarjeta necesitas…", o: ["tu documento de identidad", "una cita en el ayuntamiento", "la tarjeta antigua"], c: 0,
          e: "'Con el DNI o NIE'." }
      ]
    }
  ];

  /* ---------- 3. PRÁCTICA DE AUDICIÓN (la app lo lee en voz alta) ----------
     guion: lista de frases. v = voz "A" o "B" (la B se lee con otro tono). */
  const AUDICION = [
    { id: "a1", titulo: "En la panadería",
      guion: [{ v: "A", t: "Buenos días. ¿Qué le pongo?" }, { v: "B", t: "Una barra de pan y cuatro croissants, por favor." }, { v: "A", t: "Lo siento, croissants no quedan. ¿Le pongo magdalenas?" }, { v: "B", t: "Vale, entonces seis magdalenas." }],
      p: "¿Qué compra finalmente la mujer?", o: ["Pan y croissants", "Pan y magdalenas", "Solo croissants"], c: 1,
      e: "No quedan croissants, así que compra pan y seis magdalenas. La palabra 'entonces' cambia la respuesta." },
    { id: "a2", titulo: "Mensaje de voz del médico",
      guion: [{ v: "A", t: "Hola, le llamamos del centro de salud. Su cita del martes se cambia al miércoles a la misma hora, a las diez y media. Si no le va bien, llame al centro. Gracias." }],
      p: "¿Cuándo es la nueva cita?", o: ["El martes a las 10:30", "El miércoles a las 10:30", "El miércoles a las 12:30"], c: 1,
      e: "La cita se cambia 'al miércoles a la misma hora, a las diez y media'." },
    { id: "a3", titulo: "En la estación",
      guion: [{ v: "A", t: "Atención, por favor. El tren con destino a Madrid, que salía a las cuatro y cuarto, saldrá con veinte minutos de retraso, por el andén número tres." }],
      p: "¿A qué hora sale ahora el tren a Madrid?", o: ["A las 16:15", "A las 16:35", "A las 16:20"], c: 1,
      e: "Salía a las 16:15 y tiene 20 minutos de retraso: 16:35." },
    { id: "a4", titulo: "Buscando piso",
      guion: [{ v: "B", t: "Hola, llamo por el piso del anuncio. ¿Cuántas habitaciones tiene?" }, { v: "A", t: "Tiene tres habitaciones y dos baños. Está en el cuarto piso, pero no tiene ascensor." }, { v: "B", t: "Uy, con mi madre mayor eso es un problema. Gracias de todas formas." }],
      p: "¿Por qué no quiere el piso la mujer?", o: ["Porque es pequeño", "Porque no tiene ascensor", "Porque tiene un solo baño"], c: 1,
      e: "'No tiene ascensor' y su madre es mayor." },
    { id: "a5", titulo: "En la radio: el tiempo",
      guion: [{ v: "A", t: "Mañana, sábado, hará sol por la mañana en toda la Comunidad Valenciana. Por la tarde llegarán nubes y es posible que llueva en el interior. En la costa, las temperaturas estarán entre quince y veintidós grados." }],
      p: "¿Qué tiempo hará el sábado por la tarde?", o: ["Sol en toda la comunidad", "Nubes y quizá lluvia en el interior", "Nieve en la costa"], c: 1,
      e: "'Por la tarde llegarán nubes y es posible que llueva en el interior'." },
    { id: "a6", titulo: "Quedando con un amigo",
      guion: [{ v: "A", t: "¿Quedamos el jueves para tomar algo?" }, { v: "B", t: "El jueves tengo clase de español. ¿Y el viernes?" }, { v: "A", t: "El viernes trabajo hasta tarde. ¿El sábado por la mañana?" }, { v: "B", t: "Perfecto, el sábado a las once en la plaza." }],
      p: "¿Cuándo quedan?", o: ["El jueves", "El viernes", "El sábado"], c: 2,
      e: "El jueves y el viernes no pueden. Quedan 'el sábado a las once'." },
    { id: "a7", titulo: "En la tienda de ropa",
      guion: [{ v: "B", t: "Perdone, ¿tiene esta camisa en azul?" }, { v: "A", t: "En azul no, solo en blanco y en negro. Pero tenemos esta otra en azul, que está rebajada: cuesta quince euros." }, { v: "B", t: "Muy bien, me llevo la azul rebajada." }],
      p: "¿Cuánto paga el cliente?", o: ["50 €", "15 €", "5 €"], c: 1,
      e: "Compra la camisa azul rebajada, que cuesta quince euros." },
    { id: "a8", titulo: "Mensaje del colegio",
      guion: [{ v: "A", t: "Buenas tardes, familias. Les recordamos que el viernes no hay clase porque es fiesta local. Las clases empiezan otra vez el lunes a las nueve. El comedor funciona normal el jueves." }],
      p: "¿Qué pasa el viernes?", o: ["Hay clase hasta las nueve", "No hay clase porque es fiesta", "Solo funciona el comedor"], c: 1,
      e: "'El viernes no hay clase porque es fiesta local'." }
  ];

  /* ---------- 4. PRÁCTICA DE ESCRITURA ---------- */
  const ESCRITURA = [
    { id: "e1", tarea: 1, titulo: "Contestar a un correo: invitación",
      enunciado: "Tu amigo Pablo te escribe: «¡Hola! El domingo hago una barbacoa en mi casa del campo. ¿Puedes venir? ¿Qué te gusta comer? Un abrazo». Contesta a Pablo: saluda, di si puedes ir o no y por qué, di qué te gusta comer, ofrece llevar algo y despídete.",
      min: 60, max: 70,
      plantilla: ["Hola, Pablo:", "¡Gracias por la invitación! (Sí, puedo ir / Lo siento, no puedo ir porque…)", "Me gusta mucho… / No como…", "¿Quieres que lleve…?", "Un abrazo, (tu nombre)"],
      modelo: "Hola, Pablo:\n\n¡Muchas gracias por la invitación! Sí, puedo ir el domingo, porque ese día no trabajo. Me gusta mucho la carne a la brasa y también las verduras, pero no como cerdo. ¿Quieres que lleve algo? Puedo llevar una ensalada y pan. ¿A qué hora empieza la barbacoa? ¿Cómo llego a tu casa del campo?\n\nHasta el domingo.\nUn abrazo,\nYusuf",
      checklist: ["He saludado", "He dicho si puedo ir y por qué", "He dicho qué me gusta comer", "He ofrecido llevar algo", "Me he despedido", "Tengo entre 60 y 70 palabras"] },
    { id: "e2", tarea: 1, titulo: "Contestar a un mensaje: cambiar una cita",
      enunciado: "Tu profesora de español, Ana, te escribe: «Mañana tenemos tutoría a las 17:00 para preparar el examen». No puedes ir. Escribe a Ana: saluda, explica por qué no puedes ir, propón otro día y hora, pregunta algo sobre el examen y despídete.",
      min: 60, max: 70,
      plantilla: ["Hola, Ana:", "Lo siento mucho, mañana no puedo ir porque…", "¿Podemos quedar el… a las…?", "Una pregunta: ¿…?", "Muchas gracias. Un saludo, (tu nombre)"],
      modelo: "Hola, Ana:\n\nLo siento mucho, pero mañana no puedo ir a la tutoría porque tengo que trabajar hasta las ocho. ¿Podemos quedar el jueves a las cinco? Ese día salgo antes. También tengo una pregunta: ¿qué parte del examen es más difícil? Creo que necesito practicar más la parte de escuchar.\n\nMuchas gracias por tu ayuda.\nUn saludo,\nFátima",
      checklist: ["He saludado", "He explicado por qué no puedo ir", "He propuesto otro día y hora", "He hecho una pregunta", "Me he despedido", "Tengo entre 60 y 70 palabras"] },
    { id: "e3", tarea: 2, titulo: "Texto: tu ciudad",
      enunciado: "Escribe un texto sobre la ciudad o el pueblo donde vives: dónde está, cómo es, qué se puede hacer allí, qué te gusta más y qué no te gusta.",
      min: 70, max: 80,
      plantilla: ["Vivo en… Está en…", "Es una ciudad/un pueblo (grande, pequeño, tranquilo…)", "Allí se puede…", "Lo que más me gusta es…", "Lo que no me gusta es…", "En resumen,…"],
      modelo: "Vivo en Novelda, un pueblo que está cerca de Alicante. Es un pueblo tranquilo y bonito, con muchos parques y un mercado los sábados. Allí se puede pasear, hacer deporte y comer en restaurantes buenos y baratos. Lo que más me gusta es que la playa está a media hora en coche. Lo que no me gusta es que hay pocos autobuses por la noche. En resumen, estoy muy contento de vivir aquí.",
      checklist: ["He dicho dónde está", "He dicho cómo es", "He dicho qué se puede hacer", "He dicho qué me gusta y qué no", "He usado conectores (y, pero, porque, también)", "Tengo entre 70 y 80 palabras"] },
    { id: "e4", tarea: 2, titulo: "Texto: un día especial (en pasado)",
      enunciado: "Escribe sobre un día especial de tu vida: cuándo fue, dónde estabas, con quién, qué pasó y cómo te sentiste. Usa el pasado.",
      min: 70, max: 80,
      plantilla: ["Un día especial para mí fue…", "Estaba en… con…", "Primero… Después… Al final…", "Me sentí muy…", "Nunca voy a olvidar…"],
      modelo: "Un día muy especial para mí fue el día que llegó mi familia a España, en 2021. Yo estaba en el aeropuerto de Alicante con un amigo. Primero esperé dos horas porque el avión llegó tarde. Después vi a mi mujer y a mis hijos y corrí a abrazarlos. Al final fuimos todos a cenar a casa y hablamos hasta muy tarde. Me sentí muy feliz y tranquilo. Nunca voy a olvidar ese día.",
      checklist: ["He dicho cuándo y dónde", "He dicho con quién", "He contado qué pasó en orden (primero, después, al final)", "He dicho cómo me sentí", "He usado verbos en pasado", "Tengo entre 70 y 80 palabras"] }
  ];

  /* ---------- 5. PRÁCTICA ORAL ---------- */
  const ORAL = [
    { id: "o1", tarea: 1, titulo: "Presentarte y hablar de tu vida", segundos: 150,
      explicacion: "Hablas tú solo 2-3 minutos sobre un tema. Prepara 4 o 5 ideas y di 2 frases de cada una.",
      frases: ["Me llamo… y soy de…", "Vivo en España desde hace… años.", "Trabajo de… / Ahora estoy buscando trabajo.", "Vivo con… En mi familia somos…", "En mi tiempo libre me gusta…", "Lo que más me gusta de España es…", "Quiero ser español/española porque…"],
      modelo: "Me llamo Samira y soy de Marruecos. Vivo en España desde hace ocho años, en Alicante. Trabajo en una residencia de mayores, cuidando a personas mayores. Me gusta mucho mi trabajo porque ayudo a la gente. Estoy casada y tengo dos hijos: Adam, de diez años, y Nour, de seis. En mi tiempo libre me gusta pasear por la playa con mi familia y cocinar. Lo que más me gusta de España es la gente, que es muy simpática, y el buen tiempo. Quiero la nacionalidad porque mi vida y la vida de mis hijos están aquí." },
    { id: "o2", tarea: 1, titulo: "Hablar de tu día normal", segundos: 150,
      explicacion: "Cuenta un día normal desde que te levantas hasta que te acuestas. Usa horas y conectores.",
      frases: ["Normalmente me levanto a las…", "Primero… luego… después…", "Por la mañana… / Por la tarde… / Por la noche…", "Como a las… y ceno a las…", "Los fines de semana es diferente:…"],
      modelo: "Normalmente me levanto a las seis y media. Primero me ducho y desayuno café con tostadas. Luego llevo a mis hijos al colegio y después voy al trabajo en autobús. Trabajo en un almacén de ocho a tres. Como en casa sobre las tres y media. Por la tarde descanso un poco y estudio español media hora. Por la noche ceno con mi familia y vemos la tele. Me acuesto a las once. Los fines de semana es diferente: vamos al parque o visitamos a amigos." },
    { id: "o3", tarea: 2, titulo: "Describir una foto: una familia en el parque", segundos: 150,
      escena: "👨‍👩‍👧‍👦🌳☀️ Imagina la foto: una familia en un parque. El padre y la madre están sentados en un banco. Una niña juega con un perro y un niño come un helado. Hace sol.",
      explicacion: "Describe qué ves: quién hay, dónde están, qué hacen, cómo son, y qué crees que pasa antes o después.",
      frases: ["En la foto hay…", "Están en… / Parece que es…", "A la derecha / a la izquierda / en el centro hay…", "El padre está + -ando/-iendo (sentado, hablando…)", "Creo que son… / Me parece que…", "Seguramente después van a…"],
      modelo: "En la foto hay una familia en un parque. Creo que es domingo porque hace sol y parecen tranquilos. A la izquierda, el padre y la madre están sentados en un banco y están hablando. En el centro, una niña está jugando con un perro marrón. Parece muy contenta. A la derecha, un niño está comiendo un helado de chocolate. Al fondo hay muchos árboles. Me parece que es verano. Seguramente después van a volver a casa a comer." },
    { id: "o4", tarea: 2, titulo: "Describir una foto: en el mercado", segundos: 150,
      escena: "🛒🍅🍊 Imagina la foto: un mercado con frutas y verduras. Una mujer mayor compra tomates. El vendedor sonríe y pesa la fruta. Hay mucha gente.",
      explicacion: "Describe personas, lugar y acciones. Si no sabes una palabra, usa otra más fácil.",
      frases: ["Esta foto es de un mercado.", "Hay una mujer que está comprando…", "El vendedor está + -ando…", "Hay muchas frutas: naranjas, tomates…", "Yo también voy al mercado los…"],
      modelo: "Esta foto es de un mercado de frutas y verduras. Hay mucha gente comprando. En el centro hay una señora mayor que está comprando tomates. Lleva un carro de la compra. El vendedor es un hombre joven, está sonriendo y está pesando los tomates. Hay muchas frutas de colores: naranjas, manzanas, plátanos. Creo que es por la mañana. A mí también me gusta ir al mercado los sábados, porque la fruta es más fresca y más barata que en el supermercado." },
    { id: "o5", tarea: 3, titulo: "Conversación: en el médico", segundos: 210,
      escena: "🩺 Situación: vas al centro de salud. El examinador es el médico. Explica qué te pasa y contesta sus preguntas.",
      explicacion: "Es una conversación. Escucha la pregunta, contesta con frases completas y haz tú también alguna pregunta.",
      frases: ["Buenos días, doctor. Me duele…", "Desde hace… días.", "Tengo fiebre / tos / dolor de cabeza.", "¿Tengo que tomar algo?", "¿Cada cuántas horas?", "¿Puede repetir, por favor? No he entendido."],
      modelo: "— Buenos días. ¿Qué le pasa?\n— Buenos días, doctor. Me duele mucho la garganta y tengo fiebre.\n— ¿Desde cuándo?\n— Desde hace tres días.\n— ¿Toma alguna medicina?\n— Solo paracetamol. ¿Tengo que tomar otra cosa?\n— Le voy a dar un jarabe. Tómelo tres veces al día.\n— ¿Antes o después de comer?\n— Después de comer.\n— Muchas gracias, doctor." },
    { id: "o6", tarea: 3, titulo: "Conversación: devolver algo en una tienda", segundos: 210,
      escena: "🧥 Situación: compraste un abrigo y es pequeño. El examinador es el dependiente. Quieres cambiarlo o que te devuelvan el dinero.",
      explicacion: "Saluda, explica el problema, di qué quieres y responde. Sé educado: 'por favor', 'perdone', 'gracias'.",
      frases: ["Perdone, compré esto el… y…", "Me queda pequeño / grande.", "¿Puedo cambiarlo por otra talla?", "Aquí tiene el tique.", "Si no hay, ¿me devuelven el dinero?"],
      modelo: "— Hola, buenas tardes. ¿En qué puedo ayudarle?\n— Hola. Compré este abrigo el sábado, pero me queda pequeño.\n— ¿Tiene el tique?\n— Sí, aquí tiene.\n— ¿Quiere otra talla?\n— Sí, la talla grande, por favor. Si no hay, ¿me pueden devolver el dinero?\n— Tenemos la talla grande en negro, no en azul.\n— Vale, el negro también me gusta. Gracias." }
  ];

  window.DELE = { pruebas: PRUEBAS, lectura: LECTURA, audicion: AUDICION, escritura: ESCRITURA, oral: ORAL };
})();
