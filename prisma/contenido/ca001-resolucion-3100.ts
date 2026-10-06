/**
 * CURSO KG-CA-001 · RESOLUCIÓN 3100 DE 2019: HABILITACIÓN DE SERVICIOS DE SALUD
 *
 * Curso completo en formato interactivo (contentType "interactivo"): cuatro
 * módulos de dos lecciones sobre la inscripción de prestadores y la
 * habilitación de servicios de salud en Colombia (Resolución 3100 de 2019 del
 * Ministerio de Salud y Protección Social y su Manual de Inscripción de
 * Prestadores y Habilitación de Servicios de Salud), con ejemplos de una IPS y
 * de un cuerpo de bomberos con servicio de ambulancia.
 *
 * BORRADOR redactado por Claude a solicitud de Diego. Está PENDIENTE DE
 * VALIDACIÓN TÉCNICA por los profesionales de KG (calidad en salud y
 * habilitación) antes de certificar a nadie con él. Explica la norma con
 * palabras propias; no transcribe su texto.
 *
 * Estado normativo verificado el 6 de octubre de 2026: la Resolución 3100 de
 * 2019 sigue vigente con sus modificaciones (2215 de 2020, 1317 de 2021, 1138 y
 * 1410 de 2022, 1719 de 2022, 544 y 648 de 2023 y 465 de 2025). La Resolución
 * 1732 del 5 de agosto de 2026, que pretendía reemplazarla, no se publicó en el
 * Diario Oficial y fue revocada en su integridad por la Resolución 2080 del 8 de
 * septiembre de 2026.
 *
 * Fuentes consultadas:
 *  - Resolución 3100 de 2019 con notas de vigencia y anexo técnico (Normograma
 *    de la Cancillería, actualizado al 30 de septiembre de 2024):
 *    https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/resolucion_minsaludps_3100_2019.htm
 *  - Resolución 544 de 2023 (MinSalud):
 *    https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%20No.%20544%20de%202023.pdf
 *  - Resolución 465 de 2025 (MinSalud):
 *    https://www.minsalud.gov.co/Normatividad_Nuevo/Resolucion%20No%20465%20de%202025.pdf
 *  - Resolución 2080 de 2026, que revoca la 1732 de 2026 (MinSalud):
 *    https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%20No%202080%20de%202026.pdf
 *  - Resolución 1317 de 2021 (SUIN-Juriscol), ampliación de plazos del art. 26:
 *    https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Resolucion/30043644
 *  - Decreto 780 de 2016, Título 1 de la Parte 5 del Libro 2 (SOGCS), en el
 *    gestor normativo de Función Pública:
 *    https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=77813
 *  - Ley 9 de 1979, artículos 576 (medidas de seguridad) y 577 (sanciones):
 *    https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=1177
 *  - Gobernación de Caldas, caso de un cuerpo de bomberos con atención
 *    prehospitalaria que trasladaba pacientes sin habilitar el transporte:
 *    https://caldas.gov.co/noticias-gobernacion/5472-cuerpo-de-bomberos-de-manizales-debe-solicitar-la-habilitacion-del-servicio-de-transporte-asistencial-de-pacientes-territorial-de-salud-de-caldas-realizo-visita-de-inspeccion-vigilancia-y-control-a-este-organismo-de-socorro
 *  - Notas de contexto sobre la revocatoria de la 1732 de 2026 (secundarias):
 *    https://fepasde.com/noticias/resolucion-2080-2026-habilitacion-servicios-salud/
 *    https://consultorsalud.com/minsalud-revoca-la-resolucion-1732-de-2026-asi-quedan-las-reglas-de-habilitacion-para-prestadores-de-servicios-de-salud/
 *
 * Puntos que KG debe confirmar antes de publicar:
 *  1. Vigencia y autoevaluación: el art. 10 fija cuatro años para la inscripción
 *     inicial y renovaciones anuales, y la regla transitoria del art. 26.1
 *     (Res. 648 de 2023) dice que la autoevaluación declarada tras la
 *     actualización del REPS vale un año. Confirmar cómo lo aplican hoy el REPS
 *     y las secretarías, sobre todo para prestadores dentro de sus cuatro años.
 *  2. Tipo de prestador con que se inscriben los cuerpos de bomberos (entidad
 *     con objeto social diferente o transporte especial de pacientes) y sus
 *     efectos: los servicios de una entidad con objeto social diferente no se
 *     pueden contratar dentro del SGSSS. El curso no fija un tipo único.
 *  3. Soportes de la novedad «apertura de ambulancias»: las tablas 3 a 6 del
 *     manual (requisitos de novedades) son imágenes y no se pudieron leer. El
 *     curso solo dice que se reporta con los soportes que pide el manual.
 *  4. Emblemas de la ambulancia: el criterio 13.7 del manual decía «estrella de
 *     la vida ... o el emblema de la Misión Médica»; el art. 20 modificado por
 *     la Res. 465 de 2025 exige ambos («y»). El curso enseña la versión de 2025.
 *  5. Aplicación del PAMEC a prestadores que no son IPS (por ejemplo, un cuerpo
 *     de bomberos): el Decreto 780 lo hace obligatorio para IPS, EAPB y
 *     entidades territoriales; el curso no afirma que sea obligatorio para otros.
 *  6. Seguir el nuevo proceso de actualización de la habilitación anunciado en
 *     la Res. 2080 de 2026: si sale una norma nueva, este curso queda obsoleto.
 *  7. Revisar las constancias de formación continua citadas (soporte vital
 *     básico y avanzado, primer respondiente, ataques con agentes químicos) y
 *     los ejemplos de dotación de la ambulancia contra la versión vigente del
 *     manual que use la secretaría de salud.
 */
import type { CursoInteractivo } from "../cursos-interactivos";

const VF = (ok: boolean) => [
  { text: "Verdadero", ok },
  { text: "Falso", ok: !ok },
];

const MARCELA = { nombre: "Marcela Rincón", rol: "Auditora de calidad en salud", avatar: "paramedico" as const };

