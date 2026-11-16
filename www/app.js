/* =========================================================================
   AMAZING NACIONALIDAD · app.js
   -------------------------------------------------------------------------
   La "lógica" de la app: pantallas, preguntas, simulacro del CCSE,
   prácticas del DELE A2, voz, progreso y ajustes.

   PRIVACIDAD: no se envía nada a internet. Todo se guarda en el propio
   móvil (localStorage). Si se borra la app, el progreso se pierde.

   NAVEGACIÓN: cada pantalla tiene una "dirección" después de # (por
   ejemplo #/ccse). Así el botón "atrás" del móvil funciona solo.
   ========================================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   * 1. GUARDADO EN EL MÓVIL                                             *
   * ------------------------------------------------------------------ */
  const CLAVE = "amazingNacionalidad.v1";

  function datosVacios() {
    return {
      aceptado: false,      // ha leído el aviso de "app no oficial"
      letraGrande: false,
      vozLenta: false,
      stats: {},            // por pregunta CCSE: { r: aciertos seguidos, f: fallos, v: veces vista }
      simulacros: [],       // [{ fecha, aciertos }]
      dele: {},             // por ejercicio DELE: mejor resultado
      plan: {},             // casillas marcadas del plan de 30 días
      borradores: {},       // textos escritos en la práctica de escritura
      dias: []              // días en que se ha estudiado (AAAA-MM-DD)
    };
  }
  function cargar() {
    try {
      const raw = localStorage.getItem(CLAVE);
      if (raw) return Object.assign(datosVacios(), JSON.parse(raw));
    } catch (e) { /* sin almacenamiento: la app funciona, pero no recuerda */ }
    return datosVacios();
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(D)); } catch (e) { /* ignorar */ }
  }
  let D = cargar();

  // Apunta que hoy se ha estudiado (para el contador de días)
  function marcarDia() {
    const hoy = new Date().toISOString().slice(0, 10);
    if (!D.dias.includes(hoy)) { D.dias.push(hoy); if (D.dias.length > 400) D.dias.shift(); guardar(); }
  }

  /* ------------------------------------------------------------------ *
   * 2. UTILIDADES                                                       *
   * ------------------------------------------------------------------ */
  const $app = document.getElementById("app");
  const C = window.CONFIG;
  const LETRAS = ["a", "b", "c", "d"];

  // Evita que un texto con símbolos raros "rompa" la página
  function esc(s) {
    return String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }
  // Convierte saltos de línea en párrafos
  function parrafos(s) {
    return String(s).split(/\n{2,}/).map(p => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("");
  }
  function barajar(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function contarPalabras(t) { return (t.trim().match(/\S+/g) || []).length; }
  function ir(ruta) { location.hash = ruta; }
  function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }

  /* ------------------------------------------------------------------ *
   * 3. VOZ (lectura en voz alta)                                        *
   *    En el APK usa el motor de voz de Android (plugin de Capacitor).  *
   *    En el navegador usa la voz del propio navegador.                 *
   * ------------------------------------------------------------------ */
  const Voz = {
    nativa() {
      return window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()
        && window.Capacitor.Plugins && window.Capacitor.Plugins.TextToSpeech;
    },
    disponible() { return !!(this.nativa() || ("speechSynthesis" in window)); },
    velocidad() { return D.vozLenta ? C.voz.velocidadLenta : C.voz.velocidadNormal; },

    // Lee un texto. Devuelve una "promesa" que termina cuando acaba de hablar.
    decir(texto, opciones) {
      const o = Object.assign({ rate: this.velocidad(), pitch: 1 }, opciones || {});
      const tts = this.nativa();
      if (tts) {
        return tts.speak({ text: texto, lang: C.voz.idioma, rate: o.rate, pitch: o.pitch, volume: 1, category: "playback" })
          .catch(() => {});
      }
      if (!("speechSynthesis" in window)) return Promise.resolve();
      return new Promise(resolve => {
        const u = new SpeechSynthesisUtterance(texto);
        u.lang = C.voz.idioma; u.rate = o.rate; u.pitch = o.pitch;
        const voces = speechSynthesis.getVoices().filter(v => v.lang && v.lang.startsWith("es"));
        if (voces.length) u.voice = voces.find(v => v.lang === C.voz.idioma) || voces[0];
        u.onend = u.onerror = () => resolve();
        speechSynthesis.speak(u);
      });
    },
    // Lee un diálogo frase a frase; la voz "B" con un tono distinto
    async dialogo(guion, opciones) {
      this.parar();
      this.hablando = true;
      for (const linea of guion) {
        if (!this.hablando) break;
        await this.decir(linea.t, Object.assign({}, opciones, { pitch: linea.v === "B" ? 1.35 : 0.9 }));
      }
      this.hablando = false;
    },
    parar() {
      this.hablando = false;
      const tts = this.nativa();
      if (tts) { tts.stop().catch(() => {}); return; }
      if ("speechSynthesis" in window) speechSynthesis.cancel();
    }
  };

  // Botón de altavoz reutilizable: data-hablar="texto"
  function botonVoz(texto, etiqueta) {
    if (!Voz.disponible()) return "";
    return `<button class="btn-voz" data-hablar="${esc(texto)}" aria-label="Escuchar">🔊${etiqueta ? " " + esc(etiqueta) : ""}</button>`;
  }

  /* ------------------------------------------------------------------ *
   * 4. PROGRESO DEL CCSE                                                *
   * ------------------------------------------------------------------ */
  const PREG = window.CCSE.preguntas;
  function preguntasDeTarea(n) { return PREG.filter(q => q.t === n); }
  function stat(id) { return D.stats[id] || (D.stats[id] = { r: 0, f: 0, v: 0 }); }
  function dominada(q) { const s = D.stats[q.id]; return !!s && s.r >= C.ccse.aciertosParaDominar; }
  function fallada(q) { const s = D.stats[q.id]; return !!s && s.f > 0 && s.r < C.ccse.aciertosParaDominar; }
  function apuntarRespuesta(q, bien) {
    const s = stat(q.id); s.v++;
    if (bien) s.r++; else { s.r = 0; s.f++; }
    marcarDia(); guardar();
  }
  function progresoTarea(n) {
    const lista = preguntasDeTarea(n);
    return { hechas: lista.filter(dominada).length, total: lista.length };
  }
  function progresoCCSE() {
    return { hechas: PREG.filter(dominada).length, total: PREG.length };
  }

  /* ------------------------------------------------------------------ *
   * 5. PIEZAS DE PANTALLA                                               *
   * ------------------------------------------------------------------ */
  function cabecera(titulo, atras) {
    return `<header class="cab">
      ${atras ? `<button class="btn-atras" data-ir="${atras}" aria-label="Volver">←</button>` : `<span class="logo" aria-hidden="true">📘</span>`}
      <h1>${esc(titulo)}</h1>
      <button class="btn-ajustes" data-ir="#/ajustes" aria-label="Ajustes">⚙️</button>
    </header>`;
  }
  function barra(valor, total, texto) {
    const p = pct(valor, total);
    return `<div class="barra" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100">
      <span style="width:${p}%"></span></div>
      <p class="mini">${texto ? esc(texto) : `${valor} de ${total} · ${p}%`}</p>`;
  }
  function tarjetaGrande(ruta, icono, titulo, sub, extra) {
    return `<button class="tarjeta grande" data-ir="${ruta}">
      <span class="ico">${icono}</span>
      <span class="txt"><strong>${esc(titulo)}</strong><small>${esc(sub)}</small>${extra || ""}</span>
      <span class="flecha" aria-hidden="true">›</span>
    </button>`;
  }
  function pintar(html) {
    Voz.parar();
    $app.innerHTML = html;
    window.scrollTo(0, 0);
  }

  /* ------------------------------------------------------------------ *
   * 6. PANTALLAS GENERALES                                              *
   * ------------------------------------------------------------------ */
  function pBienvenida() {
    pintar(`
      <section class="bienvenida">
        <div class="sello">📘</div>
        <h1>¡Hola! Bienvenido.<br>¡Hola! Bienvenida.</h1>
        <p class="grande">Esta app te ayuda a preparar los <strong>dos exámenes</strong> para la nacionalidad española:</p>
        <div class="dos">
          <div><span>🏛️</span><strong>CCSE</strong><small>Preguntas sobre España</small></div>
          <div><span>🗣️</span><strong>DELE A2</strong><small>Examen de español</small></div>
        </div>
        <p>Toca <strong>🔊</strong> para escuchar. Toca <strong>📖</strong> para ver las palabras difíciles.</p>
        <div class="aviso">
          <strong>⚠️ Importante</strong>
          <p>Esta app <strong>no es oficial</strong>. No tiene relación con el Instituto Cervantes.
          Las preguntas y ejercicios son nuestros: son parecidos al examen, pero no son las preguntas oficiales.
          Estudia también los materiales oficiales en la web del Instituto Cervantes.</p>
        </div>
        <button class="btn principal" id="empezar">Entendido. ¡Empezar!</button>
      </section>`);
    document.getElementById("empezar").onclick = () => { D.aceptado = true; guardar(); ir("#/"); };
  }

  function pInicio() {
    const pc = progresoCCSE();
    const ultimo = D.simulacros[D.simulacros.length - 1];
    const deleHechos = Object.keys(D.dele).length;
    const deleTotal = DELE.lectura.length + DELE.audicion.length + DELE.escritura.length + DELE.oral.length;
    pintar(`
      ${cabecera(C.nombreApp)}
      <section class="pantalla">
        <div class="saludo">
          <p class="grande">¡Vamos a estudiar! 💪</p>
          <p class="mini">📅 Has estudiado <strong>${D.dias.length}</strong> ${D.dias.length === 1 ? "día" : "días"}${ultimo ? ` · Último simulacro: <strong>${ultimo.aciertos}/${C.ccse.preguntas}</strong>` : ""}</p>
        </div>
        ${tarjetaGrande("#/ccse", "🏛️", "Examen CCSE", "Preguntas sobre España", barra(pc.hechas, pc.total, `${pc.hechas} de ${pc.total} preguntas aprendidas`))}
        ${tarjetaGrande("#/dele", "🗣️", "Examen DELE A2", "Leer, escuchar, escribir y hablar", barra(deleHechos, deleTotal, `${deleHechos} de ${deleTotal} ejercicios hechos`))}
        <div class="rejilla">
          <button class="tarjeta peq" data-ir="#/trucos"><span class="ico">💡</span><strong>Trucos</strong></button>
          <button class="tarjeta peq" data-ir="#/plan"><span class="ico">📅</span><strong>Plan 30 días</strong></button>
          <button class="tarjeta peq" data-ir="#/glosario"><span class="ico">📖</span><strong>Palabras</strong></button>
          <button class="tarjeta peq" data-ir="#/dia"><span class="ico">🎒</span><strong>Día del examen</strong></button>
        </div>
        <p class="pie">App no oficial · <a href="${C.enlaces.cervantes}" target="_blank" rel="noopener">Web oficial del Instituto Cervantes</a></p>
      </section>`);
  }

  function pTrucos() {
    pintar(`
      ${cabecera("Trucos para estudiar", "#/")}
      <section class="pantalla">
        ${EXTRAS.trucos.map(t => `<article class="caja truco"><span class="ico">${t.icono}</span><div><h3>${esc(t.titulo)}</h3><p>${esc(t.texto)}</p></div>${botonVoz(t.titulo + ". " + t.texto)}</article>`).join("")}
        <h2>Trucos para el CCSE</h2>
        <ul class="lista-check">${EXTRAS.trucosCCSE.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
        <h2>Trucos para el DELE A2</h2>
        ${DELE.pruebas.map(p => `<details class="caja"><summary>${p.icono} ${esc(p.titulo)}</summary><ul class="lista-check">${p.trucos.map(t => `<li>${esc(t)}</li>`).join("")}</ul></details>`).join("")}
      </section>`);
  }

  function pPlan() {
    const html = EXTRAS.plan.map(s => {
      const hechas = s.tareas.filter((_, i) => D.plan[`${s.semana}-${i}`]).length;
      return `<article class="caja">
        <h3>Semana ${s.semana}: ${esc(s.titulo)}</h3>
        ${barra(hechas, s.tareas.length)}
        ${s.tareas.map((t, i) => {
          const k = `${s.semana}-${i}`;
          return `<label class="casilla"><input type="checkbox" data-plan="${k}" ${D.plan[k] ? "checked" : ""}><span>Día ${(s.semana - 1) * 7 + i + 1}: ${esc(t)}</span></label>`;
        }).join("")}
      </article>`;
    }).join("");
    pintar(`${cabecera("Plan de 30 días", "#/")}
      <section class="pantalla">
        <p class="intro">Una tarea cada día, unos 20-30 minutos. Marca la casilla cuando la termines. Los días 29 y 30: repasa lo que te cueste más.</p>
        ${html}
      </section>`);
    $app.querySelectorAll("[data-plan]").forEach(c => c.onchange = () => {
      D.plan[c.dataset.plan] = c.checked; if (c.checked) marcarDia(); guardar(); pPlan();
    });
  }

  function pDia() {
    pintar(`${cabecera("El día del examen", "#/")}
      <section class="pantalla">
        ${EXTRAS.diaExamen.map(d => `<article class="caja truco"><span class="ico">${d.icono}</span><div><p>${esc(d.texto)}</p></div>${botonVoz(d.texto)}</article>`).join("")}
        <p class="mini">Comprueba siempre las instrucciones de tu convocatoria en la <a href="${C.enlaces.cervantes}" target="_blank" rel="noopener">web del Instituto Cervantes</a>.</p>
      </section>`);
  }

  function pGlosario() {
    pintar(`${cabecera("Palabras difíciles", "#/")}
      <section class="pantalla">
        <input type="search" id="buscar" class="buscador" placeholder="🔎 Buscar una palabra…" aria-label="Buscar palabra">
        <div id="lista-glosario"></div>
      </section>`);
    const lista = document.getElementById("lista-glosario");
    function dibujar(filtro) {
      const f = (filtro || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      const items = EXTRAS.glosario.filter(g => !f || norm(g.p).includes(f) || norm(g.d).includes(f));
      lista.innerHTML = items.length ? items.map(g => `
        <article class="caja palabra"><span class="ico">${g.i}</span>
          <div><h3>${esc(g.p)}</h3><p>${esc(g.d)}</p></div>${botonVoz(g.p + ". " + g.d)}</article>`).join("")
        : `<p class="mini">No hay ninguna palabra con "${esc(filtro)}".</p>`;
    }
    dibujar("");
    document.getElementById("buscar").oninput = e => dibujar(e.target.value);
  }

  function pAjustes() {
    pintar(`${cabecera("Ajustes", "#/")}
      <section class="pantalla">
        <article class="caja">
          <label class="interruptor"><input type="checkbox" id="aj-letra" ${D.letraGrande ? "checked" : ""}><span>🔠 Letra más grande</span></label>
          <label class="interruptor"><input type="checkbox" id="aj-voz" ${D.vozLenta ? "checked" : ""}><span>🐢 Voz más despacio</span></label>
          ${Voz.disponible() ? `<p>${botonVoz("Hola. Así suena la voz de la aplicación.", "Probar la voz")}</p>`
            : `<p class="mini">Este dispositivo no tiene voz disponible.</p>`}
          <p class="mini">Si la voz no suena en español, en tu móvil Android ve a <em>Ajustes → Accesibilidad → Salida de texto a voz</em> y descarga el idioma español.</p>
        </article>
        <article class="caja">
          <h3>🔒 Privacidad</h3>
          <p>Esta app no pide tu nombre ni ningún dato personal, no tiene publicidad y no envía nada a internet. Tu progreso y tus textos se guardan solo en este móvil.</p>
        </article>
        <article class="caja">
          <h3>⚠️ Aviso</h3>
          <p>App no oficial, sin relación con el Instituto Cervantes. Contenido propio actualizado a ${C.anioContenido}. Los exámenes pueden cambiar: consulta siempre la web oficial.</p>
          <p><a href="${C.enlaces.ccse}" target="_blank" rel="noopener">Preparar el CCSE (web oficial)</a><br>
             <a href="${C.enlaces.dele}" target="_blank" rel="noopener">Preparar el DELE (web oficial)</a></p>
        </article>
        <button class="btn peligro" id="borrar">🗑️ Borrar todo mi progreso</button>
        <p class="mini centro">${esc(C.nombreApp)} · versión ${esc(C.version)}</p>
      </section>`);
    document.getElementById("aj-letra").onchange = e => { D.letraGrande = e.target.checked; guardar(); aplicarAjustes(); };
    document.getElementById("aj-voz").onchange = e => { D.vozLenta = e.target.checked; guardar(); };
    document.getElementById("borrar").onclick = () => {
      if (confirm("¿Seguro? Se borrará todo tu progreso de este móvil. No se puede deshacer.")) {
        D = datosVacios(); D.aceptado = true; guardar(); aplicarAjustes(); ir("#/");
      }
    };
  }

  /* ------------------------------------------------------------------ *
   * 7. CCSE                                                             *
   * ------------------------------------------------------------------ */
  function pCCSE() {
    const fallos = PREG.filter(fallada).length;
    const mejores = D.simulacros.map(s => s.aciertos);
    pintar(`${cabecera("Examen CCSE", "#/")}
      <section class="pantalla">
        <details class="caja como">
          <summary>❓ ¿Cómo es el examen?</summary>
          <ul class="lista-check">
            <li><strong>${C.ccse.preguntas} preguntas</strong> sobre España.</li>
            <li>Tienes <strong>${C.ccse.minutos} minutos</strong>.</li>
            <li>Para aprobar necesitas <strong>${C.ccse.aprobado} bien</strong>.</li>
            <li>Algunas preguntas tienen 3 respuestas (a, b, c). Otras son <strong>verdadero o falso</strong>.</li>
            <li>Las preguntas salen de un manual oficial que el Instituto Cervantes publica cada año.</li>
          </ul>
          ${botonVoz(`El examen tiene ${C.ccse.preguntas} preguntas. Tienes ${C.ccse.minutos} minutos. Para aprobar necesitas ${C.ccse.aprobado} respuestas bien.`)}
        </details>

        <div class="acciones">
          <button class="btn principal" data-ir="#/ccse/simulacro">🎯 Simulacro de examen<br><small>${C.ccse.preguntas} preguntas · ${C.ccse.minutos} min</small></button>
          <button class="btn" data-ir="#/ccse/practicar/fallos" ${fallos ? "" : "disabled"}>🔁 Repasar fallos (${fallos})</button>
          <button class="btn" data-ir="#/ccse/practicar/todo">🎲 Preguntas al azar</button>
        </div>
        ${mejores.length ? `<p class="mini centro">Simulacros hechos: ${mejores.length} · Mejor nota: <strong>${Math.max(...mejores)}/${C.ccse.preguntas}</strong></p>` : ""}

        <h2>Estudia por temas</h2>
        ${CCSE.tareas.map(t => {
          const pr = progresoTarea(t.n);
          return tarjetaGrande(`#/ccse/t/${t.n}`, t.icono, `Tarea ${t.n}: ${t.titulo}`, `${t.sub} · ${t.enExamen} en el examen`,
            barra(pr.hechas, pr.total, `${pr.hechas} de ${pr.total} aprendidas`));
        }).join("")}
      </section>`);
  }

  function pTarea(n) {
    const t = CCSE.tareas.find(x => x.n === n);
    if (!t) return ir("#/ccse");
    const pr = progresoTarea(n);
    pintar(`${cabecera(`Tarea ${n}`, "#/ccse")}
      <section class="pantalla">
        <div class="titular"><span class="ico">${t.icono}</span><div><h2>${esc(t.titulo)}</h2><p>${esc(t.sub)}</p></div></div>
        ${barra(pr.hechas, pr.total, `${pr.hechas} de ${pr.total} aprendidas (aciertas ${C.ccse.aciertosParaDominar} veces seguidas)`)}
        <div class="acciones">
          <button class="btn principal" data-ir="#/ccse/estudiar/${n}">📚 1. Estudiar<br><small>Ver preguntas con la respuesta</small></button>
          <button class="btn principal" data-ir="#/ccse/practicar/${n}">✏️ 2. Practicar<br><small>Contesta tú</small></button>
        </div>
        <p class="mini">Consejo: primero estudia, después practica. En el examen salen <strong>${t.enExamen}</strong> preguntas de esta tarea.</p>
      </section>`);
  }

  // --- Estudiar: tarjetas con la respuesta ya marcada ---
  function pEstudiar(n, i) {
    const lista = preguntasDeTarea(n);
    if (!lista.length) return ir("#/ccse");
    i = Math.max(0, Math.min(i || 0, lista.length - 1));
    const q = lista[i];
    const textoVoz = `${q.p} Respuesta: ${q.o[q.c]}. ${q.e}`;
    marcarDia();
    pintar(`${cabecera(`Estudiar · Tarea ${n}`, `#/ccse/t/${n}`)}
      <section class="pantalla">
        <p class="mini centro">Pregunta ${i + 1} de ${lista.length} ${dominada(q) ? "· ✅ aprendida" : ""}</p>
        <article class="caja pregunta">
          <h2>${esc(q.p)}</h2>
          ${botonVoz(textoVoz)}
          <ol class="opciones fija">${q.o.map((op, k) => `<li class="${k === q.c ? "ok" : "apagada"}"><span class="letra">${esVF(q) ? (k ? "F" : "V") : LETRAS[k]}</span>${esc(op)}${k === q.c ? " ✅" : ""}</li>`).join("")}</ol>
          <div class="explica"><p>${esc(q.e)}</p>${q.k ? `<p class="truco-linea">💡 ${esc(q.k)}</p>` : ""}</div>
        </article>
        <div class="nav">
          <button class="btn" id="ant" ${i === 0 ? "disabled" : ""}>← Anterior</button>
          <button class="btn principal" id="sig">${i === lista.length - 1 ? "¡A practicar! ✏️" : "Siguiente →"}</button>
        </div>
      </section>`);
    document.getElementById("ant").onclick = () => pEstudiar(n, i - 1);
    document.getElementById("sig").onclick = () => i === lista.length - 1 ? ir(`#/ccse/practicar/${n}`) : pEstudiar(n, i + 1);
  }
  // ¿Es una pregunta de verdadero/falso?
  function esVF(q) { return q.o.length === 2 && q.o[0] === "Verdadero" && q.o[1] === "Falso"; }

  // Prepara una pregunta para mostrarla: baraja opciones (salvo verdadero/falso)
  function prepararPregunta(q) {
    const orden = esVF(q) ? q.o.map((_, k) => k) : barajar(q.o.map((_, k) => k));
    return { q, orden, correcta: orden.indexOf(q.c), elegida: null };
  }
  function letraOpcion(item, k) { return esVF(item.q) ? (k ? "F" : "V") : LETRAS[k]; }

  // --- Practicar: preguntas con corrección inmediata ---
  let sesion = null;
  function pPracticar(modo) {
    let lista;
    if (modo === "fallos") lista = PREG.filter(fallada);
    else if (modo === "todo") lista = barajar(PREG).slice(0, C.ccse.preguntasPorPractica);
    else {
      // De una tarea: primero las no aprendidas
      const n = Number(modo);
      const todas = barajar(preguntasDeTarea(n));
      lista = todas.filter(q => !dominada(q)).concat(todas.filter(dominada)).slice(0, C.ccse.preguntasPorPractica);
    }
    if (!lista.length) return ir("#/ccse");
    sesion = { modo, items: barajar(lista).map(prepararPregunta), i: 0, aciertos: 0 };
    pPregunta();
  }
  function volverDePractica() {
    return sesion && /^\d$/.test(String(sesion.modo)) ? `#/ccse/t/${sesion.modo}` : "#/ccse";
  }

  function pPregunta() {
    const s = sesion; const it = s.items[s.i]; const q = it.q;
    const respondida = it.elegida !== null;
    pintar(`${cabecera("Practicar", volverDePractica())}
      <section class="pantalla">
        ${barra(s.i + (respondida ? 1 : 0), s.items.length, `Pregunta ${s.i + 1} de ${s.items.length} · ✅ ${s.aciertos}`)}
        <article class="caja pregunta">
          <h2>${esc(q.p)}</h2>
          ${botonVoz(q.p + " " + it.orden.map((o, k) => (esVF(q) ? "" : LETRAS[k] + ": ") + q.o[o]).join(". "))}
          <div class="opciones">
            ${it.orden.map((o, k) => {
              let cls = "";
              if (respondida) cls = k === it.correcta ? "ok" : (k === it.elegida ? "mal" : "apagada");
              return `<button class="opcion ${cls}" data-op="${k}" ${respondida ? "disabled" : ""}><span class="letra">${letraOpcion(it, k)}</span>${esc(q.o[o])}</button>`;
            }).join("")}
          </div>
          ${respondida ? `<div class="explica ${it.elegida === it.correcta ? "bien" : "fallo"}">
              <p class="veredicto">${it.elegida === it.correcta ? "✅ ¡Muy bien!" : `❌ La respuesta correcta es: <strong>${esc(q.o[q.c])}</strong>`}</p>
              <p>${esc(q.e)}</p>${q.k ? `<p class="truco-linea">💡 ${esc(q.k)}</p>` : ""}
              ${botonVoz(q.e)}
            </div>` : ""}
        </article>
        ${respondida ? `<button class="btn principal ancho" id="sig">${s.i === s.items.length - 1 ? "Ver resultado" : "Siguiente →"}</button>` : ""}
      </section>`);
    $app.querySelectorAll("[data-op]").forEach(b => b.onclick = () => {
      it.elegida = Number(b.dataset.op);
      const bien = it.elegida === it.correcta;
      if (bien) s.aciertos++;
      apuntarRespuesta(q, bien);
      if (navigator.vibrate && !bien) navigator.vibrate(120);
      pPregunta();
    });
    const sig = document.getElementById("sig");
    if (sig) sig.onclick = () => { if (s.i < s.items.length - 1) { s.i++; pPregunta(); } else pResultadoPractica(); };
  }

  function pResultadoPractica() {
    const s = sesion; const total = s.items.length; const p = pct(s.aciertos, total);
    const falladas = s.items.filter(it => it.elegida !== it.correcta);
    pintar(`${cabecera("Resultado", volverDePractica())}
      <section class="pantalla centro">
        <div class="nota ${p >= 60 ? "bien" : "fallo"}"><strong>${s.aciertos}/${total}</strong><span>${p}%</span></div>
        <p class="grande">${p === 100 ? "🏆 ¡Perfecto!" : p >= 80 ? "🎉 ¡Muy bien!" : p >= 60 ? "👍 ¡Bien! Sigue así." : "💪 Hay que repasar un poco más."}</p>
        ${falladas.length ? `<h2>Repasa estas</h2>${falladas.map(it => `<article class="caja izq"><p><strong>${esc(it.q.p)}</strong></p><p>✅ ${esc(it.q.o[it.q.c])}</p>${it.q.k ? `<p class="truco-linea">💡 ${esc(it.q.k)}</p>` : ""}</article>`).join("")}` : ""}
        <div class="acciones">
          <button class="btn principal" id="otra">🔄 Otra vez</button>
          <button class="btn" data-ir="${volverDePractica()}">Volver</button>
        </div>
      </section>`);
    document.getElementById("otra").onclick = () => pPracticar(s.modo);
  }

  // --- Simulacro: como el examen real, con reloj y sin corrección hasta el final ---
  let reloj = null;
  function pararReloj() { if (reloj) { clearInterval(reloj); reloj = null; } }

  function empezarSimulacro() {
    let items = [];
    Object.keys(C.ccse.reparto).forEach(n => {
      items = items.concat(barajar(preguntasDeTarea(Number(n))).slice(0, C.ccse.reparto[n]));
    });
    sesion = { modo: "simulacro", items: items.map(prepararPregunta), i: 0, fin: Date.now() + C.ccse.minutos * 60000 };
    pintarSimulacro();
    pararReloj();
    reloj = setInterval(actualizarReloj, 1000);
  }
  function actualizarReloj() {
    const el = document.getElementById("reloj");
    if (!sesion || sesion.modo !== "simulacro") return pararReloj();
    const quedan = Math.max(0, sesion.fin - Date.now());
    if (el) {
      const m = Math.floor(quedan / 60000), sg = Math.floor((quedan % 60000) / 1000);
      el.textContent = `⏱️ ${m}:${String(sg).padStart(2, "0")}`;
      el.classList.toggle("urgente", quedan < 5 * 60000);
    }
    if (quedan <= 0) { pararReloj(); terminarSimulacro(); }
  }
  function pintarSimulacro() {
    const s = sesion; const it = s.items[s.i]; const q = it.q;
    const contestadas = s.items.filter(x => x.elegida !== null).length;
    pintar(`<header class="cab"><button class="btn-atras" id="salir" aria-label="Salir">✕</button><h1>Simulacro</h1><span id="reloj" class="reloj">⏱️</span></header>
      <section class="pantalla">
        <p class="mini centro">Pregunta ${s.i + 1} de ${s.items.length} · Contestadas: ${contestadas}</p>
        <article class="caja pregunta">
          <h2>${esc(q.p)}</h2>
          ${botonVoz(q.p + " " + it.orden.map((o, k) => (esVF(q) ? "" : LETRAS[k] + ": ") + q.o[o]).join(". "))}
          <div class="opciones">
            ${it.orden.map((o, k) => `<button class="opcion ${it.elegida === k ? "elegida" : ""}" data-op="${k}"><span class="letra">${letraOpcion(it, k)}</span>${esc(q.o[o])}</button>`).join("")}
          </div>
        </article>
        <div class="nav">
          <button class="btn" id="ant" ${s.i === 0 ? "disabled" : ""}>←</button>
          <button class="btn principal" id="sig">${s.i === s.items.length - 1 ? "Terminar ✔" : "Siguiente →"}</button>
        </div>
        <div class="puntos">${s.items.map((x, k) => `<button class="punto ${x.elegida !== null ? "hecho" : ""} ${k === s.i ? "actual" : ""}" data-ver="${k}" aria-label="Pregunta ${k + 1}">${k + 1}</button>`).join("")}</div>
        <button class="btn ancho" id="terminar">Entregar examen</button>
      </section>`);
    actualizarReloj();
    $app.querySelectorAll("[data-op]").forEach(b => b.onclick = () => { it.elegida = Number(b.dataset.op); pintarSimulacro(); });
    $app.querySelectorAll("[data-ver]").forEach(b => b.onclick = () => { s.i = Number(b.dataset.ver); pintarSimulacro(); });
    document.getElementById("ant").onclick = () => { s.i--; pintarSimulacro(); };
    document.getElementById("sig").onclick = () => { if (s.i < s.items.length - 1) { s.i++; pintarSimulacro(); } else preguntarTerminar(); };
    document.getElementById("terminar").onclick = preguntarTerminar;
    document.getElementById("salir").onclick = () => { if (confirm("¿Salir del simulacro? Se perderán tus respuestas.")) { pararReloj(); sesion = null; ir("#/ccse"); } };
  }
  function preguntarTerminar() {
    const sin = sesion.items.filter(x => x.elegida === null).length;
    if (confirm(sin ? `Tienes ${sin} preguntas sin contestar. ¿Entregar el examen?` : "¿Entregar el examen?")) terminarSimulacro();
  }
  function terminarSimulacro() {
    pararReloj();
    const s = sesion; if (!s) return;
    s.items.forEach(it => { if (it.elegida !== null) apuntarRespuesta(it.q, it.elegida === it.correcta); });
    const aciertos = s.items.filter(it => it.elegida === it.correcta).length;
    D.simulacros.push({ fecha: new Date().toISOString().slice(0, 10), aciertos });
    if (D.simulacros.length > 50) D.simulacros.shift();
    guardar();
    const apto = aciertos >= C.ccse.aprobado;
    const porTarea = CCSE.tareas.map(t => {
      const de = s.items.filter(it => it.q.t === t.n);
      return `<li>${t.icono} ${esc(t.titulo)}: <strong>${de.filter(it => it.elegida === it.correcta).length}/${de.length}</strong></li>`;
    }).join("");
    const falladas = s.items.filter(it => it.elegida !== it.correcta);
    sesion = null;
    history.replaceState(null, "", "#/ccse/resultado");
    pintar(`${cabecera("Resultado del simulacro", "#/ccse")}
      <section class="pantalla centro">
        <div class="nota ${apto ? "bien" : "fallo"}"><strong>${aciertos}/${C.ccse.preguntas}</strong><span>${apto ? "APTO" : "NO APTO"}</span></div>
        <p class="grande">${apto ? (aciertos >= 20 ? "🏆 ¡Excelente! Estás listo/a." : "🎉 ¡Aprobado! Sigue practicando para ir más seguro/a.") : `💪 Necesitas ${C.ccse.aprobado}. Te faltan ${C.ccse.aprobado - aciertos}. ¡Repasa tus fallos!`}</p>
        <ul class="lista-simple izq">${porTarea}</ul>
        ${falladas.length ? `<h2>Tus fallos</h2>${falladas.map(it => `<article class="caja izq"><p><strong>${esc(it.q.p)}</strong></p>
          ${it.elegida !== null ? `<p class="txt-mal">❌ Tú: ${esc(it.q.o[it.orden[it.elegida]])}</p>` : `<p class="txt-mal">❌ Sin contestar</p>`}
          <p class="txt-bien">✅ ${esc(it.q.o[it.q.c])}</p><p class="mini">${esc(it.q.e)}</p></article>`).join("")}` : ""}
        <div class="acciones">
          <button class="btn principal" data-ir="#/ccse/simulacro">🎯 Otro simulacro</button>
          <button class="btn" data-ir="#/ccse/practicar/fallos">🔁 Repasar fallos</button>
        </div>
      </section>`);
  }

  /* ------------------------------------------------------------------ *
   * 8. DELE A2                                                          *
   * ------------------------------------------------------------------ */
  const LISTAS_DELE = { lectura: () => DELE.lectura, audicion: () => DELE.audicion, escritura: () => DELE.escritura, oral: () => DELE.oral };

  function pDELE() {
    pintar(`${cabecera("Examen DELE A2", "#/")}
      <section class="pantalla">
        <details class="caja como" open>
          <summary>❓ ¿Cómo es el examen?</summary>
          <ul class="lista-check">
            <li>Tiene <strong>4 partes</strong>: leer, escuchar, escribir y hablar. Cada parte vale <strong>25 puntos</strong>.</li>
            <li>Grupo 1 = leer + escribir. Grupo 2 = escuchar + hablar.</li>
            <li>Para aprobar necesitas <strong>${C.dele.minimoPorGrupo} puntos en cada grupo</strong> (${C.dele.minimoTotal} en total).</li>
            <li>Si eres de un país donde se habla español, no tienes que hacer este examen.</li>
          </ul>
          ${botonVoz(`El examen tiene 4 partes: leer, escuchar, escribir y hablar. Cada parte vale 25 puntos. Para aprobar necesitas ${C.dele.minimoPorGrupo} puntos en cada grupo.`)}
        </details>
        <div class="aviso suave"><p>💬 Esta app te ayuda con el formato del examen y los trucos. Para aprobar el DELE también necesitas practicar español cada día: con vecinos, en el trabajo, con la radio o en una clase.</p></div>
        ${DELE.pruebas.map(p => {
          const lista = LISTAS_DELE[p.id](); const hechos = lista.filter(x => D.dele[x.id]).length;
          return tarjetaGrande(`#/dele/p/${p.id}`, p.icono, p.titulo, `${p.oficial} · ${p.minutos} min`, barra(hechos, lista.length, `${hechos} de ${lista.length} ejercicios`));
        }).join("")}
      </section>`);
  }

  function pPrueba(id) {
    const p = DELE.pruebas.find(x => x.id === id); if (!p) return ir("#/dele");
    const lista = LISTAS_DELE[id]();
    pintar(`${cabecera(p.titulo, "#/dele")}
      <section class="pantalla">
        <div class="titular"><span class="ico">${p.icono}</span><div><h2>${esc(p.oficial)}</h2><p>${p.minutos} minutos · ${p.puntos} puntos</p></div></div>
        <article class="caja"><h3>Cómo es</h3><ul class="lista-check">${p.como.map(c => `<li>${esc(c)}</li>`).join("")}</ul>${botonVoz(p.como.join(" "))}</article>
        <article class="caja"><h3>💡 Trucos</h3><ul class="lista-check">${p.trucos.map(c => `<li>${esc(c)}</li>`).join("")}</ul>${botonVoz(p.trucos.join(" "))}</article>
        <h2>Ejercicios</h2>
        ${lista.map((e, k) => `<button class="tarjeta" data-ir="#/dele/${id}/${e.id}">
            <span class="ico">${D.dele[e.id] ? "✅" : k + 1}</span>
            <span class="txt"><strong>${esc(e.titulo)}</strong>${e.tarea ? `<small>Tarea ${e.tarea}</small>` : ""}${D.dele[e.id] && D.dele[e.id].nota !== undefined ? `<small>Mejor: ${D.dele[e.id].nota}</small>` : ""}</span>
            <span class="flecha">›</span></button>`).join("")}
      </section>`);
  }

  // --- Lectura ---
  function pLectura(id) {
    const ej = DELE.lectura.find(x => x.id === id); if (!ej) return ir("#/dele/p/lectura");
    const resp = ej.preguntas.map(() => null);
    const ordenes = ej.preguntas.map(q => barajar(q.o.map((_, k) => k)));
    let corregido = false;
    function dibujar() {
      const aciertos = ej.preguntas.filter((q, i) => resp[i] !== null && ordenes[i][resp[i]] === q.c).length;
      pintar(`${cabecera("Leer", "#/dele/p/lectura")}
        <section class="pantalla">
          <h2>${esc(ej.titulo)}</h2>
          <p class="mini">💡 Truco: lee primero las preguntas y después el texto.</p>
          <article class="caja texto-lectura">${parrafos(ej.texto)}${botonVoz(ej.texto, "Escuchar el texto")}</article>
          ${ej.preguntas.map((q, i) => `<article class="caja pregunta">
            <h3>${i + 1}. ${esc(q.p)}</h3>
            <div class="opciones">${ordenes[i].map((o, k) => {
              let cls = resp[i] === k ? "elegida" : "";
              if (corregido) cls = o === q.c ? "ok" : (resp[i] === k ? "mal" : "apagada");
              return `<button class="opcion ${cls}" data-q="${i}" data-op="${k}" ${corregido ? "disabled" : ""}><span class="letra">${LETRAS[k]}</span>${esc(q.o[o])}</button>`;
            }).join("")}</div>
            ${corregido ? `<div class="explica"><p>${esc(q.e)}</p></div>` : ""}
          </article>`).join("")}
          ${corregido
            ? `<div class="nota ${aciertos / ej.preguntas.length >= 0.6 ? "bien" : "fallo"}"><strong>${aciertos}/${ej.preguntas.length}</strong><span>aciertos</span></div>
               <div class="acciones"><button class="btn principal" id="repetir">🔄 Repetir</button><button class="btn" data-ir="#/dele/p/lectura">Volver</button></div>`
            : `<button class="btn principal ancho" id="corregir">✔ Corregir</button>`}
        </section>`);
      $app.querySelectorAll("[data-q]").forEach(b => b.onclick = () => {
        resp[Number(b.dataset.q)] = Number(b.dataset.op);
        // Repinta solo las opciones de esa pregunta para no perder la posición de la pantalla
        b.parentElement.querySelectorAll(".opcion").forEach(x => x.classList.toggle("elegida", x === b));
      });
      const corr = document.getElementById("corregir");
      if (corr) corr.onclick = () => {
        if (resp.includes(null) && !confirm("Hay preguntas sin contestar. ¿Corregir igualmente?")) return;
        corregido = true;
        const ac = ej.preguntas.filter((q, i) => resp[i] !== null && ordenes[i][resp[i]] === q.c).length;
        guardarDele(ej.id, `${ac}/${ej.preguntas.length}`, ac);
        dibujar();
      };
      const rep = document.getElementById("repetir");
      if (rep) rep.onclick = () => pLectura(id);
    }
    dibujar();
  }
  // Guarda el mejor resultado de un ejercicio del DELE
  function guardarDele(id, nota, valor) {
    const antes = D.dele[id];
    if (!antes || valor === undefined || (antes.valor || 0) <= valor) D.dele[id] = { nota, valor };
    marcarDia(); guardar();
  }

  // --- Audición ---
  function pAudicion(id) {
    const ej = DELE.audicion.find(x => x.id === id); if (!ej) return ir("#/dele/p/audicion");
    const orden = barajar(ej.o.map((_, k) => k));
    let escuchas = 0, elegida = null, verTexto = false;
    const disponible = Voz.disponible();
    function dibujar() {
      const respondida = elegida !== null;
      pintar(`${cabecera("Escuchar", "#/dele/p/audicion")}
        <section class="pantalla">
          <h2>${esc(ej.titulo)}</h2>
          <article class="caja centro">
            ${disponible ? `<button class="btn principal play" id="play">▶️ Escuchar</button>
              <p class="mini">Escuchas: <strong>${escuchas}</strong> · En el examen escuchas <strong>2 veces</strong>.</p>
              <button class="btn peq" id="lento">🐢 Escuchar despacio</button>`
              : `<p>⚠️ Este dispositivo no tiene voz. Lee el texto:</p>`}
          </article>
          <article class="caja pregunta">
            <h3>${esc(ej.p)}</h3>
            <div class="opciones">${orden.map((o, k) => {
              let cls = "";
              if (respondida) cls = o === ej.c ? "ok" : (k === elegida ? "mal" : "apagada");
              return `<button class="opcion ${cls}" data-op="${k}" ${respondida ? "disabled" : ""}><span class="letra">${LETRAS[k]}</span>${esc(ej.o[o])}</button>`;
            }).join("")}</div>
            ${respondida ? `<div class="explica ${orden[elegida] === ej.c ? "bien" : "fallo"}"><p class="veredicto">${orden[elegida] === ej.c ? "✅ ¡Muy bien!" : "❌ No es correcta."}</p><p>${esc(ej.e)}</p></div>` : ""}
          </article>
          ${(respondida || !disponible) ? `<button class="btn ancho" id="vertexto">${verTexto || !disponible ? "🙈 Ocultar texto" : "📄 Ver el texto"}</button>` : ""}
          ${(verTexto || !disponible) ? `<article class="caja guion">${ej.guion.map(l => `<p><strong>${l.v === "A" ? "🔵" : "🟠"}</strong> ${esc(l.t)}</p>`).join("")}</article>` : ""}
          ${respondida ? `<div class="acciones"><button class="btn principal" id="siguiente">Siguiente audio →</button><button class="btn" data-ir="#/dele/p/audicion">Volver</button></div>` : ""}
        </section>`);
      const play = document.getElementById("play");
      if (play) play.onclick = () => { escuchas++; dibujarContador(); Voz.dialogo(ej.guion); };
      const lento = document.getElementById("lento");
      if (lento) lento.onclick = () => { escuchas++; dibujarContador(); Voz.dialogo(ej.guion, { rate: C.voz.velocidadLenta }); };
      $app.querySelectorAll("[data-op]").forEach(b => b.onclick = () => {
        elegida = Number(b.dataset.op);
        const bien = orden[elegida] === ej.c;
        guardarDele(ej.id, bien ? "✅" : "❌", bien ? 1 : 0);
        dibujar();
      });
      const vt = document.getElementById("vertexto");
      if (vt) vt.onclick = () => { verTexto = !verTexto; dibujar(); };
      const sig = document.getElementById("siguiente");
      if (sig) sig.onclick = () => {
        const i = DELE.audicion.indexOf(ej);
        ir(i < DELE.audicion.length - 1 ? `#/dele/audicion/${DELE.audicion[i + 1].id}` : "#/dele/p/audicion");
      };
    }
    function dibujarContador() {
      const m = $app.querySelector(".caja.centro .mini strong"); if (m) m.textContent = escuchas;
    }
    dibujar();
  }

  // --- Escritura ---
  function pEscritura(id) {
    const ej = DELE.escritura.find(x => x.id === id); if (!ej) return ir("#/dele/p/escritura");
    const marcadas = (D.dele[id] && D.dele[id].check) || [];
    pintar(`${cabecera("Escribir", "#/dele/p/escritura")}
      <section class="pantalla">
        <h2>Tarea ${ej.tarea}: ${esc(ej.titulo)}</h2>
        <article class="caja enunciado"><p>${esc(ej.enunciado)}</p>${botonVoz(ej.enunciado)}</article>
        <article class="caja"><h3>🧩 Plantilla (toca para añadir)</h3>
          <div class="chips">${ej.plantilla.map((f, k) => `<button class="chip" data-chip="${k}">${esc(f)}</button>`).join("")}</div>
        </article>
        <label for="texto" class="mini">Escribe aquí tu texto (${ej.min}-${ej.max} palabras):</label>
        <textarea id="texto" rows="10" placeholder="Hola,…" autocapitalize="sentences"></textarea>
        <p id="contador" class="contador"></p>
        <article class="caja"><h3>✔ Comprueba tu texto</h3>
          ${ej.checklist.map((c, k) => `<label class="casilla"><input type="checkbox" data-ck="${k}" ${marcadas.includes(k) ? "checked" : ""}><span>${esc(c)}</span></label>`).join("")}
        </article>
        <details class="caja"><summary>👀 Ver un ejemplo de respuesta</summary>${parrafos(ej.modelo)}${botonVoz(ej.modelo, "Escuchar el ejemplo")}
          <p class="mini">Es solo un ejemplo: escribe con tus palabras y tu historia.</p></details>
        <p class="mini">🔒 Tu texto se guarda solo en este móvil.</p>
      </section>`);
    const ta = document.getElementById("texto");
    ta.value = D.borradores[id] || "";
    function contar() {
      const n = contarPalabras(ta.value);
      const el = document.getElementById("contador");
      el.textContent = `${n} palabras · objetivo: ${ej.min}-${ej.max}`;
      el.className = "contador " + (n >= ej.min && n <= ej.max ? "bien" : n > ej.max ? "fallo" : "");
    }
    contar();
    ta.oninput = () => { D.borradores[id] = ta.value; guardar(); contar(); };
    $app.querySelectorAll("[data-chip]").forEach(b => b.onclick = () => {
      const frase = ej.plantilla[Number(b.dataset.chip)];
      ta.value = (ta.value ? ta.value.replace(/\s*$/, "") + "\n" : "") + frase + " ";
      ta.oninput(); ta.focus();
    });
    $app.querySelectorAll("[data-ck]").forEach(c => c.onchange = () => {
      const lista = Array.from($app.querySelectorAll("[data-ck]")).filter(x => x.checked).map(x => Number(x.dataset.ck));
      D.dele[id] = { nota: `${lista.length}/${ej.checklist.length} ✔`, valor: lista.length, check: lista };
      marcarDia(); guardar();
    });
  }

  // --- Oral ---
  let cuentaAtras = null;
  function pararCuenta() { if (cuentaAtras) { clearInterval(cuentaAtras); cuentaAtras = null; } }
  function pOral(id) {
    const ej = DELE.oral.find(x => x.id === id); if (!ej) return ir("#/dele/p/oral");
    pintar(`${cabecera("Hablar", "#/dele/p/oral")}
      <section class="pantalla">
        <h2>Tarea ${ej.tarea}: ${esc(ej.titulo)}</h2>
        <article class="caja"><p>${esc(ej.explicacion)}</p>${botonVoz(ej.explicacion)}</article>
        ${ej.escena ? `<article class="caja escena"><p>${esc(ej.escena)}</p>${botonVoz(ej.escena.replace(/^[^A-Za-zÁÉÍÓÚáéíóúÑñ¿¡]+/, ""))}</article>` : ""}
        <article class="caja"><h3>🗨️ Frases útiles (escucha y repite)</h3>
          <ul class="frases">${ej.frases.map(f => `<li><span>${esc(f)}</span>${botonVoz(f.replace(/…/g, ""))}</li>`).join("")}</ul>
        </article>
        <article class="caja centro">
          <h3>⏱️ Practica en voz alta</h3>
          <p class="reloj-grande" id="cuenta">${Math.floor(ej.segundos / 60)}:${String(ej.segundos % 60).padStart(2, "0")}</p>
          <button class="btn principal" id="empezar">▶️ Empezar a hablar</button>
          <p class="mini">Habla sin parar hasta que termine el tiempo. Puedes grabarte con la grabadora del móvil para escucharte después.</p>
        </article>
        <details class="caja"><summary>👀 Ver un ejemplo</summary>${parrafos(ej.modelo)}${botonVoz(ej.modelo.replace(/—/g, ""), "Escuchar el ejemplo")}</details>
        <button class="btn ancho" id="hecho">${D.dele[id] ? "✅ Practicado" : "Marcar como practicado"}</button>
      </section>`);
    let restantes = ej.segundos;
    document.getElementById("empezar").onclick = e => {
      const btn = e.currentTarget;
      if (cuentaAtras) { pararCuenta(); btn.textContent = "▶️ Seguir"; return; }
      Voz.parar();
      btn.textContent = "⏸️ Pausa";
      cuentaAtras = setInterval(() => {
        restantes--;
        const el = document.getElementById("cuenta");
        if (!el) return pararCuenta();
        el.textContent = `${Math.floor(restantes / 60)}:${String(restantes % 60).padStart(2, "0")}`;
        if (restantes <= 0) {
          pararCuenta(); el.textContent = "¡Tiempo! 🎉"; btn.textContent = "🔄 Otra vez"; restantes = ej.segundos;
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          guardarDele(id, "✅", 1);
        }
      }, 1000);
    };
    document.getElementById("hecho").onclick = e => { guardarDele(id, "✅", 1); e.currentTarget.textContent = "✅ Practicado"; };
  }

  /* ------------------------------------------------------------------ *
   * 9. NAVEGACIÓN (lee la dirección después de # y pinta la pantalla)  *
   * ------------------------------------------------------------------ */
  function enrutar() {
    pararReloj(); pararCuenta();
    const r = (location.hash || "#/").slice(1).split("/").filter(Boolean);
    if (!D.aceptado) return pBienvenida();
    const [a, b, c] = r;
    if (!a) return pInicio();
    if (a === "trucos") return pTrucos();
    if (a === "plan") return pPlan();
    if (a === "dia") return pDia();
    if (a === "glosario") return pGlosario();
    if (a === "ajustes") return pAjustes();
    if (a === "ccse") {
      if (!b) return pCCSE();
      if (b === "t") return pTarea(Number(c));
      if (b === "estudiar") return pEstudiar(Number(c), 0);
      if (b === "practicar") return pPracticar(c || "todo");
      if (b === "simulacro") return empezarSimulacro();
      return pCCSE();
    }
    if (a === "dele") {
      if (!b) return pDELE();
      if (b === "p") return pPrueba(c);
      if (b === "lectura") return pLectura(c);
      if (b === "audicion") return pAudicion(c);
      if (b === "escritura") return pEscritura(c);
      if (b === "oral") return pOral(c);
      return pDELE();
    }
    pInicio();
  }

  // Un solo "escuchador" para todos los botones de navegación y de voz
  document.addEventListener("click", e => {
    const voz = e.target.closest("[data-hablar]");
    if (voz) {
      if (voz.classList.contains("sonando")) { Voz.parar(); voz.classList.remove("sonando"); return; }
      Voz.parar();
      $app.querySelectorAll(".sonando").forEach(x => x.classList.remove("sonando"));
      voz.classList.add("sonando");
      Voz.decir(voz.dataset.hablar).then(() => voz.classList.remove("sonando"));
      return;
    }
    const nav = e.target.closest("[data-ir]");
    if (nav && !nav.disabled) {
      const destino = nav.dataset.ir;
      // Si ya estamos en esa dirección (p. ej. "otro simulacro"), fuerza a repintar
      if (location.hash === destino) enrutar(); else ir(destino);
    }
  });

  function aplicarAjustes() { document.documentElement.classList.toggle("letra-grande", !!D.letraGrande); }

  // En el navegador, las voces se cargan un poco más tarde
  if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => {};

  window.addEventListener("hashchange", enrutar);
  aplicarAjustes();
  enrutar();
})();
