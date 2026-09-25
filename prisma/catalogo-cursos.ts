/**
 * CATÁLOGO DE LOS TRES PRIMEROS CURSOS
 *
 * Fuente única de la estructura (módulos, lecciones y material de Genially) de
 * los cursos de primeros auxilios. La usan:
 *   - prisma/seed.ts            base de demostración local (borra todo),
 *   - prisma/cursos-produccion.ts  crea en producción los que falten, en borrador.
 */

/* ------------------------------------------------------------------ */
/*  ESTRUCTURA DE LOS TRES PRIMEROS CURSOS                             */
/*                                                                     */
/*  Contenido entregado por KG a la fecha:                             */
/*    - KG-PA-001, Módulo 1: presentación interactiva en Genially.     */
/*    - KG-PA-001, Módulo 2: presentación interactiva en Genially.     */
/*    - KG-PA-001, Módulo 3: presentación interactiva en Genially.     */
/*  El resto de módulos queda con el contenedor reservado              */
/*  (contentType "pendiente") hasta que KG produzca el material.       */
/* ------------------------------------------------------------------ */

/** Una lección de la semilla: texto simple si el contenido está pendiente. */
export type LeccionSemilla = {
  title: string;
  description?: string;
  contentType?: string;
  contentUrl?: string;
  durationMin?: number;
  isPreview?: boolean;
};

/**
 * Presentación interactiva del Módulo 1 del Curso Básico de Primeros Auxilios.
 * Se embebe por URL pública: el material vive en Genially y la plataforma solo
 * lo referencia. Si KG edita la presentación, el cambio se refleja sin
 * necesidad de volver a desplegar.
 *
 * Se usa la URL canónica por identificador, sin el fragmento del título. KG ya
 * renombró la presentación una vez (de "CU RSO" a "CURSO") y eso cambió el
 * final de la dirección; la forma corta sobrevive a ese tipo de cambios.
 */
const GENIALLY_PA_MODULO_1 = "https://view.genially.com/6a839aee6503b7aa52feb9d8";

/**
 * Módulo 2 del Curso Básico. Entregado por KG el 31 de agosto de 2026.
 *
 * A diferencia del Módulo 1, está construido como narrativa ramificada: el
 * participante acompaña a un personaje (Vera) por tres misiones y cierra con una
 * decisión que lleva a dos finales distintos. Las actividades viven dentro de la
 * presentación, no en la tabla `assessments`.
 */
const GENIALLY_PA_MODULO_2 = "https://view.genially.com/6a8cb026f9ab92630df290da";

/**
 * Módulo 3 del Curso Básico. Entregado por KG el 31 de agosto de 2026.
 *
 * Es el más extenso de los tres: 31 diapositivas de exploración por zonas del
 * cuerpo y por maniobra. La técnica de RCP y el uso del DEA se enseñan con dos
 * videos de YouTube incrustados dentro de la presentación, así que esa parte
 * depende de que esos videos sigan disponibles en su canal de origen.
 */
const GENIALLY_PA_MODULO_3 = "https://view.genially.com/6a839a1d6503b7aa52fe73bd";

