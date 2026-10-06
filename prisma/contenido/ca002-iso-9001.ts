/**
 * CURSO KG-CA-002 · ISO 9001: SISTEMA DE GESTIÓN DE LA CALIDAD
 *
 * Curso completo en formato interactivo (contentType "interactivo"): cuatro
 * módulos de dos lecciones sobre los fundamentos de ISO 9001, sus requisitos
 * (capítulos 4 a 10) y la auditoría interna con apoyo en ISO 19011. Los casos
 * usan tres organizaciones FICTICIAS: una empresa de servicios de mantenimiento
 * (Altavista Servicios S.A.S.), un cuerpo de bomberos (Bomberos Voluntarios de
 * Puerto Esmeralda) y una pequeña fábrica (Metalmecánica Ruiz e Hijos). Los
 * nombres de organizaciones y personas son inventados.
 *
 * BORRADOR redactado por Claude a solicitud de Diego, PENDIENTE DE VALIDACIÓN
 * TÉCNICA por los profesionales de calidad y auditoría de KG antes de certificar
 * a nadie con él.
 *
 * VERSIÓN DE LA NORMA: ISO 9001:2026, publicada por ISO el 16 de septiembre de
 * 2026 (comité ISO/TC 176/SC 2). Reemplaza a ISO 9001:2015 y a su Enmienda
 * 1:2024 (cambio climático en 4.1 y 4.2). Transición según Global ACI (la
 * organización que unió a IAF e ILAC): las organizaciones certificadas con la
 * versión 2015 tienen hasta el 30 de septiembre de 2029; desde el 31 de marzo
 * de 2028 las certificaciones iniciales acreditadas solo se emiten con la 2026.
 * Donde la versión 2026 conserva el contenido de 2015, el curso usa los nombres
 * de capítulos y numerales de la traducción oficial al español de 2015.
 *
 * DERECHOS DE AUTOR: el texto de ISO 9001 está protegido. El curso explica cada
 * requisito con palabras propias y solo cita números y nombres de capítulos. No
 * reproduce texto de la norma.
 *
 * FUENTES CONSULTADAS (octubre de 2026):
 *  - ISO/TC 176/SC 2, "ISO 9001:2026 has been released!" (fecha de publicación,
 *    cambios principales y fechas de transición):
 *    https://committee.iso.org/sites/tc176sc2/home/news/content-left-area/news-and-updates/news-2.html
 *  - ISO/TC 176, misma noticia:
 *    https://committee.iso.org/sites/tc176/home/news/content-left-area/news-and-updates/news.html
 *  - ISO/TC 176/SC 2, avance a FDIS (votación cerrada el 9 de julio de 2026):
 *    https://committee.iso.org/sites/tc176sc2/home/news/content-left-area/news-and-updates/iso-9001-revision-update-4.html
 *  - Global ACI, requisitos de transición Global ACI-TECH-3-TR 2029-09-30 (M):
 *    https://global-aci.org/en/news/global-aci-publishes-transition-requirements-for-iso-90012026/
 *  - Ficha de la norma en iso.org (no se pudo abrir: respondió 403; solo se vio
 *    en buscadores): https://www.iso.org/standard/88464.html
 *  - DNV, cambios cláusula por cláusula:
 *    https://www.dnv.us/assurance/Management-Systems/new-iso/transition/iso-9001-revision/
 *  - DQS: https://www.dqsglobal.com/en/explore/blog/iso-9001-2026-changes-timeline-transition
 *  - Ideagen: https://www.ideagen.com/noram/thought-leadership/blog/iso-9001-2026-is-here
 *  - ISO Managed: https://isomanaged.com/knowledge-base/iso-standards/iso-9001/iso-9001-2026-changes
 *  - Revista AENOR (sobre el borrador DIS):
 *    https://revista.aenor.com/420/iso-90012026-novedades-y-claves-para-la-transicion.html
 *  - ISO 19011:2026 (siete principios de auditoría conservados):
 *    https://certbetter.com/blog/iso-19011-2026-what-changed-from-2018
 *    https://en.wikipedia.org/wiki/ISO_19011
 *  - ISO 9000:2026 (siete principios de la gestión de la calidad conservados):
 *    https://9001-2026.com/blogs/iso-9000-2026-released-what-changed
 *  - Creación de Global ACI (vista en buscador):
 *    https://iaf.nu/en/news/global-accreditation-cooperation-incorporated-launch-unifies-international-accreditation-organisations-and-strengthens-worldwide-trust/
 *
 * PUNTOS QUE KG DEBE CONFIRMAR CONTRA EL TEXTO OFICIAL DE LA NORMA:
 *  1. Títulos oficiales en español de los capítulos y numerales de ISO 9001:2026
 *     (traducción oficial de ISO y, si ya existe, la NTC-ISO 9001:2026 de
 *     ICONTEC). El curso usa los títulos de 2015 donde se supone que no cambian.
 *  2. Los cambios de 2026 que vienen de organismos certificadores (fuentes
 *     secundarias, no del texto oficial): cultura de la calidad y comportamiento
 *     ético en 5.1.1, 7.1.4 y 7.3; división de 6.1 en determinar, abordar
 *     riesgos y abordar oportunidades; refuerzo de 6.3; integración de la
 *     Enmienda 1:2024 en 4.1 y 4.2; decidir qué requisitos de las partes
 *     interesadas atiende el sistema (4.2); cambios en las partes interesadas
 *     como entrada de la revisión por la dirección (9.3.2); capítulo 10 con la
 *     mejora continua en 10.1 (antes 10.1 y 10.3) y la no conformidad y acción
 *     correctiva en 10.2; anexo A ampliado y anexo B eliminado.
 *  3. Que el anexo A de 2026 mantiene la idea de que la norma no impone un
 *     método único de gestión del riesgo (lección 2, lección 4 y pregunta 8).
 *  4. Fechas de transición de Global ACI y cómo las aplica el organismo de
 *     certificación de cada cliente de KG.
 *  5. Ediciones 2026 de ISO 19011 y de ISO 9000, y que ambas conservan los siete
 *     principios de auditoría y los siete principios de la gestión de la calidad
 *     (se confirmó solo con fuentes secundarias).
 *  6. Datos de certificación tomados de ISO/IEC 17021-1 y no de ISO 9001: auditoría
 *     inicial en dos etapas, ciclo de tres años, seguimiento al menos anual y
 *     separación entre consultoría y certificación. También que el ONAC es el
 *     organismo nacional de acreditación en Colombia.
 *  7. Prácticas que NO son requisitos de la norma y se presentan como
 *     herramientas: mapa de procesos estratégicos, misionales, de apoyo y de
 *     evaluación; SIPOC; DOFA y PESTEL; cinco porqués e Ishikawa; la
 *     «observación» como tipo de hallazgo. Ajustar a la metodología de KG.
 *  8. Las cifras de los casos (pedidos, muestras, plazos, metas) son
 *     ilustrativas e inventadas; no son valores de ninguna norma.
 */
import type { CursoInteractivo } from "../cursos-interactivos";

const VF = (ok: boolean) => [
  { text: "Verdadero", ok },
  { text: "Falso", ok: !ok },
];

const ANDRES = { nombre: "Andrés Molina", rol: "Auditor interno de calidad", avatar: "brigadista" as const };

