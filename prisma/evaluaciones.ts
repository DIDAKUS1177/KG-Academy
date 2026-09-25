/**
 * EVALUACIONES FINALES DE LOS CURSOS DEL CATÁLOGO
 *
 * Fuente única de las preguntas: la usan la semilla de demostración
 * (seed.ts) y la carga a producción (evaluaciones-produccion.ts).
 *
 * KG-PA-001 sigue los temas de sus tres módulos de Genially: marco legal y rol
 * del primer respondiente, valoración de la escena y bioseguridad, y
 * evaluación primaria con RCP, DEA y obstrucción de la vía aérea. Los valores
 * de RCP corresponden a las recomendaciones internacionales vigentes para
 * adultos. Debe validarla un profesional de KG; KG la puede editar desde
 * Administración → Evaluaciones sin tocar código.
 */

export type PreguntaEvaluacion = {
  statement: string;
  explanation: string;
  type?: "unica" | "verdadero_falso";
  options: { text: string; ok: boolean }[];
};

export type EvaluacionFinal = {
  title: string;
  description: string;
  minScore: number;
  maxAttempts: number;
  timeLimitMin: number;
  preguntas: PreguntaEvaluacion[];
};

const VF = (ok: boolean) => [
  { text: "Verdadero", ok },
  { text: "Falso", ok: !ok },
];

