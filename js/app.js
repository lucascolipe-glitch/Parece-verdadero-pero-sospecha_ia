"use strict";

const pantallas = [...document.querySelectorAll(".pantalla")];
const botonesNavegacion = [...document.querySelectorAll("[data-ir]")];

function mostrarPantalla(id, actualizarHash = true) {
  const destino = document.getElementById(id);
  if (!destino) return;

  pantallas.forEach((pantalla) => pantalla.classList.toggle("activa", pantalla === destino));
  if (actualizarHash) history.replaceState(null, "", `#${id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });

  const titulo = destino.querySelector("h1, h2");
  if (titulo) {
    titulo.setAttribute("tabindex", "-1");
    setTimeout(() => titulo.focus({ preventScroll: true }), 250);
  }
}

botonesNavegacion.forEach((boton) => {
  boton.addEventListener("click", (evento) => {
    evento.preventDefault();
    mostrarPantalla(boton.dataset.ir);
  });
});

const hashInicial = location.hash.replace("#", "");
mostrarPantalla(document.getElementById(hashInicial) ? hashInicial : "inicio", false);

// Audio alternativo mediante la voz del navegador.
const botonLeer = document.getElementById("leer-navegador");
if (botonLeer) {
  botonLeer.addEventListener("click", () => {
    if (!("speechSynthesis" in window)) {
      alert("Este navegador no ofrece lectura por voz.");
      return;
    }
    speechSynthesis.cancel();
    const texto = "La inteligencia artificial puede responder con seguridad y estar equivocada. La fluidez de sus palabras no garantiza la verdad. Sospechar no es rechazar la tecnología: es detenerse, preguntar por las evidencias, buscar otras voces y decidir qué lugar darle a la respuesta.";
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-AR";
    mensaje.rate = 0.94;
    speechSynthesis.speak(mensaje);
  });
}

// Actividad interactiva.
const casos = [
  {
    titulo: "Una estadística sin origen",
    texto: "La IA afirma: “El 73 % de los estudiantes aprende mejor con inteligencia artificial”, pero no indica estudio, fecha, muestra ni enlace verificable.",
    correcta: "amarillo",
    devolucion: "La afirmación podría ser verdadera o falsa, pero no hay evidencia suficiente. Conviene verificar antes de utilizarla."
  },
  {
    titulo: "Una fuente inventada",
    texto: "La IA atribuye una cita textual a un libro y una página. Al buscar el título, la obra no existe en catálogos ni repositorios confiables.",
    correcta: "rojo",
    devolucion: "La referencia no puede corroborarse y presenta una señal fuerte de invención. Debe descartarse y reemplazarse por una fuente real."
  },
  {
    titulo: "Una respuesta con evidencia rastreable",
    texto: "La IA resume una idea de un documento que vos le proporcionaste, indica la página correcta y la comparación con el texto original confirma el sentido.",
    correcta: "verde",
    devolucion: "La respuesta tiene una fuente identificable y fue contrastada con el original. Puede utilizarse, citando el documento y explicando el uso de IAG."
  }
];

let indiceCaso = 0;
let puntaje = 0;
const tituloCaso = document.getElementById("caso-titulo");
const textoCaso = document.getElementById("caso-texto");
const etiquetaCaso = document.getElementById("caso-etiqueta");
const actualCaso = document.getElementById("quiz-actual");
const totalCasos = document.getElementById("quiz-total");
const devolucion = document.getElementById("devolucion");
const siguiente = document.getElementById("siguiente-caso");
const opciones = [...document.querySelectorAll("[data-respuesta]")];

if (totalCasos) totalCasos.textContent = casos.length;

function cargarCaso() {
  const caso = casos[indiceCaso];
  actualCaso.textContent = indiceCaso + 1;
  etiquetaCaso.textContent = `Situación ${indiceCaso + 1}`;
  tituloCaso.textContent = caso.titulo;
  textoCaso.textContent = caso.texto;
  devolucion.hidden = true;
  devolucion.textContent = "";
  siguiente.hidden = true;
  siguiente.textContent = indiceCaso === casos.length - 1 ? "Ver resultado" : "Siguiente situación";
  opciones.forEach((opcion) => {
    opcion.disabled = false;
    opcion.removeAttribute("aria-pressed");
  });
}

opciones.forEach((opcion) => {
  opcion.addEventListener("click", () => {
    const elegida = opcion.dataset.respuesta;
    const caso = casos[indiceCaso];
    const acierto = elegida === caso.correcta;
    if (acierto) puntaje += 1;

    opciones.forEach((boton) => {
      boton.disabled = true;
      boton.setAttribute("aria-pressed", boton === opcion ? "true" : "false");
    });
    devolucion.hidden = false;
    devolucion.innerHTML = `<strong>${acierto ? "Buena decisión." : "Vale la pena revisar el criterio."}</strong> ${caso.devolucion}`;
    siguiente.hidden = false;
  });
});

if (siguiente) {
  siguiente.addEventListener("click", () => {
    if (indiceCaso < casos.length - 1) {
      indiceCaso += 1;
      cargarCaso();
      return;
    }

    tituloCaso.textContent = `Resultado: ${puntaje} de ${casos.length}`;
    textoCaso.textContent = puntaje === casos.length
      ? "Aplicaste criterios de verificación en las tres situaciones."
      : "La sospecha crítica se construye con práctica: lo importante es poder justificar cada decisión.";
    etiquetaCaso.textContent = "Recorrido completado";
    document.querySelector(".semaforo-opciones").hidden = true;
    devolucion.hidden = false;
    devolucion.innerHTML = "Recordá: una respuesta confiable no depende del tono con que está escrita, sino de las evidencias, el contexto y la posibilidad de contrastarla.";
    siguiente.hidden = true;
  });
  cargarCaso();
}

// Bitácora local.
const campoReflexion = document.getElementById("reflexion");
const guardarReflexion = document.getElementById("guardar-reflexion");
const estadoGuardado = document.getElementById("estado-guardado");
if (campoReflexion) campoReflexion.value = localStorage.getItem("capsula-reflexion") || "";
if (guardarReflexion) {
  guardarReflexion.addEventListener("click", () => {
    localStorage.setItem("capsula-reflexion", campoReflexion.value.trim());
    estadoGuardado.textContent = "Guardado.";
    setTimeout(() => { estadoGuardado.textContent = ""; }, 2000);
  });
}

// Preguntas para la pausa musical.
const preguntasPausa = [
  "¿Qué afirmación de la respuesta todavía no puedo justificar?",
  "¿Qué voz o perspectiva podría estar ausente?",
  "¿Qué cambiaría si la respuesta se produjera desde mi territorio?",
  "¿Qué parte acepté por el tono seguro y no por la evidencia?",
  "¿Qué tarea de pensamiento no quiero delegar?"
];
const preguntaPausa = document.getElementById("pregunta-pausa");
const otraPregunta = document.getElementById("otra-pregunta");
if (otraPregunta) {
  otraPregunta.addEventListener("click", () => {
    const actual = preguntasPausa.indexOf(preguntaPausa.textContent);
    preguntaPausa.textContent = preguntasPausa[(actual + 1) % preguntasPausa.length];
  });
}