export const CURSOS = [
  {
    code: "KG-PA-001",
    slug: "primeros-auxilios-basicos",
    title: "Curso Básico de Primeros Auxilios",
    subtitle:
      "Para brigadas de emergencia y equipos de primera respuesta: protocolos estandarizados, valoración inicial y gestión segura de la escena.",
    objective:
      "Capacitar al personal integrante de las brigadas de emergencia en la aplicación estandarizada de protocolos internacionales de primeros auxilios y soporte vital; proveer las bases fisiopatológicas, normativas y prácticas para realizar una valoración clínica inicial, estabilización temporal y manejo seguro de lesiones agudas; y desarrollar competencias operativas y de liderazgo en la gestión de escenas de emergencias empresariales, priorizando la autoprotección y la articulación con los sistemas de emergencia.",
    targetAudience:
      "Integrantes de brigadas de emergencia, equipos de primera respuesta, COPASST y personal designado para la atención inicial de emergencias.",
    requirements: "No requiere conocimientos previos. Se recomienda computador o celular con internet.",
    methodology:
      "100% virtual asincrónico. Cada módulo se desarrolla en una presentación interactiva de Genially, con evaluación diagnóstica, evaluaciones por módulo y evaluación final.",
    level: "basico",
    // 3 módulos publicados (60 + 60 + 90 min) y la evaluación final. Al publicar
    // los módulos 4 a 7 del temario hay que subir la intensidad.
    durationHours: 4,
    price: 149000,
    status: "publicado",
    accessType: "pago",
    launch: "22 de agosto de 2026",
    // Se siembran solo los módulos que KG tiene producidos. Sembrar los demás
    // vacíos permitía que un trabajador los marcara como completados sin
    // estudiar nada y saliera certificado.
    //
    // Temario oficial completo, tomado del índice de la presentación de KG. Los
    // módulos 4 a 7 se agregan aquí a medida que KG entregue cada presentación:
    //   4. Manejo de la Vía Aérea y Obstrucción (OVACE)  <- ojo: el Módulo 3
    //      entregado ya cubre OVACE (obstrucción leve y grave). Confirmar con
    //      KG si el 4 se reduce, se fusiona o cambia de alcance.
    //   5. Control de Hemorragias, Heridas y Quemaduras
    //   6. Lesiones Osteomusculares, Shock y Alteraciones de Conciencia
    //   7. Movilización, Transporte de Pacientes y Casos Prácticos
    modules: [
      {
        title: "Módulo 1. Introducción a los Primeros Auxilios y Marco Legal del Brigadista",
        description:
          "Definición y objetivos de los primeros auxilios, rol y límites del primer respondiente, responsabilidad y consentimiento.",
        lessons: [
          {
            title: "Introducción a los Primeros Auxilios y Marco Legal del Brigadista",
            description:
              "Presentación interactiva del módulo: fundamentos y objetivos, rol y competencias del primer respondiente, responsabilidad y consentimiento.",
            contentType: "genially",
            contentUrl: GENIALLY_PA_MODULO_1,
            durationMin: 60,
            isPreview: true,
          },
        ],
      },
      {
        title: "Módulo 2. Valoración de la Escena, Bioseguridad y Activación del SEM",
        description:
          "Por qué no se corre hacia la víctima: evaluar primero si la escena es segura, reconocer los riesgos del lugar, protegerse con los elementos adecuados antes del contacto y activar el sistema de emergencias.",
        lessons: [
          {
            title: "Valoración de la Escena, Bioseguridad y Activación del SEM",
            description:
              "Presentación interactiva en formato de caso: tres misiones guiadas —valoración de la escena, condiciones y riesgos del lugar, y bioseguridad— y una decisión final que muestra las consecuencias de atender antes de protegerse.",
            contentType: "genially",
            contentUrl: GENIALLY_PA_MODULO_2,
            durationMin: 60,
          },
        ],
      },
      {
        title: "Módulo 3. Evaluación Primaria y Soporte Vital Básico (SVB, RCP y DEA)",
        description:
          "Valoración primaria del paciente —consciencia, vía aérea, respiración y circulación—, recorrido céfalo-caudal en busca de lesiones, reanimación cardiopulmonar, uso del desfibrilador externo automático y manejo de la obstrucción de la vía aérea.",
        lessons: [
          {
            title: "Evaluación Primaria y Soporte Vital Básico (SVB, RCP y DEA)",
            description:
              "Presentación interactiva: exploración por zonas del cuerpo y por órgano, señales de alarma en cráneo, tórax, pelvis y extremidades, maniobras de RCP y DEA en video, obstrucción leve y grave de la vía aérea, y una sección final de autoevaluación.",
            contentType: "genially",
            contentUrl: GENIALLY_PA_MODULO_3,
            durationMin: 90,
          },
        ],
      },
    ],
  },
  {
    code: "KG-PA-002",
    slug: "primeros-auxilios-pediatricos",
    title: "Primeros Auxilios Pediátricos",
    subtitle: "Lactantes y niños: valoración, RCP pediátrica, atragantamiento, fiebre y accidentes en el hogar.",
    objective:
      "Capacitar al participante en la atención inicial de emergencias en lactantes y niños, reconociendo las diferencias anatómicas y fisiológicas frente al adulto.",
    targetAudience:
      "Padres, cuidadores, docentes, personal de jardines infantiles y trabajadores con población infantil a cargo.",
    requirements: "Se recomienda haber cursado Primeros Auxilios Básicos.",
    methodology: "100% virtual asincrónico con casos clínicos guiados y evaluación final.",
    level: "intermedio",
    durationHours: 60,
    price: 169000,
    status: "borrador",
    accessType: "pago",
    launch: "Finales de agosto de 2026",
    // Estructura tentativa: KG aún no entrega el material. Se siembra un solo
    // módulo, igual que KG-PA-001, y el temario real se define cuando llegue.
    modules: [
      {
        title: "Módulo 1. El paciente pediátrico es diferente",
        description: "Diferencias anatómicas y fisiológicas, y triángulo de evaluación pediátrica.",
        lessons: ["El paciente pediátrico es diferente"],
      },
    ],
  },
  {
    code: "KG-PA-003",
    slug: "primeros-auxilios-psicologicos",
    title: "Primeros Auxilios Psicológicos",
    subtitle: "Contención emocional en crisis: escucha activa, modelo ABCDE y cuidado de quién ayuda.",
    objective:
      "Entregar herramientas prácticas de contención emocional para acompañar a una persona en crisis dentro del entorno laboral, respetando sus límites y los del auxiliador.",
    targetAudience:
      "Lideres de equipo, talento humano, brigadistas, COPASST y responsables del SG-SST.",
    requirements: "No requiere formación previa en salud mental.",
    methodology: "100% virtual asincrónico con simulaciones de diálogo y evaluación final.",
    level: "basico",
    durationHours: 12,
    price: 139000,
    status: "borrador",
    accessType: "pago",
    launch: "Finales de agosto de 2026",
    // Estructura tentativa: KG aún no entrega el material.
    modules: [
      {
        title: "Módulo 1. Crisis y reacción humana",
        description: "Qué es una crisis y qué reacciones son esperables ante un evento crítico.",
        lessons: ["Crisis y reacción humana"],
      },
    ],
  },
];