export const EVALUACIONES_FINALES: Record<string, EvaluacionFinal> = {
  "KG-PA-001": {
    title: "Evaluación final",
    description:
      "16 preguntas sobre los tres módulos del curso. Nota mínima aprobatoria: 80/100. Tiene tres intentos y 25 minutos por intento.",
    minScore: 80,
    maxAttempts: 3,
    timeLimitMin: 25,
    preguntas: [
      /* ---------------- Módulo 1 · Marco legal y rol del brigadista ---------------- */
      {
        statement: "¿Cuál es el objetivo principal de los primeros auxilios?",
        explanation:
          "Los primeros auxilios buscan preservar la vida, evitar que las lesiones empeoren y facilitar la recuperación mientras llega la atención profesional.",
        options: [
          { text: "Preservar la vida y evitar que las lesiones empeoren hasta que llegue la atención profesional", ok: true },
          { text: "Diagnosticar la enfermedad y formular el tratamiento", ok: false },
          { text: "Reemplazar la atención del personal de salud", ok: false },
          { text: "Trasladar siempre al lesionado en un vehículo particular", ok: false },
        ],
      },
      {
        statement: "¿Qué puede hacer un primer respondiente?",
        explanation:
          "El primer respondiente actúa dentro de su formación: brinda la atención inicial y no diagnostica, no formula medicamentos ni hace procedimientos invasivos.",
        options: [
          { text: "Brindar atención inicial dentro de su formación, sin reemplazar al personal de salud", ok: true },
          { text: "Administrar medicamentos para calmar el dolor", ok: false },
          { text: "Suturar heridas si tiene el material", ok: false },
          { text: "Decidir que la persona no necesita ir al médico", ok: false },
        ],
      },
      {
        statement: "Una persona está inconsciente y necesita ayuda. ¿Cómo se entiende su consentimiento?",
        explanation:
          "Ante una persona inconsciente se asume el consentimiento implícito: se entiende que aceptaría la ayuda si pudiera expresarlo.",
        options: [
          { text: "Se asume consentimiento implícito y se le ayuda", ok: true },
          { text: "No se le puede ayudar hasta que un familiar lo autorice", ok: false },
          { text: "Hay que esperar a que despierte para preguntarle", ok: false },
          { text: "Solo el personal de salud puede atenderla", ok: false },
        ],
      },
      {
        statement: "Un adulto consciente y orientado rechaza la ayuda que le ofrece. ¿Qué hace?",
        explanation:
          "Se respeta su decisión: no se le obliga. Se activa el sistema de emergencias si es necesario y se permanece atento por si cambia la situación.",
        options: [
          { text: "Respeto su decisión, activo el sistema de emergencias si hace falta y me quedo atento", ok: true },
          { text: "Lo atiendo de todas formas porque es mi obligación", ok: false },
          { text: "Me retiro sin avisar a nadie", ok: false },
          { text: "Le pido a otra persona que lo sujete para atenderlo", ok: false },
        ],
      },
      {
        statement:
          "Verdadero o falso: el primer respondiente está obligado a ponerse en riesgo para atender a una víctima.",
        explanation:
          "Falso. La primera regla es la propia seguridad: un auxiliador lesionado no puede ayudar y se convierte en otra víctima.",
        type: "verdadero_falso",
        options: VF(false),
      },

      /* ---------- Módulo 2 · Escena, bioseguridad y activación del SEM ---------- */
      {
        statement: "Al llegar donde hay una persona lesionada, ¿qué es lo primero?",
        explanation:
          "Antes de acercarse se valora la escena: que no haya riesgos para usted, para la víctima ni para los demás.",
        options: [
          { text: "Verificar que la escena sea segura", ok: true },
          { text: "Correr hacia la víctima", ok: false },
          { text: "Moverla a un lugar más cómodo", ok: false },
          { text: "Darle agua", ok: false },
        ],
      },
      {
        statement: "¿Qué significa la secuencia PAS?",
        explanation: "Proteger (la escena y a usted), Avisar (activar el sistema de emergencias) y Socorrer (atender a la víctima).",
        options: [
          { text: "Proteger, Avisar, Socorrer", ok: true },
          { text: "Prevenir, Ayudar, Sanar", ok: false },
          { text: "Preguntar, Atender, Salir", ok: false },
          { text: "Presionar, Aplicar, Sostener", ok: false },
        ],
      },
      {
        statement: "¿Cuándo se ponen los guantes u otra barrera de protección?",
        explanation:
          "Antes de cualquier contacto con sangre o fluidos corporales. Si no hay guantes, sirve una bolsa plástica o una tela gruesa.",
        options: [
          { text: "Antes de tener contacto con sangre o fluidos de la víctima", ok: true },
          { text: "Solo si la víctima tiene una enfermedad conocida", ok: false },
          { text: "Después de atenderla, para limpiar", ok: false },
          { text: "No son necesarios en primeros auxilios", ok: false },
        ],
      },
      {
        statement: "¿Cuál es el número único de emergencias en Colombia?",
        explanation: "El 123 es la línea única de emergencias en Colombia.",
        options: [
          { text: "123", ok: true },
          { text: "911", ok: false },
          { text: "112", ok: false },
          { text: "144", ok: false },
        ],
      },
      {
        statement: "Al llamar a la línea de emergencias, ¿qué información es la más importante?",
        explanation:
          "La dirección exacta, qué pasó, cuántas víctimas hay y en qué estado están. Y no colgar hasta que el operador lo indique.",
        options: [
          { text: "La dirección exacta, qué pasó, cuántas víctimas hay y cómo están", ok: true },
          { text: "El nombre completo y la EPS de la víctima", ok: false },
          { text: "Solo que hay una emergencia", ok: false },
          { text: "El nombre de la empresa y del jefe inmediato", ok: false },
        ],
      },

      /* ------- Módulo 3 · Evaluación primaria, RCP, DEA y vía aérea ------- */
      {
        statement: "Un adulto no responde y no respira con normalidad. ¿Qué hace?",
        explanation:
          "Se trata como un paro cardíaco: pedir ayuda y el DEA, llamar al 123 e iniciar compresiones torácicas de inmediato.",
        options: [
          { text: "Pido ayuda y el DEA, llamo al 123 e inicio compresiones torácicas", ok: true },
          { text: "Espero a que llegue la ambulancia sin tocarlo", ok: false },
          { text: "Le doy agua y lo siento", ok: false },
          { text: "Lo pongo de lado y me voy a buscar ayuda", ok: false },
        ],
      },
      {
        statement: "¿A qué frecuencia se hacen las compresiones torácicas en un adulto?",
        explanation: "Entre 100 y 120 compresiones por minuto.",
        options: [
          { text: "Entre 100 y 120 por minuto", ok: true },
          { text: "Entre 60 y 80 por minuto", ok: false },
          { text: "Entre 140 y 160 por minuto", ok: false },
          { text: "Según el cansancio del reanimador", ok: false },
        ],
      },
      {
        statement: "¿Qué profundidad deben tener las compresiones en un adulto?",
        explanation:
          "Al menos 5 cm sin pasar de 6 cm, dejando que el pecho vuelva a su posición entre compresiones.",
        options: [
          { text: "Al menos 5 cm, sin pasar de 6 cm", ok: true },
          { text: "1 a 2 cm", ok: false },
          { text: "Más de 8 cm", ok: false },
          { text: "La profundidad no importa", ok: false },
        ],
      },
      {
        statement: "Un solo reanimador entrenado atiende a un adulto. ¿Cuál es la relación de compresiones y ventilaciones?",
        explanation:
          "30 compresiones por 2 ventilaciones. Si no está entrenado o no puede ventilar, se hacen solo compresiones continuas.",
        options: [
          { text: "30 compresiones por 2 ventilaciones", ok: true },
          { text: "15 compresiones por 1 ventilación", ok: false },
          { text: "5 compresiones por 1 ventilación", ok: false },
          { text: "50 compresiones por 5 ventilaciones", ok: false },
        ],
      },
      {
        statement: "Llega el desfibrilador externo automático (DEA). ¿Qué es lo correcto?",
        explanation:
          "Se enciende y se siguen sus instrucciones de voz. Mientras analiza y descarga, nadie toca a la persona; después se retoman las compresiones.",
        options: [
          { text: "Encenderlo, seguir sus instrucciones y que nadie toque a la persona mientras analiza o descarga", ok: true },
          { text: "Esperar a la ambulancia para que lo use el personal de salud", ok: false },
          { text: "Usarlo solo si la persona está consciente", ok: false },
          { text: "Suspender la RCP hasta que llegue el médico", ok: false },
        ],
      },
      {
        statement: "Un adulto consciente se atraganta: no puede hablar, toser ni respirar. ¿Qué hace?",
        explanation:
          "Es una obstrucción grave de la vía aérea: se hacen compresiones abdominales (maniobra de Heimlich) hasta que expulse el objeto o pierda la consciencia. Si solo tose, se le anima a seguir tosiendo.",
        options: [
          { text: "Compresiones abdominales (maniobra de Heimlich)", ok: true },
          { text: "Darle agua para que pase el objeto", ok: false },
          { text: "Esperar a que tosa solo", ok: false },
          { text: "Acostarlo boca arriba y esperar", ok: false },
        ],
      },
    ],
  },
};