export const ISO_9001: CursoInteractivo = {
  code: "KG-CA-002",
  slug: "iso-9001-gestion-calidad",
  title: "ISO 9001: sistema de gestión de la calidad",
  subtitle:
    "Del contexto a la mejora continua: entienda la versión 2026 de la norma capítulo por capítulo y aprenda a auditar, con casos de una empresa de servicios, un cuerpo de bomberos y una pequeña fábrica.",
  objective:
    "Que el participante comprenda la estructura y los requisitos de ISO 9001:2026 (capítulos 4 a 10), los relacione con los siete principios de la gestión de la calidad, el ciclo PHVA y el pensamiento basado en riesgos, los aplique a los procesos de su organización y participe en auditorías internas con las directrices de ISO 19011, identificando no conformidades y acciones correctivas eficaces.",
  targetAudience:
    "Líderes de proceso, coordinadores de calidad, auditores internos en formación y personal de organizaciones que implementan o mantienen un sistema de gestión de la calidad ISO 9001.",
  requirements:
    "No requiere formación previa en ISO 9001; ayuda conocer los procesos de su organización. El curso no reemplaza la lectura de la norma, que se adquiere ante ISO o el organismo nacional de normalización (en Colombia, ICONTEC), y por sí solo no habilita como auditor: la competencia del auditor interno la define y evalúa cada organización.",
  methodology:
    "100% virtual y en formato de videojuego: mundos y niveles con vidas, XP y estrellas, casos de una empresa de servicios, un cuerpo de bomberos y una pequeña fábrica, decisiones con consecuencias, misiones contra el reloj, una auditoría interna simulada y desafío final.",
  level: "intermedio",
  durationHours: 3,
  categoria: "calidad",
  modules: [
    /* ==================================================================== */
    /*  MÓDULO 1 · FUNDAMENTOS DE ISO 9001                                   */
    /* ==================================================================== */
    {
      title: "Módulo 1. Fundamentos de ISO 9001",
      description:
        "Qué es la norma, cuál es la versión vigente, los siete principios de la gestión de la calidad, el ciclo PHVA, el pensamiento basado en riesgos y el mapa de capítulos.",
      lessons: [
        {
          title: "Qué es ISO 9001 y para qué sirve",
          description:
            "Qué es un sistema de gestión de la calidad, qué versión de la norma está vigente y en qué se diferencia implementar de certificar.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: ANDRES,
            bloques: [
              {
                tipo: "portada",
                titulo: "Qué es ISO 9001 y para qué sirve",
                subtitulo: "Una norma para organizarse de modo que el cliente reciba, una y otra vez, lo que se le prometió.",
                objetivos: [
                  "Explicar qué es un sistema de gestión de la calidad",
                  "Reconocer la versión vigente de ISO 9001 y su periodo de transición",
                  "Distinguir ISO 9001 de otras normas de la familia",
                  "Diferenciar implementar el sistema de certificarlo",
                ],
                minutos: 20,
                dice: "Soy Andrés Molina, auditor interno de calidad. En este curso vamos a recorrer ISO 9001 como se vive en una organización real: con clientes, procesos, errores y mejoras. No se trata de memorizar la norma, sino de entenderla y aplicarla.",
              },
              {
                tipo: "explicacion",
                titulo: "¿Qué es un sistema de gestión de la calidad?",
                parrafos: [
                  "Un sistema de gestión de la calidad (SGC) es la forma en que una organización se organiza para entregar productos y servicios que cumplan lo que el cliente necesita y lo que exige la ley, y para mejorar con el tiempo. Reúne procesos, responsables, recursos, información y controles.",
                  "ISO 9001 es la norma internacional que fija los requisitos de ese sistema. No dice cómo fabricar una pieza ni cómo atender una emergencia: dice qué debe tener resuelto la organización para que sus resultados sean confiables.",
                  "La publica la Organización Internacional de Normalización (ISO) y la redacta el comité técnico ISO/TC 176, subcomité 2. Sirve para cualquier organización, sin importar su tamaño, su sector o si es pública, privada o sin ánimo de lucro.",
                ],
                puntos: [
                  { titulo: "Cliente en el centro", texto: "Todo el sistema gira alrededor de entender lo que el cliente necesita y de cumplírselo." },
                  { titulo: "Resultados repetibles", texto: "Lo que sale bien no depende de la suerte ni de una sola persona: está en los procesos." },
                  { titulo: "Mejora", texto: "El sistema detecta lo que falla y lo corrige desde la causa, no solo en el síntoma." },
                ],
                clave: "ISO 9001 no define la calidad de su producto: le pide que defina, cumpla y mejore lo que le promete a su cliente.",
                dice: "Fíjese: la norma dice qué lograr, no cómo hacerlo. Cada organización decide su manera.",
              },
              {
                tipo: "explicacion",
                titulo: "La versión vigente: ISO 9001:2026",
                parrafos: [
                  "ISO 9001 se publicó por primera vez en 1987 y se ha revisado en 1994, 2000, 2008, 2015 y 2026. La edición vigente es ISO 9001:2026, publicada por ISO el 16 de septiembre de 2026. Reemplaza a ISO 9001:2015 y a su Enmienda 1 de 2024, que había agregado el cambio climático al análisis del contexto.",
                  "Es una evolución, no una norma nueva: conserva la estructura de capítulos, el enfoque a procesos, el ciclo PHVA y el pensamiento basado en riesgos. Cambian la claridad del texto y el énfasis en algunos temas.",
                  "Si su organización está certificada con la versión 2015, no pierde el certificado de un día para otro. Las reglas de transición de Global ACI, la organización internacional que agrupa a los organismos de acreditación, dan plazo hasta el 30 de septiembre de 2029 para pasar a la versión 2026. Desde el 31 de marzo de 2028, las certificaciones iniciales acreditadas solo se otorgan con la versión 2026.",
                ],
                puntos: [
                  { titulo: "Cultura de la calidad y ética", texto: "La alta dirección debe promover de forma explícita una cultura de la calidad y un comportamiento ético, y el personal debe conocerlos." },
                  { titulo: "Riesgos y oportunidades por separado", texto: "La planificación distingue mejor las acciones frente a los riesgos de las acciones para aprovechar las oportunidades." },
                  { titulo: "Cambio climático", texto: "Lo que agregó la Enmienda de 2024 queda integrado: la organización analiza si el cambio climático es pertinente para su contexto y para sus partes interesadas." },
                  { titulo: "Anexo A ampliado", texto: "Un anexo informativo más extenso explica la estructura, los términos y la intención de los requisitos. No agrega obligaciones." },
                ],
                clave: "Organizaciones certificadas con la versión 2015: plazo de transición hasta el 30 de septiembre de 2029.",
                dice: "En este curso trabajamos con la versión 2026. Cuando algo cambió frente a la de 2015, se lo voy a señalar.",
              },
              {
                tipo: "tarjetas",
                titulo: "¿Mito o realidad?",
                instruccion: "Lea cada frase, piense si es mito o realidad y toque la tarjeta para comprobarlo.",
                tarjetas: [
                  {
                    frente: "ISO 9001 es solo para fábricas.",
                    reverso: "Mito. La usan empresas de servicios, hospitales, universidades, entidades públicas y organizaciones de emergencia. Sus requisitos hablan de productos y servicios.",
                  },
                  {
                    frente: "ISO certifica a las empresas.",
                    reverso: "Mito. ISO escribe y publica la norma, pero no certifica a nadie. Certifican organismos de certificación independientes, que a su vez pueden estar acreditados.",
                  },
                  {
                    frente: "Tener ISO 9001 es llenarse de papeles.",
                    reverso: "Mito. La norma pide la información documentada necesaria para que el sistema funcione y para demostrarlo. El exceso de documentos es una decisión de la organización, no un requisito.",
                  },
                  {
                    frente: "Una organización puede aplicar ISO 9001 sin certificarse.",
                    reverso: "Realidad. Muchas la usan como guía para ordenar su gestión. La certificación es voluntaria y suele responder a una exigencia de los clientes o del mercado.",
                  },
                  {
                    frente: "El certificado garantiza que el producto nunca falla.",
                    reverso: "Mito. Demuestra que hay un sistema capaz de cumplir los requisitos y de corregir los errores. Las fallas pueden pasar; lo que importa es cómo se detectan y se tratan.",
                  },
                ],
              },
              {
                tipo: "clasificar",
                titulo: "¿Qué norma consulto?",
                instruccion: "Cada norma de la familia cumple un papel distinto. Toque la que corresponde a cada necesidad.",
                categorias: [
                  { id: "9001", nombre: "ISO 9001", pista: "Requisitos del sistema; es la certificable" },
                  { id: "9000", nombre: "ISO 9000", pista: "Fundamentos y vocabulario" },
                  { id: "19011", nombre: "ISO 19011", pista: "Directrices para auditar" },
                  { id: "9004", nombre: "ISO 9004", pista: "Orientación para el éxito sostenido" },
                ],
                elementos: [
                  { texto: "Saber qué requisitos revisará el auditor del organismo de certificación", categoria: "9001" },
                  {
                    texto: "Consultar qué significa exactamente «no conformidad» o «parte interesada»",
                    categoria: "9000",
                    porque: "ISO 9000 reúne los conceptos y las definiciones que usa toda la familia de normas.",
                  },
                  {
                    texto: "Preparar el programa de auditorías internas y definir la competencia de los auditores",
                    categoria: "19011",
                    porque: "ISO 19011 orienta la auditoría de cualquier sistema de gestión. Es una guía: nadie se certifica en ella.",
                  },
                  { texto: "Ir más allá de los requisitos y evaluar la madurez de la organización", categoria: "9004" },
                  {
                    texto: "Conocer los siete principios de la gestión de la calidad",
                    categoria: "9000",
                    porque: "Los principios se describen en ISO 9000, y ISO 9001 se apoya en ellos.",
                  },
                  { texto: "Saber qué debe tener el sistema para poder certificarlo", categoria: "9001" },
                  { texto: "Planear cómo entrevistar y tomar muestras de evidencia en una auditoría", categoria: "19011" },
                ],
              },
              {
                tipo: "decision",
                titulo: "¿Les sirve a los bomberos?",
                situacion:
                  "La comandante Liliana Patiño, de los Bomberos Voluntarios de Puerto Esmeralda, quiere ordenar la atención de emergencias, el mantenimiento de las máquinas y las inspecciones a los comercios. Un miembro de la junta opina que ISO 9001 «es para empresas que venden cosas».",
                pregunta: "¿Qué le responde usted?",
                opciones: [
                  {
                    texto: "Que ISO 9001 sirve para cualquier organización que preste servicios, también sin ánimo de lucro: sus clientes son la comunidad, los comercios inspeccionados y quienes llaman en una emergencia",
                    correcta: true,
                    retro: "Exacto. La norma es genérica: aplica a cualquier organización que quiera cumplir los requisitos de quienes reciben sus servicios y mejorar.",
                  },
                  {
                    texto: "Que tiene razón: un cuerpo de bomberos no tiene clientes, así que la norma no le aplica",
                    retro: "Toda organización tiene a alguien que recibe sus servicios y espera algo de ellos. Para los bomberos, la comunidad y las personas atendidas son sus clientes.",
                  },
                  {
                    texto: "Que solo le aplicaría si cobrara por todos sus servicios",
                    retro: "El cobro no define si la norma aplica. Lo que importa es que la organización entregue servicios que deben cumplir requisitos.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Implementar no es lo mismo que certificar",
                parrafos: [
                  "Implementar es construir el sistema y hacerlo funcionar: definir procesos, responsables, controles e indicadores, y usarlos todos los días. Es trabajo de la propia organización.",
                  "Certificar es pedirle a un organismo de certificación independiente que audite el sistema y, si cumple, emita un certificado. En Colombia, el organismo nacional de acreditación es el ONAC, que evalúa que los organismos de certificación sean competentes e imparciales.",
                  "La certificación inicial se hace en dos etapas: primero se revisa si el sistema está listo y después se audita cómo funciona. El certificado tiene un ciclo de tres años, con auditorías de seguimiento al menos una vez al año y una auditoría de renovación antes de que venza.",
                ],
                puntos: [
                  { titulo: "Implementar", texto: "Lo hace la organización. Es indispensable para certificarse, pero se puede hacer sin certificarse." },
                  { titulo: "Certificar", texto: "Lo hace un tercero independiente. Es voluntario y demuestra el cumplimiento ante clientes y mercados." },
                  { titulo: "Asesorar", texto: "Una consultora puede acompañar la implementación, pero quien asesora no puede certificar ese mismo sistema: se perdería la imparcialidad." },
                ],
                clave: "Primero se implementa y se usa el sistema; después se certifica. Un certificado sin un sistema que funcione es un papel en la pared.",
              },
              {
                tipo: "contrarreloj",
                titulo: "¿Quién emite el certificado?",
                segundos: 20,
                situacion:
                  "Metalmecánica Ruiz e Hijos ya implementó su sistema. Un cliente grande le exige el certificado ISO 9001 para seguir comprándole, y don Jaime Ruiz pregunta a quién debe pedírselo.",
                pregunta: "¿Qué le contesta?",
                opciones: [
                  {
                    texto: "A un organismo de certificación independiente, preferiblemente acreditado",
                    correcta: true,
                    retro: "Correcto. ISO no certifica, y la acreditación da confianza en que el organismo es competente e imparcial.",
                  },
                  {
                    texto: "A ISO, en Ginebra",
                    retro: "ISO publica la norma, pero no audita ni certifica a ninguna organización.",
                  },
                  {
                    texto: "A la consultora que le ayudó a implementar el sistema",
                    retro: "Quien asesoró no puede certificar: perdería la imparcialidad. La certificación la hace un tercero independiente.",
                  },
                ],
                alAgotar: "Don Jaime sigue esperando. Recuerde: ISO publica la norma, el organismo de certificación audita y certifica, y el ONAC acredita a los organismos en Colombia.",
              },
              {
                tipo: "ordenar",
                titulo: "El camino hacia la certificación",
                instruccion: "Ordene las etapas típicas, desde la decisión de la dirección hasta el certificado.",
                pasos: [
                  "La alta dirección decide implementar el sistema y asigna recursos",
                  "Se analizan el contexto, las partes interesadas y el alcance",
                  "Se definen los procesos, sus controles, sus indicadores y la información documentada necesaria",
                  "El sistema funciona en la práctica y genera registros",
                  "Se hacen la auditoría interna y la revisión por la dirección",
                  "El organismo de certificación hace la auditoría en dos etapas",
                  "Se atienden los hallazgos y el organismo decide otorgar el certificado",
                ],
                explicacion:
                  "Así es. El organismo de certificación espera encontrar un sistema que ya funciona, con la auditoría interna y la revisión por la dirección hechas. Después del certificado vienen las auditorías de seguimiento cada año.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Un SGC es la manera en que la organización se organiza para cumplirle al cliente y mejorar.",
                  "ISO 9001 fija requisitos; no dice cómo hacer su producto o servicio.",
                  "La versión vigente es ISO 9001:2026 (16 de septiembre de 2026). Quienes están certificados con la de 2015 tienen hasta el 30 de septiembre de 2029 para la transición.",
                  "ISO publica, el organismo de certificación certifica y el ONAC acredita en Colombia.",
                  "Primero se implementa; la certificación es voluntaria.",
                ],
                insignia: "Primer paso en calidad",
                cierre: "En la próxima lección verá los siete principios que sostienen la norma, el ciclo PHVA y el pensamiento basado en riesgos.",
              },
            ],
          },
        },
        {
          title: "Principios, ciclo PHVA y pensamiento basado en riesgos",
          description:
            "Los siete principios de la gestión de la calidad, el ciclo Planificar-Hacer-Verificar-Actuar, el pensamiento basado en riesgos y el mapa de capítulos de la norma.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: ANDRES,
            bloques: [
              {
                tipo: "portada",
                titulo: "Los cimientos de la norma",
                subtitulo: "Siete principios, un ciclo y una forma de pensar: con eso se lee toda ISO 9001.",
                objetivos: [
                  "Explicar los siete principios de la gestión de la calidad",
                  "Aplicar el ciclo PHVA a un proceso real",
                  "Entender qué es el pensamiento basado en riesgos",
                  "Ubicar los capítulos 4 a 10 de la norma",
                ],
                minutos: 20,
                dice: "Si entiende esta lección, el resto de la norma se vuelve lógico. Cada requisito sale de aquí.",
              },
              {
                tipo: "explicacion",
                titulo: "Los siete principios de la gestión de la calidad",
                parrafos: [
                  "Los principios están descritos en ISO 9000, la norma de fundamentos y vocabulario, que en su edición de 2026 los conserva. No se auditan uno por uno, pero cada requisito de ISO 9001 se apoya en ellos.",
                ],
                puntos: [
                  { titulo: "Enfoque al cliente", texto: "Entender y cumplir lo que el cliente necesita, y procurar superar sus expectativas." },
                  { titulo: "Liderazgo", texto: "Los líderes fijan el rumbo y crean las condiciones para que las personas se comprometan con los objetivos de calidad." },
                  { titulo: "Compromiso de las personas", texto: "Personas competentes, reconocidas y con autoridad para actuar son las que hacen funcionar el sistema." },
                  { titulo: "Enfoque a procesos", texto: "Los resultados son más predecibles cuando las actividades se gestionan como procesos conectados entre sí." },
                  { titulo: "Mejora", texto: "Las organizaciones que tienen éxito mejoran de forma permanente." },
                  { titulo: "Toma de decisiones basada en la evidencia", texto: "Las decisiones aciertan más cuando se apoyan en datos e información analizados." },
                  { titulo: "Gestión de las relaciones", texto: "Cuidar la relación con proveedores, aliados y demás partes interesadas sostiene los resultados." },
                ],
                clave: "Los principios no se auditan uno por uno, pero se notan: o se viven en la operación diaria, o el sistema es solo papel.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Qué principio se está aplicando?",
                instruccion: "Lea cada práctica y toque el principio que mejor la representa.",
                categorias: [
                  { id: "cliente", nombre: "Enfoque al cliente", pista: "Lo que el cliente necesita" },
                  { id: "procesos", nombre: "Enfoque a procesos", pista: "Actividades conectadas" },
                  { id: "evidencia", nombre: "Decisiones basadas en la evidencia", pista: "Datos antes de decidir" },
                  { id: "relaciones", nombre: "Gestión de las relaciones", pista: "Proveedores y aliados" },
                ],
                elementos: [
                  {
                    texto: "Altavista Servicios llama a cada cliente una semana después del mantenimiento para saber si el equipo quedó funcionando bien",
                    categoria: "cliente",
                  },
                  {
                    texto: "Los bomberos revisan los tiempos de respuesta del último año antes de decidir dónde ubicar una nueva estación",
                    categoria: "evidencia",
                    porque: "La decisión se apoya en datos analizados, no en la intuición.",
                  },
                  {
                    texto: "La metalmecánica se reúne cada trimestre con su proveedor de acero para revisar entregas y calidad del material",
                    categoria: "relaciones",
                  },
                  {
                    texto: "Compras sabe qué necesita producción, cuándo y con qué especificaciones, porque sus procesos están conectados",
                    categoria: "procesos",
                    porque: "La salida de un proceso es la entrada de otro: gestionarlos conectados evita errores en el traspaso.",
                  },
                  {
                    texto: "Antes de cambiar el horario de atención, Altavista pregunta a sus clientes principales qué les sirve más",
                    categoria: "cliente",
                  },
                  {
                    texto: "La gerencia decide renovar una máquina después de comparar seis meses de datos de paradas y desperdicio",
                    categoria: "evidencia",
                  },
                  {
                    texto: "La comandante define qué información pasa la guardia saliente a la entrante, para que nada se pierda en el cambio de turno",
                    categoria: "procesos",
                  },
                  {
                    texto: "Altavista y su proveedor de repuestos acuerdan un inventario mínimo para los equipos más críticos de sus clientes",
                    categoria: "relaciones",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "El ciclo PHVA",
                parrafos: [
                  "El ciclo Planificar-Hacer-Verificar-Actuar (PHVA) es la lógica con la que funciona todo el sistema y también cada proceso por separado.",
                  "Planificar es fijar objetivos, identificar riesgos y oportunidades y decidir los recursos. Hacer es ejecutar lo planificado. Verificar es medir y comparar los resultados con lo planificado. Actuar es corregir y mejorar lo necesario para empezar una nueva vuelta.",
                ],
                puntos: [
                  { titulo: "Planificar · capítulo 6", texto: "Riesgos, oportunidades, objetivos y cambios." },
                  { titulo: "Hacer · capítulos 7 y 8", texto: "Apoyo (recursos, competencia, documentos) y operación." },
                  { titulo: "Verificar · capítulo 9", texto: "Seguimiento, medición, auditoría interna y revisión por la dirección." },
                  { titulo: "Actuar · capítulo 10", texto: "No conformidades, acciones correctivas y mejora continua." },
                  { titulo: "En el centro · capítulos 4 y 5", texto: "El contexto y las partes interesadas dan las entradas; el liderazgo mueve todo el ciclo." },
                ],
                clave: "PHVA no es un trámite que se hace una vez al año: es la forma de gestionar cada proceso todos los días.",
              },
              {
                tipo: "ordenar",
                titulo: "PHVA en la estación de bomberos",
                instruccion:
                  "Los Bomberos de Puerto Esmeralda quieren reducir el tiempo que tarda la máquina en salir después de una llamada. Ordene las acciones según el ciclo PHVA.",
                pasos: [
                  "Fijar una meta de tiempo de salida y analizar qué demora hoy la salida",
                  "Reorganizar la ubicación de los equipos de protección y entrenar al personal en la nueva rutina",
                  "Medir durante dos meses el tiempo real de salida en cada emergencia",
                  "Comparar los resultados con la meta e identificar los turnos donde no se cumplió",
                  "Ajustar la rutina donde no funcionó y dejarla establecida en el procedimiento",
                ],
                explicacion:
                  "Exacto: planificar (meta y análisis), hacer (reorganizar y entrenar), verificar (medir y comparar) y actuar (ajustar y estandarizar). Con eso empieza otra vuelta del ciclo.",
              },
              {
                tipo: "explicacion",
                titulo: "Pensamiento basado en riesgos",
                parrafos: [
                  "Pensar con base en riesgos es preguntarse, antes de actuar, qué podría salir mal y qué podría salir mejor, para prepararse. Es lo que hace un buen jefe de turno sin necesidad de un formato.",
                  "ISO 9001 integra esta forma de pensar en todo el sistema: al planificar, al diseñar los procesos, al elegir proveedores y al revisar resultados. La versión 2026 distingue con más claridad los riesgos (efectos negativos posibles) de las oportunidades (posibilidades de mejorar o crecer).",
                  "La norma no impone un método único de gestión del riesgo ni una matriz específica. Cada organización elige una forma proporcional a su tamaño y a la importancia de cada proceso.",
                ],
                puntos: [
                  { titulo: "Riesgo", texto: "Algo que podría afectar el cumplimiento: un proveedor que se atrasa, un equipo sin mantenimiento, una persona clave que se va." },
                  { titulo: "Oportunidad", texto: "Algo que podría mejorar los resultados: una tecnología nueva, un cliente nuevo, una alianza." },
                  { titulo: "Proporcional", texto: "Más análisis donde hay más impacto. No todo merece el mismo esfuerzo." },
                ],
                clave: "Prevenir es más barato que corregir. Desde 2015, el pensamiento basado en riesgos ocupa el lugar de la antigua «acción preventiva»: ya no es un formulario, es una forma de trabajar.",
              },
              {
                tipo: "decision",
                titulo: "El técnico estrella",
                situacion:
                  "En Altavista Servicios, un solo técnico sabe reparar los equipos de refrigeración de las dos clínicas que son sus clientes más grandes. Ese técnico está pensando en renunciar.",
                pregunta: "Con pensamiento basado en riesgos, ¿qué conviene hacer?",
                opciones: [
                  {
                    texto: "Reconocerlo como un riesgo para el servicio y planear acciones: documentar lo que sabe y formar a otro técnico",
                    correcta: true,
                    retro: "Muy bien. Se identifica el riesgo antes de que se materialice y se actúa de forma proporcional: el impacto sobre los clientes principales es alto.",
                  },
                  {
                    texto: "Esperar a ver si renuncia y, si lo hace, buscar un reemplazo",
                    retro: "Eso es reaccionar cuando el problema ya ocurrió. Mientras se consigue y se forma a alguien, las clínicas quedan sin servicio.",
                  },
                  {
                    texto: "Hacer primero una matriz de riesgos de todos los cargos de la empresa y actuar después",
                    retro: "Analizar está bien, pero este riesgo ya es evidente y urgente. El esfuerzo se concentra donde está el mayor impacto.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "El mapa de la norma: capítulos 1 a 10",
                parrafos: [
                  "ISO 9001 sigue la estructura armonizada que comparten las normas ISO de sistemas de gestión, como ISO 14001 (ambiental) e ISO 45001 (seguridad y salud en el trabajo). Por eso sus capítulos tienen los mismos números y nombres, y se pueden integrar en un solo sistema.",
                ],
                puntos: [
                  { titulo: "1 a 3 · Introductorios", texto: "Objeto y campo de aplicación, referencias normativas, y términos y definiciones. No traen requisitos para auditar." },
                  { titulo: "4 · Contexto de la organización", texto: "Entorno, partes interesadas, alcance y procesos." },
                  { titulo: "5 · Liderazgo", texto: "Compromiso de la dirección, política y roles." },
                  { titulo: "6 · Planificación", texto: "Riesgos, oportunidades, objetivos y cambios." },
                  { titulo: "7 · Apoyo", texto: "Recursos, competencia, toma de conciencia, comunicación e información documentada." },
                  { titulo: "8 · Operación", texto: "Desde los requisitos del cliente hasta la entrega y el control de lo que sale mal." },
                  { titulo: "9 · Evaluación del desempeño", texto: "Seguimiento, medición, auditoría interna y revisión por la dirección." },
                  { titulo: "10 · Mejora", texto: "No conformidades, acciones correctivas y mejora continua." },
                ],
                clave: "Los requisitos que se auditan están en los capítulos 4 a 10.",
              },
              {
                tipo: "clasificar",
                titulo: "¿En qué parte del PHVA está?",
                instruccion: "Ubique cada actividad de la metalmecánica en la etapa del ciclo que le corresponde.",
                categorias: [
                  { id: "planificar", nombre: "Planificar (cap. 6)", pista: "Antes de hacer" },
                  { id: "hacer", nombre: "Hacer (caps. 7 y 8)", pista: "Apoyo y operación" },
                  { id: "verificar", nombre: "Verificar (cap. 9)", pista: "Medir y auditar" },
                  { id: "actuar", nombre: "Actuar (cap. 10)", pista: "Corregir y mejorar" },
                ],
                elementos: [
                  { texto: "Fijar el objetivo de reducir las piezas devueltas por los clientes", categoria: "planificar" },
                  {
                    texto: "Capacitar al nuevo soldador",
                    categoria: "hacer",
                    porque: "La competencia del personal hace parte del apoyo (capítulo 7).",
                  },
                  { texto: "Fabricar el pedido según el plano del cliente", categoria: "hacer" },
                  { texto: "Hacer la auditoría interna del proceso de producción", categoria: "verificar" },
                  { texto: "Medir cada mes el porcentaje de entregas a tiempo", categoria: "verificar" },
                  {
                    texto: "Buscar la causa de un lote rechazado y eliminarla",
                    categoria: "actuar",
                    porque: "Tratar la no conformidad y su causa corresponde al capítulo 10.",
                  },
                  { texto: "Identificar qué pasaría si el único proveedor de lámina deja de venderle", categoria: "planificar" },
                  { texto: "Cambiar el método de corte porque la auditoría mostró un desperdicio alto", categoria: "actuar" },
                ],
              },
              {
                tipo: "contrarreloj",
                titulo: "¿Riesgo u oportunidad?",
                segundos: 15,
                situacion:
                  "Un hospital cercano le pide a Altavista Servicios cotizar el mantenimiento de todos sus equipos de aire acondicionado. Es un contrato que duplicaría el tamaño de la empresa.",
                pregunta: "¿Cómo lo trata en la planificación?",
                opciones: [
                  {
                    texto: "Como una oportunidad, analizando también los riesgos de asumirla: personal, repuestos y tiempos de respuesta",
                    correcta: true,
                    retro: "Correcto. Es una oportunidad de crecer, y aprovecharla bien exige mirar los riesgos que trae. La versión 2026 pide planificar acciones para ambos.",
                  },
                  {
                    texto: "Como un riesgo que hay que evitar, porque es demasiado grande",
                    retro: "Descartarlo sin analizar es perder una oportunidad. Lo sensato es evaluar si puede cumplir y qué necesitaría.",
                  },
                  {
                    texto: "No es tema del sistema de calidad: es una decisión comercial",
                    retro: "Un contrato así afecta la capacidad de cumplirles a todos los clientes. Por eso sí entra en la planificación del sistema.",
                  },
                ],
                alAgotar: "El hospital no espera para siempre. Una oportunidad se analiza con sus riesgos, pero se analiza a tiempo.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Siete principios: enfoque al cliente, liderazgo, compromiso de las personas, enfoque a procesos, mejora, decisiones basadas en la evidencia y gestión de las relaciones.",
                  "PHVA: planificar (cap. 6), hacer (caps. 7 y 8), verificar (cap. 9) y actuar (cap. 10), con el contexto y el liderazgo en el centro.",
                  "Pensar con base en riesgos es prepararse para lo que puede salir mal y para lo que puede salir mejor.",
                  "Los requisitos auditables están en los capítulos 4 a 10.",
                ],
                insignia: "Arquitecto del sistema",
                cierre: "En el próximo módulo entrará al capítulo 4: el contexto, las partes interesadas, el alcance y los procesos.",
              },
            ],
          },
        },
      ],
    },

    /* ==================================================================== */
    /*  MÓDULO 2 · CONTEXTO, LIDERAZGO Y PLANIFICACIÓN                       */
    /* ==================================================================== */
    {
      title: "Módulo 2. Contexto, liderazgo y planificación",
      description:
        "Capítulos 4, 5 y 6: entender el entorno, definir el alcance, gestionar por procesos, comprometer a la dirección y planificar riesgos, oportunidades, objetivos y cambios.",
      lessons: [
        {
          title: "Contexto, partes interesadas, alcance y procesos",
          description:
            "Cuestiones internas y externas, partes interesadas y sus requisitos, el alcance del sistema y el enfoque a procesos (capítulo 4).",
          durationMin: 22,
          contenido: {
            version: 1,
            guia: ANDRES,
            bloques: [
              {
                tipo: "portada",
                titulo: "El capítulo 4: saber dónde está parado",
                subtitulo: "Antes de organizar procesos, la organización tiene que entender su entorno y a quién le responde.",
                objetivos: [
                  "Identificar cuestiones internas y externas del contexto, incluido el cambio climático",
                  "Determinar las partes interesadas pertinentes y sus requisitos",
                  "Definir el alcance del sistema y justificar lo que no aplica",
                  "Describir un proceso con sus entradas, salidas, controles e indicadores",
                ],
                minutos: 22,
                dice: "Un sistema copiado de otra empresa no funciona. El capítulo 4 es el que lo vuelve suyo.",
              },
              {
                tipo: "explicacion",
                titulo: "4.1 Comprensión de la organización y de su contexto",
                parrafos: [
                  "La organización identifica las cuestiones externas e internas que influyen en su propósito, en su dirección estratégica y en su capacidad de lograr los resultados que espera del sistema. Y les hace seguimiento, porque el entorno cambia.",
                  "Desde la Enmienda de 2024, ahora integrada en la versión 2026, la organización también debe preguntarse si el cambio climático es una cuestión pertinente para ella. La respuesta puede ser sí o no, pero tiene que haberse analizado.",
                ],
                puntos: [
                  { titulo: "Externas", texto: "Mercado, competencia, leyes, economía, tecnología, clima, orden público y cultura de la región." },
                  { titulo: "Internas", texto: "Valores, cultura, conocimientos, desempeño, infraestructura, finanzas y personal." },
                  { titulo: "Cambio climático", texto: "Lluvias, sequías, olas de calor o exigencias de los clientes sobre el tema pueden afectar la operación." },
                ],
                clave: "La norma no impone una herramienta para el contexto: puede usar una matriz DOFA, un análisis PESTEL u otra. Lo que se audita es que la organización conozca sus cuestiones y las use al planificar.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Cuestión interna o externa?",
                instruccion: "Ubique cada cuestión del contexto de los Bomberos Voluntarios de Puerto Esmeralda.",
                categorias: [
                  { id: "interna", nombre: "Interna", pista: "Depende de la propia organización" },
                  { id: "externa", nombre: "Externa", pista: "Viene del entorno" },
                ],
                elementos: [
                  {
                    texto: "Temporadas de lluvias más intensas que aumentan las inundaciones en el municipio",
                    categoria: "externa",
                    porque: "Es un efecto del clima en el entorno: aquí entra el análisis del cambio climático.",
                  },
                  { texto: "Dos máquinas extintoras con muchos años de uso y fallas frecuentes", categoria: "interna" },
                  { texto: "Cambios en la reglamentación que deben aplicar en las inspecciones a establecimientos", categoria: "externa" },
                  { texto: "Alta rotación de voluntarios jóvenes", categoria: "interna" },
                  { texto: "Crecimiento de barrios en zonas de ladera", categoria: "externa" },
                  {
                    texto: "La experiencia acumulada de los bomberos más antiguos",
                    categoria: "interna",
                    porque: "El conocimiento de la organización es una cuestión interna, y perderlo es un riesgo.",
                  },
                  { texto: "Recortes en los recursos que transfiere el municipio", categoria: "externa" },
                  { texto: "Un software de despacho que se cae con frecuencia", categoria: "interna" },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "4.2 Las partes interesadas",
                parrafos: [
                  "Una parte interesada es cualquier persona u organización que puede afectar a la organización, verse afectada por sus decisiones o creer que lo está. No todas son pertinentes para el sistema de calidad: hay que identificar las que sí lo son y qué requisitos tienen.",
                  "La organización decide cuáles de esos requisitos atenderá por medio del sistema y les hace seguimiento. Con la versión 2026 también se tiene presente que algunas partes interesadas pueden tener requisitos relacionados con el cambio climático.",
                ],
                puntos: [
                  { titulo: "Cliente", texto: "Quien recibe el producto o servicio. Puede ser una persona, una empresa o la comunidad." },
                  { titulo: "Personal", texto: "Necesita instrucciones claras, formación y recursos para cumplir." },
                  { titulo: "Proveedores", texto: "Necesitan pedidos claros y pagos a tiempo para entregar bien." },
                  { titulo: "Autoridades", texto: "Exigen el cumplimiento de leyes y reglamentos." },
                  { titulo: "Comunidad y dueños", texto: "Esperan un servicio confiable, sostenibilidad y buena reputación." },
                ],
                clave: "No se trata de complacer a todo el mundo: se identifican las partes pertinentes, sus requisitos y cuáles de ellos atenderá el sistema.",
              },
              {
                tipo: "tarjetas",
                titulo: "¿Qué espera cada parte interesada?",
                instruccion: "Caso Altavista Servicios. Toque cada parte interesada para ver un requisito pertinente para su sistema de calidad.",
                tarjetas: [
                  {
                    etiqueta: "Cliente",
                    frente: "La clínica que contrata el mantenimiento",
                    reverso: "Que los equipos de las salas críticas no fallen y que, si fallan, el técnico llegue en el tiempo pactado en el contrato.",
                  },
                  {
                    etiqueta: "Personal",
                    frente: "Los técnicos de campo",
                    reverso: "Herramientas en buen estado, órdenes de trabajo claras y formación en los equipos nuevos.",
                  },
                  {
                    etiqueta: "Proveedor",
                    frente: "El distribuidor de repuestos",
                    reverso: "Pedidos con la referencia correcta y con la anticipación suficiente para conseguir los repuestos.",
                  },
                  {
                    etiqueta: "Autoridad",
                    frente: "Las autoridades ambientales y laborales",
                    reverso: "Manejo adecuado de los gases refrigerantes y cumplimiento de la normativa laboral y de seguridad y salud en el trabajo.",
                  },
                  {
                    etiqueta: "Socios",
                    frente: "Los dueños de la empresa",
                    reverso: "Que la empresa sea rentable, conserve sus clientes y mantenga su buena reputación.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "4.3 El alcance del sistema",
                parrafos: [
                  "El alcance dice qué cubre el sistema: qué productos y servicios, en qué sedes y con qué procesos. Para definirlo se tienen en cuenta las cuestiones del contexto, los requisitos de las partes interesadas y los productos y servicios de la organización.",
                  "Todo requisito de la norma que aplique dentro del alcance se debe cumplir. Si la organización considera que alguno no aplica, debe justificarlo, y solo puede hacerlo si eso no afecta su capacidad ni su responsabilidad de entregar productos y servicios conformes y de lograr la satisfacción del cliente. El alcance se mantiene como información documentada.",
                ],
                puntos: [
                  { titulo: "Sí se puede", texto: "Una empresa que fabrica exactamente según los planos del cliente puede justificar que el diseño y desarrollo (8.3) no le aplica." },
                  { titulo: "No se puede", texto: "Dejar por fuera un proceso que sí se hace solo porque no está ordenado o porque «da mucho trabajo»." },
                  { titulo: "Cuidado con recortar", texto: "Un alcance demasiado estrecho puede dejar por fuera justo lo que al cliente le importa." },
                ],
                clave: "«No aplica» no es lo mismo que «no lo quiero auditar»: tiene que haber una razón y no puede afectar al cliente.",
              },
              {
                tipo: "decision",
                titulo: "¿Se puede dejar por fuera?",
                situacion:
                  "Metalmecánica Ruiz e Hijos fabrica soportes con planos que le envían sus clientes. Pero desde hace un año también diseña, con su propio ingeniero, una línea de estanterías que vende con su marca. Don Jaime propone declarar que el diseño y desarrollo no aplica «para no complicarse».",
                pregunta: "¿Qué le recomienda?",
                opciones: [
                  {
                    texto: "Que el diseño sí aplica a las estanterías propias y debe incluirlo, porque de él depende que cumplan lo que el cliente espera",
                    correcta: true,
                    retro: "Correcto. Hay diseño real y afecta la conformidad del producto. Un requisito solo se declara no aplicable si eso no afecta la conformidad ni la satisfacción del cliente.",
                  },
                  {
                    texto: "Que puede excluirlo sin problema, porque el diseño lo hace una sola persona",
                    retro: "El tamaño del equipo no cambia nada. Si la empresa diseña, el requisito aplica.",
                  },
                  {
                    texto: "Que basta con no mencionar las estanterías en el alcance para que el auditor no las vea",
                    retro: "Ocultar una línea de productos que se vende es engañar al cliente y al organismo de certificación. Además, es justo donde están los riesgos del diseño.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "4.4 El enfoque a procesos",
                parrafos: [
                  "Un proceso es un conjunto de actividades que transforma entradas en salidas, como «atender una emergencia» o «hacer mantenimiento preventivo». El sistema se construye con los procesos que la organización necesita y con la forma en que se conectan.",
                  "Para cada proceso, la organización determina qué recibe y qué entrega, cómo se relaciona con los demás, con qué criterios se controla, qué recursos usa, quién responde, qué riesgos y oportunidades tiene, cómo se mide y cómo se mejora.",
                  "En Colombia es común agrupar los procesos en un mapa de estratégicos, misionales, de apoyo y de evaluación. La norma no exige esa clasificación ni un mapa en particular, pero es una buena forma de ver el sistema completo.",
                ],
                puntos: [
                  { titulo: "Entradas y salidas", texto: "Lo que el proceso recibe y lo que entrega, y a quién." },
                  { titulo: "Responsable", texto: "Una persona que responde por que el proceso logre sus resultados." },
                  { titulo: "Criterios y controles", texto: "Cómo se sabe que el proceso se hizo bien." },
                  { titulo: "Indicadores", texto: "Cómo se mide su desempeño." },
                  { titulo: "Información documentada", texto: "La necesaria para operar el proceso y para confiar en que se hizo como se planificó." },
                ],
                clave: "El cliente no ve departamentos: ve el resultado de procesos que se pasan el trabajo entre sí.",
              },
              {
                tipo: "clasificar",
                titulo: "El mapa de procesos de los bomberos",
                instruccion: "Ubique cada proceso de los Bomberos de Puerto Esmeralda en el grupo que le corresponde, según la clasificación habitual.",
                categorias: [
                  { id: "estrategico", nombre: "Estratégico", pista: "Da el rumbo" },
                  { id: "misional", nombre: "Misional", pista: "Entrega el servicio a la comunidad" },
                  { id: "apoyo", nombre: "De apoyo", pista: "Da los recursos" },
                  { id: "evaluacion", nombre: "De evaluación", pista: "Mide y mejora" },
                ],
                elementos: [
                  { texto: "Direccionamiento estratégico y planeación anual", categoria: "estrategico" },
                  { texto: "Atención de incendios y rescates", categoria: "misional" },
                  {
                    texto: "Inspecciones de seguridad a establecimientos",
                    categoria: "misional",
                    porque: "Es un servicio que la comunidad y los comercios reciben directamente.",
                  },
                  { texto: "Capacitación a la comunidad en prevención", categoria: "misional" },
                  { texto: "Mantenimiento de máquinas y equipos", categoria: "apoyo" },
                  { texto: "Gestión del talento humano y de los voluntarios", categoria: "apoyo" },
                  { texto: "Compras y almacén", categoria: "apoyo" },
                  { texto: "Auditoría interna y seguimiento a indicadores", categoria: "evaluacion" },
                ],
              },
              {
                tipo: "ordenar",
                titulo: "Así se describe un proceso",
                instruccion:
                  "Altavista describe su proceso de mantenimiento preventivo. Ordene los elementos desde quien entrega lo necesario hasta quien recibe el resultado.",
                pasos: [
                  "Proveedor: el área comercial entrega el contrato y el cronograma del cliente",
                  "Entrada: la orden de trabajo con los equipos que se deben revisar",
                  "Actividades: el técnico inspecciona, limpia, ajusta y prueba cada equipo",
                  "Salida: el equipo funcionando y el informe de mantenimiento firmado",
                  "Cliente: la clínica, que recibe el equipo y el informe",
                ],
                explicacion:
                  "Así es: proveedor, entradas, actividades, salidas y cliente. Esta forma de describir procesos, conocida como SIPOC, no la exige la norma, pero ayuda a ver dónde se conecta un proceso con otro y dónde se pierde información.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "4.1: conozca sus cuestiones internas y externas y analice si el cambio climático es pertinente.",
                  "4.2: identifique las partes interesadas pertinentes, sus requisitos y cuáles atenderá el sistema.",
                  "4.3: el alcance dice qué cubre el sistema; lo que no aplique se justifica y no puede afectar al cliente.",
                  "4.4: el sistema se construye con procesos conectados, cada uno con entradas, salidas, responsable, controles e indicadores.",
                ],
                insignia: "Lector del contexto",
                cierre: "En la próxima lección verá el papel de la alta dirección y cómo se planifican los riesgos, las oportunidades, los objetivos y los cambios.",
              },
            ],
          },
        },
        {
          title: "Liderazgo y planificación",
          description:
            "Compromiso de la alta dirección, cultura de la calidad, política y roles (capítulo 5); riesgos y oportunidades, objetivos de la calidad y planificación de los cambios (capítulo 6).",
          durationMin: 22,
          contenido: {
            version: 1,
            guia: ANDRES,
            bloques: [
              {
                tipo: "portada",
                titulo: "Liderazgo y planificación",
                subtitulo: "La calidad no se delega en un coordinador: la dirige la alta dirección y se planifica con objetivos claros.",
                objetivos: [
                  "Reconocer las responsabilidades de la alta dirección, incluidas la cultura de la calidad y el comportamiento ético",
                  "Evaluar si una política de la calidad cumple su función",
                  "Distinguir las acciones frente a los riesgos de las acciones para aprovechar oportunidades",
                  "Formular objetivos de la calidad medibles y planificar los cambios",
                ],
                minutos: 22,
                dice: "En mis auditorías, la primera conversación con la gerencia casi siempre revela cómo está el sistema.",
              },
              {
                tipo: "explicacion",
                titulo: "5.1 Liderazgo y compromiso",
                parrafos: [
                  "La alta dirección es la persona o el grupo que dirige y controla la organización al más alto nivel: el gerente, la junta, la comandancia. Responde por la eficacia del sistema, y esa responsabilidad no se delega.",
                  "Debe asegurarse de que la política y los objetivos sean coherentes con el contexto y la estrategia, de que los requisitos del sistema se integren en los procesos del negocio, de que haya recursos y de que las personas entiendan por qué es importante cumplir. También promueve el enfoque a procesos, el pensamiento basado en riesgos y la mejora.",
                  "La versión 2026 agrega de forma explícita que la alta dirección debe promover una cultura de la calidad y un comportamiento ético. La cultura se ve en lo que la gente hace cuando nadie la está auditando.",
                ],
                puntos: [
                  { titulo: "Rinde cuentas", texto: "Responde por los resultados del sistema; no se limita a firmar." },
                  { titulo: "Integra", texto: "La calidad hace parte de cómo se decide y se opera; no es un área aparte." },
                  { titulo: "Enfoque al cliente (5.1.2)", texto: "Se asegura de que se conozcan y cumplan los requisitos del cliente y de que no se pierda el foco en su satisfacción." },
                  { titulo: "Da ejemplo", texto: "Promueve la cultura de la calidad y el comportamiento ético con sus propias decisiones." },
                ],
                clave: "Desde 2015 la norma no exige un «representante de la dirección», pero sí que la alta dirección asigne responsabilidades y autoridades claras.",
              },
              {
                tipo: "decision",
                titulo: "La gerente ocupada",
                situacion:
                  "Claudia Rojas, gerente de Altavista Servicios, le dice al auditor interno: «De calidad sabe todo Felipe, el coordinador. Yo firmo lo que él me trae». Esa misma semana, ella aprobó un descuento a un cliente a cambio de reducir las visitas de mantenimiento, sin consultar a nadie.",
                pregunta: "¿Qué evidencia esto frente al capítulo 5?",
                opciones: [
                  {
                    texto: "Que la alta dirección no está integrando la calidad en sus decisiones de negocio ni asumiendo la responsabilidad por la eficacia del sistema",
                    correcta: true,
                    retro: "Exacto. La rendición de cuentas no se delega, y una decisión comercial que afecta el servicio debería pasar por el análisis de riesgos del sistema.",
                  },
                  {
                    texto: "Nada: es normal que el coordinador de calidad se encargue de todo",
                    retro: "El coordinador apoya, pero la norma pone en la alta dirección la responsabilidad por la eficacia del sistema.",
                  },
                  {
                    texto: "Que Felipe no está haciendo bien su trabajo",
                    retro: "Felipe no puede integrar la calidad en decisiones que ni siquiera conoce. El hallazgo es sobre el liderazgo.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "5.2 Política y 5.3 roles",
                parrafos: [
                  "La política de la calidad es la declaración de intenciones de la alta dirección. Debe ser apropiada al propósito y al contexto de la organización, apoyar su dirección estratégica, servir de marco para fijar los objetivos e incluir el compromiso de cumplir los requisitos aplicables y de mejorar continuamente.",
                  "No basta con tenerla en un cuadro: debe estar documentada, comunicarse, entenderse y aplicarse dentro de la organización, y estar disponible para las partes interesadas que corresponda.",
                  "Además, la alta dirección asigna y comunica responsabilidades y autoridades para que el sistema cumpla la norma, los procesos den sus resultados, se informe sobre el desempeño y las oportunidades de mejora, se promueva el enfoque al cliente y el sistema no se desarme cuando se hacen cambios.",
                ],
                clave: "Una buena política se reconoce porque de ella salen objetivos medibles. Si no se puede medir nada de lo que dice, es un eslogan.",
              },
              {
                tipo: "tarjetas",
                titulo: "¿Política o eslogan?",
                instruccion: "Toque cada frase para ver si sirve como parte de una política de la calidad.",
                tarjetas: [
                  {
                    frente: "«Somos los mejores del país en mantenimiento.»",
                    reverso: "Eslogan. No dice a qué se compromete la organización ni sirve de marco para fijar objetivos.",
                  },
                  {
                    frente: "«Nos comprometemos a cumplir los tiempos de respuesta pactados con cada cliente y la normativa aplicable.»",
                    reverso: "Sirve. Es coherente con el servicio, incluye el cumplimiento de requisitos y de ella sale un objetivo medible: el porcentaje de atenciones a tiempo.",
                  },
                  {
                    frente: "«Mejoramos continuamente nuestros procesos a partir de lo que nos dicen los clientes y los datos.»",
                    reverso: "Sirve. Expresa el compromiso de mejora y lo conecta con evidencia concreta.",
                  },
                  {
                    frente: "«La calidad es responsabilidad del área de calidad.»",
                    reverso: "Contradice la norma. La calidad depende de todos los procesos, y la eficacia del sistema es responsabilidad de la alta dirección.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "6.1 Riesgos y oportunidades",
                parrafos: [
                  "A partir de las cuestiones del contexto (4.1) y de los requisitos de las partes interesadas (4.2), la organización determina los riesgos y las oportunidades que debe abordar para que el sistema logre sus resultados, potencie lo deseable, prevenga o reduzca lo indeseable y mejore.",
                  "La versión 2026 separa con más claridad este numeral: primero se determinan los riesgos y las oportunidades; luego se planifican las acciones para abordar los riesgos y, aparte, las acciones para aprovechar las oportunidades. En ambos casos las acciones se integran en los procesos y se evalúa si funcionaron.",
                  "Las acciones deben ser proporcionales al impacto que el riesgo o la oportunidad tendría en la conformidad de los productos y servicios.",
                ],
                puntos: [
                  { titulo: "Frente a un riesgo", texto: "Evitarlo, eliminar su fuente, reducir su probabilidad o su impacto, compartirlo o aceptarlo de forma informada." },
                  { titulo: "Frente a una oportunidad", texto: "Adoptar nuevas prácticas, lanzar servicios, llegar a clientes nuevos, hacer alianzas o usar nuevas tecnologías." },
                  { titulo: "Después", texto: "Integrar las acciones en los procesos y evaluar su eficacia." },
                ],
                clave: "Un riesgo identificado sin acción planificada es solo una lista de preocupaciones.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Riesgo u oportunidad?",
                instruccion: "Clasifique cada situación de Metalmecánica Ruiz e Hijos.",
                categorias: [
                  { id: "riesgo", nombre: "Riesgo", pista: "Podría afectar el cumplimiento" },
                  { id: "oportunidad", nombre: "Oportunidad", pista: "Podría mejorar los resultados" },
                ],
                elementos: [
                  { texto: "El único proveedor de lámina anunció que subirá precios y alargará sus tiempos de entrega", categoria: "riesgo" },
                  { texto: "Un cliente ofrece un contrato de largo plazo si la empresa obtiene la certificación", categoria: "oportunidad" },
                  { texto: "La cortadora principal no tiene repuestos disponibles en el país", categoria: "riesgo" },
                  { texto: "Una entidad de formación ofrece cursos gratuitos de soldadura para el personal", categoria: "oportunidad" },
                  {
                    texto: "Las lluvias fuertes inundan la vía de acceso a la planta dos veces al año",
                    categoria: "riesgo",
                    porque: "Es una cuestión climática del contexto que puede afectar las entregas.",
                  },
                  { texto: "Un software de bajo costo permitiría controlar la trazabilidad de cada lote", categoria: "oportunidad" },
                  {
                    texto: "La supervisora de producción, que conoce todos los procesos, se pensionará el próximo año",
                    categoria: "riesgo",
                    porque: "Perder conocimiento clave afecta la conformidad; se aborda formando a otra persona a tiempo.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "6.2 Objetivos de la calidad",
                parrafos: [
                  "Los objetivos de la calidad convierten la política en metas concretas para las funciones, niveles y procesos que lo necesiten. Deben ser coherentes con la política, medibles, pertinentes para la conformidad de los productos y servicios y para la satisfacción del cliente, y tener en cuenta los requisitos aplicables.",
                  "Se les hace seguimiento, se comunican, se actualizan cuando hace falta y se mantienen como información documentada. Para cada uno se planifica qué se va a hacer, con qué recursos, quién responde, para cuándo y cómo se evaluarán los resultados.",
                ],
                puntos: [
                  { titulo: "Qué", texto: "Las acciones concretas para lograrlo." },
                  { titulo: "Con qué", texto: "Los recursos: personas, dinero, equipos y tiempo." },
                  { titulo: "Quién", texto: "El responsable de cada acción." },
                  { titulo: "Cuándo", texto: "La fecha de cumplimiento." },
                  { titulo: "Cómo se evalúa", texto: "El indicador y la forma de medirlo." },
                ],
                clave: "Un objetivo sin indicador, responsable y fecha no se puede gestionar.",
              },
              {
                tipo: "decision",
                titulo: "El objetivo bien escrito",
                situacion:
                  "Los Bomberos de Puerto Esmeralda redactan sus objetivos de la calidad para el próximo año. La comandante le pide su opinión sobre cuatro propuestas.",
                pregunta: "¿Cuál cumple mejor lo que pide la norma?",
                opciones: [
                  {
                    texto: "Reducir el tiempo promedio de salida de la máquina tras una llamada de emergencia frente al promedio del año anterior, medido cada mes, con el jefe de guardia como responsable, antes de diciembre",
                    correcta: true,
                    retro: "Muy bien. Es coherente con el servicio, medible y tiene responsable, plazo y forma de evaluarse.",
                  },
                  {
                    texto: "Ser el mejor cuerpo de bomberos del departamento",
                    retro: "Es una aspiración, no un objetivo: no se puede medir ni dice qué se va a hacer.",
                  },
                  {
                    texto: "Mejorar la calidad del servicio",
                    retro: "Demasiado general. ¿Qué se mide? ¿Quién responde? ¿Para cuándo?",
                  },
                  {
                    texto: "Comprar dos máquinas nuevas",
                    retro: "Es una acción o un recurso, no un objetivo de la calidad. El objetivo sería el resultado que esas máquinas ayudarían a lograr.",
                  },
                ],
              },
              {
                tipo: "mision",
                titulo: "Un cambio sin desarmar el sistema",
                intro:
                  "Altavista Servicios va a reemplazar las órdenes de trabajo en papel por una aplicación en el celular de cada técnico. El numeral 6.3 pide que los cambios al sistema se hagan de forma planificada: considerando su propósito y sus consecuencias, la integridad del sistema, los recursos y las responsabilidades. Usted acompaña la planificación. Cada decisión acertada protege el servicio; cada error aumenta el riesgo de fallarles a los clientes.",
                medidor: { etiqueta: "Riesgo para el servicio", tipo: "amenaza" },
                velocidad: 1,
                penalizacion: 20,
                pasos: [
                  {
                    situacion: "La gerente quiere arrancar con la aplicación el lunes en todos los clientes al mismo tiempo.",
                    pregunta: "¿Qué propone primero?",
                    opciones: [
                      {
                        texto: "Definir el propósito del cambio y analizar sus posibles consecuencias antes de fijar la fecha",
                        correcta: true,
                        retro: "Así empieza la planificación de un cambio: para qué se hace y qué puede pasar si sale mal.",
                      },
                      {
                        texto: "Arrancar el lunes y resolver los problemas sobre la marcha",
                        retro: "Sin análisis previo, una falla de la aplicación dejaría a los técnicos sin órdenes de trabajo frente a los clientes.",
                      },
                    ],
                  },
                  {
                    situacion: "El análisis muestra que en dos clínicas no hay buena señal de celular en los cuartos de máquinas del sótano.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Planear cómo se registrará el trabajo sin conexión y probarlo antes en esas clínicas",
                        correcta: true,
                        retro: "Se aborda el riesgo antes de que ocurra y se protege el registro del servicio.",
                      },
                      {
                        texto: "Ignorarlo: los técnicos pueden llenar los datos de memoria al salir",
                        retro: "Llenar de memoria abre la puerta a errores en el informe que recibe el cliente.",
                      },
                    ],
                  },
                  {
                    situacion: "Con la aplicación cambia quién aprueba el informe final: antes lo firmaba el supervisor en papel.",
                    pregunta: "¿Qué debe quedar definido?",
                    opciones: [
                      {
                        texto: "Quién tiene ahora la responsabilidad y la autoridad para aprobar el informe en la aplicación",
                        correcta: true,
                        retro: "Correcto. Al planificar un cambio se considera la asignación o reasignación de responsabilidades.",
                      },
                      {
                        texto: "Nada: cualquiera con acceso puede aprobarlo",
                        retro: "Si no está claro quién aprueba, pueden llegar al cliente informes sin revisar.",
                      },
                      {
                        texto: "Que el supervisor siga firmando en papel además de la aplicación",
                        retro: "Duplicar el control sin definir cuál vale genera confusión y registros contradictorios.",
                      },
                    ],
                  },
                  {
                    situacion: "Varios técnicos nunca han usado una aplicación de este tipo.",
                    pregunta: "¿Qué incluye en el plan?",
                    opciones: [
                      {
                        texto: "Capacitación práctica y acompañamiento en las primeras semanas, con el tiempo y los recursos necesarios",
                        correcta: true,
                        retro: "La disponibilidad de recursos, incluida la competencia del personal, hace parte de planificar un cambio.",
                      },
                      {
                        texto: "Un correo con el manual de la aplicación",
                        retro: "Un manual no reemplaza la práctica. Sin capacitación, los errores llegarán al cliente.",
                      },
                    ],
                  },
                  {
                    situacion: "La aplicación ya funciona con todos los clientes.",
                    pregunta: "¿Cómo cierra el cambio?",
                    opciones: [
                      {
                        texto: "Hago seguimiento a los resultados (informes completos, quejas y tiempos) y ajusto lo que no funcione",
                        correcta: true,
                        retro: "La versión 2026 refuerza que los cambios se planifiquen para lograr los resultados previstos. Sin verificar, no se sabe si se lograron.",
                      },
                      {
                        texto: "Doy el cambio por terminado y archivo el plan",
                        retro: "Un cambio no termina cuando se lanza, sino cuando se comprueba que logró su propósito sin afectar el servicio.",
                      },
                    ],
                  },
                ],
                exito: "¡El cambio salió bien! Definió el propósito, anticipó las fallas de señal, aclaró quién aprueba, preparó al personal y verificó los resultados.",
                fracaso: "El riesgo para el servicio se disparó. Recuerde lo que pide 6.3: propósito y consecuencias, integridad del sistema, recursos, responsabilidades y seguimiento a los resultados.",
                dice: "Los cambios mal planificados son una fuente muy común de no conformidades. Vamos con calma.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "La alta dirección responde por la eficacia del sistema y no puede delegar esa responsabilidad.",
                  "La versión 2026 pide de forma explícita promover una cultura de la calidad y un comportamiento ético.",
                  "La política sirve de marco para objetivos medibles, se comunica y se aplica.",
                  "6.1: se determinan riesgos y oportunidades, y se planifican acciones para cada uno, proporcionales a su impacto.",
                  "6.2: objetivos medibles, con acciones, recursos, responsable, fecha y forma de evaluarlos. 6.3: los cambios se planifican.",
                ],
                insignia: "Estratega de la calidad",
                cierre: "En el próximo módulo pasará de planificar a hacer: el apoyo y la operación.",
              },
            ],
          },
        },
      ],
    },

    /* ==================================================================== */
    /*  MÓDULO 3 · APOYO Y OPERACIÓN                                         */
    /* ==================================================================== */
    {
      title: "Módulo 3. Apoyo y operación",
      description:
        "Capítulos 7 y 8: recursos, competencia, toma de conciencia, comunicación e información documentada; requisitos del cliente, diseño, proveedores externos, producción y prestación del servicio, liberación y salidas no conformes.",
      lessons: [
        {
          title: "Apoyo: recursos, personas e información documentada",
          description:
            "Recursos, equipos de medición, conocimientos, competencia, toma de conciencia, comunicación y control de la información documentada (capítulo 7).",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: ANDRES,
            bloques: [
              {
                tipo: "portada",
                titulo: "El capítulo 7: lo que sostiene la operación",
                subtitulo: "Sin recursos, personas competentes e información confiable, ningún proceso cumple.",
                objetivos: [
                  "Identificar los recursos que pide la norma, incluidos los de seguimiento y medición",
                  "Diferenciar competencia de toma de conciencia",
                  "Planificar la comunicación interna y externa",
                  "Controlar la información documentada",
                ],
                minutos: 20,
                dice: "Cuando audito, muchos hallazgos salen de aquí: un equipo sin calibrar, una persona sin formación, un documento desactualizado.",
              },
              {
                tipo: "explicacion",
                titulo: "7.1 Recursos",
                parrafos: [
                  "La organización determina y proporciona los recursos que necesita el sistema, teniendo en cuenta lo que ya tiene y lo que debe conseguir de proveedores externos.",
                ],
                puntos: [
                  { titulo: "Personas (7.1.2)", texto: "Las necesarias para operar y controlar los procesos." },
                  { titulo: "Infraestructura (7.1.3)", texto: "Edificios, equipos, software, transporte y tecnologías de información y comunicación." },
                  {
                    titulo: "Ambiente para la operación (7.1.4)",
                    texto: "Condiciones físicas, sociales y psicológicas adecuadas: temperatura, iluminación, trato respetuoso, carga de trabajo razonable. La versión 2026 reconoce también la influencia de la cultura de la calidad.",
                  },
                  {
                    titulo: "Seguimiento y medición (7.1.5)",
                    texto: "Equipos adecuados para verificar la conformidad. Cuando se requiere trazabilidad de la medición, se calibran o verifican a intervalos definidos contra patrones trazables, se identifican y se protegen.",
                  },
                  {
                    titulo: "Conocimientos (7.1.6)",
                    texto: "Lo que la organización sabe y necesita para operar: lecciones aprendidas, experiencia, información de expertos. Se conserva y se comparte para que no se pierda.",
                  },
                ],
                clave: "Si un equipo de medición resulta fuera de especificación, no basta con repararlo: hay que evaluar si los resultados anteriores siguen siendo válidos y actuar.",
              },
              {
                tipo: "decision",
                titulo: "El calibrador vencido",
                situacion:
                  "En una auditoría interna en Metalmecánica Ruiz e Hijos, usted encuentra que el calibrador con que se miden los soportes de un cliente automotriz tiene la calibración vencida hace tres meses. Al revisarlo, mide un poco por encima del valor real.",
                pregunta: "¿Qué debe hacer la empresa?",
                opciones: [
                  {
                    texto: "Retirarlo, calibrarlo y evaluar si las piezas medidas con él en esos tres meses pueden estar fuera de especificación, para actuar e informar al cliente si es necesario",
                    correcta: true,
                    retro: "Correcto. La norma pide determinar si la validez de los resultados anteriores se vio afectada y tomar las acciones necesarias.",
                  },
                  {
                    texto: "Calibrarlo y seguir trabajando: lo pasado ya pasó",
                    retro: "Las piezas medidas con un equipo que mide de más pueden estar fuera de tolerancia y ya estar en manos del cliente.",
                  },
                  {
                    texto: "Ajustarlo con una pieza del taller que «siempre ha medido bien» y seguir",
                    retro: "Un ajuste sin un patrón trazable no da confianza en la medición, y sigue sin evaluarse lo que ya se entregó.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "7.2 Competencia y 7.3 toma de conciencia",
                parrafos: [
                  "Competencia es la capacidad de aplicar conocimientos y habilidades para lograr los resultados. La organización determina qué competencia necesita cada persona cuyo trabajo afecta la calidad, se asegura de que la tenga por educación, formación o experiencia, toma acciones cuando falta, evalúa si esas acciones funcionaron y conserva evidencia.",
                  "Toma de conciencia es otra cosa: que cada persona sepa cuál es la política de la calidad, qué objetivos le corresponden, cómo contribuye su trabajo y qué pasa si no cumple. La versión 2026 agrega que las personas también deben conocer la cultura de la calidad y el comportamiento ético que se esperan de ellas.",
                ],
                puntos: [
                  { titulo: "Competencia", texto: "«Sé hacerlo bien»: conocimientos, habilidades y experiencia, con evidencia." },
                  { titulo: "Toma de conciencia", texto: "«Sé por qué importa»: política, objetivos, mi aporte y las consecuencias de no cumplir." },
                  { titulo: "Eficacia de la formación", texto: "Una lista de asistencia demuestra que alguien fue al curso, no que aprendió." },
                ],
                clave: "La pregunta del auditor no es «¿lo capacitaron?», sino «¿cómo sabe la organización que ahora es competente?».",
              },
              {
                tipo: "explicacion",
                titulo: "7.4 Comunicación",
                parrafos: [
                  "La organización define las comunicaciones internas y externas que importan para el sistema: sobre qué se comunica, cuándo, con quién y cómo. En la práctica, también conviene dejar claro quién es responsable de comunicar cada cosa.",
                  "Comunicar bien evita que un cambio en el pedido no llegue a producción, que un cliente no sepa que su servicio se retrasará o que el personal no conozca un procedimiento nuevo.",
                ],
                puntos: [
                  { titulo: "Qué", texto: "Cambios en requisitos, resultados de indicadores, alertas, procedimientos nuevos." },
                  { titulo: "Cuándo", texto: "Al inicio del turno, cada mes, antes de un cambio, apenas se detecta un problema." },
                  { titulo: "Con quién", texto: "Personal, clientes, proveedores, autoridades." },
                  { titulo: "Cómo", texto: "Reunión de turno, correo, cartelera, aplicación, informe." },
                ],
                clave: "Si algo crítico depende de que «alguien le cuente a alguien», no está gestionado.",
              },
              {
                tipo: "contrarreloj",
                titulo: "El cambio que nadie supo",
                segundos: 20,
                situacion:
                  "Un cliente de la metalmecánica cambió el espesor de la lámina de sus soportes. Ventas lo recibió por correo hace una semana, pero hoy producción sigue cortando con el espesor anterior.",
                pregunta: "¿Qué falló, principalmente?",
                opciones: [
                  {
                    texto: "La comunicación interna: no estaba definido qué cambios se comunican, a quién, cuándo y cómo",
                    correcta: true,
                    retro: "Correcto. Además, cuando cambian los requisitos del cliente (8.2.4), hay que actualizar la información documentada y avisar a las personas que deben saberlo.",
                  },
                  {
                    texto: "La competencia de los operarios de corte",
                    retro: "Los operarios cortaron bien lo que se les indicó. El problema es que la información nunca les llegó.",
                  },
                  {
                    texto: "La infraestructura de la planta",
                    retro: "Las máquinas funcionaron. Lo que falló fue el flujo de información entre procesos.",
                  },
                ],
                alAgotar: "Mientras duda, la cortadora sigue trabajando con el espesor equivocado. Detenga, comunique y corrija.",
              },
              {
                tipo: "explicacion",
                titulo: "7.5 Información documentada",
                parrafos: [
                  "La información documentada es la que la organización debe controlar y mantener, en cualquier medio: papel, archivos digitales, videos o aplicaciones. Incluye la que exige la norma y la que la organización decide que necesita. Cuánta hace falta depende del tamaño de la organización, de la complejidad de sus procesos y de la competencia de su personal.",
                  "Al crearla o actualizarla, se identifica (título, fecha, autor o código), se elige un formato adecuado y se revisa y aprueba. Luego se controla: disponible donde se necesita, protegida contra pérdida o uso indebido, con control de versiones, y conservada o eliminada cuando corresponda. Los documentos externos necesarios, como manuales de fabricantes o planos del cliente, también se identifican y controlan.",
                ],
                puntos: [
                  { titulo: "Para operar", texto: "Lo que dice cómo se hace: procedimientos, instructivos, planos, planes. Se mantiene al día." },
                  { titulo: "Como evidencia", texto: "Lo que demuestra qué se hizo: registros de inspección, formación o calibración. Se conserva y se protege contra cambios no autorizados." },
                ],
                clave: "Un buen sistema documental tiene lo necesario, en la versión vigente y en el lugar donde se usa. Ni más ni menos.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Para operar o como evidencia?",
                instruccion: "Clasifique cada información documentada de Altavista Servicios.",
                categorias: [
                  { id: "operar", nombre: "Para operar", pista: "Dice cómo se hace" },
                  { id: "evidencia", nombre: "Como evidencia", pista: "Demuestra qué se hizo" },
                ],
                elementos: [
                  { texto: "Instructivo de mantenimiento preventivo de equipos tipo minisplit", categoria: "operar" },
                  { texto: "Informe de mantenimiento firmado por el cliente", categoria: "evidencia" },
                  {
                    texto: "Certificado de calibración del manómetro",
                    categoria: "evidencia",
                    porque: "Demuestra que el equipo de medición estaba calibrado cuando se usó.",
                  },
                  {
                    texto: "Manual del fabricante del equipo de aire acondicionado",
                    categoria: "operar",
                    porque: "Es un documento de origen externo que se usa para trabajar: también se identifica y se controla.",
                  },
                  { texto: "Plan anual de mantenimiento de los clientes", categoria: "operar" },
                  { texto: "Evaluación práctica aprobada de un técnico nuevo", categoria: "evidencia" },
                  { texto: "Resultados de la encuesta de satisfacción del semestre", categoria: "evidencia" },
                  { texto: "Procedimiento para atender quejas", categoria: "operar" },
                ],
              },
              {
                tipo: "tarjetas",
                titulo: "Errores frecuentes con los documentos",
                instruccion: "Toque cada error para ver cómo se evita.",
                tarjetas: [
                  {
                    frente: "En el taller hay tres versiones distintas del mismo instructivo.",
                    reverso: "Control de versiones: retire las obsoletas del punto de uso o márquelas claramente si debe conservarlas.",
                  },
                  {
                    frente: "Los registros de inspección se guardan en una carpeta que cualquiera puede editar.",
                    reverso: "La evidencia se protege contra cambios no autorizados: permisos de acceso, copias de respaldo y rastro de quién cambia qué.",
                  },
                  {
                    frente: "Un procedimiento de 40 páginas que nadie lee.",
                    reverso: "La información documentada debe servirle a quien la usa. A veces un diagrama, una lista de chequeo o un video funcionan mejor.",
                  },
                  {
                    frente: "Los planos del cliente llegan por correo y cada quien imprime el que encuentra.",
                    reverso: "Los documentos externos también se controlan: se identifica cuál es el vigente y se asegura que llegue a quien lo usa.",
                  },
                ],
              },
              {
                tipo: "mision",
                titulo: "El voluntario nuevo",
                intro:
                  "Sebastián Torres acaba de llegar a los Bomberos Voluntarios de Puerto Esmeralda y quiere salir ya en la máquina. Usted apoya al jefe de guardia para que llegue preparado a su primera emergencia. Cada decisión acertada reduce el riesgo; cada error lo aumenta.",
                medidor: { etiqueta: "Riesgo en la primera emergencia", tipo: "amenaza" },
                velocidad: 1,
                penalizacion: 20,
                pasos: [
                  {
                    situacion: "Sebastián trae un curso básico de otra ciudad y mucho entusiasmo.",
                    pregunta: "¿Qué se revisa primero?",
                    opciones: [
                      {
                        texto: "Comparar su formación y experiencia con la competencia definida para el cargo de bombero de línea",
                        correcta: true,
                        retro: "Primero se sabe qué competencia exige el cargo y cuánta tiene la persona. Así se ve qué le falta.",
                      },
                      {
                        texto: "Dejarlo salir en la próxima emergencia para ver cómo le va",
                        retro: "Probar la competencia en una emergencia real pone en riesgo a la comunidad y al propio voluntario.",
                      },
                    ],
                  },
                  {
                    situacion: "Le falta formación en el manejo del equipo de rescate vehicular.",
                    pregunta: "¿Qué se hace?",
                    opciones: [
                      {
                        texto: "Planear su formación práctica con un instructor y definir desde ya cómo se evaluará antes de habilitarlo",
                        correcta: true,
                        retro: "La acción para adquirir la competencia incluye, desde el principio, cómo se evaluará su eficacia.",
                      },
                      {
                        texto: "Darle el manual del equipo para que lo lea en la casa",
                        retro: "Leer no garantiza saber hacer. El rescate exige práctica supervisada.",
                      },
                    ],
                  },
                  {
                    situacion: "Sebastián terminó la formación.",
                    pregunta: "¿Cómo se sabe que la formación fue eficaz?",
                    opciones: [
                      {
                        texto: "Con una evaluación práctica en un ejercicio simulado, con criterios definidos y registro del resultado",
                        correcta: true,
                        retro: "Eso demuestra la competencia y deja la evidencia que pide 7.2.",
                      },
                      {
                        texto: "Con el certificado de asistencia al curso",
                        retro: "Asistir no es lo mismo que aprender.",
                      },
                      {
                        texto: "Con una carta firmada por Sebastián en la que dice que entendió",
                        retro: "Una autodeclaración no es evidencia objetiva de competencia.",
                      },
                    ],
                  },
                  {
                    situacion:
                      "En la inducción, Sebastián pregunta por qué hay que llenar la planilla de cada salida si «lo importante es apagar el fuego».",
                    pregunta: "¿Qué le explica?",
                    opciones: [
                      {
                        texto: "Que el registro permite medir los tiempos, aprender de cada emergencia y rendir cuentas a la comunidad, y que omitirlo afecta los objetivos de la calidad",
                        correcta: true,
                        retro: "Eso es toma de conciencia: entender cómo su trabajo contribuye al sistema y qué implica no cumplir.",
                      },
                      {
                        texto: "Que es una orden y no tiene que entenderla",
                        retro: "Sin entender el porqué, la planilla se llenará mal o no se llenará.",
                      },
                    ],
                  },
                  {
                    situacion: "En la máquina, Sebastián encuentra dos versiones impresas del protocolo de rescate vehicular, con pasos distintos.",
                    pregunta: "¿Qué hace el jefe de guardia?",
                    opciones: [
                      {
                        texto: "Retira la versión obsoleta, confirma cuál es la vigente y revisa por qué había dos versiones en la máquina",
                        correcta: true,
                        retro: "Control de la información documentada: la versión vigente debe estar disponible donde se usa, y las obsoletas no deben confundir a nadie.",
                      },
                      {
                        texto: "Le dice que use la que le parezca más clara",
                        retro: "Dos versiones con pasos distintos en plena emergencia son un riesgo directo para la operación.",
                      },
                    ],
                  },
                ],
                exito: "¡Sebastián está listo para su primera emergencia! Se definió su competencia, se le formó, se evaluó con evidencia, entiende por qué importa su trabajo y tiene a mano la versión vigente del protocolo.",
                fracaso: "Sebastián llegó a la emergencia sin la preparación necesaria. Recuerde: competencia definida, formación práctica, evaluación de la eficacia, toma de conciencia e información documentada vigente.",
                dice: "Las personas son el recurso más importante del sistema. Prepárelas bien.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "7.1: personas, infraestructura, ambiente, equipos de medición y conocimientos. Un equipo fuera de especificación obliga a revisar los resultados anteriores.",
                  "7.2: competencia es saber hacerlo, con evidencia y con evaluación de la eficacia de la formación.",
                  "7.3: toma de conciencia es saber por qué importa; en 2026 incluye la cultura de la calidad y el comportamiento ético.",
                  "7.4: defina qué se comunica, cuándo, con quién y cómo.",
                  "7.5: la información para operar se mantiene al día; la evidencia se conserva y se protege.",
                ],
                insignia: "Guardián del apoyo",
                cierre: "En la próxima lección llegará al corazón de la norma: la operación, desde lo que pide el cliente hasta lo que se entrega.",
              },
            ],
          },
        },
        {
          title: "Operación: del requisito del cliente a la entrega",
          description:
            "Requisitos del cliente, diseño y desarrollo, proveedores externos, producción y prestación del servicio, liberación y control de las salidas no conformes (capítulo 8).",
          durationMin: 22,
          contenido: {
            version: 1,
            guia: ANDRES,
            bloques: [
              {
                tipo: "portada",
                titulo: "El capítulo 8: cumplir lo prometido",
                subtitulo: "Entender lo que pide el cliente, diseñar, comprar bien, producir o prestar el servicio bajo control y no dejar pasar lo que sale mal.",
                objetivos: [
                  "Determinar y revisar los requisitos antes de comprometerse con el cliente",
                  "Distinguir la revisión, la verificación y la validación del diseño",
                  "Controlar a los proveedores externos según su impacto",
                  "Aplicar controles a la producción y prestación del servicio, a la liberación y a las salidas no conformes",
                ],
                minutos: 22,
                dice: "Aquí es donde el cliente siente si el sistema funciona o no.",
              },
              {
                tipo: "explicacion",
                titulo: "8.1 y 8.2: planificar y entender lo que pide el cliente",
                parrafos: [
                  "La organización planifica y controla los procesos con que entrega sus productos y servicios: define requisitos, criterios de aceptación, recursos, controles y la información documentada necesaria. También controla los cambios planificados y revisa las consecuencias de los que no lo fueron (8.1).",
                  "Con el cliente se comunica para informarle sobre los productos y servicios, atender consultas, contratos y pedidos, recibir su retroalimentación (incluidas las quejas), manejar los bienes que él entregue y acordar qué se hará ante contingencias (8.2.1).",
                  "Antes de comprometerse, la organización determina los requisitos, incluidos los legales y los que el cliente no mencionó pero se necesitan para el uso previsto, y los revisa para asegurarse de que puede cumplirlos. Si los requisitos cambian, actualiza la información y avisa a las personas que deben saberlo.",
                ],
                puntos: [
                  { titulo: "Lo que dice el cliente", texto: "Especificaciones, cantidades, plazos, condiciones de entrega." },
                  { titulo: "Lo que no dice, pero se necesita", texto: "Por ejemplo, que el equipo reparado no haga ruido en una sala de cirugía." },
                  { titulo: "Lo que exige la ley", texto: "Reglamentos técnicos y normas sanitarias o ambientales que apliquen." },
                  { titulo: "Lo que la organización decide", texto: "Sus propios estándares de producto o de servicio." },
                ],
                clave: "Revise antes de prometer: es más barato decir «en esa fecha no puedo» que incumplir.",
              },
              {
                tipo: "decision",
                titulo: "El pedido imposible",
                situacion:
                  "Un cliente nuevo le pide a Metalmecánica Ruiz e Hijos 2.000 soportes galvanizados para dentro de diez días. El vendedor quiere firmar ya: es el pedido más grande del año. Pero la planta tiene comprometida su capacidad y el galvanizado lo hace un proveedor que tarda una semana.",
                pregunta: "¿Qué debe pasar antes de aceptar?",
                opciones: [
                  {
                    texto: "Revisar con producción y compras si es posible cumplir el plazo y, si no, negociar con el cliente una fecha realista antes de comprometerse",
                    correcta: true,
                    retro: "Correcto. La revisión de los requisitos antes de aceptar el pedido asegura que la organización puede cumplir lo que promete.",
                  },
                  {
                    texto: "Aceptar el pedido y luego ver cómo se cumple con horas extra",
                    retro: "Comprometerse sin revisar la capacidad pone en riesgo este pedido y los que ya estaban en curso.",
                  },
                  {
                    texto: "Aceptar y no decirle nada al cliente si se atrasa, para no perderlo",
                    retro: "Ocultar un retraso rompe la confianza y deja al cliente sin tiempo para reaccionar.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "8.3 Diseño y desarrollo",
                parrafos: [
                  "Si la organización crea productos o servicios nuevos, o cambia de fondo los existentes, debe gestionar un proceso de diseño y desarrollo. Aplica igual a un producto físico que a un servicio, por ejemplo un nuevo programa de capacitación comunitaria de los bomberos.",
                  "El proceso se planifica por etapas; parte de entradas claras (requisitos de funcionamiento, requisitos legales, normas aplicables, lecciones de diseños anteriores y posibles consecuencias de una falla); se controla con revisiones, verificaciones y validaciones; produce salidas que permiten fabricar o prestar el servicio, y gestiona los cambios que surjan.",
                ],
                puntos: [
                  { titulo: "Revisión", texto: "Mirar en momentos definidos si el diseño va por buen camino y puede cumplir los requisitos, para detectar problemas a tiempo." },
                  { titulo: "Verificación", texto: "Comprobar que las salidas del diseño cumplen las entradas: ¿el plano tiene las medidas y la resistencia que se pidieron?" },
                  { titulo: "Validación", texto: "Comprobar que el producto o servicio sirve para el uso previsto, en condiciones reales: ¿la estantería aguanta la carga en la bodega del cliente?" },
                ],
                clave: "Verificar es «lo diseñamos bien según lo pedido»; validar es «lo que diseñamos sirve para lo que el cliente lo va a usar».",
              },
              {
                tipo: "clasificar",
                titulo: "¿Revisión, verificación o validación?",
                instruccion: "Clasifique cada control del diseño de la nueva estantería de la metalmecánica.",
                categorias: [
                  { id: "revision", nombre: "Revisión", pista: "¿Vamos bien?" },
                  { id: "verificacion", nombre: "Verificación", pista: "¿Cumple las entradas?" },
                  { id: "validacion", nombre: "Validación", pista: "¿Sirve para el uso real?" },
                ],
                elementos: [
                  { texto: "Reunión con producción y ventas al terminar el primer boceto, para detectar problemas", categoria: "revision" },
                  { texto: "Cálculo que confirma que el diseño soporta la carga especificada en las entradas", categoria: "verificacion" },
                  {
                    texto: "Prueba de un prototipo cargado durante un mes en la bodega de un cliente piloto",
                    categoria: "validacion",
                    porque: "Se prueba en las condiciones reales de uso.",
                  },
                  { texto: "Comparación del plano final con la lista de requisitos del cliente", categoria: "verificacion" },
                  { texto: "Evaluación del avance a mitad del proyecto para decidir si se ajusta el cronograma", categoria: "revision" },
                  {
                    texto: "Un cliente arma la estantería siguiendo solo el instructivo, para ver si lo logra sin ayuda",
                    categoria: "validacion",
                    porque: "Comprueba que el producto, con su instructivo, sirve para el uso previsto.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "8.4 Proveedores externos",
                parrafos: [
                  "La organización controla lo que compra o contrata cuando se incorpora a sus productos y servicios, cuando el proveedor entrega directamente al cliente en su nombre o cuando le encarga a un tercero un proceso completo, como el galvanizado de la metalmecánica o el mantenimiento de las máquinas de los bomberos.",
                  "Para eso define criterios para evaluar, seleccionar, hacer seguimiento y reevaluar a los proveedores, y conserva evidencia de esas evaluaciones. El tipo y la intensidad del control dependen del impacto del proveedor en la conformidad.",
                  "Antes de pedir, le comunica al proveedor con claridad qué necesita: el producto o servicio, cómo se aprobará, la competencia requerida, cómo se relacionará con la organización y qué controles y verificaciones se le harán.",
                ],
                clave: "Cuando un proceso se contrata afuera, la responsabilidad ante el cliente sigue siendo de la organización.",
              },
              {
                tipo: "explicacion",
                titulo: "8.5 a 8.7: producir, liberar y controlar lo que sale mal",
                parrafos: [
                  "La producción y la prestación del servicio se hacen bajo condiciones controladas (8.5.1): información sobre lo que se debe lograr, equipos de medición adecuados, controles en las etapas apropiadas, infraestructura y personas competentes, medidas para prevenir el error humano y, cuando el resultado no se puede verificar después, validación periódica del proceso.",
                  "Ese último punto es clave en los servicios: la atención de una emergencia no se puede «inspeccionar» antes de entregarla. Por eso los bomberos validan su proceso con simulacros, protocolos, entrenamiento y equipos revisados.",
                  "También se gestionan la identificación y la trazabilidad (8.5.2), los bienes del cliente o de proveedores (8.5.3), la preservación (8.5.4), las actividades posteriores a la entrega (8.5.5) y los cambios (8.5.6). Antes de entregar se verifica que se cumplió lo planificado y se registra quién autorizó la liberación (8.6).",
                ],
                puntos: [
                  { titulo: "8.7 Salidas no conformes", texto: "Lo que no cumple se identifica y se controla para que no se use ni se entregue por error." },
                  { titulo: "Qué se puede hacer", texto: "Corregir; separar o contener; devolver o suspender; informar al cliente, u obtener su autorización para aceptarlo por concesión." },
                  { titulo: "Qué se registra", texto: "Qué falló, qué se hizo, qué concesiones hubo y quién decidió." },
                ],
                clave: "Lo que no cumple no sale, salvo que alguien con autoridad y, cuando aplique, el cliente lo autoricen de forma expresa.",
              },
              {
                tipo: "ordenar",
                titulo: "Tratamiento de una salida no conforme",
                instruccion:
                  "Un técnico de Altavista descubre que tres equipos instalados la semana pasada quedaron con un repuesto equivocado. Ordene lo que se hace.",
                pasos: [
                  "Identificar los equipos afectados y verificar si hay otros con el mismo repuesto",
                  "Controlar la situación para que el error no afecte al cliente mientras se resuelve",
                  "Informar al cliente lo ocurrido y lo que se va a hacer",
                  "Corregir: cambiar el repuesto y probar que el equipo funciona",
                  "Registrar la no conformidad, las acciones y quién las autorizó",
                  "Evaluar si hace falta una acción correctiva para eliminar la causa",
                ],
                explicacion:
                  "Así es. Primero se contiene, luego se corrige y se deja registro. Como el error ya llegó al cliente, conviene analizar la causa para que no se repita: eso lo verá en el capítulo 10.",
              },
              {
                tipo: "mision",
                titulo: "Lote fuera de medida",
                intro:
                  "Son las 3 de la tarde en Metalmecánica Ruiz e Hijos. Mañana a primera hora sale un pedido de 500 soportes para el cliente más importante. En la inspección final, la supervisora Marcela Ortiz encuentra piezas con una perforación fuera de tolerancia. Usted la acompaña. Cada buena decisión reduce el riesgo de que el cliente reciba piezas malas.",
                medidor: { etiqueta: "Riesgo de entregar piezas malas", tipo: "amenaza" },
                velocidad: 1.2,
                penalizacion: 20,
                pasos: [
                  {
                    situacion: "Marcela encontró 12 piezas malas en una muestra de 50.",
                    pregunta: "¿Qué hace primero?",
                    opciones: [
                      {
                        texto: "Identificar y separar todo el lote hasta saber cuántas piezas están afectadas",
                        correcta: true,
                        retro: "Correcto. Si la muestra tiene defectos, todo el lote es sospechoso. Separarlo evita que se despache por error.",
                      },
                      {
                        texto: "Separar solo las 12 piezas malas y despachar el resto",
                        retro: "Si la muestra tuvo fallas, el resto del lote seguramente también. Despacharlo es mandarle defectos al cliente.",
                      },
                    ],
                  },
                  {
                    situacion: "El lote está identificado con una tarjeta roja y separado. El vendedor presiona para despachar mañana.",
                    pregunta: "¿Cómo se decide qué hacer con las piezas?",
                    opciones: [
                      {
                        texto: "Inspeccionar todo el lote, reprocesar las piezas que se puedan corregir y rechazar las demás",
                        correcta: true,
                        retro: "Se corrige lo que se puede y se controla lo que no, antes de entregar.",
                      },
                      {
                        texto: "Despachar todo y cambiar después las piezas que el cliente devuelva",
                        retro: "Trasladarle el problema al cliente es justo lo que la norma busca evitar.",
                      },
                      {
                        texto: "Despachar, porque el defecto es pequeño y el cliente no lo notará",
                        retro: "Decidir por el cliente que un defecto no importa no le corresponde a la organización.",
                      },
                    ],
                  },
                  {
                    situacion: "Después de inspeccionar, quedan 40 piezas con una desviación mínima que no se pueden reprocesar, y harían falta para completar el pedido.",
                    pregunta: "¿Qué opción es válida?",
                    opciones: [
                      {
                        texto: "Informar al cliente la desviación y pedir su autorización expresa por escrito antes de enviarlas",
                        correcta: true,
                        retro: "Eso es una concesión: el cliente decide si acepta la desviación, y su autorización queda registrada.",
                      },
                      {
                        texto: "Enviarlas mezcladas con las buenas sin decir nada",
                        retro: "Entregar una salida no conforme sin autorización es incumplir lo pactado y destruye la confianza.",
                      },
                    ],
                  },
                  {
                    situacion: "El cliente aceptó las 40 piezas y pidió la entrega mañana.",
                    pregunta: "¿Qué se registra?",
                    opciones: [
                      {
                        texto: "La descripción de la no conformidad, las acciones tomadas, la concesión del cliente y quién autorizó la liberación",
                        correcta: true,
                        retro: "Es la información documentada que piden el control de las salidas no conformes y la liberación.",
                      },
                      {
                        texto: "Nada: el problema ya se resolvió",
                        retro: "Sin registro no hay evidencia, ni datos para analizar la causa y evitar que se repita.",
                      },
                    ],
                  },
                  {
                    situacion: "El pedido salió a tiempo. Marcela pregunta qué falta.",
                    pregunta: "¿Qué le responde?",
                    opciones: [
                      {
                        texto: "Analizar por qué la perforación salió fuera de tolerancia, para eliminar la causa y que no se repita",
                        correcta: true,
                        retro: "Tratar el lote fue la corrección. Eliminar la causa es la acción correctiva, que verá en el módulo 4.",
                      },
                      {
                        texto: "Nada más: ya se cumplió la entrega",
                        retro: "Si la causa sigue ahí, el próximo lote puede salir igual.",
                      },
                    ],
                  },
                ],
                exito: "¡Ninguna pieza mala llegó al cliente sin su autorización! Contuvo el lote, corrigió lo posible, pidió una concesión, registró todo y dejó planteado el análisis de la causa.",
                fracaso: "Piezas fuera de medida pudieron llegar al cliente. Recuerde: identificar y separar todo el lote, corregir o rechazar, pedir concesión cuando aplique, registrar y buscar la causa.",
                dice: "Con el camión esperando es cuando más se pone a prueba el sistema. No deje que la prisa decida.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "8.1 y 8.2: planifique la operación, comuníquese con el cliente y revise los requisitos antes de comprometerse.",
                  "8.3: revisión (¿vamos bien?), verificación (¿cumple las entradas?) y validación (¿sirve para el uso real?).",
                  "8.4: controle a los proveedores externos según su impacto; la responsabilidad ante el cliente sigue siendo suya.",
                  "8.5 y 8.6: condiciones controladas, validación de los procesos que no se pueden verificar después y liberación autorizada.",
                  "8.7: lo que no cumple se identifica, se controla y solo sale con autorización expresa.",
                ],
                insignia: "Maestro de la operación",
                cierre: "En el último módulo verá cómo se mide el sistema, cómo se audita y cómo se mejora.",
              },
            ],
          },
        },
      ],
    },

    /* ==================================================================== */
    /*  MÓDULO 4 · EVALUACIÓN DEL DESEMPEÑO Y MEJORA                         */
    /* ==================================================================== */
    {
      title: "Módulo 4. Evaluación del desempeño y mejora",
      description:
        "Capítulos 9 y 10: seguimiento y medición, satisfacción del cliente, auditoría interna con apoyo en ISO 19011, revisión por la dirección, no conformidades, acción correctiva, mejora continua y un caso práctico de auditoría.",
      lessons: [
        {
          title: "Medir, auditar y revisar",
          description:
            "Seguimiento, medición y análisis, satisfacción del cliente, auditoría interna con las directrices de ISO 19011 y revisión por la dirección (capítulo 9).",
          durationMin: 22,
          contenido: {
            version: 1,
            guia: ANDRES,
            bloques: [
              {
                tipo: "portada",
                titulo: "El capítulo 9: ¿está funcionando?",
                subtitulo: "Lo que no se mide no se puede gestionar, y lo que no se audita se va desordenando.",
                objetivos: [
                  "Definir qué medir, cómo, cuándo y cuándo analizarlo",
                  "Hacer seguimiento a la percepción del cliente",
                  "Aplicar los principios de auditoría de ISO 19011 en la auditoría interna",
                  "Preparar las entradas y las salidas de la revisión por la dirección",
                ],
                minutos: 22,
                dice: "Este es mi capítulo favorito. Aquí el sistema se mira al espejo.",
              },
              {
                tipo: "explicacion",
                titulo: "9.1 Seguimiento, medición, análisis y evaluación",
                parrafos: [
                  "La organización decide qué necesita seguir y medir, con qué métodos para que los resultados sean válidos, cuándo hacerlo y cuándo analizar y evaluar los resultados. Conserva evidencia de esos resultados.",
                  "El análisis sirve para evaluar la conformidad de los productos y servicios, la satisfacción del cliente, el desempeño y la eficacia del sistema, si lo planificado se cumplió, si funcionaron las acciones frente a riesgos y oportunidades, cómo se desempeñan los proveedores y qué hay que mejorar.",
                ],
                puntos: [
                  { titulo: "Indicador útil", texto: "Mide algo que le importa al cliente o al proceso, y tiene meta, responsable y frecuencia." },
                  { titulo: "Indicador inútil", texto: "Se mide porque «toca», nadie lo analiza y no lleva a ninguna decisión." },
                  { titulo: "Análisis", texto: "Tendencias, comparación con la meta y causas de las desviaciones. Un dato suelto dice poco." },
                ],
                clave: "Medir no es llenar formatos: es tener información para decidir.",
              },
              {
                tipo: "explicacion",
                titulo: "9.1.2 Satisfacción del cliente",
                parrafos: [
                  "La organización hace seguimiento a la percepción de sus clientes sobre qué tanto se cumplieron sus necesidades y expectativas, y define cómo obtiene, revisa y usa esa información.",
                  "La encuesta es solo uno de los métodos. También sirven las quejas y felicitaciones, las reuniones con el cliente, los reclamos de garantía, la recompra, la pérdida de clientes y lo que escucha el personal de campo.",
                ],
                clave: "La ausencia de quejas no es lo mismo que la satisfacción: muchos clientes insatisfechos no se quejan, simplemente se van.",
              },
              {
                tipo: "decision",
                titulo: "El indicador de los bomberos",
                situacion:
                  "Los Bomberos de Puerto Esmeralda miden cuántas emergencias atienden al mes. La cifra sube cada año y la junta la presenta como un logro de calidad.",
                pregunta: "¿Qué les aconseja usted?",
                opciones: [
                  {
                    texto: "Complementarla con indicadores del desempeño del servicio, como el tiempo de respuesta frente a la meta y la percepción de la comunidad atendida",
                    correcta: true,
                    retro: "Exacto. El número de emergencias muestra la demanda, no la calidad. El desempeño se ve en cómo y qué tan rápido se atiende.",
                  },
                  {
                    texto: "Mantenerla así: más emergencias atendidas significa mejor servicio",
                    retro: "Más emergencias pueden significar más riesgo en el municipio, no un mejor servicio. Ese indicador no mide desempeño.",
                  },
                  {
                    texto: "Dejar de medir: un cuerpo de bomberos no debería tener indicadores",
                    retro: "Sin medición no hay forma de saber si el servicio cumple ni de decidir con evidencia.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "9.2 Auditoría interna, con apoyo en ISO 19011",
                parrafos: [
                  "La organización hace auditorías internas a intervalos planificados para saber si el sistema cumple sus propios requisitos y los de ISO 9001, y si está implementado y se mantiene de forma eficaz.",
                  "Para eso planifica un programa de auditorías (frecuencia, métodos, responsabilidades e informes) que tiene en cuenta la importancia de los procesos, los cambios que los afectan y los resultados de auditorías anteriores. En cada auditoría define criterios y alcance, elige auditores que aseguren objetividad e imparcialidad, informa los resultados a la dirección pertinente y hace las correcciones y acciones correctivas sin demoras injustificadas.",
                  "ISO 19011 da las directrices para auditar cualquier sistema de gestión. Su edición más reciente, de 2026, conserva los siete principios de la auditoría.",
                ],
                clave: "Un auditor interno no audita su propio trabajo: la imparcialidad es lo que le da valor al hallazgo.",
              },
              {
                tipo: "tarjetas",
                titulo: "Los siete principios de la auditoría",
                instruccion: "Toque cada principio para ver qué significa en una auditoría interna.",
                tarjetas: [
                  {
                    frente: "Integridad",
                    reverso: "Trabajar con honestidad, diligencia y responsabilidad. Es la base del profesionalismo del auditor.",
                  },
                  {
                    frente: "Presentación imparcial",
                    reverso: "Informar con veracidad y exactitud lo que se encontró, incluidas las diferencias de opinión que no se resolvieron.",
                  },
                  {
                    frente: "Debido cuidado profesional",
                    reverso: "Aplicar el juicio y la diligencia que exigen la importancia de la tarea y la confianza de quien pidió la auditoría.",
                  },
                  {
                    frente: "Confidencialidad",
                    reverso: "Proteger la información conocida durante la auditoría y no usarla en beneficio propio ni en perjuicio del auditado.",
                  },
                  {
                    frente: "Independencia",
                    reverso: "No auditar el propio trabajo y actuar libre de sesgos y conflictos de interés, para que las conclusiones sean objetivas.",
                  },
                  {
                    frente: "Enfoque basado en la evidencia",
                    reverso: "Llegar a conclusiones a partir de evidencia verificable, obtenida de muestras adecuadas.",
                  },
                  {
                    frente: "Enfoque basado en riesgos",
                    reverso: "Concentrar la planificación y la ejecución de la auditoría en lo que más importa para quien la pide y para lograr sus objetivos.",
                  },
                ],
              },
              {
                tipo: "ordenar",
                titulo: "Las etapas de una auditoría interna",
                instruccion: "Ordene las actividades de una auditoría según las directrices de ISO 19011.",
                pasos: [
                  "Definir los objetivos, el alcance y los criterios, y confirmar que la auditoría es viable",
                  "Revisar la información documentada y preparar el plan y las listas de verificación",
                  "Hacer la reunión de apertura con los responsables del proceso auditado",
                  "Recopilar y verificar evidencia con entrevistas, observación y revisión de registros",
                  "Comparar la evidencia con los criterios y redactar los hallazgos",
                  "Presentar los hallazgos y las conclusiones en la reunión de cierre",
                  "Entregar el informe y hacer seguimiento a las acciones",
                ],
                explicacion:
                  "Así es: iniciar, preparar, realizar, informar y hacer seguimiento. La lista de verificación es una guía para no olvidar nada, no un cuestionario rígido: un buen auditor sigue la evidencia.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Qué tipo de hallazgo es?",
                instruccion: "Usted audita el proceso de mantenimiento de Altavista Servicios. Clasifique cada hallazgo comparando la evidencia con los criterios.",
                categorias: [
                  { id: "conforme", nombre: "Conformidad", pista: "Cumple el criterio" },
                  { id: "nc", nombre: "No conformidad", pista: "Incumple un requisito, con evidencia" },
                  { id: "om", nombre: "Oportunidad de mejora", pista: "Cumple, pero podría hacerse mejor" },
                ],
                elementos: [
                  { texto: "Los diez informes de mantenimiento revisados tienen la firma del cliente, como exige el procedimiento", categoria: "conforme" },
                  {
                    texto: "Dos técnicos usan una versión anterior del instructivo, que no incluye la nueva prueba de fugas",
                    categoria: "nc",
                    porque: "Incumple el control de la información documentada (7.5): la versión vigente no está disponible donde se usa.",
                  },
                  {
                    texto: "Las quejas se atienden a tiempo, pero cada sede las registra en una hoja de cálculo distinta y consolidarlas toma días",
                    categoria: "om",
                  },
                  {
                    texto: "El manómetro usado en la visita a la clínica tiene la calibración vencida",
                    categoria: "nc",
                    porque: "Incumple el control de los recursos de seguimiento y medición (7.1.5).",
                  },
                  { texto: "Los técnicos explican con claridad la política de la calidad y cómo su trabajo afecta al cliente", categoria: "conforme" },
                  {
                    texto: "El plan de mantenimiento se cumple, aunque se lleva en papel y digitalizarlo reduciría errores de transcripción",
                    categoria: "om",
                  },
                  {
                    texto: "Un técnico nuevo atiende equipos de salas de cirugía sin la evaluación práctica que exige el perfil del cargo",
                    categoria: "nc",
                    porque: "Incumple el requisito de competencia (7.2) y el propio perfil definido por la empresa.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "9.3 Revisión por la dirección",
                parrafos: [
                  "A intervalos planificados, la alta dirección revisa el sistema para asegurarse de que sigue siendo conveniente, adecuado, eficaz y alineado con la dirección estratégica. No es una reunión de trámite: es el momento de tomar decisiones sobre el sistema.",
                  "Se llega con información: estado de las acciones de revisiones anteriores; cambios en las cuestiones internas y externas y en las necesidades de las partes interesadas; satisfacción del cliente; logro de los objetivos; desempeño de los procesos; no conformidades y acciones correctivas; resultados de la medición y de las auditorías; desempeño de los proveedores; suficiencia de los recursos; eficacia de las acciones frente a riesgos y oportunidades, y oportunidades de mejora.",
                ],
                puntos: [
                  { titulo: "Salen decisiones sobre", texto: "Oportunidades de mejora, cambios necesarios en el sistema y necesidades de recursos." },
                  { titulo: "Queda evidencia", texto: "Se conserva información documentada de los resultados de la revisión." },
                ],
                clave: "Una revisión por la dirección sin decisiones, responsables y fechas es solo una presentación.",
              },
              {
                tipo: "mision",
                titulo: "El cierre del año en Altavista",
                intro:
                  "Es diciembre y Felipe Cárdenas, coordinador de calidad de Altavista Servicios, debe terminar el programa de auditorías y preparar la revisión por la dirección. Usted lo acompaña. Cada decisión acertada fortalece el sistema; cada error lo debilita de cara al nuevo año.",
                medidor: { etiqueta: "Solidez del sistema", tipo: "vida" },
                velocidad: 1,
                penalizacion: 20,
                pasos: [
                  {
                    situacion: "Falta auditar compras. El jefe de compras se ofrece a hacerlo «porque es el que mejor conoce el proceso».",
                    pregunta: "¿Qué decide Felipe?",
                    opciones: [
                      {
                        texto: "Asignar a otro auditor interno formado que no trabaje en compras",
                        correcta: true,
                        retro: "Nadie audita su propio trabajo: la norma pide objetividad e imparcialidad, y la independencia es un principio de la auditoría.",
                      },
                      {
                        texto: "Aceptar, para terminar rápido",
                        retro: "Conocer el proceso ayuda, pero auditar el propio trabajo le quita objetividad al resultado.",
                      },
                      {
                        texto: "Saltarse compras este año",
                        retro: "El programa debe tener en cuenta la importancia de los procesos, y compras afecta directamente el servicio.",
                      },
                    ],
                  },
                  {
                    situacion: "La gerente propone no hacer la revisión: «Este año todo fue bien, no hace falta».",
                    pregunta: "¿Qué le responde Felipe?",
                    opciones: [
                      {
                        texto: "Que la revisión se hace a intervalos planificados y es la oportunidad de decidir sobre el sistema con datos, vaya bien o mal",
                        correcta: true,
                        retro: "La revisión no depende de que haya problemas: es la forma en que la dirección asegura que el sistema sigue siendo conveniente, adecuado y eficaz.",
                      },
                      {
                        texto: "Que tiene razón y se puede dejar para el próximo año",
                        retro: "Saltarse la revisión deja a la dirección sin información para decidir y es un incumplimiento de 9.3.",
                      },
                    ],
                  },
                  {
                    situacion: "Felipe prepara la información para la reunión.",
                    pregunta: "¿Qué lleva?",
                    opciones: [
                      {
                        texto: "Acciones pendientes, cambios en el contexto y en las partes interesadas, satisfacción, objetivos, procesos, proveedores, no conformidades, auditorías, recursos, riesgos y oportunidades",
                        correcta: true,
                        retro: "Son las entradas que la revisión necesita para ver el sistema completo.",
                      },
                      {
                        texto: "Solo las ventas del año y las utilidades",
                        retro: "La información financiera importa, pero revisar el sistema exige datos de clientes, procesos y calidad.",
                      },
                      {
                        texto: "Las fotos de la fiesta de fin de año",
                        retro: "Eso no ayuda a decidir nada sobre el sistema.",
                      },
                    ],
                  },
                  {
                    situacion: "Los datos muestran que la satisfacción de las clínicas bajó en el segundo semestre y que las quejas por retrasos se triplicaron.",
                    pregunta: "¿Qué hace la dirección con esto?",
                    opciones: [
                      {
                        texto: "Analiza las causas con los datos y decide acciones, por ejemplo revisar la programación de rutas y la capacidad de técnicos",
                        correcta: true,
                        retro: "Toma de decisiones basada en la evidencia: el dato lleva a una decisión concreta.",
                      },
                      {
                        texto: "Lo pasa por alto porque las ventas subieron",
                        retro: "Los clientes insatisfechos de hoy son los clientes perdidos de mañana, aunque las ventas de este año hayan subido.",
                      },
                    ],
                  },
                  {
                    situacion: "La reunión termina.",
                    pregunta: "¿Qué debe quedar?",
                    opciones: [
                      {
                        texto: "Un acta con las decisiones sobre mejoras, cambios al sistema y recursos, con responsables y fechas",
                        correcta: true,
                        retro: "Las salidas de la revisión son decisiones y acciones, y se conserva evidencia de ellas.",
                      },
                      {
                        texto: "La presentación guardada en el computador de Felipe",
                        retro: "Una presentación muestra lo que se habló, no lo que se decidió ni quién lo hará.",
                      },
                    ],
                  },
                ],
                exito: "¡El sistema cierra el año fortalecido! Auditorías imparciales, revisión hecha con información completa y decisiones con responsables y fechas.",
                fracaso: "El sistema quedó débil para el nuevo año. Recuerde: auditores imparciales, revisión a intervalos planificados, entradas completas y salidas con decisiones concretas.",
                dice: "Medir y auditar sirve de poco si la dirección no decide con esa información.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "9.1: decida qué medir, cómo, cuándo y cuándo analizar. Medir sirve para decidir.",
                  "9.1.2: siga la percepción del cliente con varios métodos; la falta de quejas no prueba satisfacción.",
                  "9.2: auditorías planificadas, con criterios, alcance y auditores imparciales, apoyadas en ISO 19011.",
                  "Principios de auditoría: integridad, presentación imparcial, debido cuidado profesional, confidencialidad, independencia, enfoque basado en la evidencia y enfoque basado en riesgos.",
                  "9.3: la alta dirección revisa el sistema con información completa y sale con decisiones.",
                ],
                insignia: "Ojo de auditor",
                cierre: "En la última lección cerrará el ciclo: no conformidades, acciones correctivas, mejora continua y una auditoría completa para poner todo en práctica.",
              },
            ],
          },
        },
        {
          title: "No conformidad, acción correctiva y mejora: caso de auditoría",
          description:
            "Corrección y acción correctiva, análisis de causa, verificación de la eficacia, mejora continua (capítulo 10) y una auditoría interna completa.",
          durationMin: 22,
          contenido: {
            version: 1,
            guia: ANDRES,
            bloques: [
              {
                tipo: "portada",
                titulo: "El capítulo 10 y su primera auditoría",
                subtitulo: "Cerrar el ciclo PHVA: corregir, eliminar la causa y mejorar. Y después, auditar de verdad.",
                objetivos: [
                  "Diferenciar la corrección de la acción correctiva",
                  "Aplicar una herramienta de análisis de causa",
                  "Verificar la eficacia de una acción correctiva",
                  "Conducir una auditoría interna completa, de la apertura al seguimiento",
                ],
                minutos: 22,
                dice: "Una no conformidad bien tratada es la mejor maestra de una organización. Hoy va a ver cómo.",
              },
              {
                tipo: "explicacion",
                titulo: "10.2 No conformidad y acción correctiva",
                parrafos: [
                  "Cuando aparece una no conformidad, incluidas las que llegan como queja, la organización primero reacciona: la controla, la corrige y se hace cargo de las consecuencias.",
                  "Después evalúa si hace falta eliminar la causa para que no se repita ni ocurra en otra parte. Para eso revisa la no conformidad, determina sus causas y busca si hay otras parecidas o si podrían presentarse. Implementa las acciones necesarias, revisa si fueron eficaces y, si hace falta, actualiza los riesgos y oportunidades y hace cambios en el sistema.",
                  "Las acciones correctivas deben ser proporcionales a los efectos de la no conformidad. Se conserva evidencia de qué pasó, qué se hizo y cuáles fueron los resultados.",
                ],
                puntos: [
                  { titulo: "Corrección", texto: "Arreglar lo que ya ocurrió: cambiar el repuesto, reprocesar la pieza, repetir el servicio." },
                  { titulo: "Acción correctiva", texto: "Eliminar la causa para que no se repita: cambiar el método, el control, la formación o el proveedor." },
                  { titulo: "Eficacia", texto: "Comprobar con datos, después de un tiempo, que el problema no volvió." },
                ],
                clave: "La corrección apaga el incendio; la acción correctiva quita lo que lo provocó.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Corrección o acción correctiva?",
                instruccion: "Clasifique cada acción tomada en las organizaciones del curso.",
                categorias: [
                  { id: "correccion", nombre: "Corrección", pista: "Arregla lo que ya pasó" },
                  { id: "ac", nombre: "Acción correctiva", pista: "Elimina la causa" },
                ],
                elementos: [
                  { texto: "Reprocesar las piezas con la perforación fuera de tolerancia", categoria: "correccion" },
                  {
                    texto: "Cambiar la plantilla de perforación desgastada e incluir su revisión en el mantenimiento preventivo",
                    categoria: "ac",
                    porque: "Ataca la causa encontrada: la plantilla desgastada y la falta de control sobre ella.",
                  },
                  { texto: "Volver donde el cliente para cambiar el repuesto equivocado", categoria: "correccion" },
                  { texto: "Organizar el almacén por modelo de equipo y verificar la referencia antes de entregar cada repuesto", categoria: "ac" },
                  { texto: "Reemplazar la manguera que se rompió durante la emergencia", categoria: "correccion" },
                  {
                    texto: "Incluir la inspección de mangueras en la lista de chequeo de cada cambio de guardia",
                    categoria: "ac",
                    porque: "Evita que una manguera en mal estado vuelva a llegar a una emergencia.",
                  },
                  { texto: "Recoger del taller las copias obsoletas del instructivo", categoria: "correccion" },
                  {
                    texto: "Pasar los instructivos a una carpeta digital con una sola versión vigente, consultable desde la tableta del taller",
                    categoria: "ac",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Encontrar la causa raíz",
                parrafos: [
                  "ISO 9001 pide determinar las causas, pero no impone una herramienta. Dos de las más usadas son los cinco porqués y el diagrama de causa y efecto, también llamado de Ishikawa o espina de pescado.",
                  "Con los cinco porqués se pregunta «¿por qué pasó?» varias veces, hasta llegar a una causa sobre la que se pueda actuar; el número cinco es una guía, no una regla. Con el diagrama de Ishikawa se revisan las posibles causas por categorías, por ejemplo métodos, mano de obra, máquinas, materiales, medición y medio ambiente.",
                ],
                puntos: [
                  { titulo: "Busque el proceso, no al culpable", texto: "«El operario se equivocó» casi nunca es la causa raíz. Pregunte por qué el proceso permitió el error." },
                  { titulo: "Use datos", texto: "Verifique cada causa con evidencia antes de darla por cierta." },
                  { titulo: "Pare donde pueda actuar", texto: "La causa raíz es la que, si se elimina, evita que el problema se repita." },
                ],
                clave: "Si su acción correctiva es «volver a capacitar al trabajador», pregúntese si de verdad encontró la causa.",
              },
              {
                tipo: "ordenar",
                titulo: "Los cinco porqués del repuesto equivocado",
                instruccion:
                  "Altavista instaló repuestos equivocados en tres equipos. Ordene la cadena de porqués, desde el problema hasta la causa raíz.",
                pasos: [
                  "Problema: tres equipos quedaron con un repuesto que no les corresponde",
                  "¿Por qué? El técnico tomó el repuesto de la caja equivocada",
                  "¿Por qué? Dos modelos de repuesto casi idénticos estaban en la misma caja",
                  "¿Por qué? El almacén organiza los repuestos por proveedor y no por modelo de equipo",
                  "¿Por qué? Nunca se definió un criterio de almacenamiento ni una verificación de la referencia antes de entregar",
                ],
                explicacion:
                  "Exacto. La causa raíz no es un técnico distraído: es un almacén sin criterio de organización ni verificación. Sobre eso sí se puede actuar.",
              },
              {
                tipo: "decision",
                titulo: "¿Cerramos la acción?",
                situacion:
                  "Hace un mes Altavista reorganizó el almacén por modelo de equipo y empezó a verificar la referencia de cada repuesto antes de entregarlo. Felipe quiere cerrar la acción correctiva en la reunión de hoy.",
                pregunta: "¿Qué debe comprobar antes de cerrarla?",
                opciones: [
                  {
                    texto: "Que la acción se implementó y que, según los datos del periodo, no se han vuelto a entregar repuestos equivocados",
                    correcta: true,
                    retro: "Correcto. Para cerrar se necesita evidencia de eficacia: que la causa se eliminó y el problema no volvió.",
                  },
                  {
                    texto: "Que el plan de acción tiene todas las firmas",
                    retro: "Las firmas prueban que se aprobó el plan, no que funcionó.",
                  },
                  {
                    texto: "Que ya pasó un mes, que es el plazo del formato",
                    retro: "El paso del tiempo no demuestra eficacia. Se necesita evidencia de resultados.",
                  },
                ],
              },
              {
                tipo: "contrarreloj",
                titulo: "La queja repetida",
                segundos: 20,
                situacion:
                  "Una clínica se queja por tercera vez en el año porque el técnico de Altavista llega después del tiempo pactado en el contrato.",
                pregunta: "¿Cómo la trata?",
                opciones: [
                  {
                    texto: "Como una no conformidad: respondo al cliente, corrijo y analizo la causa de los retrasos repetidos para eliminarla",
                    correcta: true,
                    retro: "Correcto. Una queja puede ser una no conformidad, y que se repita indica que la causa sigue ahí.",
                  },
                  {
                    texto: "Le pido disculpas al cliente y cierro la queja",
                    retro: "La disculpa atiende al cliente, pero si la causa no se elimina habrá una cuarta queja.",
                  },
                  {
                    texto: "Cambio al técnico de esa ruta",
                    retro: "Puede ser parte de la corrección, pero sin analizar la causa no sabe si el problema es el técnico, la programación o las distancias.",
                  },
                ],
                alAgotar: "La clínica espera respuesta. Una queja repetida pide reacción inmediata y análisis de la causa.",
              },
              {
                tipo: "explicacion",
                titulo: "10.1 Mejora continua",
                parrafos: [
                  "La organización mejora de forma continua la conveniencia, la adecuación y la eficacia del sistema, y aprovecha las oportunidades para mejorar sus productos y servicios, cumplir los requisitos y aumentar la satisfacción del cliente.",
                  "En la versión 2026 el capítulo 10 se reorganiza: la mejora continua queda en 10.1 y reúne lo que en 2015 estaba repartido entre 10.1 y 10.3, y la no conformidad y la acción correctiva quedan en 10.2.",
                  "Las entradas para mejorar ya las conoce: los resultados del análisis de datos, de las auditorías y de la revisión por la dirección. Una mejora puede ser una corrección, una acción correctiva, un ajuste gradual, un cambio grande o una innovación.",
                ],
                clave: "La mejora continua no es un proyecto con fecha de cierre: es la siguiente vuelta del ciclo PHVA.",
              },
              {
                tipo: "mision",
                titulo: "Caso práctico: auditoría al proceso de inspecciones",
                intro:
                  "Usted es el auditor líder de la auditoría interna al proceso de inspecciones de seguridad de los Bomberos Voluntarios de Puerto Esmeralda. Los criterios son ISO 9001:2026 y el procedimiento interno de inspecciones. Cada decisión acertada fortalece la confianza en los resultados de la auditoría; cada error la debilita.",
                medidor: { etiqueta: "Confianza en la auditoría", tipo: "vida" },
                velocidad: 1,
                penalizacion: 20,
                pasos: [
                  {
                    situacion: "Llega a la estación. El teniente Ramírez, jefe de inspecciones, está listo para empezar.",
                    pregunta: "¿Cómo inicia?",
                    opciones: [
                      {
                        texto: "Con una reunión de apertura breve: confirmo objetivos, alcance, criterios, plan y horarios, y aclaro cómo se manejará la información",
                        correcta: true,
                        retro: "Así se empieza: todos saben qué se va a auditar, contra qué criterios y cómo.",
                      },
                      {
                        texto: "Voy directo al archivo a buscar errores, sin presentarme",
                        retro: "Sin apertura, el auditado no sabe qué esperar y la auditoría arranca con desconfianza.",
                      },
                    ],
                  },
                  {
                    situacion: "El teniente le asegura que todas las inspecciones se hacen con la lista de chequeo vigente.",
                    pregunta: "¿Cómo lo comprueba?",
                    opciones: [
                      {
                        texto: "Selecciono una muestra de inspecciones de los últimos meses y reviso qué versión de la lista se usó en cada una",
                        correcta: true,
                        retro: "Enfoque basado en la evidencia: una afirmación se verifica con registros de una muestra adecuada.",
                      },
                      {
                        texto: "Le creo: es el jefe del proceso",
                        retro: "Una afirmación no es evidencia. El auditor la verifica.",
                      },
                      {
                        texto: "Reviso solo la inspección que él me recomienda",
                        retro: "Una muestra escogida por el auditado no es representativa.",
                      },
                    ],
                  },
                  {
                    situacion:
                      "De 15 inspecciones revisadas, 4 se hicieron con una lista de chequeo anterior que no incluye la revisión de las rutas de evacuación.",
                    pregunta: "¿Cómo redacta el hallazgo?",
                    opciones: [
                      {
                        texto: "Como no conformidad, con el requisito (control de la información documentada, 7.5, y el procedimiento de inspecciones), la evidencia (4 de 15 inspecciones, con sus números) y la descripción del incumplimiento",
                        correcta: true,
                        retro: "Un buen hallazgo tiene requisito, evidencia objetiva y descripción del incumplimiento. Así es verificable y se puede tratar.",
                      },
                      {
                        texto: "«El proceso de inspecciones está desordenado»",
                        retro: "Es una opinión sin requisito ni evidencia. El auditado no sabría qué corregir.",
                      },
                      {
                        texto: "No lo registro, porque son pocas",
                        retro: "Cuatro de quince es un incumplimiento real. Presentación imparcial: se informa lo que se encontró.",
                      },
                    ],
                  },
                  {
                    situacion:
                      "El teniente se molesta: «Eso fue culpa de un voluntario nuevo. Póngalo como observación y no como no conformidad».",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Escucho su explicación y la dejo como insumo para el análisis de causa, pero mantengo la clasificación porque la evidencia muestra el incumplimiento",
                        correcta: true,
                        retro: "Integridad e imparcialidad. El hallazgo describe el sistema, no busca culpables, y la causa la analizará el proceso.",
                      },
                      {
                        texto: "Lo cambio a observación para mantener una buena relación",
                        retro: "Suavizar un hallazgo para evitar conflictos le quita valor a la auditoría y deja el problema sin tratar.",
                      },
                    ],
                  },
                  {
                    situacion: "Termina la recolección de evidencia.",
                    pregunta: "¿Cómo cierra la auditoría?",
                    opciones: [
                      {
                        texto: "Hago la reunión de cierre, presento los hallazgos y las conclusiones, acuerdo los plazos del plan de acción y luego entrego el informe",
                        correcta: true,
                        retro: "Así se cierra bien: el proceso entiende los hallazgos, la dirección recibe el informe y queda definido el seguimiento.",
                      },
                      {
                        texto: "Envío el informe por correo dentro de un mes, sin reunión de cierre",
                        retro: "Sin cierre, los hallazgos pueden sorprender o malinterpretarse, y las acciones se demoran.",
                      },
                    ],
                  },
                  {
                    situacion: "Dos meses después, el proceso informa que ya corrigió la no conformidad.",
                    pregunta: "¿Qué hace usted en el seguimiento?",
                    opciones: [
                      {
                        texto: "Verifico que se analizó la causa, que se implementaron las acciones y que las inspecciones recientes usan la lista vigente",
                        correcta: true,
                        retro: "El seguimiento confirma que la acción fue eficaz. Ahí se cierra el ciclo.",
                      },
                      {
                        texto: "La doy por cerrada porque el teniente lo confirmó por correo",
                        retro: "La palabra del auditado no reemplaza la evidencia de eficacia.",
                      },
                    ],
                  },
                ],
                exito: "¡Auditoría impecable! Abrió con claridad, verificó con una muestra, redactó un hallazgo sólido, se mantuvo imparcial, cerró bien e hizo seguimiento a la eficacia.",
                fracaso: "La confianza en la auditoría se perdió. Recuerde: apertura clara, evidencia de una muestra adecuada, hallazgos con requisito y evidencia, imparcialidad, cierre y seguimiento.",
                dice: "Llegó el momento de juntarlo todo. Usted es el auditor.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Ante una no conformidad: reaccione (controle y corrija), analice la causa, actúe, verifique la eficacia y registre.",
                  "La corrección arregla lo que pasó; la acción correctiva elimina la causa.",
                  "La norma no impone herramienta de análisis: los cinco porqués e Ishikawa son las más usadas. Busque el proceso, no al culpable.",
                  "En la versión 2026, la mejora continua queda en 10.1: es la siguiente vuelta del PHVA.",
                  "Una auditoría sólida: apertura, muestras, hallazgos con requisito y evidencia, imparcialidad, cierre y seguimiento.",
                ],
                insignia: "Auditor interno en formación",
                cierre: "Terminó la parte práctica. En el desafío final pondrá a prueba todo lo aprendido. Recuerde que, para auditar en su organización, también debe cumplir la competencia que ella defina para sus auditores internos.",
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
        statement: "¿Cuál es la edición vigente de ISO 9001 en octubre de 2026?",
        explanation:
          "ISO publicó ISO 9001:2026 el 16 de septiembre de 2026. Reemplaza a la versión 2015 y a su Enmienda 1:2024. Las organizaciones certificadas con la 2015 tienen hasta el 30 de septiembre de 2029 para hacer la transición.",
        options: [
          { text: "ISO 9001:2008", ok: false },
          { text: "ISO 9001:2015, sin cambios", ok: false },
          { text: "ISO 9001:2026, publicada en septiembre de 2026", ok: true },
          { text: "ISO 9001:2024", ok: false },
        ],
      },
      {
        statement: "Verdadero o falso: ISO, la Organización Internacional de Normalización, audita a las empresas y emite los certificados ISO 9001.",
        explanation:
          "Falso. ISO publica la norma. Los certificados los emiten organismos de certificación independientes; en Colombia, el organismo nacional de acreditación es el ONAC.",
        type: "verdadero_falso",
        options: VF(false),
      },
      {
        statement: "¿Cuál de estos NO es uno de los siete principios de la gestión de la calidad?",
        explanation:
          "Los siete principios son enfoque al cliente, liderazgo, compromiso de las personas, enfoque a procesos, mejora, toma de decisiones basada en la evidencia y gestión de las relaciones. La inspección total no es un principio.",
        options: [
          { text: "Enfoque al cliente", ok: false },
          { text: "Toma de decisiones basada en la evidencia", ok: false },
          { text: "Gestión de las relaciones", ok: false },
          { text: "Inspección final del cien por ciento de los productos", ok: true },
        ],
      },
      {
        statement: "En la lógica del ciclo PHVA aplicada a ISO 9001, el capítulo 9 (Evaluación del desempeño) corresponde a:",
        explanation:
          "El capítulo 9 (seguimiento, medición, auditoría interna y revisión por la dirección) es la etapa de verificar. El 6 es planificar, el 7 y el 8 hacer, y el 10 actuar.",
        options: [
          { text: "Planificar", ok: false },
          { text: "Hacer", ok: false },
          { text: "Verificar", ok: true },
          { text: "Actuar", ok: false },
        ],
      },
      /* ---- Módulo 2 ---- */
      {
        statement:
          "Una empresa fabrica exclusivamente según los planos que le envían sus clientes y quiere declarar que el diseño y desarrollo (8.3) no le aplica. ¿Qué es lo correcto?",
        explanation:
          "Un requisito se puede declarar no aplicable, con justificación, si eso no afecta la capacidad de entregar productos conformes ni la satisfacción del cliente. Si la empresa no diseña, es el caso típico.",
        options: [
          { text: "Puede hacerlo, justificándolo, porque no diseña y eso no afecta la conformidad de sus productos", ok: true },
          { text: "No puede: todos los requisitos de la norma aplican siempre", ok: false },
          { text: "Puede excluir cualquier requisito que le resulte costoso", ok: false },
          { text: "Solo puede hacerlo si ISO lo autoriza por escrito", ok: false },
        ],
      },
      {
        statement: "Según la versión 2026, ¿qué debe promover la alta dirección de forma explícita, además de lo que ya pedía la versión 2015?",
        explanation:
          "La versión 2026 agrega en el liderazgo la promoción de una cultura de la calidad y de un comportamiento ético, y en la toma de conciencia pide que el personal los conozca.",
        options: [
          { text: "Una cultura de la calidad y un comportamiento ético", ok: true },
          { text: "El nombramiento de un representante de la dirección", ok: false },
          { text: "La certificación en ISO 14001", ok: false },
          { text: "La eliminación de los indicadores de gestión", ok: false },
        ],
      },
      {
        statement: "¿Cuál de estos objetivos de la calidad está mejor formulado?",
        explanation:
          "Un objetivo de la calidad debe ser coherente con la política y medible, y planificarse con responsable, plazo y forma de evaluación. Las demás opciones son aspiraciones generales o acciones.",
        options: [
          { text: "Ser los mejores del sector", ok: false },
          { text: "Mejorar la calidad", ok: false },
          {
            text: "Lograr que el 95 % de las atenciones se hagan dentro del tiempo pactado con el cliente antes de diciembre, medido cada mes por el coordinador de servicio",
            ok: true,
          },
          { text: "Comprar una aplicación nueva", ok: false },
        ],
      },
      {
        statement: "Verdadero o falso: para cumplir el numeral 6.1, ISO 9001 obliga a usar una matriz de riesgos con una metodología específica.",
        explanation:
          "Falso. La norma pide determinar riesgos y oportunidades y planificar acciones proporcionales a su impacto, pero no impone un método único ni un formato.",
        type: "verdadero_falso",
        options: VF(false),
      },
      /* ---- Módulo 3 ---- */
      {
        statement:
          "Se descubre que el calibrador con que se inspeccionan las piezas tenía la calibración vencida y mide de más. Además de calibrarlo, la organización debe:",
        explanation:
          "Cuando un equipo de medición resulta fuera de especificación, hay que determinar si la validez de los resultados anteriores se vio afectada y tomar las acciones necesarias, incluso con el cliente.",
        options: [
          { text: "Evaluar si los resultados de las mediciones anteriores siguen siendo válidos y tomar acciones", ok: true },
          { text: "Nada más: con calibrarlo es suficiente", ok: false },
          { text: "Desechar todos los equipos de medición de la planta", ok: false },
          { text: "Cambiar de laboratorio de calibración sin revisar lo ya medido", ok: false },
        ],
      },
      {
        statement: "¿Qué diferencia hay entre la verificación y la validación del diseño?",
        explanation:
          "La verificación comprueba que las salidas del diseño cumplen las entradas. La validación comprueba que el producto o servicio sirve para el uso previsto, en condiciones reales.",
        options: [
          { text: "Ninguna: son dos nombres para lo mismo", ok: false },
          { text: "La verificación comprueba que las salidas cumplen las entradas; la validación, que el producto sirve para el uso previsto", ok: true },
          { text: "La verificación la hace el cliente y la validación el diseñador", ok: false },
          { text: "La validación solo aplica a productos físicos, no a servicios", ok: false },
        ],
      },
      {
        statement:
          "Verdadero o falso: un producto que no cumple los requisitos puede entregarse si el cliente lo autoriza de forma expresa mediante una concesión, y se deja registro.",
        explanation:
          "Verdadero. La concesión es una de las formas de tratar una salida no conforme. Se registran la no conformidad, las acciones, la concesión y quién autorizó la liberación.",
        type: "verdadero_falso",
        options: VF(true),
      },
      /* ---- Módulo 4 ---- */
      {
        statement: "¿Cuál es la diferencia entre una corrección y una acción correctiva?",
        explanation:
          "La corrección arregla la no conformidad que ya ocurrió. La acción correctiva elimina su causa para que no se repita ni ocurra en otro lugar, y se verifica su eficacia.",
        options: [
          { text: "La corrección arregla lo que ya ocurrió; la acción correctiva elimina la causa para que no se repita", ok: true },
          { text: "Son lo mismo, solo cambia quién las firma", ok: false },
          { text: "La acción correctiva es una corrección más rápida", ok: false },
          { text: "La corrección solo la puede ordenar el auditor", ok: false },
        ],
      },
      {
        statement: "El jefe de compras se ofrece a auditar su propio proceso. ¿Qué principio de auditoría de ISO 19011 se vería afectado?",
        explanation:
          "La independencia exige no auditar el propio trabajo y actuar sin conflictos de interés. ISO 9001 también pide elegir auditores que aseguren objetividad e imparcialidad.",
        options: [
          { text: "Independencia", ok: true },
          { text: "Confidencialidad", ok: false },
          { text: "Enfoque basado en riesgos", ok: false },
          { text: "Ninguno, porque es una auditoría interna", ok: false },
        ],
      },
      {
        statement: "Verdadero o falso: si una organización no recibe quejas, puede concluir que sus clientes están satisfechos sin hacer ningún otro seguimiento.",
        explanation:
          "Falso. La norma pide hacer seguimiento a la percepción del cliente con los métodos que la organización defina. Muchos clientes insatisfechos no se quejan: simplemente se van.",
        type: "verdadero_falso",
        options: VF(false),
      },
      {
        statement: "¿Qué debe contener un hallazgo de no conformidad bien redactado?",
        explanation:
          "Un hallazgo sólido indica el requisito incumplido, la evidencia objetiva verificable y la descripción del incumplimiento. No señala culpables ni impone la solución.",
        options: [
          { text: "El requisito incumplido, la evidencia objetiva y la descripción del incumplimiento", ok: true },
          { text: "El nombre del trabajador culpable", ok: false },
          { text: "La opinión general del auditor sobre el proceso", ok: false },
          { text: "La acción correctiva que el auditado está obligado a tomar", ok: false },
        ],
      },
    ],
  },
};