export const RESOLUCION_3100: CursoInteractivo = {
  code: "KG-CA-001",
  slug: "resolucion-3100-habilitacion",
  title: "Resolución 3100 de 2019: habilitación de servicios de salud",
  subtitle:
    "Inscripción en el REPS, autoevaluación, condiciones y estándares de habilitación, visitas de verificación y mejora continua. Con casos de una IPS y de la ambulancia de un cuerpo de bomberos.",
  objective:
    "Que el participante explique cómo se inscribe un prestador y se habilita un servicio de salud según la Resolución 3100 de 2019 y sus modificaciones vigentes, aplique las condiciones de habilitación y los siete estándares de capacidad tecnológica y científica en una autoevaluación honesta, mantenga al día el REPS con sus novedades, prepare una visita de verificación y conecte la habilitación con la auditoría para el mejoramiento de la calidad y la acreditación.",
  targetAudience:
    "Prestadores de servicios de salud, IPS, profesionales independientes, organismos de socorro y cuerpos de bomberos que prestan transporte asistencial de pacientes, responsables de calidad y auditores.",
  requirements:
    "No requiere formación jurídica. Se recomienda conocer el funcionamiento básico del sistema de salud colombiano. El curso explica la norma con fines de formación: no reemplaza la lectura del texto vigente ni la asesoría de la secretaría de salud.",
  methodology:
    "100% virtual y en formato de videojuego: mundos y niveles con vidas, XP y estrellas, recorridos de autoevaluación con el riesgo de hallazgos en juego, preparación de la visita previa de una ambulancia contra el reloj, decisiones con consecuencias y desafío final.",
  level: "intermedio",
  durationHours: 3,
  categoria: "calidad",
  modules: [
    /* ==================================================================== */
    /*  MÓDULO 1 · EL SISTEMA DE CALIDAD Y LA HABILITACIÓN                    */
    /* ==================================================================== */
    {
      title: "Módulo 1. El sistema de calidad y la habilitación",
      description:
        "Qué es habilitar, dónde encaja en el Sistema Obligatorio de Garantía de Calidad, quién expide, quién verifica y quién vigila, qué es el REPS y qué tipos de prestadores existen.",
      lessons: [
        {
          title: "La puerta de entrada al sistema de salud",
          description: "La habilitación dentro del SOGCS, los actores del sistema y el estado actual de la norma.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: MARCELA,
            bloques: [
              {
                tipo: "portada",
                titulo: "La puerta de entrada al sistema de salud",
                subtitulo: "Habilitar no es un trámite más: es demostrar que su servicio cumple lo mínimo para atender a las personas con seguridad.",
                objetivos: [
                  "Explicar qué es la habilitación y para qué sirve",
                  "Ubicar la habilitación dentro del Sistema Obligatorio de Garantía de Calidad (SOGCS)",
                  "Identificar quién expide las normas, quién verifica y quién vigila",
                  "Reconocer qué norma está vigente hoy",
                ],
                minutos: 20,
                dice: "Soy Marcela Rincón, auditora de calidad en salud. Llevo años acompañando a clínicas, consultorios y cuerpos de bomberos a preparar sus visitas de habilitación. En este curso le voy a mostrar la Resolución 3100 de 2019 sin enredos de abogado.",
              },
              {
                tipo: "explicacion",
                titulo: "¿Qué es habilitar un servicio de salud?",
                parrafos: [
                  "En Colombia nadie puede ofrecer ni prestar un servicio de salud solo porque tiene un título o un local. Antes debe demostrar que cumple unas condiciones mínimas que protegen al paciente: personal idóneo, instalaciones adecuadas, equipos en buen estado, procesos seguros y registros confiables.",
                  "La habilitación es la autorización para ofertar y prestar servicios de salud dentro del Sistema General de Seguridad Social en Salud. Se habilita servicio por servicio: para la norma, el servicio de salud es la unidad básica que se habilita.",
                  "La Resolución 3100 de 2019 del Ministerio de Salud y Protección Social define cómo se inscriben los prestadores y cómo se habilitan los servicios. Su anexo técnico es el Manual de Inscripción de Prestadores y Habilitación de Servicios de Salud, que trae las condiciones, los estándares y los criterios que se verifican.",
                ],
                puntos: [
                  { titulo: "Es obligatoria", texto: "Sin habilitación, el servicio no se puede ofertar ni prestar." },
                  { titulo: "Es un mínimo", texto: "Los estándares son requisitos básicos de seguridad, no un premio a la excelencia." },
                  { titulo: "Es por servicio", texto: "Una IPS puede tener habilitada la consulta externa y no la urgencia. Cada servicio cumple lo suyo." },
                ],
                clave: "Si un servicio no cumple las condiciones de habilitación, el prestador debe abstenerse de ofertarlo y prestarlo hasta que las cumpla.",
              },
              {
                tipo: "explicacion",
                titulo: "El SOGCS: cuatro piezas de un mismo sistema",
                parrafos: [
                  "El Decreto 780 de 2016, Decreto Único del sector salud, organiza la calidad en el Sistema Obligatorio de Garantía de Calidad de la Atención de Salud, conocido como SOGCS. La habilitación es solo uno de sus cuatro componentes.",
                ],
                puntos: [
                  { titulo: "Sistema Único de Habilitación", texto: "Las condiciones mínimas obligatorias para entrar y permanecer en el sistema. Es el tema de este curso." },
                  { titulo: "Auditoría para el Mejoramiento de la Calidad", texto: "Compara la calidad observada con la esperada y corrige las desviaciones. En las IPS se conoce como PAMEC." },
                  { titulo: "Sistema Único de Acreditación", texto: "Proceso voluntario para demostrar niveles de calidad superiores a los mínimos." },
                  { titulo: "Sistema de Información para la Calidad", texto: "Datos para hacer seguimiento a la calidad y orientar a los usuarios en sus decisiones." },
                ],
                clave: "La habilitación es el piso obligatorio; la auditoría para el mejoramiento y la acreditación construyen hacia arriba.",
                dice: "Cuando un gerente me pregunta si la habilitación es «la certificación de calidad», le respondo: no, es la licencia mínima para abrir la puerta.",
              },
              {
                tipo: "tarjetas",
                titulo: "Las cinco características de la calidad",
                instruccion: "El SOGCS busca que la atención cumpla cinco características. Toque cada tarjeta para ver qué significa.",
                tarjetas: [
                  {
                    frente: "Accesibilidad",
                    reverso: "Que el usuario pueda utilizar los servicios de salud que le garantiza el sistema.",
                  },
                  {
                    frente: "Oportunidad",
                    reverso: "Que obtenga los servicios que necesita sin retrasos que pongan en riesgo su vida o su salud.",
                  },
                  {
                    frente: "Seguridad",
                    reverso: "Estructuras, procesos y métodos basados en evidencia que buscan reducir el riesgo de un evento adverso o mitigar sus consecuencias.",
                  },
                  {
                    frente: "Pertinencia",
                    reverso: "Que reciba lo que de verdad requiere, con buen uso de los recursos y con beneficios mayores que los efectos secundarios.",
                  },
                  {
                    frente: "Continuidad",
                    reverso: "Que reciba las intervenciones que necesita en una secuencia lógica y racional, sin cortes que afecten su atención.",
                  },
                ],
              },
              {
                tipo: "clasificar",
                titulo: "¿A qué componente pertenece?",
                instruccion: "Toque el componente del SOGCS al que corresponde cada actividad.",
                categorias: [
                  { id: "hab", nombre: "Habilitación", pista: "Lo mínimo obligatorio" },
                  { id: "aud", nombre: "Auditoría para el mejoramiento", pista: "Calidad observada contra esperada" },
                  { id: "acr", nombre: "Acreditación", pista: "Voluntaria y superior" },
                  { id: "inf", nombre: "Información para la calidad", pista: "Datos para monitorear y orientar" },
                ],
                elementos: [
                  { texto: "Declarar la autoevaluación de los servicios en el REPS", categoria: "hab" },
                  { texto: "Recibir la visita de verificación de la secretaría de salud", categoria: "hab" },
                  { texto: "Fijar el distintivo del servicio en un lugar visible", categoria: "hab", porque: "El distintivo muestra que el servicio está habilitado." },
                  { texto: "Comparar la calidad que se obtuvo con la que se esperaba y corregir las diferencias", categoria: "aud" },
                  { texto: "Trabajar en tres niveles: autocontrol, auditoría interna y auditoría externa", categoria: "aud", porque: "Son los niveles en que opera la auditoría para el mejoramiento de la calidad." },
                  { texto: "Someterse por decisión propia a la evaluación externa de una entidad acreditadora", categoria: "acr" },
                  { texto: "Dar información para que los usuarios elijan su IPS o su EPS con base en la calidad", categoria: "inf", porque: "Orientar a los usuarios es uno de los objetivos del sistema de información para la calidad." },
                  { texto: "Monitorear la calidad de los servicios para ajustar el sistema", categoria: "inf" },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "¿Quién hace qué?",
                parrafos: [
                  "La habilitación funciona con reglas nacionales y verificación territorial. Conocer el papel de cada actor le evita perder tiempo tocando la puerta equivocada.",
                ],
                puntos: [
                  { titulo: "Ministerio de Salud y Protección Social", texto: "Expide las normas y los estándares, como la Resolución 3100 de 2019, y consolida el REPS de todo el país." },
                  { titulo: "Secretarías de salud departamentales y distritales", texto: "Inscriben a los prestadores, administran el REPS de su territorio, verifican las condiciones en visitas, autorizan el distintivo y brindan asistencia técnica. Si otra entidad tiene esas competencias, es ella quien lo hace." },
                  { titulo: "Superintendencia Nacional de Salud", texto: "Ejerce inspección, vigilancia y control dentro del SOGCS y vigila que las entidades territoriales cumplan sus funciones de habilitación." },
                  { titulo: "Secretarías municipales de salud", texto: "Brindan asistencia técnica para implementar la auditoría para el mejoramiento de la calidad en los prestadores de su jurisdicción." },
                  { titulo: "El prestador", texto: "Se autoevalúa, declara la verdad en el REPS, mantiene las condiciones y reporta sus cambios." },
                ],
                clave: "Las condiciones de habilitación las verifica la secretaría de salud departamental o distrital (o la entidad que tenga esas competencias), no el municipio ni el Ministerio.",
              },
              {
                tipo: "decision",
                titulo: "¿Ante quién se tramita?",
                situacion:
                  "El capitán Jorge Pinzón, comandante del Cuerpo de Bomberos Voluntarios de San Isidro, quiere habilitar la ambulancia del cuerpo de bomberos. Un concejal le dice que basta con un permiso de la alcaldía.",
                pregunta: "¿Ante quién debe adelantar la inscripción y la habilitación?",
                opciones: [
                  {
                    texto: "Ante la secretaría de salud departamental o distrital donde está su sede, a través del REPS",
                    correcta: true,
                    retro: "Correcto. Las secretarías departamentales y distritales inscriben a los prestadores y habilitan los servicios. Un permiso municipal no reemplaza ese trámite.",
                  },
                  {
                    texto: "Ante la alcaldía municipal, con un permiso de funcionamiento",
                    retro: "Un permiso de la alcaldía no habilita servicios de salud. La inscripción se hace en el REPS ante la secretaría departamental o distrital.",
                  },
                  {
                    texto: "Directamente ante el Ministerio de Salud, en Bogotá",
                    retro: "El Ministerio expide las normas y consolida el REPS, pero no inscribe a cada prestador. Eso lo hace la secretaría del territorio.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Una norma que se ha movido",
                parrafos: [
                  "La Resolución 3100 se firmó el 25 de noviembre de 2019 y reemplazó a la Resolución 2003 de 2014. Desde entonces ha tenido varios ajustes: plazos de transición, reglas del plan de visitas y cambios en artículos sobre inscripción, novedades, visitas y transporte asistencial.",
                  "Para el día a día pesan dos modificaciones. La Resolución 544 de 2023 incluyó, entre otras cosas, la habilitación del traslado de pacientes a cargo de los cuerpos de bomberos. La Resolución 465 de 2025 precisó temas como la grabación de procedimientos, la vacunación y los emblemas de las ambulancias.",
                  "En agosto de 2026 el Ministerio expidió la Resolución 1732, que pretendía reemplazar a la 3100. Nunca se publicó en el Diario Oficial, así que no llegó a ser obligatoria, y la Resolución 2080 del 8 de septiembre de 2026 la revocó por completo. Resultado: la Resolución 3100 de 2019 y sus modificaciones siguen vigentes, sin interrupción.",
                ],
                puntos: [
                  { titulo: "2019", texto: "Resolución 3100: nuevo procedimiento de inscripción y nuevo manual de habilitación." },
                  { titulo: "2020 a 2023", texto: "Resoluciones 2215, 1317, 1138, 1410, 1719, 544 y 648: plazos de transición, plan de visitas y otros ajustes." },
                  { titulo: "2025", texto: "Resolución 465: cambios en los artículos 4, 5, 7, 19 y 20." },
                  { titulo: "2026", texto: "Resolución 1732, revocada por la 2080 antes de entrar a regir." },
                ],
                clave: "Antes de una autoevaluación o de una visita, confirme el texto vigente con todas sus modificaciones. La Resolución 2080 de 2026 anunció que la actualización de la habilitación se retomará con un nuevo proceso.",
              },
              {
                tipo: "contrarreloj",
                titulo: "¿Ya cambió la norma?",
                segundos: 20,
                situacion:
                  "En una reunión de calidad, un compañero afirma: «Ya no hay que preocuparse por la 3100; desde agosto de 2026 rige la Resolución 1732».",
                pregunta: "¿Qué le responde?",
                opciones: [
                  {
                    texto: "Que la 1732 de 2026 nunca se publicó en el Diario Oficial y fue revocada por la 2080 de 2026; la 3100 de 2019 sigue vigente",
                    correcta: true,
                    retro: "Exacto. Una resolución general que no se publica no obliga, y además esta fue revocada. Se sigue trabajando con la 3100 y sus modificaciones.",
                  },
                  {
                    texto: "Que tiene razón: hay que aplicar la 1732 desde que se firmó",
                    retro: "No. La 1732 no llegó a ser obligatoria y fue revocada. Aplicarla lo pondría a preparar requisitos que no existen.",
                  },
                  {
                    texto: "Que mientras sale una norma nueva no rige ninguna de las dos",
                    retro: "Falso. No hay vacío: la 3100 de 2019 y sus modificaciones siguen rigiendo sin interrupción.",
                  },
                ],
                alAgotar: "Se acabó el tiempo y su compañero salió convencido de algo falso. Recuerde: la 1732 de 2026 fue revocada y la 3100 de 2019 sigue vigente.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Habilitar es obtener la autorización para ofertar y prestar un servicio de salud, cumpliendo condiciones mínimas de seguridad.",
                  "El SOGCS tiene cuatro componentes: habilitación, auditoría para el mejoramiento, acreditación e información para la calidad.",
                  "El Ministerio expide las normas; las secretarías departamentales y distritales inscriben y verifican; la Supersalud vigila.",
                  "La Resolución 3100 de 2019, con sus modificaciones, sigue vigente: la 1732 de 2026 fue revocada.",
                ],
                insignia: "Guardián del mínimo",
                cierre: "En la próxima lección conocerá el REPS y los cuatro tipos de prestadores, incluido el caso de los cuerpos de bomberos.",
              },
            ],
          },
        },
        {
          title: "El REPS y los tipos de prestadores",
          description: "El registro de prestadores, los cuatro tipos de prestador y el caso de los cuerpos de bomberos con ambulancia.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: MARCELA,
            bloques: [
              {
                tipo: "portada",
                titulo: "El REPS y los tipos de prestadores",
                subtitulo: "Antes de habilitar un servicio hay que saber quién es usted ante el sistema.",
                objetivos: [
                  "Explicar qué es el REPS y para qué sirve",
                  "Distinguir los cuatro tipos de prestadores de servicios de salud",
                  "Reconocer los límites de una entidad con objeto social diferente",
                  "Ubicar el caso de los cuerpos de bomberos con ambulancia",
                ],
                minutos: 20,
                dice: "Un error en el tipo de prestador o en el servicio inscrito se paga caro en la visita. Vamos a evitarlo desde el principio.",
              },
              {
                tipo: "explicacion",
                titulo: "El REPS: el registro que todo lo cuenta",
                parrafos: [
                  "El Registro Especial de Prestadores de Servicios de Salud (REPS) es la base de datos en la que las secretarías de salud departamentales y distritales registran a los prestadores y sus servicios habilitados. El Ministerio de Salud la consolida para todo el país.",
                  "Todo prestador debe estar inscrito en el REPS con al menos una sede con infraestructura física y al menos un servicio habilitado. Allí quedan sus sedes, sus servicios, la complejidad, la modalidad y la capacidad instalada, como el número de camas, consultorios o ambulancias.",
                  "Quien contrata servicios de salud debe verificar que el prestador esté inscrito en el REPS. Por eso, lo que usted declara allí no es un formulario más: es la cara pública de su servicio.",
                ],
                puntos: [
                  { titulo: "Gratuito", texto: "La inscripción y la habilitación en el REPS no tienen costo." },
                  { titulo: "Veraz", texto: "El prestador responde por la veracidad de lo que declara." },
                  { titulo: "Al día", texto: "Cada cambio se reporta como novedad para mantener el registro actualizado." },
                ],
                clave: "Lo que no está habilitado en el REPS no se puede ofertar ni prestar, aunque usted tenga el personal y los equipos.",
              },
              {
                tipo: "explicacion",
                titulo: "Los cuatro tipos de prestadores",
                parrafos: [
                  "El manual reconoce cuatro tipos de prestadores de servicios de salud. El tipo define qué condiciones de habilitación le aplican y qué servicios puede habilitar.",
                ],
                puntos: [
                  { titulo: "Institución Prestadora de Servicios de Salud (IPS)", texto: "Entidad cuyo objeto social es prestar servicios de salud: clínicas, hospitales, centros médicos." },
                  { titulo: "Profesional independiente de salud", texto: "Persona natural egresada de un programa de educación superior en ciencias de la salud, que atiende de forma autónoma; puede tener personal de apoyo técnico o auxiliar." },
                  { titulo: "Entidad con objeto social diferente", texto: "Organización cuyo objeto no es prestar servicios de salud, pero que por su propia actividad los necesita." },
                  { titulo: "Transporte especial de pacientes", texto: "Prestador que traslada pacientes en ambulancia y puede hacer atención prehospitalaria." },
                ],
                clave: "Primero defina qué tipo de prestador es; de eso dependen los soportes que radica y las condiciones que le van a verificar.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Qué tipo de prestador es?",
                instruccion: "Toque el tipo de prestador que corresponde a cada caso.",
                categorias: [
                  { id: "ips", nombre: "IPS", pista: "Su objeto social es la salud" },
                  { id: "ind", nombre: "Profesional independiente", pista: "Persona natural autónoma" },
                  { id: "osd", nombre: "Objeto social diferente", pista: "La salud apoya otra actividad" },
                  { id: "tep", nombre: "Transporte especial de pacientes", pista: "Ambulancias" },
                ],
                elementos: [
                  { texto: "Clínica S.A.S. con hospitalización, cirugía y urgencias", categoria: "ips" },
                  { texto: "Fisioterapeuta que atiende sola en su consultorio", categoria: "ind" },
                  { texto: "Odontóloga con consultorio propio y una auxiliar de apoyo", categoria: "ind", porque: "Puede tener personal técnico o auxiliar de apoyo y seguir siendo profesional independiente." },
                  { texto: "Empresa minera con consultorio médico para sus trabajadores", categoria: "osd", porque: "Su objeto social es la minería; el servicio de salud apoya esa actividad." },
                  { texto: "Universidad que ofrece consulta médica a sus estudiantes", categoria: "osd" },
                  { texto: "Empresa cuyo negocio es trasladar pacientes en ambulancia", categoria: "tep" },
                  { texto: "Centro de diagnóstico con laboratorio clínico e imágenes", categoria: "ips" },
                  { texto: "Empresa que traslada pacientes en ambulancia y también hace atención prehospitalaria", categoria: "tep", porque: "El transporte especial de pacientes traslada en ambulancia y puede hacer atención prehospitalaria." },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Los límites del objeto social diferente",
                parrafos: [
                  "Una entidad con objeto social diferente solo puede habilitar servicios de baja y mediana complejidad de consulta externa y de apoyo diagnóstico y complementación terapéutica, además de transporte asistencial, atención prehospitalaria, cuidado básico del consumo de sustancias psicoactivas y procedimientos de cirugía ambulatoria.",
                  "No puede habilitar urgencias, atención del parto ni servicios del grupo de internación. Y los servicios que habilite no se pueden ofrecer en contratación dentro del Sistema General de Seguridad Social en Salud.",
                ],
                puntos: [
                  { titulo: "Sí puede", texto: "Consulta externa, apoyo diagnóstico, transporte asistencial, atención prehospitalaria y cirugía ambulatoria, en baja y mediana complejidad." },
                  { titulo: "No puede", texto: "Urgencias, atención del parto ni hospitalización u otros servicios de internación." },
                  { titulo: "Lo que demuestra", texto: "Existencia y representación legal. No se le exige sistema contable ni suficiencia patrimonial y financiera." },
                ],
                clave: "Si la intención es vender servicios de salud dentro del sistema, la entidad con objeto social diferente no es la figura: hay que evaluar otro tipo de prestador.",
              },
              {
                tipo: "contrarreloj",
                titulo: "La planta que quiere urgencias",
                segundos: 25,
                situacion:
                  "Una planta de alimentos inscrita como entidad con objeto social diferente tiene habilitada la consulta externa general para sus trabajadores. La gerencia quiere abrir urgencias 24 horas en la misma sede.",
                pregunta: "¿Qué le recomienda?",
                opciones: [
                  {
                    texto: "Explicarle que, con esa figura, no puede habilitar urgencias; tendría que evaluar otro tipo de prestador y cumplir todo lo que exige ese servicio",
                    correcta: true,
                    retro: "Correcto. Las entidades con objeto social diferente no pueden habilitar urgencias, atención del parto ni internación.",
                  },
                  {
                    texto: "Reportar una novedad de apertura de servicio y empezar a atender",
                    retro: "La novedad no cambia lo que la norma no le permite a este tipo de prestador. Además, urgencias requiere visita previa.",
                  },
                  {
                    texto: "Abrirlo con el nombre de «área de primeros auxilios» y atender urgencias igual",
                    retro: "Cambiarle el nombre no cambia la realidad: atender urgencias sin habilitación expone a los pacientes y a la empresa a medidas sanitarias.",
                  },
                ],
                alAgotar: "La gerencia tomó la decisión sin usted. Recuerde: una entidad con objeto social diferente no habilita urgencias, parto ni internación.",
              },
              {
                tipo: "explicacion",
                titulo: "Bomberos con ambulancia: lo que dice la norma",
                parrafos: [
                  "Muchos cuerpos de bomberos trasladan pacientes. La norma es clara: el transporte asistencial es un servicio de salud y debe estar habilitado. La Resolución 544 de 2023 lo planteó de forma expresa para los cuerpos de bomberos de Colombia.",
                  "Según el artículo 20, modificado por la Resolución 465 de 2025, los servicios de transporte asistencial y de atención prehospitalaria a cargo de los cuerpos de bomberos se habilitan en el departamento o distrito donde esté la sede que hayan definido. Esa habilitación produce efectos en todo el país, sin inscribirse en cada secretaría donde vayan a prestar el servicio.",
                  "Ojo: la atención prehospitalaria y el transporte asistencial son dos servicios distintos del grupo de atención inmediata. Tener habilitado uno no autoriza a prestar el otro.",
                ],
                puntos: [
                  { titulo: "Atención prehospitalaria", texto: "Atiende en el sitio a la persona con una urgencia por trauma o enfermedad. El vehículo de este servicio no está destinado a trasladar pacientes." },
                  { titulo: "Transporte asistencial", texto: "Traslada al paciente en ambulancia y lo atiende durante el recorrido. Puede ser básico (TAB) o medicalizado (TAM)." },
                ],
                clave: "Si la ambulancia del cuerpo de bomberos traslada pacientes, el servicio de transporte asistencial tiene que estar habilitado antes de operar.",
                dice: "He visto secretarías ordenar que una ambulancia deje de trasladar pacientes porque el organismo solo tenía habilitada la atención prehospitalaria. Que no le pase.",
              },
              {
                tipo: "decision",
                titulo: "La ambulancia que no debía rodar",
                situacion:
                  "El cuerpo de bomberos de San Isidro tiene habilitada en el REPS la atención prehospitalaria. Desde hace un mes, su ambulancia lleva pacientes al hospital regional.",
                pregunta: "¿Qué debe hacer el comandante?",
                opciones: [
                  {
                    texto: "Suspender los traslados y tramitar la habilitación del servicio de transporte asistencial, con su autoevaluación y la visita previa",
                    correcta: true,
                    retro: "Correcto. Son servicios distintos. El transporte asistencial requiere habilitación propia y visita previa de la secretaría.",
                  },
                  {
                    texto: "Nada: la atención prehospitalaria incluye el traslado",
                    retro: "No. La atención prehospitalaria atiende en el sitio; trasladar pacientes en ambulancia es el servicio de transporte asistencial.",
                  },
                  {
                    texto: "Seguir trasladando y declararlo en la próxima autoevaluación anual",
                    retro: "Mientras tanto estaría prestando un servicio no habilitado. La autoevaluación no sirve para legalizar lo que ya se está haciendo.",
                  },
                ],
              },
              {
                tipo: "tarjetas",
                titulo: "Reglas del REPS que ahorran dolores de cabeza",
                instruccion: "Toque cada tarjeta para descubrir la regla.",
                tarjetas: [
                  {
                    frente: "¿Cuánto cuesta inscribirse?",
                    reverso: "Nada. La inscripción de prestadores y la habilitación de servicios en el REPS son trámites gratuitos.",
                  },
                  {
                    frente: "¿La secretaría puede pedir requisitos adicionales?",
                    reverso: "No. No puede exigir requisitos distintos a los de la norma ni negar la certificación por requisitos que la norma no pide.",
                  },
                  {
                    frente: "¿Dos prestadores pueden habilitar el mismo servicio?",
                    reverso: "No se permite la doble habilitación: el servicio lo habilita solo el prestador responsable de él.",
                  },
                  {
                    frente: "¿Y si un tercero aporta personal o equipos?",
                    reverso: "El prestador que habilita sigue siendo responsable de cumplir todos los estándares del servicio, aunque otros le aporten personal, equipos o servicios.",
                  },
                ],
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "El REPS es la base de datos de prestadores y servicios habilitados: lo administran las secretarías y lo consolida el Ministerio.",
                  "Hay cuatro tipos de prestadores: IPS, profesional independiente, entidad con objeto social diferente y transporte especial de pacientes.",
                  "Una entidad con objeto social diferente no habilita urgencias, parto ni internación, ni contrata sus servicios dentro del sistema.",
                  "Transporte asistencial y atención prehospitalaria son servicios distintos; los de bomberos se habilitan donde está su sede, con efecto nacional.",
                ],
                insignia: "Lector del REPS",
                cierre: "En el siguiente módulo verá paso a paso cómo inscribirse, autoevaluarse y mantener la inscripción al día.",
              },
            ],
          },
        },
      ],
    },

    /* ==================================================================== */
    /*  MÓDULO 2 · INSCRIPCIÓN Y ESTRUCTURA DE LOS SERVICIOS                 */
    /* ==================================================================== */
    {
      title: "Módulo 2. Inscripción y estructura de los servicios",
      description:
        "Autoevaluación, pasos de la inscripción, vigencia y renovación, novedades, y cómo se organizan los servicios en grupos, modalidades y complejidades.",
      lessons: [
        {
          title: "Inscribirse, autoevaluarse y mantenerse al día",
          description: "La autoevaluación, el paso a paso de la inscripción, la vigencia, la renovación y las novedades.",
          durationMin: 21,
          contenido: {
            version: 1,
            guia: MARCELA,
            bloques: [
              {
                tipo: "portada",
                titulo: "Inscribirse, autoevaluarse y mantenerse al día",
                subtitulo: "La habilitación no se gana una vez: se sostiene con autoevaluaciones a tiempo y novedades bien reportadas.",
                objetivos: [
                  "Explicar qué es la autoevaluación y cuándo es obligatoria",
                  "Seguir los pasos de la inscripción en el REPS",
                  "Reconocer la vigencia de la inscripción y su renovación",
                  "Identificar las novedades y reportarlas a tiempo",
                ],
                minutos: 21,
                dice: "La autoevaluación es el corazón del sistema: usted mismo revisa si cumple y lo declara. Por eso hay que hacerla con total honestidad.",
              },
              {
                tipo: "explicacion",
                titulo: "La autoevaluación: mirarse al espejo",
                parrafos: [
                  "La autoevaluación es la revisión que hace el propio prestador del cumplimiento de las condiciones de habilitación, seguida de la declaración de su resultado en el REPS. Se hace servicio por servicio, contra los estándares y criterios del manual.",
                  "Si al autoevaluarse descubre que no cumple una o más condiciones, debe abstenerse de registrar, ofertar y prestar ese servicio hasta corregirlo.",
                ],
                puntos: [
                  { titulo: "Antes de inscribirse", texto: "Es requisito previo a la inscripción del prestador y a la habilitación de cada servicio." },
                  { titulo: "En el cuarto año", texto: "Durante el cuarto año de la inscripción inicial y antes de que venza." },
                  { titulo: "En cada renovación", texto: "Antes de que venza cada año de renovación de la inscripción." },
                  { titulo: "Antes de ciertas novedades", texto: "Cuando el manual la exige para la novedad que se va a reportar." },
                ],
                clave: "Declarar que cumple sin cumplir no es un error de formulario: pone en riesgo a los pacientes y expone al prestador a medidas sanitarias y sanciones.",
              },
              {
                tipo: "ordenar",
                titulo: "Paso a paso de la inscripción",
                instruccion: "Ordene los pasos, desde la autoevaluación hasta tener el servicio habilitado.",
                pasos: [
                  "Hacer la autoevaluación de las condiciones de habilitación de cada servicio",
                  "Entrar al enlace del REPS en la página de la secretaría de salud y definir sedes, servicios, complejidad, modalidad y capacidad instalada",
                  "Diligenciar el formulario de inscripción y la declaración de autoevaluación de cada servicio",
                  "Imprimir el formulario y radicarlo con sus soportes ante la secretaría de salud",
                  "La secretaría revisa los soportes y asigna el código de inscripción",
                  "La secretaría hace la visita previa, si el servicio la requiere",
                  "La secretaría registra la inscripción, expide la constancia de habilitación y autoriza el distintivo",
                ],
                explicacion:
                  "Así es. La autoevaluación va primero, la radicación con soportes después, y el servicio se considera habilitado cuando la secretaría registra la inscripción, expide la constancia y autoriza el distintivo. En los servicios con visita previa, como el transporte asistencial, eso solo ocurre después de la visita.",
              },
              {
                tipo: "explicacion",
                titulo: "¿Cuánto dura la inscripción?",
                parrafos: [
                  "La inscripción inicial en el REPS dura cuatro años, contados desde que la secretaría la registra. Para renovarla, el prestador se autoevalúa y lo declara en el REPS durante el cuarto año, antes del vencimiento. Esa renovación dura un año.",
                  "Desde ahí, cada renovación es anual y exige una nueva autoevaluación declarada antes de que venza cada año. Si la inscripción fue inactivada y el prestador vuelve a inscribirse, la nueva inscripción ya no dura cuatro años sino uno, igual que sus renovaciones.",
                  "Además, la regla de transición de la resolución dispuso que, tras la actualización del REPS, la autoevaluación declarada tiene vigencia de un año y la siguiente debe hacerse antes de que venza ese periodo.",
                ],
                puntos: [
                  { titulo: "Inscripción inicial", texto: "Cuatro años." },
                  { titulo: "Renovaciones", texto: "Un año cada una, con autoevaluación declarada antes del vencimiento." },
                  { titulo: "Reinscripción tras inactivación", texto: "Un año, igual que sus renovaciones." },
                ],
                clave: "Anote en el calendario la fecha en que vence su autoevaluación y empiece a prepararla con meses de anticipación.",
                dice: "En la práctica, confirme con su secretaría de salud la fecha exacta en que vence la autoevaluación de su prestador.",
              },
              {
                tipo: "contrarreloj",
                titulo: "El cuarto año",
                segundos: 25,
                situacion:
                  "La IPS Bienestar Total está en el cuarto año de su inscripción inicial. Faltan dos meses para que venza y nadie ha hablado de autoevaluación.",
                pregunta: "¿Qué debe hacer?",
                opciones: [
                  {
                    texto: "Autoevaluar todos sus servicios y declarar la autoevaluación en el REPS antes del vencimiento",
                    correcta: true,
                    retro: "Correcto. Así renueva la inscripción por un año. Si deja vencer el plazo, la inscripción se inactiva.",
                  },
                  {
                    texto: "Esperar a que la secretaría le avise y le programe una visita",
                    retro: "La autoevaluación es responsabilidad del prestador. La secretaría no tiene que recordárselo.",
                  },
                  {
                    texto: "Nada: la inscripción se renueva sola cada cuatro años",
                    retro: "No se renueva sola. Sin autoevaluación declarada a tiempo, la inscripción se inactiva.",
                  },
                ],
                alAgotar: "El reloj corrió y la inscripción quedó en riesgo. Recuerde: autoevaluación declarada en el REPS antes del vencimiento.",
              },
              {
                tipo: "explicacion",
                titulo: "Si no se autoevalúa a tiempo",
                parrafos: [
                  "Si el prestador no autoevalúa la totalidad de sus servicios dentro del plazo, se inactiva su inscripción. Para volver, debe hacer de nuevo el trámite de inscripción y pedir visita de reactivación; la secretaría tiene hasta seis meses para hacerla.",
                  "Si solo deja de autoevaluar algunos servicios, se inactivan esos servicios. Para habilitarlos otra vez debe autoevaluarlos y declararlos. En los servicios de alta complejidad, urgencias, hospitalización obstétrica, transporte asistencial y oncológicos, además necesita visita de reactivación.",
                ],
                puntos: [
                  { titulo: "Inactivación del prestador", texto: "Cierre en el REPS por no autoevaluar todos sus servicios o porque venció el cierre temporal de todos ellos." },
                  { titulo: "Inactivación del servicio", texto: "Cierre en el REPS del servicio que no se autoevaluó o cuyo cierre temporal venció." },
                ],
                clave: "Para un cuerpo de bomberos, dejar vencer la autoevaluación del transporte asistencial significa parar la ambulancia hasta que la secretaría haga la visita de reactivación.",
              },
              {
                tipo: "explicacion",
                titulo: "Las novedades: el REPS siempre al día",
                parrafos: [
                  "Una novedad es un cambio en la información del prestador, en sus sedes, en sus servicios o en su capacidad instalada. Debe reportarse ante la secretaría de salud por medio del REPS, con los soportes que pide el manual. Algunas se tramitan en línea y quedan registradas de inmediato.",
                  "El cierre temporal de un servicio dura máximo un año. Si en ese tiempo no se reporta la reactivación, el servicio se inactiva y hay que habilitarlo de nuevo. En alta complejidad, urgencias, atención del parto, oncología y transporte asistencial, la reactivación exige visita de la secretaría.",
                ],
                puntos: [
                  { titulo: "Del prestador", texto: "Cierre, cambio de domicilio, de representante legal, de razón social sin cambiar NIT o de datos de contacto." },
                  { titulo: "De la sede", texto: "Apertura o cierre de sede, cambio de sede principal, de director o responsable, o de nombre de la sede." },
                  { titulo: "De los servicios", texto: "Apertura, cierre temporal o definitivo, reactivación, cambio de complejidad, de modalidad o de horario, traslado." },
                  { titulo: "De capacidad instalada", texto: "Apertura o cierre de camas, camillas de observación, salas, consultorios, sillas, unidades móviles o ambulancias." },
                ],
                clave: "Desde que se reporta el cierre temporal de un servicio, ya no se puede seguir prestando.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Qué tipo de novedad es?",
                instruccion: "Ubique cada cambio en el tipo de novedad que le corresponde.",
                categorias: [
                  { id: "prestador", nombre: "Del prestador", pista: "Quién es" },
                  { id: "sede", nombre: "De la sede", pista: "Dónde atiende" },
                  { id: "servicio", nombre: "Del servicio", pista: "Qué y cómo presta" },
                  { id: "capacidad", nombre: "De capacidad instalada", pista: "Cuántos recursos" },
                ],
                elementos: [
                  { texto: "Cambia el representante legal de la IPS", categoria: "prestador" },
                  { texto: "La IPS cambia su razón social sin cambiar de NIT", categoria: "prestador" },
                  { texto: "Se abre una nueva sede en otro barrio", categoria: "sede" },
                  { texto: "Llega un nuevo director a la sede norte", categoria: "sede", porque: "El cambio de director, gerente, administrador o responsable se reporta como novedad de la sede." },
                  { texto: "Se cierra temporalmente el servicio de vacunación por obras", categoria: "servicio" },
                  { texto: "La consulta externa amplía su horario hasta las 9 de la noche", categoria: "servicio", porque: "El cambio de horario de prestación es una novedad del servicio." },
                  { texto: "El cuerpo de bomberos incorpora una segunda ambulancia", categoria: "capacidad", porque: "Más ambulancias es más capacidad instalada: novedad de apertura de ambulancias." },
                  { texto: "Se retiran dos camas de hospitalización", categoria: "capacidad" },
                ],
              },
              {
                tipo: "decision",
                titulo: "La segunda ambulancia",
                situacion:
                  "El cuerpo de bomberos de San Isidro, con transporte asistencial básico habilitado, recibió en donación una segunda ambulancia. El comandante quiere sacarla a la calle este fin de semana.",
                pregunta: "¿Qué le aconseja?",
                opciones: [
                  {
                    texto: "Verificar que la ambulancia cumpla todos los criterios del servicio y reportar la novedad de apertura de ambulancias, con sus soportes, antes de ponerla a operar",
                    correcta: true,
                    retro: "Correcto. Los cambios de capacidad instalada se reportan como novedad, y la nueva ambulancia debe cumplir los mismos criterios que la primera.",
                  },
                  {
                    texto: "Usarla de inmediato, porque el servicio ya está habilitado",
                    retro: "Aunque el servicio esté habilitado, incorporar una ambulancia es una novedad que se debe reportar, y el vehículo tiene que cumplir los criterios antes de atender pacientes.",
                  },
                  {
                    texto: "Esperar a la próxima autoevaluación anual para registrarla",
                    retro: "Las novedades se reportan cuando ocurren. Esperar meses dejaría una ambulancia operando por fuera del registro.",
                  },
                ],
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "La autoevaluación es obligatoria antes de inscribirse, en el cuarto año, antes de cada renovación anual y antes de ciertas novedades.",
                  "Si la autoevaluación muestra un incumplimiento, el servicio no se registra, no se oferta y no se presta.",
                  "La inscripción inicial dura cuatro años; las renovaciones, un año, siempre con autoevaluación declarada a tiempo.",
                  "Los cambios del prestador, la sede, los servicios y la capacidad instalada se reportan como novedades.",
                ],
                insignia: "Al día con el REPS",
                cierre: "En la próxima lección aprenderá a ubicar cada servicio en su grupo, su modalidad y su complejidad.",
              },
            ],
          },
        },
        {
          title: "Grupos, modalidades y complejidad",
          description: "Cómo se organizan los servicios de salud: grupos, modalidades intramural, extramural y telemedicina, y grados de complejidad.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: MARCELA,
            bloques: [
              {
                tipo: "portada",
                titulo: "Grupos, modalidades y complejidad",
                subtitulo: "Cada servicio tiene un lugar en el mapa: a qué grupo pertenece, cómo se presta y qué tan complejo es.",
                objetivos: [
                  "Identificar los cinco grupos de servicios del manual",
                  "Diferenciar las modalidades intramural, extramural y telemedicina",
                  "Reconocer las cuatro categorías de telemedicina",
                  "Explicar los grados de complejidad y sus consecuencias",
                ],
                minutos: 20,
                dice: "Cuando usted declara un servicio en el REPS, elige el servicio, la modalidad y la complejidad. Una mala elección suele ser el primer hallazgo de la visita.",
              },
              {
                tipo: "explicacion",
                titulo: "El mapa de los servicios",
                parrafos: [
                  "El manual organiza los servicios en grupos. Un grupo reúne servicios relacionados que se prestan de forma parecida y comparten estándares. Dentro de cada grupo están los servicios, que son lo que se habilita.",
                ],
                puntos: [
                  { titulo: "Consulta externa", texto: "Consulta general y especializada, vacunación y seguridad y salud en el trabajo." },
                  { titulo: "Apoyo diagnóstico y complementación terapéutica", texto: "Laboratorio clínico, imágenes diagnósticas, terapias, servicio farmacéutico y diálisis, entre otros." },
                  { titulo: "Internación", texto: "Hospitalización, cuidados básicos, intermedios e intensivos, y hospitalización en salud mental, entre otros." },
                  { titulo: "Quirúrgico", texto: "El servicio de cirugía." },
                  { titulo: "Atención inmediata", texto: "Urgencias, transporte asistencial, atención prehospitalaria y atención del parto." },
                ],
                clave: "Cada servicio cumple los criterios que aplican a todos los servicios y, además, los suyos propios.",
              },
              {
                tipo: "clasificar",
                titulo: "¿A qué grupo pertenece el servicio?",
                instruccion: "Toque el grupo al que pertenece cada servicio según el manual.",
                categorias: [
                  { id: "ce", nombre: "Consulta externa" },
                  { id: "ad", nombre: "Apoyo diagnóstico y complementación terapéutica" },
                  { id: "int", nombre: "Internación" },
                  { id: "qx", nombre: "Quirúrgico" },
                  { id: "ai", nombre: "Atención inmediata" },
                ],
                elementos: [
                  { texto: "Seguridad y salud en el trabajo (evaluaciones médicas ocupacionales)", categoria: "ce", porque: "Es un servicio del grupo de consulta externa, de mediana complejidad." },
                  { texto: "Vacunación", categoria: "ce" },
                  { texto: "Laboratorio clínico", categoria: "ad" },
                  { texto: "Terapias (fisioterapia, fonoaudiología, terapia ocupacional y respiratoria)", categoria: "ad" },
                  { texto: "Servicio farmacéutico", categoria: "ad" },
                  { texto: "Hospitalización", categoria: "int" },
                  { texto: "Cuidado intensivo adultos", categoria: "int" },
                  { texto: "Cirugía", categoria: "qx" },
                  { texto: "Transporte asistencial", categoria: "ai", porque: "Está en atención inmediata, junto con urgencias, atención prehospitalaria y atención del parto." },
                  { texto: "Atención del parto", categoria: "ai", porque: "Aunque se asocie con hospitalización, el manual lo ubica en el grupo de atención inmediata." },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Tres modalidades para prestar un servicio",
                parrafos: [
                  "La modalidad es la forma de prestar un servicio en condiciones particulares. Un mismo servicio puede habilitarse en una o varias modalidades, siempre que el manual lo permita para ese servicio.",
                ],
                puntos: [
                  { titulo: "Intramural", texto: "En una infraestructura física destinada a la atención en salud." },
                  { titulo: "Extramural: unidad móvil", texto: "Dentro de un medio de transporte terrestre, marítimo o fluvial. No se puede atender con la unidad en movimiento." },
                  { titulo: "Extramural: domiciliaria", texto: "En el domicilio o residencia del paciente. Se habilita ante cada secretaría de salud donde se oferte." },
                  { titulo: "Extramural: jornada de salud", texto: "En espacios adaptados de forma temporal para la atención en salud." },
                  { titulo: "Telemedicina", texto: "A distancia, con tecnologías de la información y la comunicación, como prestador remisor, prestador de referencia o ambos." },
                ],
                clave: "Para hacer una jornada de salud o atender con unidad móvil en un departamento distinto al de la inscripción, se pide autorización a esa secretaría con mínimo quince días de antelación.",
              },
              {
                tipo: "tarjetas",
                titulo: "Las cuatro categorías de telemedicina",
                instruccion: "Toque cada categoría para ver cómo funciona.",
                tarjetas: [
                  {
                    etiqueta: "Profesional y usuario",
                    frente: "Telemedicina interactiva",
                    reverso: "Videollamada en tiempo real entre un profesional de la salud y el usuario. Quien la ofrece cumple los criterios de prestador de referencia.",
                  },
                  {
                    etiqueta: "Profesional y usuario",
                    frente: "Telemedicina no interactiva",
                    reverso: "Comunicación asincrónica entre profesional y usuario, para servicios que no requieren respuesta inmediata. También exige los criterios de prestador de referencia.",
                  },
                  {
                    etiqueta: "Entre el personal de salud",
                    frente: "Telexperticia",
                    reverso: "Apoyo a distancia entre dos profesionales, entre personal técnico, tecnólogo o auxiliar y un profesional, o entre profesionales en junta médica.",
                  },
                  {
                    etiqueta: "Seguimiento a distancia",
                    frente: "Telemonitoreo",
                    reverso: "Una infraestructura tecnológica recoge y transmite datos clínicos del usuario para que el prestador haga seguimiento y dé una respuesta.",
                  },
                ],
              },
              {
                tipo: "contrarreloj",
                titulo: "La jornada en el departamento vecino",
                segundos: 25,
                situacion:
                  "La IPS Bienestar Total, inscrita en un departamento, quiere hacer dentro de diez días una jornada de salud de consulta externa general en un municipio del departamento vecino.",
                pregunta: "¿Cuál es el problema?",
                opciones: [
                  {
                    texto: "Debe pedir autorización a la secretaría de salud del otro departamento con mínimo quince días de antelación: con diez días no alcanza",
                    correcta: true,
                    retro: "Correcto. Para jornadas de salud o unidad móvil fuera del territorio donde se inscribió, la autorización se pide con al menos quince días de antelación.",
                  },
                  {
                    texto: "Ninguno: la inscripción sirve para cualquier departamento sin avisar",
                    retro: "La inscripción produce efectos en todo el país, pero para hacer la jornada en otro departamento debe pedir autorización a esa secretaría.",
                  },
                  {
                    texto: "Debe inscribirse de nuevo como prestador en el otro departamento",
                    retro: "No hace falta una nueva inscripción: lo que se requiere es la autorización de la jornada ante esa secretaría.",
                  },
                ],
                alAgotar: "La fecha se le vino encima. Recuerde: jornadas y unidades móviles fuera del territorio de inscripción piden autorización con quince días de antelación.",
              },
              {
                tipo: "explicacion",
                titulo: "La complejidad",
                parrafos: [
                  "La complejidad depende de las condiciones de salud que se atienden, de la formación del talento humano y de la tecnología que se necesita. El manual usa tres grados: baja, mediana y alta. A algunos servicios no les aplica complejidad.",
                  "La complejidad cambia lo que se exige. En transporte asistencial, la baja complejidad es el transporte asistencial básico (TAB) y la mediana es el transporte asistencial medicalizado (TAM), que exige médico en la tripulación y más equipos.",
                ],
                puntos: [
                  { titulo: "Baja", texto: "Por ejemplo, la atención prehospitalaria, la vacunación y el transporte asistencial básico." },
                  { titulo: "Mediana", texto: "Por ejemplo, el transporte asistencial medicalizado y el servicio de seguridad y salud en el trabajo." },
                  { titulo: "Alta", texto: "Por ejemplo, el cuidado intensivo adultos. Todo servicio nuevo de alta complejidad requiere visita previa." },
                  { titulo: "No aplica", texto: "Por ejemplo, el servicio de terapias." },
                ],
                clave: "Para pasar un servicio de baja o mediana a alta complejidad se necesita visita previa; mientras tanto, el servicio sigue en la complejidad que tenía.",
              },
              {
                tipo: "mision",
                titulo: "Arme el portafolio de la IPS",
                intro:
                  "La IPS Bienestar Total va a ampliar su portafolio y le pidió a usted, como auditor de calidad, revisar cómo declarar cada servicio antes de cargarlo en el REPS. Cada error sube el riesgo de que la secretaría encuentre servicios mal declarados.",
                medidor: { etiqueta: "Riesgo de hallazgos", tipo: "amenaza" },
                velocidad: 1,
                penalizacion: 20,
                pasos: [
                  {
                    situacion: "La gerencia quiere ofrecer fisioterapia en la casa de los pacientes en dos departamentos.",
                    pregunta: "¿Cómo se habilita?",
                    opciones: [
                      {
                        texto: "En modalidad extramural domiciliaria, ante cada una de las secretarías de los departamentos donde se va a ofertar",
                        correcta: true,
                        retro: "Correcto. La modalidad domiciliaria se habilita ante cada secretaría donde se oferte.",
                      },
                      {
                        texto: "Con la inscripción en el departamento de la sede basta para todo el país",
                        retro: "Esa regla vale para jornadas de salud y unidad móvil, no para la atención domiciliaria, que se habilita en cada secretaría.",
                      },
                    ],
                  },
                  {
                    situacion: "El médico quiere hacer controles por videollamada en tiempo real con los pacientes.",
                    pregunta: "¿Qué categoría de telemedicina es?",
                    opciones: [
                      {
                        texto: "Telemedicina interactiva, cumpliendo los criterios de prestador de referencia",
                        correcta: true,
                        retro: "Correcto. La videollamada en tiempo real entre profesional y usuario es telemedicina interactiva.",
                      },
                      {
                        texto: "Telemonitoreo",
                        retro: "El telemonitoreo transmite datos clínicos para hacer seguimiento. La videollamada en vivo con el paciente es telemedicina interactiva.",
                      },
                      {
                        texto: "Telexperticia",
                        retro: "La telexperticia ocurre entre personal de salud. Aquí el médico habla directamente con el paciente.",
                      },
                    ],
                  },
                  {
                    situacion: "Una empresa cliente pide evaluaciones médicas ocupacionales para sus trabajadores en la sede de la IPS.",
                    pregunta: "¿Qué servicio se declara?",
                    opciones: [
                      {
                        texto: "Seguridad y salud en el trabajo, con médico especialista en medicina del trabajo, medicina laboral o seguridad y salud en el trabajo, con licencia vigente",
                        correcta: true,
                        retro: "Correcto. Es un servicio de consulta externa de mediana complejidad que exige ese perfil.",
                      },
                      {
                        texto: "Consulta externa general, con cualquier médico general",
                        retro: "Las evaluaciones médicas ocupacionales tienen su propio servicio, con un perfil de talento humano específico.",
                      },
                    ],
                  },
                  {
                    situacion: "La junta directiva quiere pasar la hospitalización de mediana a alta complejidad.",
                    pregunta: "¿Qué pasa con el servicio mientras tanto?",
                    opciones: [
                      {
                        texto: "Se solicita la visita previa y el servicio sigue prestándose en mediana complejidad hasta que se habilite en alta",
                        correcta: true,
                        retro: "Correcto. El cambio a alta complejidad depende del resultado de la visita previa.",
                      },
                      {
                        texto: "Se reporta el cambio y desde ese día se atiende como alta complejidad",
                        retro: "No. Hasta que la visita previa confirme el cumplimiento, el servicio sigue en la complejidad inicial.",
                      },
                    ],
                  },
                  {
                    situacion: "Para una campaña rural, alguien propone atender pacientes en la unidad móvil mientras recorre la vereda, para ahorrar tiempo.",
                    pregunta: "¿Qué responde?",
                    opciones: [
                      {
                        texto: "Que no: los servicios en unidad móvil no se pueden prestar con el vehículo en movimiento",
                        correcta: true,
                        retro: "Correcto. La unidad móvil terrestre, fluvial o marítima atiende detenida.",
                      },
                      {
                        texto: "Que sí, si el conductor va despacio",
                        retro: "La norma no hace excepciones: no se prestan servicios con la unidad móvil en movimiento.",
                      },
                    ],
                  },
                ],
                exito: "¡Portafolio impecable! Cada servicio quedó en su grupo, con la modalidad y la complejidad correctas. La visita va a encontrar lo que se declaró.",
                fracaso: "Quedaron servicios mal declarados. Repase: la domiciliaria se habilita en cada secretaría, la videollamada en vivo es telemedicina interactiva, pasar a alta complejidad exige visita previa y la unidad móvil no atiende en movimiento.",
                dice: "Piense como verificador: ¿lo que dice el REPS coincide con lo que se hace?",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Cinco grupos: consulta externa, apoyo diagnóstico y complementación terapéutica, internación, quirúrgico y atención inmediata.",
                  "Modalidades: intramural, extramural (unidad móvil, domiciliaria y jornada de salud) y telemedicina.",
                  "Telemedicina interactiva, no interactiva, telexperticia y telemonitoreo, como prestador remisor o de referencia.",
                  "Complejidad baja, mediana o alta: el TAB es baja y el TAM es mediana; pasar a alta exige visita previa.",
                ],
                insignia: "Cartógrafo de servicios",
                cierre: "En el próximo módulo entrará al detalle: las tres condiciones de habilitación y los siete estándares.",
              },
            ],
          },
        },
      ],
    },

    /* ==================================================================== */
    /*  MÓDULO 3 · CONDICIONES Y ESTÁNDARES DE HABILITACIÓN                  */
    /* ==================================================================== */
    {
      title: "Módulo 3. Condiciones y estándares de habilitación",
      description:
        "Las tres condiciones de habilitación, a quién le aplica cada una y los siete estándares de capacidad tecnológica y científica llevados a la práctica.",
      lessons: [
        {
          title: "Tres condiciones, siete estándares",
          description: "Capacidad técnico-administrativa, suficiencia patrimonial y financiera y capacidad tecnológica y científica, con sus siete estándares.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: MARCELA,
            bloques: [
              {
                tipo: "portada",
                titulo: "Tres condiciones, siete estándares",
                subtitulo: "Lo que se le exige a un prestador depende de quién es. Lo que se le exige a un servicio, de sus riesgos.",
                objetivos: [
                  "Nombrar las tres condiciones de habilitación",
                  "Identificar a qué tipo de prestador le aplica cada condición",
                  "Explicar los indicadores de suficiencia patrimonial y financiera",
                  "Reconocer los siete estándares de capacidad tecnológica y científica",
                ],
                minutos: 20,
                dice: "Aquí está el núcleo de la norma. Si entiende bien este mapa, las visitas dejan de ser una sorpresa.",
              },
              {
                tipo: "explicacion",
                titulo: "Las tres condiciones",
                parrafos: [
                  "Para entrar y permanecer en el Sistema Único de Habilitación, los prestadores deben cumplir tres condiciones. No todas les aplican a todos.",
                ],
                puntos: [
                  { titulo: "Capacidad técnico-administrativa", texto: "Existencia y representación legal según su naturaleza jurídica y, en las IPS, un sistema contable que permita generar estados financieros. Aplica a IPS, entidades con objeto social diferente y transporte especial de pacientes." },
                  { titulo: "Suficiencia patrimonial y financiera", texto: "Estabilidad financiera, liquidez y cumplimiento de obligaciones. Aplica a IPS y a transporte especial de pacientes." },
                  { titulo: "Capacidad tecnológica y científica", texto: "Los estándares de habilitación de cada servicio. Aplica a todos: IPS, profesionales independientes, entidades con objeto social diferente y transporte especial de pacientes." },
                ],
                clave: "El profesional independiente solo debe cumplir la capacidad tecnológica y científica.",
              },
              {
                tipo: "explicacion",
                titulo: "¿Cómo se mide la suficiencia patrimonial y financiera?",
                parrafos: [
                  "Se demuestra con estados financieros certificados por el revisor fiscal o el contador, por regla general los del año fiscal anterior. Para una IPS nueva sirven los estados financieros de constitución o de periodos intermedios.",
                  "El manual usa tres indicadores:",
                ],
                puntos: [
                  { titulo: "Patrimonio", texto: "El patrimonio total debe estar por encima del 50 % del capital social, el capital fiscal o los aportes, según la naturaleza de la IPS." },
                  { titulo: "Obligaciones mercantiles", texto: "Las deudas con proveedores y terceros vencidas hace más de 360 días no deben superar el 50 % del pasivo corriente." },
                  { titulo: "Obligaciones laborales", texto: "Las deudas con empleados, exempleados y pensionados vencidas hace más de 360 días no deben superar el 50 % del pasivo corriente." },
                ],
                clave: "Una IPS en intervención forzosa administrativa para administrar, en reestructuración de pasivos o en concordato demuestra la suficiencia cuando termine ese proceso.",
              },
              {
                tipo: "clasificar",
                titulo: "¿A qué condición pertenece?",
                instruccion: "Ubique cada requisito en la condición de habilitación a la que pertenece.",
                categorias: [
                  { id: "tecadm", nombre: "Técnico-administrativa", pista: "Quién es legalmente y cómo lleva sus cuentas" },
                  { id: "suf", nombre: "Suficiencia patrimonial y financiera", pista: "Salud financiera" },
                  { id: "tyc", nombre: "Tecnológica y científica", pista: "Estándares del servicio" },
                ],
                elementos: [
                  { texto: "Certificado de existencia y representación legal vigente", categoria: "tecadm" },
                  { texto: "Registros contables según el plan de cuentas o el plan general de contabilidad pública", categoria: "tecadm", porque: "El sistema contable hace parte de la capacidad técnico-administrativa de la IPS." },
                  { texto: "Patrimonio total superior al 50 % del capital social", categoria: "suf" },
                  { texto: "Deudas laborales vencidas hace más de 360 días por debajo del 50 % del pasivo corriente", categoria: "suf" },
                  { texto: "Deudas con proveedores vencidas hace más de 360 días por debajo del 50 % del pasivo corriente", categoria: "suf" },
                  { texto: "Hojas de vida de los equipos biomédicos con sus mantenimientos", categoria: "tyc", porque: "Es un criterio del estándar de dotación, dentro de la capacidad tecnológica y científica." },
                  { texto: "Personal con título e inscripción en el ReTHUS", categoria: "tyc" },
                  { texto: "Protocolo de higiene de manos", categoria: "tyc" },
                ],
              },
              {
                tipo: "tarjetas",
                titulo: "¿Qué le aplica a cada prestador?",
                instruccion: "Toque cada tipo de prestador para ver qué condiciones debe cumplir.",
                tarjetas: [
                  {
                    frente: "IPS",
                    reverso: "Las tres: capacidad técnico-administrativa, suficiencia patrimonial y financiera, y capacidad tecnológica y científica.",
                  },
                  {
                    frente: "Profesional independiente",
                    reverso: "Solo la capacidad tecnológica y científica.",
                  },
                  {
                    frente: "Entidad con objeto social diferente",
                    reverso: "Capacidad técnico-administrativa (existencia y representación legal) y capacidad tecnológica y científica. No se le exige sistema contable ni suficiencia patrimonial y financiera.",
                  },
                  {
                    frente: "Transporte especial de pacientes",
                    reverso: "Las tres: capacidad técnico-administrativa, suficiencia patrimonial y financiera, y capacidad tecnológica y científica.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Los siete estándares de capacidad tecnológica y científica",
                parrafos: [
                  "Los estándares son las condiciones tecnológicas y científicas mínimas para prestar un servicio con seguridad. Son sobre todo de estructura, apuntan a controlar los riesgos de la atención y no pretenden abarcar todo lo que hace una institución.",
                  "Se aplican en dos capas: los criterios que aplican a todos los servicios y los propios de cada servicio, modalidad y complejidad.",
                ],
                puntos: [
                  { titulo: "1. Talento humano", texto: "Perfiles mínimos, títulos, autorización para ejercer y formación continua." },
                  { titulo: "2. Infraestructura", texto: "Áreas, ambientes, edificación y su mantenimiento." },
                  { titulo: "3. Dotación", texto: "Equipos biomédicos y su mantenimiento." },
                  { titulo: "4. Medicamentos, dispositivos médicos e insumos", texto: "Almacenamiento, trazabilidad y seguimiento a su uso." },
                  { titulo: "5. Procesos prioritarios", texto: "Procesos asistenciales documentados y socializados, empezando por la seguridad del paciente." },
                  { titulo: "6. Historia clínica y registros", texto: "Trazabilidad de la atención." },
                  { titulo: "7. Interdependencia", texto: "Servicios de salud y de apoyo que el servicio necesita para funcionar de forma oportuna y segura." },
                ],
                clave: "Los estándares de habilitación se cumplen: la norma no acepta planes de cumplimiento para habilitar.",
              },
              {
                tipo: "decision",
                titulo: "El plan de cumplimiento",
                situacion:
                  "En la autoevaluación de la IPS Bienestar Total, el servicio de odontología no tiene programa de mantenimiento preventivo de sus equipos biomédicos. El director propone declarar que cumple y firmar un «plan de cumplimiento» a seis meses.",
                pregunta: "¿Qué hace usted como responsable de calidad?",
                opciones: [
                  {
                    texto: "Explicar que no se aceptan planes de cumplimiento: hay que abstenerse de declarar y prestar el servicio hasta cumplir el criterio",
                    correcta: true,
                    retro: "Correcto. El Decreto 780 de 2016 establece que no se aceptan planes de cumplimiento para la habilitación. Primero se cumple, después se declara.",
                  },
                  {
                    texto: "Declarar que cumple y adjuntar el plan como soporte",
                    retro: "Sería una declaración falsa. La norma no acepta planes de cumplimiento para efectos de habilitación.",
                  },
                  {
                    texto: "Declarar que cumple y no decir nada; total, la visita puede tardar años",
                    retro: "Además de exponer a los pacientes, declarar lo que no se cumple puede traer medidas sanitarias, sanciones y la revocatoria de la inscripción.",
                  },
                ],
              },
              {
                tipo: "contrarreloj",
                titulo: "El requisito que no está en la norma",
                segundos: 25,
                situacion:
                  "En una visita, un verificador le exige a un consultorio odontológico un certificado que no aparece en la Resolución 3100 ni en su manual, y dice que sin él no certifica el servicio.",
                pregunta: "¿Qué hace el prestador?",
                opciones: [
                  {
                    texto: "Con respeto, recuerda que la secretaría no puede exigir requisitos distintos a los de la norma ni negar la certificación por ellos, y deja su observación escrita en el acta de cierre",
                    correcta: true,
                    retro: "Correcto. La norma prohíbe exigir requisitos distintos, y el prestador tiene derecho a dejar sus observaciones en el acta y a recibir copia.",
                  },
                  {
                    texto: "Se niega a seguir y le pide a la comisión que se retire",
                    retro: "Si no se recibe la visita, se deja un acta que sirve de soporte para acciones jurídicas. Dialogue y deje su observación por escrito.",
                  },
                  {
                    texto: "Promete entregarlo y no dice nada más",
                    retro: "Aceptar en silencio un requisito que la norma no contempla le hace perder tiempo y recursos. Puede argumentarlo con la norma en la mano.",
                  },
                ],
                alAgotar: "El silencio también decide. Recuerde: la secretaría no puede exigir requisitos distintos a los de la norma, y usted puede dejar constancia en el acta.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Tres condiciones: capacidad técnico-administrativa, suficiencia patrimonial y financiera, y capacidad tecnológica y científica.",
                  "El profesional independiente solo cumple la capacidad tecnológica y científica; a la entidad con objeto social diferente no se le exige suficiencia patrimonial.",
                  "Suficiencia: patrimonio por encima del 50 % del capital y deudas mercantiles y laborales de más de 360 días por debajo del 50 % del pasivo corriente.",
                  "Siete estándares: talento humano, infraestructura, dotación, medicamentos y dispositivos, procesos prioritarios, historia clínica e interdependencia. Sin planes de cumplimiento.",
                ],
                insignia: "Arquitecto de condiciones",
                cierre: "En la próxima lección bajará cada estándar a la práctica, con ejemplos de una IPS y de una ambulancia.",
              },
            ],
          },
        },
        {
          title: "Los estándares en la práctica",
          description: "Qué se verifica en talento humano, infraestructura, dotación, medicamentos, procesos prioritarios, historia clínica e interdependencia.",
          durationMin: 22,
          contenido: {
            version: 1,
            guia: MARCELA,
            bloques: [
              {
                tipo: "portada",
                titulo: "Los estándares en la práctica",
                subtitulo: "De la norma al pasillo: qué mira el verificador en cada estándar.",
                objetivos: [
                  "Aplicar los criterios de talento humano e infraestructura",
                  "Diferenciar «cuenta con» y «disponibilidad»",
                  "Revisar dotación, medicamentos, dispositivos médicos e insumos",
                  "Reconocer los procesos prioritarios, la historia clínica y la interdependencia",
                ],
                minutos: 22,
                dice: "Vamos a recorrer una IPS como lo haría un verificador. Lleve la lista en la cabeza.",
              },
              {
                tipo: "explicacion",
                titulo: "Talento humano e infraestructura",
                parrafos: [
                  "En talento humano, el prestador tiene los títulos o certificados de su personal, la autorización para ejercer o la inscripción en el Registro Único Nacional del Talento Humano en Salud (ReTHUS), y define cuánta gente necesita según su capacidad instalada, su demanda y el riesgo de la atención. Muchos servicios piden además constancias de formación continua, como soporte vital básico o avanzado.",
                  "En infraestructura se mira la edificación y sus áreas: servicios públicos, ventilación e iluminación, circulaciones libres de obstáculos, señalización de rutas de evacuación en cada piso y concepto sanitario. Algunos servicios, como urgencias, atención del parto, hospitalización y cirugía no ambulatoria, solo pueden funcionar en edificaciones de uso exclusivo de salud.",
                ],
                puntos: [
                  { titulo: "Talento humano", texto: "Títulos, ReTHUS o autorización, cantidad suficiente y la formación continua que exija el servicio." },
                  { titulo: "Infraestructura", texto: "Edificación adecuada, accesos, señalización, concepto sanitario y mantenimiento." },
                  { titulo: "Escenario de práctica", texto: "Si recibe estudiantes: convenio vigente, supervisión documentada y estudio de capacidad instalada para definir cuántos." },
                ],
                clave: "La norma no fija las competencias de cada profesión: esas las definen los programas académicos. Lo que se verifica es que el perfil exigido esté presente y soportado.",
              },
              {
                tipo: "tarjetas",
                titulo: "Palabras que cambian todo",
                instruccion: "En el manual, unas pocas palabras definen dónde debe estar cada cosa. Toque cada tarjeta.",
                tarjetas: [
                  {
                    etiqueta: "Ubicación",
                    frente: "«Cuenta con»",
                    reverso: "El recurso existe de forma obligatoria y permanente dentro del servicio. Un servicio interdependiente marcado así debe estar en la misma edificación o sede.",
                  },
                  {
                    etiqueta: "Ubicación",
                    frente: "«Disponibilidad»",
                    reverso: "El recurso está cuando se necesita, aunque esté fuera del servicio, siempre que se localice con facilidad y no ponga en riesgo al paciente. Un servicio interdependiente con disponibilidad puede estar fuera de la sede.",
                  },
                  {
                    etiqueta: "Infraestructura",
                    frente: "Ambiente",
                    reverso: "Lugar físico delimitado por barrera física fija, piso y techo.",
                  },
                  {
                    etiqueta: "Infraestructura",
                    frente: "Área",
                    reverso: "Lugar físico que no necesariamente está delimitado por una barrera física.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Dotación, medicamentos y dispositivos",
                parrafos: [
                  "En dotación, el prestador lleva la relación de sus equipos biomédicos con nombre, marca, modelo, serie, registro sanitario o permiso de comercialización y clasificación por riesgo, cuando aplique. Tiene un programa de mantenimiento preventivo y una hoja de vida por equipo con sus mantenimientos, hechos por personal profesional, tecnólogo o técnico.",
                  "En medicamentos, dispositivos médicos e insumos se exige trazabilidad: registros con principio activo, concentración, lote, fecha de vencimiento y registro sanitario del Invima; procesos documentados desde la selección hasta la disposición final; almacenamiento en condiciones adecuadas, y programas de farmacovigilancia, tecnovigilancia y reactivovigilancia.",
                ],
                puntos: [
                  { titulo: "Equipos", texto: "Inventario, mantenimiento preventivo, hojas de vida y capacitación en su uso." },
                  { titulo: "Medicamentos", texto: "Lote, vencimiento, registro Invima y cadena de frío cuando aplique." },
                  { titulo: "Vigilancia", texto: "Farmacovigilancia, tecnovigilancia y reactivovigilancia." },
                  { titulo: "Kits", texto: "Paquete para derrames de medicamentos y, en urgencias, transporte asistencial y atención prehospitalaria, kit para víctimas de ataques con agentes químicos." },
                ],
                clave: "Un equipo sin hoja de vida o un medicamento sin control de vencimiento son hallazgos típicos y fáciles de evitar.",
              },
              {
                tipo: "clasificar",
                titulo: "¿De qué estándar es el criterio? (parte 1)",
                instruccion: "Ubique cada criterio en el estándar al que pertenece.",
                categorias: [
                  { id: "th", nombre: "Talento humano" },
                  { id: "inf", nombre: "Infraestructura" },
                  { id: "dot", nombre: "Dotación" },
                  { id: "med", nombre: "Medicamentos, dispositivos e insumos" },
                ],
                elementos: [
                  { texto: "La auxiliar de enfermería tiene su inscripción en el ReTHUS", categoria: "th" },
                  { texto: "El conductor de la ambulancia tiene constancia de formación en primeros auxilios o primer respondiente", categoria: "th", porque: "El manual ubica al conductor y sus constancias de formación en el estándar de talento humano." },
                  { texto: "Cada piso tiene planos con rutas de evacuación, salidas de emergencia y puntos de encuentro", categoria: "inf" },
                  { texto: "La sede tiene el concepto sanitario de la autoridad competente", categoria: "inf" },
                  { texto: "El monitor de signos vitales tiene hoja de vida con sus mantenimientos", categoria: "dot" },
                  { texto: "Existe un programa de mantenimiento preventivo de los equipos biomédicos", categoria: "dot" },
                  { texto: "Los medicamentos tienen registrados lote, fecha de vencimiento y registro Invima", categoria: "med" },
                  { texto: "Hay un paquete para derrames de medicamentos visible y señalizado", categoria: "med", porque: "El paquete de derrames y rupturas es un criterio del estándar de medicamentos, dispositivos médicos e insumos." },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Procesos prioritarios, historia clínica e interdependencia",
                parrafos: [
                  "Procesos prioritarios: el prestador tiene una política de seguridad del paciente, una instancia que la orienta y prácticas seguras documentadas, como identificar al paciente con al menos dos identificadores (nombre completo y número de identificación), la higiene de manos, la gestión de eventos adversos y el consentimiento informado. También documenta sus guías y protocolos, y demuestra que el personal los conoce.",
                  "Historia clínica y registros: todo paciente tiene historia clínica desde su primera atención. Se diligencia en forma clara y legible, sin tachones, enmendaduras, espacios en blanco ni siglas, con fecha, hora, nombre completo y firma de quien registra, en el momento de la atención o inmediatamente después, y se custodia con reserva.",
                  "Interdependencia: son los servicios de salud y de apoyo (alimentación, lavandería y vigilancia) que un servicio necesita para funcionar. Pueden ser propios o contratados; si son contratados, debe haber un acuerdo escrito que defina calidad, procedimientos, tiempos de entrega y supervisión.",
                ],
                puntos: [
                  { titulo: "Guías del Ministerio primero", texto: "Se adoptan en primera medida las guías y protocolos del Ministerio; si no los hay, el prestador adopta, adapta o desarrolla los suyos con evidencia." },
                  { titulo: "Grabar procedimientos", texto: "Desde la Resolución 465 de 2025, grabar un procedimiento exige autorización escrita firmada por el paciente o su representante y por el profesional responsable, que se archiva en la historia clínica." },
                ],
                clave: "Lo que no está escrito, socializado y registrado, para el verificador no existe.",
              },
              {
                tipo: "clasificar",
                titulo: "¿De qué estándar es el criterio? (parte 2)",
                instruccion: "Ahora con los otros tres estándares. Ubique cada criterio.",
                categorias: [
                  { id: "pp", nombre: "Procesos prioritarios" },
                  { id: "hc", nombre: "Historia clínica y registros" },
                  { id: "idp", nombre: "Interdependencia" },
                ],
                elementos: [
                  { texto: "Política de seguridad del paciente acorde con los lineamientos del Ministerio", categoria: "pp" },
                  { texto: "Protocolo para identificar al paciente con nombre completo y número de identificación", categoria: "pp" },
                  { texto: "Procedimiento documentado de aseo, limpieza y desinfección de áreas y superficies", categoria: "pp" },
                  { texto: "Cada anotación lleva fecha, hora, nombre completo y firma de quien la hace", categoria: "hc" },
                  { texto: "Historia clínica única por paciente, con control de entrada y salida del archivo", categoria: "hc" },
                  { texto: "Registro de los pacientes trasladados en ambulancia con origen, destino y evolución", categoria: "hc", porque: "Es un registro asistencial del servicio de transporte asistencial, dentro del estándar de historia clínica y registros." },
                  { texto: "Contrato escrito con el laboratorio clínico externo que fija tiempos de entrega y supervisión", categoria: "idp" },
                  { texto: "Servicio de lavandería contratado que apoya la hospitalización", categoria: "idp", porque: "Alimentación, lavandería y vigilancia son los servicios de apoyo del estándar de interdependencia." },
                ],
              },
              {
                tipo: "decision",
                titulo: "Notas al final del turno",
                situacion:
                  "En la IPS, un médico acostumbra escribir todas las evoluciones del día al final del turno, con abreviaturas como «HTA» y «Dx», y deja espacios en blanco para completar después.",
                pregunta: "¿Qué le dice el auditor?",
                opciones: [
                  {
                    texto: "Que debe registrar en el momento de la atención o inmediatamente después, en forma legible, sin siglas ni espacios en blanco, con fecha, hora, nombre y firma",
                    correcta: true,
                    retro: "Correcto. Así lo exige el estándar de historia clínica y registros, y así se protege al paciente y al propio médico.",
                  },
                  {
                    texto: "Que está bien mientras al final del día todo quede escrito",
                    retro: "El registro se hace en el momento de la atención o inmediatamente después. Escribir de memoria horas más tarde pierde información.",
                  },
                  {
                    texto: "Que las siglas están bien porque todo el mundo las entiende",
                    retro: "La norma pide no usar siglas. Lo que es obvio para uno puede confundir a otro y causar un error.",
                  },
                ],
              },
              {
                tipo: "contrarreloj",
                titulo: "Cámaras en la sala de procedimientos",
                segundos: 25,
                situacion:
                  "La IPS instaló cámaras en la sala de procedimientos menores para grabar las atenciones «por seguridad».",
                pregunta: "¿Qué exige la norma desde la Resolución 465 de 2025?",
                opciones: [
                  {
                    texto: "Autorización escrita de la grabación, firmada por el paciente o su representante y por el profesional responsable, archivada en la historia clínica y con respeto de las normas de protección de datos",
                    correcta: true,
                    retro: "Correcto. El documento firmado hace parte de la historia clínica, y tanto ese documento como la grabación deben cumplir las normas de datos personales.",
                  },
                  {
                    texto: "Basta con un aviso en la puerta que diga «zona videovigilada»",
                    retro: "Para grabar procedimientos en salud no basta un aviso: se requiere la autorización escrita firmada por el paciente y por el profesional.",
                  },
                  {
                    texto: "Solo la autorización verbal del paciente",
                    retro: "Debe ser un documento escrito, firmado por el paciente o su representante y por el profesional, y va a la historia clínica.",
                  },
                ],
                alAgotar: "Sin autorización escrita, esa grabación es un riesgo legal y de privacidad. Recuerde: documento firmado por paciente y profesional, dentro de la historia clínica.",
              },
              {
                tipo: "mision",
                titulo: "La autoevaluación de Bienestar Total",
                intro:
                  "Faltan tres semanas para que venza la autoevaluación de la IPS Bienestar Total. Usted recorre la sede con Andrea Gómez, la coordinadora de calidad. Cada hallazgo mal manejado aumenta el riesgo para la habilitación.",
                medidor: { etiqueta: "Riesgo para la habilitación", tipo: "amenaza" },
                velocidad: 1,
                penalizacion: 20,
                pasos: [
                  {
                    situacion: "En odontología, la unidad odontológica no tiene hoja de vida ni registros de mantenimiento.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Abrir la hoja de vida, incluir el equipo en el programa de mantenimiento preventivo y registrar el mantenimiento antes de declarar el servicio",
                        correcta: true,
                        retro: "Correcto. Es un criterio de dotación: inventario, mantenimiento preventivo y hoja de vida.",
                      },
                      {
                        texto: "Darlo por cumplido porque el equipo funciona bien",
                        retro: "Que funcione no basta: la norma pide evidencia del mantenimiento.",
                      },
                    ],
                  },
                  {
                    situacion: "En el carro de paro hay dos ampollas vencidas.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Retirarlas, reponerlas y reforzar el control de fechas de vencimiento del carro de paro con su registro",
                        correcta: true,
                        retro: "Correcto. El prestador debe mantener el almacenamiento, el control de vencimientos y la custodia de lo que hay en el carro de paro.",
                      },
                      {
                        texto: "Dejarlas hasta la próxima compra; casi nunca se usan",
                        retro: "Un medicamento vencido en el carro de paro puede fallar justo cuando más se necesita.",
                      },
                    ],
                  },
                  {
                    situacion: "Las manillas de identificación de los pacientes en observación solo tienen el primer nombre.",
                    pregunta: "¿Qué corrige?",
                    opciones: [
                      {
                        texto: "El protocolo, para usar al menos dos identificadores: nombre completo y número de identificación",
                        correcta: true,
                        retro: "Correcto. Es una de las prácticas seguras del estándar de procesos prioritarios.",
                      },
                      {
                        texto: "Nada más agregar el número de la camilla como segundo dato",
                        retro: "La camilla cambia y no identifica a la persona. Se usan el nombre completo y el número de identificación.",
                      },
                    ],
                  },
                  {
                    situacion: "El laboratorio clínico que procesa las muestras de la IPS es contratado, pero no hay ningún documento firmado.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Formalizar un contrato o acuerdo escrito que defina calidad, procedimientos, tiempos de entrega y supervisión",
                        correcta: true,
                        retro: "Correcto. Así se demuestra la interdependencia con un servicio contratado.",
                      },
                      {
                        texto: "Dejarlo así: llevan años trabajando juntos y hay confianza",
                        retro: "Sin acuerdo escrito no hay forma de demostrar la interdependencia en la visita.",
                      },
                    ],
                  },
                  {
                    situacion: "Andrea pregunta si declaran el servicio de vacunación, aunque la edificación todavía no tiene planta eléctrica.",
                    pregunta: "¿Qué le responde?",
                    opciones: [
                      {
                        texto: "Que no se declara hasta cumplir: las edificaciones donde se presta vacunación deben contar con planta eléctrica",
                        correcta: true,
                        retro: "Correcto. Si un servicio no cumple, el prestador se abstiene de declararlo, ofertarlo y prestarlo.",
                      },
                      {
                        texto: "Que lo declaren y compren la planta el próximo año",
                        retro: "En habilitación no hay planes de cumplimiento: primero se cumple, después se declara.",
                      },
                    ],
                  },
                ],
                exito: "¡Autoevaluación honesta y completa! Corrigieron lo que se podía corregir y dejaron por fuera lo que todavía no cumple. Así se declara en el REPS.",
                fracaso: "Quedaron hallazgos abiertos. Repase: hojas de vida y mantenimiento, control de vencimientos, dos identificadores, acuerdos escritos con lo contratado y nada de declarar lo que no se cumple.",
                dice: "Piense como verificador, pero actúe como responsable de calidad.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Talento humano: títulos, ReTHUS o autorización, cantidad suficiente y formación continua. Infraestructura: edificación adecuada, señalizada y con concepto sanitario.",
                  "«Cuenta con» es permanente dentro del servicio; «disponibilidad» es tenerlo cuando se necesita, aunque esté fuera.",
                  "Dotación y medicamentos exigen inventario, mantenimiento, hojas de vida, trazabilidad y control de vencimientos.",
                  "Procesos prioritarios, historia clínica e interdependencia: seguridad del paciente, registros completos y acuerdos escritos con lo contratado.",
                ],
                insignia: "Ojo de verificador",
                cierre: "En el último módulo verá la visita de verificación por dentro y preparará, paso a paso, la ambulancia de un cuerpo de bomberos.",
              },
            ],
          },
        },
      ],
    },

    /* ==================================================================== */
    /*  MÓDULO 4 · VERIFICACIÓN, CONSECUENCIAS Y MEJORA CONTINUA             */
    /* ==================================================================== */
    {
      title: "Módulo 4. Verificación, consecuencias y mejora continua",
      description:
        "Cómo son las visitas de verificación, qué pasa si se incumple, cómo se prepara la habilitación de la ambulancia de un cuerpo de bomberos y cómo pasar del mínimo a la mejora continua.",
      lessons: [
        {
          title: "La visita de verificación",
          description: "Visita previa, de certificación y de reactivación; plan de visitas; derechos del prestador; medidas de seguridad y sanciones.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: MARCELA,
            bloques: [
              {
                tipo: "portada",
                titulo: "La visita de verificación",
                subtitulo: "La secretaría viene a comprobar que lo declarado es real. Prepararse todo el año es la mejor defensa.",
                objetivos: [
                  "Diferenciar la visita previa, la de certificación y la de reactivación",
                  "Conocer cómo se planean, se anuncian y se desarrollan las visitas",
                  "Reconocer los derechos y deberes del prestador durante la visita",
                  "Identificar las medidas y sanciones por incumplir",
                ],
                minutos: 20,
                dice: "He estado a los dos lados de la mesa. Una visita bien atendida es una conversación técnica, no un interrogatorio.",
              },
              {
                tipo: "explicacion",
                titulo: "Tres tipos de visita",
                parrafos: [
                  "Las visitas de verificación las hace la secretaría de salud departamental o distrital con una comisión de verificadores. Hay tres tipos.",
                ],
                puntos: [
                  { titulo: "Visita previa", texto: "Antes de habilitar: para inscribir una nueva IPS; para habilitar nuevos servicios de urgencias, atención del parto, transporte asistencial, oncología y todos los de alta complejidad, y para pasar un servicio a alta complejidad." },
                  { titulo: "Visita de certificación", texto: "Después de habilitar, según el plan de visitas, para certificar que se cumplen las condiciones que se declararon." },
                  { titulo: "Visita de reactivación", texto: "Para reactivar una IPS inactiva por no autoevaluarse, o servicios como transporte asistencial, urgencias, alta complejidad, hospitalización obstétrica u oncología que quedaron inactivos." },
                ],
                clave: "En las visitas previa y de reactivación, el talento humano, la historia clínica, los procesos prioritarios y los medicamentos se verifican con base en lo planeado, porque todavía no hay resultados que mostrar.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Qué visita corresponde?",
                instruccion: "Toque el tipo de visita que corresponde a cada caso.",
                categorias: [
                  { id: "previa", nombre: "Visita previa", pista: "Antes de habilitar" },
                  { id: "cert", nombre: "Visita de certificación", pista: "Después de habilitar" },
                  { id: "react", nombre: "Visita de reactivación", pista: "Para volver" },
                ],
                elementos: [
                  { texto: "Una nueva IPS se va a inscribir por primera vez", categoria: "previa" },
                  { texto: "El cuerpo de bomberos quiere habilitar por primera vez su transporte asistencial", categoria: "previa" },
                  { texto: "Una IPS quiere pasar su hospitalización de mediana a alta complejidad", categoria: "previa" },
                  { texto: "La secretaría visita, según su plan anual, un consultorio ya habilitado para confirmar lo declarado", categoria: "cert" },
                  { texto: "Un prestador habilitado que nunca ha sido visitado desde su inscripción queda priorizado en el plan", categoria: "cert", porque: "Es una visita posterior a la habilitación; los prestadores nunca visitados tienen prioridad en el plan." },
                  { texto: "Una IPS quedó inactiva por no autoevaluar sus servicios y quiere volver", categoria: "react" },
                  { texto: "El transporte asistencial quedó inactivo por no autoevaluarlo a tiempo", categoria: "react", porque: "El transporte asistencial inactivo por falta de autoevaluación necesita visita de reactivación." },
                  { texto: "Un servicio de urgencias pasó más de un año en cierre temporal y se quiere reactivar", categoria: "react" },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Cómo se planean y se anuncian",
                parrafos: [
                  "Cada año, las secretarías formulan un plan de visitas a más tardar el 30 de noviembre y lo registran en el REPS hasta el 20 de diciembre, para ejecutarlo en la vigencia siguiente. Priorizan, entre otros, los servicios que defina el Ministerio, los oncológicos, los prestadores no visitados desde su inscripción y los servicios de atención del parto no visitados en los últimos cuatro años.",
                  "La visita se comunica al prestador con mínimo un día hábil de antelación, por medios físicos o electrónicos. Desde ese momento, el prestador no puede presentar novedades hasta que la visita termine.",
                  "Las IPS acreditadas no requieren visita de verificación de habilitación mientras esté vigente su acreditación, salvo cuando abren nuevos servicios de urgencias, oncología, alta complejidad, atención del parto o transporte asistencial, que siempre requieren visita previa.",
                ],
                puntos: [
                  { titulo: "Comisión", texto: "Mínimo dos verificadores; al menos uno es funcionario de la secretaría." },
                  { titulo: "Aviso", texto: "Mínimo un día hábil antes." },
                  { titulo: "Novedades", texto: "Congeladas desde que se comunica la visita hasta que termina." },
                ],
                clave: "Prepárese todo el año, no la semana de la visita: un día hábil de aviso no alcanza para improvisar.",
              },
              {
                tipo: "ordenar",
                titulo: "Así transcurre la visita",
                instruccion: "Ordene los momentos de una visita de verificación.",
                pasos: [
                  "La secretaría comunica la visita con mínimo un día hábil de antelación",
                  "La comisión se presenta ante el representante legal o su delegado y explica el objetivo",
                  "Reunión de apertura: se firma el acta y se cotejan los servicios del REPS con los que realmente se prestan",
                  "Recorrido por las áreas, siempre acompañado por un funcionario del prestador",
                  "Reunión de cierre: se firma el acta, el prestador deja sus observaciones y recibe copia",
                  "La comisión elabora el informe y se registra el resultado en el REPS",
                ],
                explicacion:
                  "Así es. En la apertura se compara lo declarado en el REPS con lo que se presta de verdad, y en el cierre usted tiene derecho a dejar sus observaciones en el acta y a recibir una copia.",
              },
              {
                tipo: "decision",
                titulo: "La novedad de última hora",
                situacion:
                  "El lunes llegó la comunicación: la secretaría visitará la IPS el miércoles. El gerente quiere aprovechar el martes para reportar el cierre temporal de un servicio que sabe que no cumple.",
                pregunta: "¿Qué le dice?",
                opciones: [
                  {
                    texto: "Que ya no se puede: comunicada la visita, no se presentan novedades hasta que termine",
                    correcta: true,
                    retro: "Correcto. Por eso las novedades se reportan cuando ocurren, no cuando se anuncia una visita.",
                  },
                  {
                    texto: "Que sí, que lo haga rápido en línea para que no lo vean",
                    retro: "La norma no permite presentar novedades desde que se comunica la visita y hasta que concluye.",
                  },
                  {
                    texto: "Que guarde los equipos de ese servicio en una bodega durante la visita",
                    retro: "Ocultar información a la comisión agrava la situación y puede terminar en medidas sanitarias y sanciones.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Qué pasa si se incumple",
                parrafos: [
                  "Si en la visita se identifica un hecho que atente o pueda ser un peligro para la salud, la comisión puede aplicar medidas de seguridad: la clausura temporal, total o parcial, del establecimiento, o la suspensión total o parcial de trabajos o servicios. Son preventivas y transitorias, y se ejecutan de inmediato.",
                  "Además, si se viola el régimen sanitario puede abrirse un proceso sancionatorio, con sanciones que van desde la amonestación y las multas hasta la suspensión o cancelación del registro o la licencia y el cierre temporal o definitivo del servicio. La inscripción también puede ser revocada cuando se comprueba el incumplimiento de las condiciones de habilitación, siempre con debido proceso.",
                ],
                puntos: [
                  { titulo: "Medidas de seguridad", texto: "Clausura temporal o suspensión de servicios: preventivas, transitorias y de ejecución inmediata." },
                  { titulo: "Sanciones", texto: "Amonestación, multas, decomiso, suspensión o cancelación del registro o la licencia, cierre temporal o definitivo." },
                  { titulo: "Revocatoria", texto: "La Supersalud o la secretaría pueden revocar la inscripción por incumplir las condiciones, con debido proceso." },
                  { titulo: "Contratos", texto: "Si quien contrata detecta un incumplimiento, informa a la secretaría; si la habilitación no se mantiene, debe dejar de contratar con ese prestador." },
                ],
                clave: "Las medidas de seguridad se aplican sin perjuicio de las sanciones: una cosa no reemplaza la otra.",
              },
              {
                tipo: "contrarreloj",
                titulo: "Oxígeno en cero",
                segundos: 20,
                situacion:
                  "En la visita de certificación a un servicio de transporte asistencial básico, los verificadores encuentran que los cilindros de oxígeno de la única ambulancia están vacíos y que el desfibrilador no enciende.",
                pregunta: "¿Qué puede hacer la secretaría de inmediato?",
                opciones: [
                  {
                    texto: "Aplicar una medida de seguridad, como la suspensión del servicio, preventiva y transitoria, mientras se corrige",
                    correcta: true,
                    retro: "Correcto. Ante un peligro para la salud, la comisión puede suspender el servicio de inmediato, sin perjuicio del proceso sancionatorio.",
                  },
                  {
                    texto: "Nada hasta la próxima visita",
                    retro: "Un riesgo así no espera: la norma permite medidas de seguridad de ejecución inmediata.",
                  },
                  {
                    texto: "Imponer una multa ahí mismo, en la visita",
                    retro: "La multa es una sanción que se impone por acto administrativo dentro de un proceso sancionatorio, con debido proceso. En la visita se aplican medidas de seguridad.",
                  },
                ],
                alAgotar: "Mientras se duda, esa ambulancia podría salir a atender. Recuerde: ante un peligro para la salud se aplican medidas de seguridad inmediatas.",
              },
              {
                tipo: "tarjetas",
                titulo: "Sus derechos y deberes en la visita",
                instruccion: "Toque cada tarjeta para ver la regla.",
                tarjetas: [
                  {
                    frente: "Saber quién viene",
                    reverso: "La secretaría le informa el listado de verificadores, sus datos de identificación y el tiempo aproximado de la visita. Los verificadores portan su identificación a la vista.",
                  },
                  {
                    frente: "Acompañar el recorrido",
                    reverso: "Los verificadores siempre van acompañados por un funcionario del prestador, que avala el recorrido por todas las áreas.",
                  },
                  {
                    frente: "Dejar constancia",
                    reverso: "En el acta de cierre puede consignar lo que considere pertinente, y tiene derecho a una copia del acta.",
                  },
                  {
                    frente: "No cerrar la puerta",
                    reverso: "Si no se recibe la visita, se levanta un acta que sirve de soporte para acciones jurídicas. Si se niega a firmar, se deja constancia y la comisión firma.",
                  },
                ],
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Visita previa antes de habilitar (nueva IPS, urgencias, parto, transporte asistencial, oncología y alta complejidad); de certificación después; de reactivación para volver.",
                  "La visita se anuncia con mínimo un día hábil y, desde el aviso, no se pueden presentar novedades.",
                  "El prestador acompaña el recorrido, deja sus observaciones en el acta y recibe copia.",
                  "Ante un peligro para la salud se aplican medidas de seguridad inmediatas; además puede haber sanciones y revocatoria, con debido proceso.",
                ],
                insignia: "Anfitrión de la visita",
                cierre: "En la última lección preparará la habilitación de la ambulancia de un cuerpo de bomberos y verá cómo pasar del mínimo a la mejora continua.",
              },
            ],
          },
        },
        {
          title: "Caso práctico: la ambulancia de los bomberos",
          description: "Transporte asistencial básico y medicalizado, preparación de la visita previa de un cuerpo de bomberos y relación con el PAMEC y la acreditación.",
          durationMin: 22,
          contenido: {
            version: 1,
            guia: MARCELA,
            bloques: [
              {
                tipo: "portada",
                titulo: "Caso práctico: la ambulancia de los bomberos",
                subtitulo: "Del garaje a la visita previa: así se prepara un servicio de transporte asistencial, y así se mantiene y se mejora.",
                objetivos: [
                  "Diferenciar el transporte asistencial básico (TAB) del medicalizado (TAM)",
                  "Reunir los documentos y requisitos de la ambulancia",
                  "Preparar la visita previa de un cuerpo de bomberos",
                  "Conectar la habilitación con la mejora continua: PAMEC y acreditación",
                ],
                minutos: 22,
                dice: "El capitán Pinzón me pidió ayuda para habilitar la ambulancia de su cuerpo de bomberos. Venga conmigo: lo vamos a hacer juntos.",
              },
              {
                tipo: "explicacion",
                titulo: "TAB y TAM: no es la misma ambulancia",
                parrafos: [
                  "El servicio de transporte asistencial traslada al paciente y lo atiende de forma oportuna y permanente durante el recorrido. En ambulancia terrestre, fluvial o marítima puede ser de baja complejidad (transporte asistencial básico, TAB) o de mediana (transporte asistencial medicalizado, TAM). La ambulancia aérea solo se habilita en mediana complejidad.",
                  "La diferencia está sobre todo en la tripulación y en los equipos.",
                ],
                puntos: [
                  { titulo: "Tripulación TAB", texto: "Tecnólogo o técnico profesional en atención prehospitalaria, o auxiliar de enfermería, con constancia de formación en soporte vital básico, más un conductor con licencia y formación en primeros auxilios o primer respondiente." },
                  { titulo: "Tripulación TAM", texto: "Profesional de la medicina; profesional de enfermería, tecnólogo o técnico profesional en atención prehospitalaria o auxiliar de enfermería; y conductor. Los profesionales, con soporte vital avanzado; técnicos y auxiliares, con soporte vital básico." },
                  { titulo: "Coordinación TAM", texto: "Un coordinador, profesional de la medicina o de la enfermería, responsable de todas las ambulancias del servicio." },
                  { titulo: "Equipos", texto: "El TAB lleva, entre otros, desfibrilador externo automático, monitor de signos vitales y oxígeno. El TAM suma desfibrilador con cardioversión y marcapasos, ventilador de transporte y bombas de infusión." },
                ],
                clave: "En los costados y en la parte posterior, la ambulancia lleva el nombre o logotipo del prestador, la sigla TAB o TAM y el nombre del municipio sede.",
              },
              {
                tipo: "clasificar",
                titulo: "¿TAB, TAM o ambos?",
                instruccion: "Decida si cada requisito es solo del básico, solo del medicalizado o de ambos.",
                categorias: [
                  { id: "tab", nombre: "Solo TAB (básico)", pista: "Baja complejidad" },
                  { id: "tam", nombre: "Solo TAM (medicalizado)", pista: "Mediana complejidad" },
                  { id: "ambos", nombre: "Ambos", pista: "Toda ambulancia" },
                ],
                elementos: [
                  { texto: "Profesional de la medicina en la tripulación", categoria: "tam" },
                  { texto: "Ventilador de transporte adulto y pediátrico", categoria: "tam" },
                  { texto: "Desfibrilador bifásico con cardioversión sincrónica y marcapasos transcutáneo", categoria: "tam" },
                  { texto: "Coordinador médico o de enfermería responsable de todas las ambulancias", categoria: "tam" },
                  { texto: "Desfibrilador externo automático con electrodos para adulto y pediátricos", categoria: "tab", porque: "En el TAM se reemplaza por el desfibrilador bifásico con cardioversión y marcapasos." },
                  { texto: "Conductor con licencia y formación en primeros auxilios o primer respondiente", categoria: "ambos" },
                  { texto: "Estrella de la vida y emblema de la Misión Médica en costados, puertas posteriores y techo", categoria: "ambos" },
                  { texto: "Registro de cada paciente trasladado con origen, destino y evolución", categoria: "ambos" },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Los papeles de la ambulancia",
                parrafos: [
                  "Sea cual sea el tipo de prestador con que se inscriba, para habilitar ambulancias se anexa la tarjeta de propiedad de cada vehículo (si está a nombre de otra persona, también la autorización del propietario para que haga parte del servicio) y el certificado de revisión técnico-mecánica, cuando aplique.",
                  "El cuerpo de bomberos habilita el servicio en el departamento o distrito de la sede que defina, con efecto en todo el país. Como es un servicio nuevo de transporte asistencial, necesita visita previa: la constancia de habilitación y el distintivo llegan solo después de que la secretaría verifica y registra el resultado.",
                  "La sede administrativa del servicio necesita ambiente para medicamentos, dispositivos e insumos; área para equipos biomédicos; área de limpieza y desinfección con mesón y poceta; sistema eléctrico para los equipos y ambiente para el archivo de historias clínicas y registros. También debe tener disponible un área para lavar y desinfectar los vehículos o un contrato con un tercero que tenga los permisos sanitarios y ambientales.",
                ],
                puntos: [
                  { titulo: "Vehículo", texto: "Tarjeta de propiedad, autorización del propietario si aplica y revisión técnico-mecánica." },
                  { titulo: "Sin banco de sangre", texto: "Con los ajustes de 2023 y 2025, el transporte asistencial no requiere convenio con banco de sangre." },
                  { titulo: "Comunicaciones", texto: "Radio de doble vía exclusivo de la ambulancia, y georreferenciación y comunicación con la entidad territorial a través del CRUE." },
                ],
                clave: "Hasta que la secretaría haga la visita previa y autorice el distintivo, la ambulancia no traslada pacientes como servicio de salud.",
              },
              {
                tipo: "mision",
                titulo: "Rumbo a la visita previa",
                intro:
                  "El Cuerpo de Bomberos Voluntarios de San Isidro quiere habilitar el transporte asistencial básico con una ambulancia terrestre. La secretaría de salud hará la visita previa en dos semanas. Usted acompaña al capitán Pinzón a cerrar los pendientes. Cada error acerca el servicio a no quedar habilitado.",
                medidor: { etiqueta: "Riesgo de no habilitar", tipo: "amenaza" },
                velocidad: 1,
                penalizacion: 20,
                pasos: [
                  {
                    situacion: "La ambulancia fue donada por la alcaldía y la tarjeta de propiedad sigue a nombre del municipio.",
                    pregunta: "¿Qué anexa?",
                    opciones: [
                      {
                        texto: "La tarjeta de propiedad y la autorización del propietario que indique que el vehículo hará parte de la capacidad instalada del servicio",
                        correcta: true,
                        retro: "Correcto. Si el vehículo está a nombre de otro, se anexa la autorización del propietario.",
                      },
                      {
                        texto: "Nada más: con la carta de donación basta",
                        retro: "La norma pide la tarjeta de propiedad y, si el vehículo está a nombre de otro, la autorización expresa del propietario.",
                      },
                    ],
                  },
                  {
                    situacion: "Toca definir la tripulación del turno.",
                    pregunta: "¿Quiénes van en la ambulancia básica?",
                    opciones: [
                      {
                        texto: "Un tecnólogo en atención prehospitalaria con constancia de soporte vital básico y un conductor con licencia y formación en primeros auxilios o primer respondiente",
                        correcta: true,
                        retro: "Correcto. Esa es la tripulación del TAB terrestre.",
                      },
                      {
                        texto: "Dos bomberos con curso de primer respondiente, sin formación en salud",
                        retro: "El TAB exige personal de salud: tecnólogo o técnico profesional en atención prehospitalaria, o auxiliar de enfermería, con soporte vital básico.",
                      },
                      {
                        texto: "Obligatoriamente un médico y una enfermera",
                        retro: "Esa tripulación corresponde al TAM. El TAB no exige médico.",
                      },
                    ],
                  },
                  {
                    situacion: "El taller entregó la ambulancia pintada solo con la estrella de la vida.",
                    pregunta: "¿Está lista la emblematización?",
                    opciones: [
                      {
                        texto: "No: desde la Resolución 465 de 2025 lleva en costados, puertas posteriores y techo la estrella de la vida azul o verde reflectiva y también el emblema protector de la Misión Médica",
                        correcta: true,
                        retro: "Correcto. La 465 de 2025 exige los dos emblemas. Además, la palabra «AMBULANCIA» va en material reflectivo y escrita al revés en el frente.",
                      },
                      {
                        texto: "Sí: basta con uno de los dos emblemas",
                        retro: "La regla cambió: la Resolución 465 de 2025 pide la estrella de la vida y el emblema de la Misión Médica.",
                      },
                    ],
                  },
                  {
                    situacion: "Revisan el oxígeno: hay un solo cilindro portátil.",
                    pregunta: "¿Qué falta?",
                    opciones: [
                      {
                        texto: "Oxígeno medicinal con capacidad total de al menos tres metros cúbicos disponibles, además del portátil de al menos medio metro cúbico para desplazar la camilla",
                        correcta: true,
                        retro: "Correcto. El criterio de dotación del TAB pide las dos capacidades.",
                      },
                      {
                        texto: "Nada: un cilindro portátil alcanza para trayectos cortos",
                        retro: "El criterio exige un almacenamiento total mínimo de tres metros cúbicos, además del cilindro portátil.",
                      },
                    ],
                  },
                  {
                    situacion: "El comandante pregunta qué mostrar en historia clínica si todavía no han trasladado a nadie.",
                    pregunta: "¿Qué le responde?",
                    opciones: [
                      {
                        texto: "La planeación: el formato de registro de pacientes trasladados (nombre, acompañante, fecha, hora, origen, destino, tipo de servicio, personal y evolución) y los procesos documentados",
                        correcta: true,
                        retro: "Correcto. En la visita previa, historia clínica, talento humano, procesos prioritarios y medicamentos se verifican sobre lo planeado.",
                      },
                      {
                        texto: "Inventar unos traslados de prueba para que el archivo no se vea vacío",
                        retro: "Fabricar registros es una falsedad. La visita previa no exige resultados, sino la planeación.",
                      },
                    ],
                  },
                  {
                    situacion: "Los procesos prioritarios del servicio todavía están en borrador.",
                    pregunta: "¿Cuáles no pueden faltar para la ambulancia?",
                    opciones: [
                      {
                        texto: "Manejo de urgencias; remisión, incluido el traslado de niños y de personas sin acompañante; atención de pacientes con trastornos mentales o consumo de sustancias; mantenimiento del vehículo; aseo y desinfección de la ambulancia, y manejo de medicamentos y dispositivos",
                        correcta: true,
                        retro: "Correcto. Esos son los procesos propios del servicio, además de los que aplican a todos los servicios, como la seguridad del paciente.",
                      },
                      {
                        texto: "Solo el manual de funciones del cuerpo de bomberos",
                        retro: "El manual de funciones no reemplaza los procesos prioritarios que exige el manual de habilitación al servicio.",
                      },
                    ],
                  },
                ],
                exito: "¡Visita previa superada! La secretaría registró el resultado, expidió la constancia y autorizó el distintivo. La ambulancia de San Isidro ya puede trasladar pacientes como servicio habilitado.",
                fracaso: "La comisión encontró incumplimientos. Si son subsanables, la secretaría le dará un plazo corto para corregir; si no, habrá que empezar de nuevo el trámite. Repase documentos del vehículo, tripulación, emblemas, oxígeno, registros y procesos prioritarios.",
                dice: "Despacio y con la norma abierta. Una buena visita previa se gana en el garaje, no en la reunión de apertura.",
              },
              {
                tipo: "explicacion",
                titulo: "Después de habilitar: mantener",
                parrafos: [
                  "Habilitar es el comienzo. El prestador que tiene el distintivo se obliga a mantener las condiciones; a imprimirlo y fijarlo en un lugar visible al público; a no adulterarlo; a explicar a los usuarios qué significa, y a retirarlo si se deteriora o si el servicio se cierra temporal o definitivamente o se inactiva. Si lo pierde, presenta a la secretaría copia de la denuncia.",
                  "Mantener también es autoevaluarse antes de cada vencimiento, reportar las novedades cuando ocurren y conservar los registros. Una visita de certificación puede llegar en cualquier momento.",
                ],
                puntos: [
                  { titulo: "Distintivo", texto: "Uno por cada servicio habilitado, visible y en buen estado." },
                  { titulo: "Certificado", texto: "Cuando se expida el certificado de cumplimiento de las condiciones de habilitación, también se mantiene visible al público." },
                  { titulo: "Autoevaluación", texto: "Antes de cada vencimiento, con honestidad." },
                  { titulo: "Novedades", texto: "Cada cambio, cuando ocurre." },
                ],
                clave: "El distintivo es una herramienta de control ciudadano: le dice al paciente que ese servicio está habilitado.",
              },
              {
                tipo: "tarjetas",
                titulo: "Del mínimo a la excelencia",
                instruccion: "La habilitación es el piso. Toque cada tarjeta para ver lo que se construye encima.",
                tarjetas: [
                  {
                    etiqueta: "Obligatoria",
                    frente: "Habilitación",
                    reverso: "Condiciones mínimas para entrar y permanecer en el sistema. Se cumplen; no se negocian.",
                  },
                  {
                    etiqueta: "Obligatoria para las IPS",
                    frente: "Auditoría para el mejoramiento (PAMEC)",
                    reverso: "Compara la calidad observada con la esperada y corrige las desviaciones. Sus exigencias van más allá de lo básico de la habilitación y en la línea de los estándares de acreditación.",
                  },
                  {
                    etiqueta: "Tres niveles",
                    frente: "Autocontrol, auditoría interna y auditoría externa",
                    reverso: "Cada persona revisa su propio trabajo; una instancia interna, externa al proceso, lo evalúa; y un ente externo verifica que lo anterior funcione.",
                  },
                  {
                    etiqueta: "Voluntaria",
                    frente: "Acreditación",
                    reverso: "Comprueba de forma gradual niveles de calidad superiores a los mínimos. Para acceder, la entidad debe tener la certificación de que cumple los requisitos mínimos obligatorios.",
                  },
                ],
              },
              {
                tipo: "ordenar",
                titulo: "El ciclo de la mejora",
                instruccion: "Ordene los pasos de la auditoría para el mejoramiento de la calidad en un servicio.",
                pasos: [
                  "Definir la calidad esperada con guías, normas e indicadores",
                  "Medir la calidad observada en el servicio",
                  "Comparar lo observado con lo esperado",
                  "Adoptar medidas para corregir las desviaciones",
                  "Hacer seguimiento para que las mejoras se mantengan",
                ],
                explicacion:
                  "Así es. La calidad esperada se define antes de medir: sin ese punto de referencia no hay con qué comparar. Y la mejora no termina al corregir: hay que sostenerla.",
              },
              {
                tipo: "decision",
                titulo: "¿Acreditarse en lugar de habilitarse?",
                situacion:
                  "La gerente de la IPS Bienestar Total propone: «Saltémonos la habilitación y vamos directo a la acreditación; así quedamos mejor que todos».",
                pregunta: "¿Qué le responde?",
                opciones: [
                  {
                    texto: "Que no se puede: la habilitación es obligatoria, y la acreditación es voluntaria y exige primero la certificación de que se cumplen los requisitos mínimos",
                    correcta: true,
                    retro: "Correcto. La acreditación se construye sobre la habilitación; no la reemplaza.",
                  },
                  {
                    texto: "Que es buena idea: la acreditación reemplaza la habilitación",
                    retro: "La acreditación no reemplaza la habilitación. Sin habilitación no se puede prestar el servicio.",
                  },
                  {
                    texto: "Que da igual, porque las dos son voluntarias",
                    retro: "Solo la acreditación es voluntaria. La habilitación es obligatoria.",
                  },
                ],
              },
              {
                tipo: "contrarreloj",
                titulo: "El distintivo en la puerta",
                segundos: 20,
                situacion:
                  "Por una remodelación, la IPS reportó el cierre temporal de su servicio de terapias. El distintivo sigue pegado en la puerta del consultorio.",
                pregunta: "¿Qué debe hacer?",
                opciones: [
                  {
                    texto: "Retirar el distintivo mientras dure el cierre temporal",
                    correcta: true,
                    retro: "Correcto. El distintivo se retira por deterioro, cierre temporal, cierre definitivo o inactivación del servicio.",
                  },
                  {
                    texto: "Dejarlo: el servicio sigue apareciendo en el REPS",
                    retro: "Con el cierre temporal reportado, el servicio no se puede prestar, y el distintivo le diría al usuario lo contrario.",
                  },
                  {
                    texto: "Cambiarlo de puerta para que no estorbe en la obra",
                    retro: "No es un tema de ubicación: el distintivo se retira durante el cierre temporal.",
                  },
                ],
                alAgotar: "El usuario que vea ese distintivo va a creer que lo pueden atender. Retírelo durante el cierre temporal.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "TAB: personal de atención prehospitalaria o auxiliar de enfermería con soporte vital básico y conductor formado. TAM: además médico, coordinador y más equipos.",
                  "La ambulancia necesita documentos del vehículo, estrella de la vida y emblema de la Misión Médica, comunicaciones, oxígeno, registros y procesos prioritarios.",
                  "El transporte asistencial nuevo requiere visita previa; los bomberos lo habilitan donde está su sede, con efecto nacional.",
                  "Después de habilitar: distintivo visible, autoevaluación a tiempo, novedades al día y mejora continua con el PAMEC y, si se quiere, la acreditación.",
                ],
                insignia: "Habilitador experto",
                cierre: "Terminó la parte práctica. En el desafío final pondrá a prueba todo lo aprendido. Gracias por cuidar que cada servicio de salud cumpla lo mínimo para proteger a las personas.",
              },
            ],
          },
        },
      ],
    },
  ],
  examen: {
    title: "Desafío final",
    description: "Quince preguntas sobre todo el curso. Nota mínima aprobatoria: 80/100. Tiene tres intentos.",
    minScore: 80,
    maxAttempts: 3,
    timeLimitMin: 25,
    preguntas: [
      /* ---- Módulo 1 ---- */
      {
        statement: "¿Cuál de los siguientes NO es un componente del Sistema Obligatorio de Garantía de Calidad de la Atención de Salud (SOGCS)?",
        explanation:
          "Los cuatro componentes del SOGCS son el Sistema Único de Habilitación, la Auditoría para el Mejoramiento de la Calidad, el Sistema Único de Acreditación y el Sistema de Información para la Calidad. El SG-SST es un sistema del ámbito laboral.",
        options: [
          { text: "El Sistema Único de Habilitación", ok: false },
          { text: "La Auditoría para el Mejoramiento de la Calidad de la Atención de Salud", ok: false },
          { text: "El Sistema Único de Acreditación", ok: false },
          { text: "El Sistema de Gestión de la Seguridad y Salud en el Trabajo (SG-SST)", ok: true },
        ],
      },
      {
        statement: "¿Qué entidad inscribe a los prestadores en el REPS y verifica en visita el cumplimiento de las condiciones de habilitación?",
        explanation:
          "La secretaría de salud departamental o distrital (o la entidad que tenga esas competencias) inscribe, administra el REPS de su territorio y hace las visitas de verificación. El Ministerio expide las normas y la Supersalud vigila.",
        options: [
          { text: "La Superintendencia Nacional de Salud", ok: false },
          { text: "La secretaría de salud departamental o distrital, o la entidad que tenga esas competencias", ok: true },
          { text: "La alcaldía del municipio donde funciona el servicio", ok: false },
          { text: "La EPS que contrata los servicios", ok: false },
        ],
      },
      {
        statement:
          "Verdadero o falso: la Resolución 1732 de 2026 reemplazó a la Resolución 3100 de 2019 y hoy es la norma de habilitación vigente.",
        explanation:
          "Falso. La Resolución 1732 de 2026 no se publicó en el Diario Oficial, no llegó a ser obligatoria y fue revocada por la Resolución 2080 de 2026. Siguen vigentes la 3100 de 2019 y sus modificaciones.",
        type: "verdadero_falso",
        options: VF(false),
      },
      /* ---- Módulo 2 ---- */
      {
        statement: "La inscripción inicial de un prestador en el REPS tiene una vigencia de:",
        explanation:
          "Cuatro años, contados desde que la secretaría registra la inscripción. Después se renueva por periodos de un año, con autoevaluación declarada en el REPS antes de cada vencimiento.",
        options: [
          { text: "Un año", ok: false },
          { text: "Dos años", ok: false },
          { text: "Cuatro años", ok: true },
          { text: "Indefinida, mientras el prestador no cierre", ok: false },
        ],
      },
      {
        statement:
          "Verdadero o falso: si en su autoevaluación el prestador encuentra que un servicio no cumple una condición de habilitación, puede seguir prestándolo mientras la corrige.",
        explanation:
          "Falso. Cuando la autoevaluación muestra el incumplimiento de una o más condiciones, el prestador debe abstenerse de registrar, ofertar y prestar ese servicio hasta cumplirlas.",
        type: "verdadero_falso",
        options: VF(false),
      },
      {
        statement: "Un cuerpo de bomberos con transporte asistencial habilitado incorpora una segunda ambulancia. ¿Qué tipo de novedad debe reportar?",
        explanation:
          "Es una novedad de capacidad instalada: apertura de ambulancias. Se reporta en el REPS ante la secretaría, y la nueva ambulancia debe cumplir los criterios del servicio.",
        options: [
          { text: "Una novedad del prestador", ok: false },
          { text: "Una novedad de la sede", ok: false },
          { text: "Una novedad de capacidad instalada: apertura de ambulancias", ok: true },
          { text: "Ninguna: el servicio ya está habilitado", ok: false },
        ],
      },
      {
        statement: "La fisioterapia que se presta en la casa del paciente corresponde a la modalidad:",
        explanation:
          "Es la modalidad extramural domiciliaria, que se habilita ante cada secretaría de salud donde se oferte. La jornada de salud usa espacios adaptados temporalmente y la telemedicina es atención a distancia.",
        options: [
          { text: "Intramural", ok: false },
          { text: "Extramural domiciliaria", ok: true },
          { text: "Telemedicina interactiva", ok: false },
          { text: "Extramural jornada de salud", ok: false },
        ],
      },
      /* ---- Módulo 3 ---- */
      {
        statement: "¿Cuál de los siguientes NO es uno de los siete estándares de capacidad tecnológica y científica?",
        explanation:
          "La suficiencia patrimonial y financiera es una condición de habilitación, no un estándar. Los siete estándares son talento humano, infraestructura, dotación, medicamentos y dispositivos, procesos prioritarios, historia clínica y registros, e interdependencia.",
        options: [
          { text: "Talento humano", ok: false },
          { text: "Interdependencia", ok: false },
          { text: "Suficiencia patrimonial y financiera", ok: true },
          { text: "Historia clínica y registros", ok: false },
        ],
      },
      {
        statement: "Un profesional independiente de salud que va a habilitar su consultorio debe cumplir:",
        explanation:
          "Al profesional independiente solo le aplica la capacidad tecnológica y científica, es decir, los estándares del servicio. La capacidad técnico-administrativa y la suficiencia patrimonial aplican a otros tipos de prestador.",
        options: [
          { text: "Las tres condiciones de habilitación", ok: false },
          { text: "Solo la capacidad tecnológica y científica", ok: true },
          { text: "Solo la suficiencia patrimonial y financiera", ok: false },
          { text: "Ninguna condición: basta con su tarjeta profesional", ok: false },
        ],
      },
      {
        statement:
          "Verdadero o falso: la secretaría de salud puede aceptar un plan de cumplimiento para habilitar un servicio que todavía no cumple los estándares.",
        explanation:
          "Falso. El Decreto 780 de 2016 establece que los prestadores deben cumplir los estándares de habilitación y que no se aceptan planes de cumplimiento para esos efectos.",
        type: "verdadero_falso",
        options: VF(false),
      },
      {
        statement: "Según el estándar de historia clínica y registros, ¿cuál es la forma correcta de diligenciar la historia clínica?",
        explanation:
          "Se registra en el momento de la atención o inmediatamente después, en forma clara y legible, sin tachones, enmendaduras, espacios en blanco ni siglas, con fecha, hora, nombre completo y firma de quien registra.",
        options: [
          { text: "Al final del turno, con siglas para ahorrar tiempo", ok: false },
          { text: "En el momento de la atención o inmediatamente después, legible, sin siglas ni espacios en blanco, con fecha, hora, nombre completo y firma", ok: true },
          { text: "Solo cuando el paciente la solicite", ok: false },
          { text: "A lápiz, para poder corregirla después", ok: false },
        ],
      },
      /* ---- Módulo 4 ---- */
      {
        statement: "¿En cuál de estos casos se requiere visita de verificación previa?",
        explanation:
          "La visita previa es obligatoria para inscribir una nueva IPS, para pasar un servicio a alta complejidad y para habilitar nuevos servicios de urgencias, atención del parto, transporte asistencial, oncología y alta complejidad.",
        options: [
          { text: "Cuando el prestador cambia sus datos de contacto", ok: false },
          { text: "Cuando se habilita por primera vez un servicio de transporte asistencial", ok: true },
          { text: "Cuando cambia el horario de la consulta externa", ok: false },
          { text: "Cuando se renueva cada año la inscripción", ok: false },
        ],
      },
      {
        statement: "La tripulación mínima de una ambulancia terrestre de transporte asistencial básico (TAB) es:",
        explanation:
          "El TAB terrestre lleva un tecnólogo o técnico profesional en atención prehospitalaria, o un auxiliar de enfermería, con soporte vital básico, y un conductor con licencia y formación en primeros auxilios o primer respondiente. El médico es propio del TAM.",
        options: [
          { text: "Profesional de la medicina, profesional de enfermería y conductor", ok: false },
          { text: "Tecnólogo o técnico profesional en atención prehospitalaria, o auxiliar de enfermería, con soporte vital básico, y conductor con licencia y formación en primeros auxilios o primer respondiente", ok: true },
          { text: "Dos bomberos con curso de primer respondiente", ok: false },
          { text: "Solo un conductor con licencia de conducción vigente", ok: false },
        ],
      },
      {
        statement:
          "Verdadero o falso: los cuerpos de bomberos habilitan su servicio de transporte asistencial en el departamento o distrito donde está la sede que definan, y esa habilitación produce efectos en todo el territorio nacional.",
        explanation:
          "Verdadero. Así lo dispone el artículo 20 de la Resolución 3100 de 2019, modificado por la Resolución 465 de 2025, sin que se requiera inscribirse en cada secretaría donde se preste el servicio.",
        type: "verdadero_falso",
        options: VF(true),
      },
      {
        statement: "Sobre la acreditación en salud, es correcto afirmar que:",
        explanation:
          "La acreditación es voluntaria, comprueba de forma gradual niveles de calidad superiores a los mínimos y exige como condición la certificación de que se cumplen los requisitos mínimos obligatorios. No reemplaza la habilitación.",
        options: [
          { text: "Es obligatoria y reemplaza la habilitación", ok: false },
          { text: "Es voluntaria, busca niveles de calidad superiores y exige primero cumplir los requisitos mínimos obligatorios", ok: true },
          { text: "La otorga la secretaría de salud municipal", ok: false },
          { text: "Solo aplica a los servicios de ambulancia", ok: false },
        ],
      },
    ],
  },
};
