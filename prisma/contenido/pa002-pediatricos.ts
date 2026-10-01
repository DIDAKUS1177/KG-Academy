/**
 * CURSO KG-PA-002 · PRIMEROS AUXILIOS PEDIÁTRICOS
 *
 * Borrador redactado por Claude a pedido de Diego, con el motor de lecciones
 * interactivas de KG Academy (cuatro mundos de dos niveles cada uno y un
 * desafío final de quince preguntas).
 *
 * IMPORTANTE: el contenido sigue las recomendaciones vigentes de ILCOR y la
 * AHA para soporte vital básico pediátrico, de la OMS para fiebre y
 * deshidratación, y de la Cruz Roja Colombiana para primeros auxilios en el
 * hogar, adaptadas al contexto colombiano (línea 123). Aun así, está PENDIENTE
 * DE VALIDACIÓN TÉCNICA por los profesionales de la salud de KG antes de
 * publicarlo o certificar a nadie con él.
 */
import type { CursoInteractivo } from "../cursos-interactivos";

const VF = (ok: boolean) => [
  { text: "Verdadero", ok },
  { text: "Falso", ok: !ok },
];

const VALENTINA = { nombre: "Valentina Herrera", rol: "Enfermera pediátrica", avatar: "paramedico" as const };

export const PEDIATRICOS: CursoInteractivo = {
  code: "KG-PA-002",
  slug: "primeros-auxilios-pediatricos",
  title: "Primeros Auxilios Pediátricos",
  subtitle:
    "Lactantes y niños: valoración, RCP pediátrica, atragantamiento, fiebre, alergias y accidentes en el hogar y en el jardín.",
  objective:
    "Capacitar al participante en la atención inicial de emergencias en lactantes y niños, reconociendo las diferencias anatómicas y fisiológicas frente al adulto, para que valore al niño, active la línea 123 a tiempo y aplique RCP pediátrica, desobstrucción de la vía aérea y los primeros auxilios ante fiebre, convulsiones, deshidratación, alergias y accidentes del hogar mientras llega la ayuda.",
  targetAudience:
    "Padres, cuidadores, docentes, personal de jardines infantiles y trabajadores con población infantil a cargo.",
  requirements:
    "Se recomienda haber cursado Primeros Auxilios Básicos. Las maniobras de RCP y desobstrucción se complementan con práctica presencial en maniquí.",
  methodology:
    "100% virtual y en formato de videojuego: mundos y niveles con vidas, XP y estrellas, misiones de rescate con la vida del niño en juego, decisiones con consecuencias, retos contra el reloj y desafío final.",
  level: "intermedio",
  durationHours: 3,
  categoria: "primeros-auxilios",
  modules: [
    /* ==================================================================== */
    /*  MÓDULO 1                                                             */
    /* ==================================================================== */
    {
      title: "Módulo 1. El paciente pediátrico es diferente",
      description:
        "Por qué un niño no es un adulto en miniatura, cómo evaluarlo en segundos con el triángulo pediátrico y cuándo llamar al 123.",
      lessons: [
        {
          title: "Pequeños, pero no adultos en miniatura",
          description: "Los grupos de edad y las diferencias del cuerpo del niño que cambian la forma de ayudarlo.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: VALENTINA,
            bloques: [
              {
                tipo: "portada",
                titulo: "Pequeños, pero no adultos en miniatura",
                subtitulo: "El cuerpo de un niño funciona distinto, y por eso se le ayuda distinto.",
                objetivos: [
                  "Distinguir a un lactante de un niño para elegir la técnica correcta",
                  "Reconocer las diferencias de la vía aérea, la respiración y la temperatura",
                  "Entender por qué un niño puede verse bien y empeorar de golpe",
                ],
                minutos: 20,
                dice: "Soy Valentina, enfermera pediátrica. Llevo años en urgencias infantiles y le voy a acompañar en todo el curso. Empecemos por lo básico: conocer al pequeño paciente.",
              },
              {
                tipo: "explicacion",
                titulo: "¿Lactante o niño?",
                parrafos: [
                  "En primeros auxilios la edad decide la técnica. La fuerza de las compresiones, la forma de abrir la vía aérea y la maniobra para un atragantamiento cambian según el grupo.",
                  "No necesita saber la edad exacta: basta con una estimación razonable. Si duda entre dos grupos, use la técnica del grupo que mejor se ajuste al tamaño del niño.",
                ],
                puntos: [
                  { titulo: "Lactante", texto: "Desde el nacimiento hasta antes de cumplir un año." },
                  { titulo: "Niño", texto: "Desde el año de edad hasta la pubertad." },
                  {
                    titulo: "Adolescente",
                    texto: "Desde la pubertad (desarrollo de los senos en las niñas, vello en las axilas en los niños) se atiende con las técnicas del adulto.",
                  },
                ],
                clave: "Lactante: menor de un año. Niño: de un año hasta la pubertad. Después, técnicas de adulto.",
              },
              {
                tipo: "tarjetas",
                titulo: "Seis diferencias que importan",
                instruccion: "Toque cada tarjeta para ver por qué cambia la atención.",
                tarjetas: [
                  {
                    etiqueta: "Cabeza",
                    frente: "La cabeza es grande y pesada en proporción al cuerpo.",
                    reverso: "Los niños pequeños caen de cabeza con facilidad, y por la cabeza pierden mucho calor. Cuando caen, revise siempre si se golpearon la cabeza.",
                  },
                  {
                    etiqueta: "Vía aérea",
                    frente: "La vía aérea es estrecha y la lengua es grande para el tamaño de la boca.",
                    reverso: "Un poco de moco, una inflamación o un objeto pequeño la tapan muy rápido. Por eso los atragantamientos son tan peligrosos en ellos.",
                  },
                  {
                    etiqueta: "Nariz",
                    frente: "Los bebés de pocos meses respiran sobre todo por la nariz.",
                    reverso: "Una nariz tapada les dificulta respirar y comer al mismo tiempo. Un lactante que no puede comer por la congestión necesita valoración.",
                  },
                  {
                    etiqueta: "Temperatura",
                    frente: "Tienen mucha piel en relación con su peso.",
                    reverso: "Se enfrían y se deshidratan más rápido que un adulto. Al atenderlos, manténgalos abrigados.",
                  },
                  {
                    etiqueta: "Reservas",
                    frente: "Compensan muy bien… hasta que dejan de hacerlo.",
                    reverso: "Un niño puede verse relativamente bien mientras su cuerpo hace un gran esfuerzo, y empeorar de forma brusca. Las señales tempranas valen oro.",
                  },
                  {
                    etiqueta: "Corazón",
                    frente: "En los niños el paro cardíaco casi nunca empieza en el corazón.",
                    reverso: "Suele ser el final de un problema de respiración o de falta de oxígeno: un atragantamiento, un ahogamiento, una infección respiratoria. Por eso en la RCP pediátrica las ventilaciones son tan importantes.",
                  },
                ],
                dice: "Si se queda con una sola idea de esta lección, que sea la última tarjeta.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Qué técnica le corresponde?",
                instruccion: "Clasifique a cada persona según el grupo de técnicas que se le aplican.",
                categorias: [
                  { id: "lactante", nombre: "Técnicas de lactante", pista: "Menor de un año" },
                  { id: "nino", nombre: "Técnicas de niño", pista: "De un año a la pubertad" },
                  { id: "adulto", nombre: "Técnicas de adulto", pista: "Desde la pubertad" },
                ],
                elementos: [
                  { texto: "Sofía, de 7 meses, que todavía gatea", categoria: "lactante" },
                  { texto: "Martín, de 3 años, en el jardín infantil", categoria: "nino" },
                  { texto: "Un recién nacido de 15 días", categoria: "lactante" },
                  {
                    texto: "Tomás, que cumplió un año la semana pasada",
                    categoria: "nino",
                    porque: "Desde el año se usan las técnicas de niño, aunque todavía sea pequeño. Si su cuerpo es muy pequeño, adapte la fuerza a su tamaño.",
                  },
                  { texto: "Laura, de 9 años, en el colegio", categoria: "nino" },
                  {
                    texto: "Un joven de 15 años con vello en las axilas y la voz cambiada",
                    categoria: "adulto",
                    porque: "Ya presenta signos de pubertad: se atiende con las técnicas del adulto.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Respiran más rápido, y eso es normal",
                parrafos: [
                  "Un lactante respira y late más rápido que un adulto. Lo que en un adulto sería alarmante, en un bebé puede ser normal. Como referencia aproximada, un lactante en reposo respira entre 30 y 60 veces por minuto; un niño en edad escolar, entre 18 y 30.",
                  "Lo que no es normal es el esfuerzo: que se le hunda la piel entre las costillas o debajo del cuello al respirar, que abra y cierre las aletas de la nariz, que mueva la cabeza con cada respiración o que se queje al soltar el aire.",
                  "Para abrir la vía aérea de un lactante, la cabeza va en posición neutra, como si estuviera olfateando: la nariz mirando al techo, sin echar la cabeza hacia atrás. Por su cabeza grande, a veces sirve poner una toalla doblada debajo de los hombros. En el niño se inclina la cabeza un poco hacia atrás y se levanta el mentón.",
                ],
                clave: "En el lactante, cabeza neutra. Echarle la cabeza muy atrás le aplasta la vía aérea, que es blanda.",
              },
              {
                tipo: "decision",
                titulo: "Abrir la vía aérea del bebé",
                situacion:
                  "Mateo, de 6 meses, está acostado boca arriba en el cambiador. No responde cuando le habla ni cuando le toca la planta del pie. Usted va a revisar si respira.",
                pregunta: "¿Cómo coloca su cabeza?",
                opciones: [
                  {
                    texto: "En posición neutra, con la nariz mirando al techo",
                    correcta: true,
                    retro: "Correcto. La posición neutra deja la vía aérea del lactante abierta. Si la cabeza se le va hacia adelante, una toalla doblada bajo los hombros ayuda.",
                  },
                  {
                    texto: "Bien echada hacia atrás, como en un adulto",
                    retro: "En un lactante la tráquea es blanda: si se extiende mucho el cuello, se aplasta y el aire no pasa.",
                  },
                  {
                    texto: "Con una almohada debajo de la cabeza",
                    retro: "La almohada le dobla la cabeza hacia el pecho y le cierra la vía aérea. Si necesita levantar algo, que sean los hombros.",
                  },
                ],
              },
              {
                tipo: "contrarreloj",
                titulo: "¿Qué suele causar el paro en un niño?",
                segundos: 15,
                situacion: "En urgencias pediátricas, la mayoría de los paros cardíacos en niños tienen un mismo punto de partida.",
                pregunta: "¿Cuál es?",
                opciones: [
                  {
                    texto: "La falta de oxígeno por un problema respiratorio",
                    correcta: true,
                    retro: "Exacto. Atragantamientos, ahogamientos e infecciones respiratorias van dejando al niño sin oxígeno hasta que el corazón se detiene. Por eso la RCP pediátrica lleva ventilaciones.",
                  },
                  {
                    texto: "Un infarto, como en los adultos",
                    retro: "El infarto es una causa típica en adultos. En los niños el paro casi siempre llega después de un problema respiratorio.",
                  },
                  {
                    texto: "El susto o un berrinche fuerte",
                    retro: "Un berrinche no causa un paro cardíaco. La causa más frecuente es la falta de oxígeno.",
                  },
                ],
                alAgotar: "Recuérdelo así: en el niño, primero falla la respiración y después el corazón.",
              },
              {
                tipo: "decision",
                titulo: "«Pero si está jugando»",
                situacion:
                  "Juliana, de 2 años, tiene tos desde ayer. Hoy sigue jugando en el jardín, pero usted nota que respira muy rápido, que se le hunde la piel entre las costillas con cada respiración y que ya no quiere el tetero.",
                pregunta: "¿Qué hace?",
                dice: "Recuerde la tarjeta de las reservas.",
                opciones: [
                  {
                    texto: "Seguir jugando con ella: si juega, no está grave",
                    retro: "Los niños compensan muy bien. Ese esfuerzo para respirar es una señal temprana de que su cuerpo está trabajando al límite y puede empeorar de golpe.",
                  },
                  {
                    texto: "Avisar a los padres y que la lleven a valoración médica hoy mismo, vigilándola mientras tanto; si empeora, llamar al 123",
                    correcta: true,
                    retro: "Correcto. El esfuerzo respiratorio es una señal de alarma aunque la niña juegue. Debe verla un médico pronto, y si aparecen labios morados, somnolencia o mucha dificultad, se llama al 123.",
                  },
                  {
                    texto: "Darle un jarabe para la tos que hay en el botiquín",
                    retro: "En el jardín no se dan medicamentos sin fórmula médica y autorización de los padres. Además, el jarabe no resuelve el problema de fondo: hay que valorar por qué le cuesta respirar.",
                  },
                ],
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Lactante: menor de un año. Niño: de un año hasta la pubertad.",
                  "Vía aérea estrecha, cabeza grande y poca reserva: se complican rápido.",
                  "En el lactante, la cabeza va en posición neutra.",
                  "En los niños, el paro suele venir de la falta de oxígeno.",
                  "Un niño que juega también puede estar en peligro: mire cómo respira.",
                ],
                insignia: "Ojo pediátrico",
                cierre: "En la próxima lección va a aprender a evaluar a un niño en treinta segundos, sin tocarlo.",
              },
            ],
          },
        },
        {
          title: "El triángulo de evaluación pediátrica y el 123",
          description: "Evaluar en segundos la apariencia, la respiración y el color de la piel, y pedir ayuda a tiempo.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: VALENTINA,
            bloques: [
              {
                tipo: "portada",
                titulo: "Treinta segundos desde la puerta",
                subtitulo: "Antes de tocar al niño, mírelo. El triángulo de evaluación pediátrica le dice qué tan grave está.",
                objetivos: [
                  "Aplicar los tres lados del triángulo de evaluación pediátrica",
                  "Reconocer las señales de alarma en un niño",
                  "Llamar al 123 y dar la información que salva tiempo",
                ],
                minutos: 20,
                dice: "En urgencias usamos esta herramienta con cada niño que llega. Usted la puede usar en la sala de su casa.",
              },
              {
                tipo: "explicacion",
                titulo: "El triángulo de evaluación pediátrica",
                parrafos: [
                  "Es una mirada rápida, de 30 a 60 segundos, que se hace sin tocar al niño y sin aparatos: solo con los ojos y los oídos. Si el niño está tranquilo en brazos de su cuidador, déjelo ahí mientras lo observa; asustarlo cambia lo que ve.",
                  "Si cualquiera de los tres lados está alterado, el niño necesita ayuda. Si hay dos o tres alterados, o si no responde, es una emergencia: llame al 123.",
                ],
                puntos: [
                  {
                    titulo: "1 · Apariencia",
                    texto: "¿Cómo luce? Tono del cuerpo, si interactúa, si se deja consolar, cómo mira y cómo llora o habla. Es el lado más importante: refleja cómo le llega el oxígeno al cerebro.",
                  },
                  {
                    titulo: "2 · Trabajo respiratorio",
                    texto: "¿Cómo respira? Ruidos como silbidos o ronquidos, piel que se hunde entre las costillas, aleteo de la nariz, cabeceo o una postura rara para poder respirar.",
                  },
                  {
                    titulo: "3 · Circulación de la piel",
                    texto: "¿De qué color está? Palidez marcada, piel con manchas como de mármol o labios y uñas morados.",
                  },
                ],
                clave: "Mire, escuche y decida antes de tocar: apariencia, respiración y color de la piel.",
              },
              {
                tipo: "tarjetas",
                titulo: "Cómo leer la apariencia",
                instruccion: "Cinco preguntas para saber si el niño luce bien o mal.",
                tarjetas: [
                  { etiqueta: "Tono", frente: "¿Se mueve con fuerza o está flojo, como un muñeco de trapo?", reverso: "Un niño sano se mueve, se resiste y patalea. Uno flojo y sin fuerza está en problemas." },
                  { etiqueta: "Interacción", frente: "¿Se fija en lo que pasa a su alrededor?", reverso: "Un niño sano mira, agarra objetos y juega. La indiferencia ante todo es una señal de alarma." },
                  { etiqueta: "Consuelo", frente: "¿Se calma en brazos de su cuidador?", reverso: "Un llanto que no se calma con nada, ni en brazos de la mamá, es preocupante." },
                  { etiqueta: "Mirada", frente: "¿Le sigue con los ojos o tiene la mirada perdida?", reverso: "La mirada fija, vidriosa o perdida indica que algo no anda bien en el cerebro." },
                  { etiqueta: "Llanto o habla", frente: "¿Llora con fuerza o habla como siempre?", reverso: "Un llanto débil, un quejido o un habla confusa son señales de gravedad." },
                ],
              },
              {
                tipo: "clasificar",
                titulo: "¿Qué lado del triángulo está alterado?",
                instruccion: "Ubique cada señal en el lado del triángulo al que pertenece.",
                categorias: [
                  { id: "apariencia", nombre: "Apariencia", pista: "Cómo luce" },
                  { id: "respiracion", nombre: "Trabajo respiratorio", pista: "Cómo respira" },
                  { id: "circulacion", nombre: "Circulación de la piel", pista: "De qué color está" },
                ],
                elementos: [
                  { texto: "Está flojo y no le sigue con la mirada", categoria: "apariencia" },
                  { texto: "Se le hunde la piel entre las costillas", categoria: "respiracion" },
                  { texto: "Tiene los labios morados", categoria: "circulacion" },
                  { texto: "No se calma ni en brazos de su mamá", categoria: "apariencia" },
                  { texto: "Se le escucha un silbido al respirar", categoria: "respiracion" },
                  { texto: "La piel está pálida y con manchas como de mármol", categoria: "circulacion" },
                  {
                    texto: "Se queda sentado, inclinado hacia adelante, y no se deja acostar",
                    categoria: "respiracion",
                    porque: "Es una postura que el niño adopta para poder respirar mejor: no lo obligue a acostarse.",
                  },
                ],
              },
              {
                tipo: "decision",
                titulo: "La siesta que no termina",
                situacion:
                  "En el jardín, a la hora de levantarse de la siesta, Samuel, de 3 años, no se despierta como los demás. Abre los ojos cuando lo mueve, pero los cierra enseguida, está muy pálido y flojo. Respira, pero rápido.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Dejarlo dormir otro rato: debe estar cansado",
                    retro: "Un niño que no despierta bien, flojo y pálido, tiene dos lados del triángulo alterados. Esperar puede costar un tiempo que él no tiene.",
                  },
                  {
                    texto: "Llamar al 123, quedarse a su lado vigilando cómo respira y avisar a la coordinadora y a los padres",
                    correcta: true,
                    retro: "Correcto. Apariencia y circulación alteradas: es una emergencia. Mientras llega la ayuda, no lo deje solo y esté listo para actuar si deja de respirar.",
                  },
                  {
                    texto: "Mojarle la cara con agua fría para despertarlo",
                    retro: "No resuelve nada y retrasa la ayuda. Un niño que no despierta bien necesita atención médica urgente.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Cuándo y cómo llamar al 123",
                parrafos: [
                  "Llame al 123 si el niño no responde o no despierta bien, no respira o respira con mucho esfuerzo, tiene los labios morados, convulsiona por más de 5 minutos o es la primera vez, tiene un sangrado que no para, una reacción alérgica grave, una quemadura extensa, tragó un producto peligroso y tiene síntomas, o sufrió un accidente fuerte.",
                  "Ponga el teléfono en altavoz para tener las manos libres. Hable despacio y responda lo que le pregunten: el operador lo va a guiar. No cuelgue hasta que se lo indiquen.",
                  "Ante la duda, llame. Es preferible una llamada de más que una ambulancia que llega tarde.",
                ],
                puntos: [
                  { titulo: "Dónde", texto: "La dirección exacta, con barrio, municipio y una referencia para encontrarlo." },
                  { titulo: "Qué pasó", texto: "Qué le ocurrió al niño y hace cuánto." },
                  { titulo: "Quién", texto: "La edad aproximada y cómo está: si responde y si respira." },
                  { titulo: "Qué está haciendo", texto: "Lo que usted ya hizo o está haciendo, por ejemplo RCP." },
                ],
                clave: "Número único de emergencias en Colombia: 123. Altavoz encendido y no cuelgue primero.",
              },
              {
                tipo: "ordenar",
                titulo: "La llamada, paso a paso",
                instruccion: "Ordene lo que hace desde que reconoce la emergencia.",
                pasos: [
                  "Verificar que el lugar sea seguro para usted y el niño",
                  "Gritar pidiendo ayuda a quien esté cerca",
                  "Marcar el 123 y poner el teléfono en altavoz",
                  "Dar la dirección exacta con una referencia",
                  "Contar qué pasó, la edad del niño y si responde y respira",
                  "Seguir las instrucciones del operador sin colgar",
                ],
                explicacion:
                  "Así es. La dirección va primero porque, si la llamada se corta, la ambulancia ya sabe adónde ir. Y el altavoz le deja las manos libres para atender al niño.",
              },
              {
                tipo: "mision",
                titulo: "Mañana difícil en el jardín",
                intro:
                  "Son las 9:15 en el jardín infantil. Valeria, de 2 años, llegó con gripa. Ahora está en un rincón, sentada y quieta, respirando con ruido. Usted es la docente a cargo. Cada decisión correcta le gana tiempo; cada error se lo quita.",
                medidor: { etiqueta: "Oxígeno de Valeria", tipo: "vida" },
                velocidad: 1.6,
                penalizacion: 20,
                pasos: [
                  {
                    situacion: "La ve desde la puerta del salón. Está sentada, inclinada hacia adelante, apoyada en las manos.",
                    pregunta: "¿Qué hace primero?",
                    opciones: [
                      {
                        texto: "La observo unos segundos desde donde estoy: apariencia, respiración y color",
                        correcta: true,
                        retro: "Bien. El triángulo se aplica sin asustarla: lo que ve desde la puerta le dice qué tan grave está.",
                      },
                      {
                        texto: "La alzo de inmediato y la acuesto en la colchoneta",
                        retro: "Esa postura inclinada la está ayudando a respirar. Acostarla a la fuerza puede empeorar su respiración.",
                      },
                      {
                        texto: "Termino de recibir a los demás niños y luego voy",
                        retro: "Un niño que respira con ruido no puede esperar a que se acabe la rutina.",
                      },
                    ],
                  },
                  {
                    situacion: "Valeria está muy quieta, no le interesan los juguetes, se le hunde la piel debajo del cuello al respirar y tiene los labios un poco morados.",
                    pregunta: "¿Cómo la califica?",
                    opciones: [
                      {
                        texto: "Los tres lados del triángulo están alterados: es una emergencia",
                        correcta: true,
                        retro: "Exacto. Apariencia, trabajo respiratorio y color están alterados. No hay tiempo que perder.",
                      },
                      {
                        texto: "Es una gripa normal: hay que esperar a que pase",
                        retro: "Una gripa no pone los labios morados. Esto es dificultad respiratoria grave.",
                      },
                    ],
                  },
                  {
                    situacion: "Una auxiliar se acerca a ayudarle.",
                    pregunta: "¿Qué le pide?",
                    opciones: [
                      {
                        texto: "Que llame al 123 en altavoz y luego avise a la coordinadora y a los padres",
                        correcta: true,
                        retro: "Correcto. Usted se queda con la niña y otra persona activa la ayuda.",
                      },
                      {
                        texto: "Que busque un jarabe en el botiquín",
                        retro: "Ningún jarabe resuelve una dificultad respiratoria grave, y en el jardín no se dan medicamentos sin fórmula y autorización.",
                      },
                      {
                        texto: "Que llame primero a los padres para preguntar qué hacer",
                        retro: "A los padres se les avisa, pero la emergencia la atiende el 123. Llamarlos primero retrasa la ambulancia.",
                      },
                    ],
                  },
                  {
                    situacion: "Mientras llega la ambulancia, Valeria pide agua.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "La dejo en la posición que ella escoja, tranquila, sin darle comida ni bebida, y la vigilo",
                        correcta: true,
                        retro: "Bien. Con tanta dificultad para respirar se puede atorar al tragar. Calma, compañía y vigilancia.",
                      },
                      {
                        texto: "Le doy un tetero para que se calme",
                        retro: "Tragar mientras lucha por respirar aumenta el riesgo de que se atore. Nada por la boca.",
                      },
                    ],
                  },
                  {
                    situacion: "De repente, Valeria deja de responder y no se le ve respirar.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "La acuesto boca arriba en el piso, le aviso al 123 y empiezo RCP",
                        correcta: true,
                        retro: "Correcto. Si no responde y no respira, empieza la RCP. En el siguiente mundo va a aprender a hacerla paso a paso.",
                      },
                      {
                        texto: "La sacudo con fuerza para despertarla",
                        retro: "Sacudir a un niño puede lastimarlo y no reemplaza la RCP.",
                      },
                    ],
                  },
                ],
                exito: "¡La ayuda llegó a tiempo! Reconoció la gravedad desde la puerta, activó el 123 sin soltar a la niña y supo cuándo empezar la RCP.",
                fracaso: "Se perdió un tiempo valioso. Recuerde: triángulo desde la puerta, 123 en altavoz y nada por la boca mientras llega la ayuda.",
                dice: "Ponga a prueba su ojo pediátrico. Esta vez el reloj corre de verdad.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "El triángulo: apariencia, trabajo respiratorio y circulación de la piel.",
                  "Se aplica en 30 a 60 segundos, sin tocar al niño.",
                  "Un lado alterado pide ayuda; dos o tres, o si no responde, es emergencia.",
                  "Llame al 123 en altavoz, dé primero la dirección y no cuelgue.",
                  "Ante la duda, llame.",
                ],
                insignia: "Evaluador pediátrico",
                cierre: "Terminó el primer mundo. En el siguiente aprenderá la RCP pediátrica y qué hacer cuando un niño se atraganta.",
              },
            ],
          },
        },
      ],
    },
    /* ==================================================================== */
    /*  MÓDULO 2                                                             */
    /* ==================================================================== */
    {
      title: "Módulo 2. RCP pediátrica y atragantamiento",
      description:
        "Reanimación cardiopulmonar en lactantes y niños, uso del DEA y maniobras de desobstrucción de la vía aérea.",
      lessons: [
        {
          title: "RCP en lactantes y niños",
          description: "Compresiones, ventilaciones, la cadena de supervivencia pediátrica y el DEA con parches pediátricos.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: VALENTINA,
            bloques: [
              {
                tipo: "portada",
                titulo: "RCP en lactantes y niños",
                subtitulo: "Manos al pecho y aire a los pulmones: así se gana tiempo hasta que llegue la ambulancia.",
                objetivos: [
                  "Reconocer cuándo un niño necesita RCP",
                  "Aplicar compresiones y ventilaciones según la edad",
                  "Saber cuándo ir por ayuda si está solo",
                  "Usar el DEA con parches pediátricos",
                ],
                minutos: 20,
                dice: "Ojalá nunca lo necesite. Pero si algún día un niño deja de respirar frente a usted, lo que aprenda hoy puede ser la diferencia.",
              },
              {
                tipo: "explicacion",
                titulo: "La cadena de supervivencia pediátrica",
                parrafos: [
                  "Como en los niños el paro suele llegar por falta de oxígeno, la cadena empieza antes del paro: prevenir accidentes y reconocer a tiempo al niño que respira mal.",
                  "Si el niño no responde y no respira, o solo da bocanadas aisladas, empiece la RCP. Las bocanadas no son una respiración normal. Revise la respiración en no más de 10 segundos.",
                  "Grite pidiendo ayuda y, si tiene celular, llame al 123 en altavoz sin dejar al niño. Si alguien más está con usted, que llame y busque un DEA mientras usted empieza.",
                ],
                puntos: [
                  { titulo: "1 · Prevenir", texto: "Evitar atragantamientos, ahogamientos, caídas e intoxicaciones." },
                  { titulo: "2 · Reconocer y llamar", texto: "Detectar el paro y activar el 123." },
                  { titulo: "3 · RCP de alta calidad", texto: "Compresiones fuertes y rápidas con ventilaciones." },
                  { titulo: "4 · DEA", texto: "Usarlo tan pronto llegue." },
                  { titulo: "5 · Atención avanzada", texto: "La ambulancia y el hospital continúan la atención." },
                ],
                clave: "No responde y no respira con normalidad: llame al 123 y empiece la RCP.",
              },
              {
                tipo: "explicacion",
                titulo: "La técnica según la edad",
                parrafos: [
                  "Acueste al niño boca arriba sobre una superficie firme, como el piso o una mesa en el caso de un lactante. Comprima en el centro del pecho, sobre la mitad inferior del esternón, justo debajo de la línea de los pezones.",
                  "Comprima fuerte y rápido, entre 100 y 120 veces por minuto, hundiendo el pecho al menos un tercio de su grosor y dejándolo volver a su posición después de cada compresión. Interrumpa lo menos posible.",
                  "Cada ventilación dura un segundo y debe hacer que el pecho se levante; no sople más fuerte de lo necesario. Si no puede o no sabe dar ventilaciones, haga al menos compresiones continuas, pero en los niños las ventilaciones son especialmente importantes.",
                ],
                puntos: [
                  {
                    titulo: "Lactante · manos",
                    texto: "Dos pulgares en el centro del pecho, con las manos rodeando el tórax. Si no alcanza a rodearlo, use el talón de una mano.",
                  },
                  { titulo: "Lactante · profundidad", texto: "Un tercio del pecho: unos 4 centímetros." },
                  { titulo: "Lactante · ventilación", texto: "Su boca cubre la boca y la nariz del bebé, con la cabeza en posición neutra." },
                  { titulo: "Niño · manos", texto: "El talón de una mano, o de las dos si el niño es grande, con los brazos rectos." },
                  { titulo: "Niño · profundidad", texto: "Un tercio del pecho: unos 5 centímetros." },
                  { titulo: "Niño · ventilación", texto: "Incline la cabeza un poco hacia atrás, levante el mentón, tape la nariz y cubra su boca." },
                  {
                    titulo: "Ritmo y relación",
                    texto: "100 a 120 compresiones por minuto. Un reanimador: 30 compresiones y 2 ventilaciones. Dos reanimadores entrenados: 15 compresiones y 2 ventilaciones.",
                  },
                ],
                clave: "Un tercio del pecho, 100 a 120 por minuto, 30:2 si está solo y 15:2 si son dos reanimadores entrenados.",
                dice: "Para llevar el ritmo, piense en una canción animada de unos 110 golpes por minuto. Y no tenga miedo de comprimir: lo que le hace daño al niño es que nadie lo haga.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Lactante o niño?",
                instruccion: "Asigne cada detalle de la técnica al grupo de edad que le corresponde.",
                categorias: [
                  { id: "lactante", nombre: "Lactante", pista: "Menor de un año" },
                  { id: "nino", nombre: "Niño", pista: "De un año a la pubertad" },
                ],
                elementos: [
                  { texto: "Comprimir con dos pulgares rodeando el tórax", categoria: "lactante" },
                  { texto: "Comprimir unos 5 centímetros", categoria: "nino" },
                  { texto: "Cubrir con la boca la boca y la nariz", categoria: "lactante" },
                  { texto: "Comprimir con el talón de una o dos manos", categoria: "nino" },
                  { texto: "Comprimir unos 4 centímetros", categoria: "lactante" },
                  { texto: "Tapar la nariz y cubrir solo la boca para ventilar", categoria: "nino" },
                  {
                    texto: "Dejar la cabeza en posición neutra para ventilar",
                    categoria: "lactante",
                    porque: "En el lactante no se extiende el cuello: la tráquea es blanda y se aplasta.",
                  },
                ],
              },
              {
                tipo: "ordenar",
                titulo: "La RCP en orden",
                instruccion: "Ordene los pasos ante un niño que se desploma frente a usted.",
                pasos: [
                  "Verificar que el lugar sea seguro",
                  "Tocarlo y hablarle fuerte para ver si responde",
                  "Gritar pidiendo ayuda y llamar al 123 en altavoz",
                  "Revisar en no más de 10 segundos si respira con normalidad",
                  "Hacer 30 compresiones en el centro del pecho",
                  "Abrir la vía aérea y dar 2 ventilaciones",
                  "Seguir con ciclos de 30:2 y usar el DEA apenas llegue",
                ],
                explicacion:
                  "Correcto. Se empieza por las compresiones para no perder tiempo, y se alternan con ventilaciones porque el niño necesita oxígeno. No se detiene hasta que llegue la ayuda, el niño se mueva o respire con normalidad, o usted ya no pueda más.",
              },
              {
                tipo: "decision",
                titulo: "Solo y sin celular",
                situacion:
                  "Usted cuida a su sobrina Isabella, de 4 años, en una finca. Sale del cuarto unos minutos y, al volver, la encuentra en el piso sin responder y sin respirar. No vio qué pasó. Está solo y el celular quedó en el carro.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Salir corriendo al carro a llamar al 123",
                    retro: "Si nadie vio el desmayo, lo más probable es que el problema sea la falta de oxígeno. Dejarla sin RCP mientras va por el teléfono le quita minutos vitales.",
                  },
                  {
                    texto: "Hacer unos 2 minutos de RCP y luego ir a llamar al 123, llevándola con usted si es pequeña y puede cargarla",
                    correcta: true,
                    retro: "Correcto. En un niño que se desplomó sin testigos, dos minutos de RCP primero le dan oxígeno a su cuerpo. Después se activa el 123 y se vuelve a la RCP lo antes posible.",
                  },
                  {
                    texto: "Esperar a que alguien llegue a la finca",
                    retro: "Cada minuto sin RCP reduce sus posibilidades. Usted es la ayuda que tiene en este momento.",
                  },
                ],
                dice: "Distinga dos casos: si vio que el niño se desplomó de repente, vaya primero por ayuda y por el DEA. Si lo encontró ya así, primero 2 minutos de RCP.",
              },
              {
                tipo: "contrarreloj",
                titulo: "¿A qué ritmo?",
                segundos: 12,
                situacion: "Está haciendo compresiones a un niño de 6 años. Otra persona le pregunta si va muy rápido.",
                pregunta: "¿Cuál es el ritmo correcto?",
                opciones: [
                  { texto: "Entre 60 y 80 por minuto", retro: "Es demasiado lento: la sangre no alcanza a circular lo suficiente." },
                  {
                    texto: "Entre 100 y 120 por minuto",
                    correcta: true,
                    retro: "Exacto. Es el mismo ritmo que en el adulto: casi dos compresiones por segundo.",
                  },
                  { texto: "Lo más rápido que pueda, sin límite", retro: "Si va demasiado rápido el pecho no alcanza a volver a su posición y el corazón no se llena de sangre." },
                ],
                alAgotar: "Entre 100 y 120 por minuto, igual que en el adulto. Practíquelo con una canción.",
              },
              {
                tipo: "explicacion",
                titulo: "El DEA también sirve en niños",
                parrafos: [
                  "El desfibrilador externo automático (DEA) analiza el ritmo del corazón y, si hace falta, da una descarga. Le va diciendo en voz alta qué hacer. Úselo tan pronto llegue, sin detener la RCP más de lo necesario.",
                  "En lactantes y niños menores de 8 años (o de menos de 25 kilos, si conoce el peso) use los parches pediátricos o el modo pediátrico si el equipo los tiene. Si no los hay, use los parches de adulto: es mejor eso que no usar el DEA.",
                  "Los parches no se deben tocar entre sí. Si el pecho es pequeño, ponga uno en el centro del pecho y el otro en la mitad de la espalda. Nadie debe tocar al niño mientras el equipo analiza o descarga.",
                ],
                clave: "Parches pediátricos si los hay; si no, los de adulto. Si no caben sin tocarse, uno adelante y otro atrás.",
              },
              {
                tipo: "decision",
                titulo: "El DEA de la empresa",
                situacion:
                  "En la fiesta de fin de año de la empresa, un niño de 5 años se desploma mientras juega. Un compañero hace RCP y le traen el DEA del edificio. Al abrirlo, usted ve que solo tiene parches de adulto.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "No usar el DEA porque no es para niños",
                    retro: "Si no hay parches pediátricos, se usan los de adulto. No usar el DEA puede quitarle al niño su mejor oportunidad.",
                  },
                  {
                    texto: "Cortar los parches de adulto para que queden más pequeños",
                    retro: "Un parche cortado no funciona bien y puede quemar la piel. Se usan completos.",
                  },
                  {
                    texto: "Usar los parches de adulto, uno en el centro del pecho y otro en la espalda si no caben sin tocarse",
                    correcta: true,
                    retro: "Correcto. Es la forma segura de usar los parches de adulto en un niño pequeño. Siga las instrucciones de voz y retome la RCP enseguida.",
                  },
                ],
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "No responde y no respira con normalidad: 123 y RCP.",
                  "Lactante: dos pulgares rodeando el tórax, unos 4 cm. Niño: una o dos manos, unos 5 cm.",
                  "100 a 120 por minuto. 30:2 un reanimador; 15:2 dos reanimadores entrenados.",
                  "Solo, sin teléfono y sin haber visto el desmayo: 2 minutos de RCP y luego a llamar.",
                  "DEA apenas llegue, con parches pediátricos si los hay.",
                ],
                insignia: "Corazón pequeño, manos firmes",
                cierre: "La RCP se aprende de verdad con las manos. Complemente este curso con práctica presencial en maniquí.",
              },
            ],
          },
        },
        {
          title: "Atragantamiento: cuando algo se atora",
          description: "Obstrucción leve y grave, golpes en la espalda, compresiones en el pecho del lactante y compresiones abdominales en el niño.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: VALENTINA,
            bloques: [
              {
                tipo: "portada",
                titulo: "Cuando algo se atora",
                subtitulo: "Una uva, una moneda o un trozo de salchicha pueden tapar la vía aérea de un niño en segundos.",
                objetivos: [
                  "Distinguir una obstrucción leve de una grave",
                  "Desobstruir la vía aérea de un lactante",
                  "Desobstruir la vía aérea de un niño",
                  "Saber qué hacer si deja de responder",
                ],
                minutos: 20,
                dice: "Los niños se llevan todo a la boca. Esta es una de las emergencias más frecuentes en casa y en el jardín, y una de las que más vidas se pueden salvar.",
              },
              {
                tipo: "explicacion",
                titulo: "¿Leve o grave?",
                parrafos: [
                  "Lo primero es mirar si el aire todavía pasa. Si el niño tose con fuerza, llora o habla, la obstrucción es leve: su propia tos es lo mejor para sacar el objeto. Anímelo a toser, no le dé golpes y vigílelo sin dejarlo solo.",
                  "Si no puede toser, llorar, hablar ni respirar, o la tos es débil y sin sonido, la obstrucción es grave y hay que actuar ya. Pida a alguien que llame al 123 mientras usted empieza las maniobras.",
                ],
                puntos: [
                  { titulo: "Obstrucción leve", texto: "Tose con fuerza, llora o habla. Respira, aunque con dificultad." },
                  { titulo: "Obstrucción grave", texto: "No puede toser, llorar ni hablar; tos débil o sin sonido; se agarra el cuello; la cara se pone morada." },
                ],
                clave: "Si tose con fuerza, déjelo toser. Si no puede toser, llorar ni hablar, actúe ya.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Pasa el aire?",
                instruccion: "Clasifique cada situación.",
                categorias: [
                  { id: "leve", nombre: "Obstrucción leve", pista: "Animar a toser y vigilar" },
                  { id: "grave", nombre: "Obstrucción grave", pista: "Maniobras ya" },
                ],
                elementos: [
                  { texto: "Tose con fuerza y llora entre tosidos", categoria: "leve" },
                  { texto: "Abre la boca pero no sale ningún sonido", categoria: "grave" },
                  { texto: "Le dice «se me fue por el otro lado» mientras tose", categoria: "leve", porque: "Si habla, el aire pasa. Su tos es la mejor herramienta." },
                  { texto: "Se agarra el cuello con las dos manos y no puede hablar", categoria: "grave" },
                  { texto: "El bebé no puede llorar y se está poniendo morado", categoria: "grave" },
                  { texto: "La tos se vuelve cada vez más débil y sin ruido", categoria: "grave", porque: "Una tos que se debilita indica que el aire ya no pasa bien: la obstrucción se volvió grave." },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "En el lactante: 5 golpes y 5 compresiones",
                parrafos: [
                  "Siéntese o arrodíllese. Ponga al bebé boca abajo sobre su antebrazo, apoyado en su muslo, con la cabeza más baja que el pecho y sosteniéndole la mandíbula con los dedos, sin apretarle el cuello.",
                  "Dé hasta 5 golpes firmes en la espalda, entre los omóplatos, con el talón de la otra mano. Luego voltéelo boca arriba sobre el otro antebrazo, siempre con la cabeza más baja, y dé hasta 5 compresiones en el centro del pecho, justo debajo de la línea de los pezones, con dos dedos o con el talón de la mano libre.",
                  "Repita 5 golpes y 5 compresiones hasta que salga el objeto o el bebé deje de responder. Nunca lo ponga de cabeza sacudiéndolo de los pies ni le dé compresiones en el abdomen.",
                ],
                clave: "Nunca meta el dedo a ciegas en la boca: puede empujar el objeto más adentro. Solo sáquelo si lo ve y lo puede agarrar con facilidad.",
              },
              {
                tipo: "ordenar",
                titulo: "Desobstrucción del lactante",
                instruccion: "Ordene los pasos ante un bebé que no puede llorar ni respirar.",
                pasos: [
                  "Pedir a alguien que llame al 123",
                  "Poner al bebé boca abajo sobre el antebrazo, con la cabeza más baja",
                  "Dar 5 golpes firmes entre los omóplatos",
                  "Voltearlo boca arriba sosteniéndole la cabeza",
                  "Dar 5 compresiones en el centro del pecho",
                  "Repetir los ciclos hasta que salga el objeto o deje de responder",
                ],
                explicacion:
                  "Así es. Los golpes y las compresiones se alternan porque cada maniobra empuja el objeto de una forma distinta. Si el bebé deja de responder, empiece la RCP.",
              },
              {
                tipo: "explicacion",
                titulo: "En el niño: golpes en la espalda y compresiones abdominales",
                parrafos: [
                  "Ubíquese detrás o al lado del niño, inclínelo hacia adelante y dé hasta 5 golpes firmes en la espalda, entre los omóplatos. Si es pequeño, arrodíllese para quedar a su altura.",
                  "Si no sale, rodéelo por detrás con los brazos, ponga el puño con el pulgar hacia adentro un poco por encima del ombligo, bien por debajo del esternón, agárrelo con la otra mano y dé hasta 5 compresiones rápidas hacia adentro y hacia arriba.",
                  "Alterne 5 golpes y 5 compresiones abdominales hasta que salga el objeto o el niño deje de responder. Después de unas compresiones abdominales, el niño siempre debe ser revisado por un médico.",
                ],
                puntos: [
                  {
                    titulo: "Si deja de responder",
                    texto: "Acuéstelo en el piso, confirme que llamaron al 123 y empiece la RCP con compresiones. Antes de cada ventilación mire en la boca: si ve el objeto, sáquelo; si no lo ve, no meta el dedo.",
                  },
                ],
                clave: "Lactante: golpes en la espalda y compresiones en el pecho. Niño: golpes en la espalda y compresiones abdominales.",
              },
              {
                tipo: "decision",
                titulo: "Tos en el almuerzo",
                situacion:
                  "En el comedor del jardín, Emilia, de 5 años, se atora con un trozo de pollo. Está roja, tose con fuerza y entre tosidos alcanza a decir «me ahogo».",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Le doy compresiones abdominales de inmediato",
                    retro: "Si tose con fuerza y habla, el aire pasa. Las maniobras en ese momento pueden desacomodar el objeto y empeorar la obstrucción.",
                  },
                  {
                    texto: "Le doy agua para que pase el bocado",
                    retro: "Beber con la vía aérea parcialmente tapada puede empeorar la situación. Primero que salga el objeto.",
                  },
                  {
                    texto: "La animo a seguir tosiendo, me quedo a su lado y estoy lista para actuar si deja de toser",
                    correcta: true,
                    retro: "Correcto. Su tos es la mejor herramienta. Si la tos se debilita o deja de poder hablar, empiece las maniobras de inmediato.",
                  },
                ],
              },
              {
                tipo: "contrarreloj",
                titulo: "¡El bebé no llora!",
                segundos: 10,
                situacion: "Simón, de 9 meses, se llevó a la boca una pieza pequeña de un juguete. No llora, no tose y se está poniendo morado.",
                pregunta: "¿Qué hace primero?",
                opciones: [
                  {
                    texto: "Le meto el dedo en la boca para buscar la pieza",
                    retro: "Si no la ve, el dedo la puede empujar más adentro y tapar del todo la vía aérea.",
                  },
                  {
                    texto: "Lo pongo boca abajo sobre mi antebrazo y le doy 5 golpes en la espalda",
                    correcta: true,
                    retro: "Correcto. Cabeza más baja que el pecho, 5 golpes firmes entre los omóplatos y luego 5 compresiones en el pecho.",
                  },
                  {
                    texto: "Le doy compresiones en el abdomen",
                    retro: "En los lactantes no se hacen compresiones abdominales: pueden lastimar sus órganos. Se usan golpes en la espalda y compresiones en el pecho.",
                  },
                ],
                alAgotar: "Un bebé que no puede llorar no tiene tiempo de esperar. Boca abajo, cabeza baja y 5 golpes.",
              },
              {
                tipo: "mision",
                titulo: "Uvas en las onces",
                intro:
                  "Es la hora de las onces en el jardín. Martín, de 4 años, se metió varias uvas enteras a la boca y de pronto se pone de pie, asustado, con las manos en el cuello. Usted es la persona más cercana.",
                medidor: { etiqueta: "Oxígeno de Martín", tipo: "vida" },
                velocidad: 2.2,
                penalizacion: 22,
                pasos: [
                  {
                    situacion: "Martín abre la boca, pero no tose ni le sale la voz.",
                    pregunta: "¿Qué tipo de obstrucción es?",
                    opciones: [
                      {
                        texto: "Grave: no puede toser ni hablar",
                        correcta: true,
                        retro: "Exacto. No pasa el aire: hay que actuar ya.",
                      },
                      {
                        texto: "Leve: seguro se le pasa solo",
                        retro: "Si no puede toser ni hablar, el aire no está pasando. No se le va a pasar solo.",
                      },
                    ],
                  },
                  {
                    situacion: "Hay otra docente en el salón.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Le pido que llame al 123 y empiezo las maniobras sin esperar",
                        correcta: true,
                        retro: "Bien. La ayuda viene en camino mientras usted actúa.",
                      },
                      {
                        texto: "Primero llamo a los papás de Martín",
                        retro: "A los padres se les avisa después. Ahora cada segundo es para Martín y para el 123.",
                      },
                    ],
                  },
                  {
                    situacion: "Se ubica a su lado y lo inclina hacia adelante.",
                    pregunta: "¿Qué hace ahora?",
                    opciones: [
                      {
                        texto: "Le doy hasta 5 golpes firmes entre los omóplatos",
                        correcta: true,
                        retro: "Correcto. Si no sale la uva, siguen las compresiones abdominales.",
                      },
                      {
                        texto: "Le meto los dedos en la garganta para sacar las uvas",
                        retro: "A ciegas, los dedos pueden empujar la uva más adentro. Nunca haga barridos a ciegas.",
                      },
                      {
                        texto: "Le doy palmaditas suaves en la espalda estando derecho",
                        retro: "Inclinado hacia adelante y con golpes firmes: así la gravedad ayuda a que salga el objeto.",
                      },
                    ],
                  },
                  {
                    situacion: "La uva no sale. Martín sigue sin poder respirar.",
                    pregunta: "¿Qué sigue?",
                    opciones: [
                      {
                        texto: "Me pongo detrás, puño un poco arriba del ombligo y doy 5 compresiones hacia adentro y hacia arriba",
                        correcta: true,
                        retro: "Bien. Alterne 5 golpes y 5 compresiones abdominales hasta que salga.",
                      },
                      {
                        texto: "Lo cuelgo de los pies y lo sacudo",
                        retro: "Sacudirlo de cabeza puede lastimarlo y no es una maniobra recomendada.",
                      },
                    ],
                  },
                  {
                    situacion: "Tras varios ciclos, Martín se desvanece entre sus brazos y deja de responder.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Lo acuesto con cuidado en el piso y empiezo la RCP, mirando en la boca antes de cada ventilación",
                        correcta: true,
                        retro: "Correcto. Las compresiones del pecho también ayudan a mover el objeto. Si lo ve, sáquelo; si no lo ve, no meta el dedo.",
                      },
                      {
                        texto: "Sigo con las compresiones abdominales de pie",
                        retro: "Si dejó de responder, no se puede sostener de pie. Lo que sigue es la RCP en el piso.",
                      },
                    ],
                  },
                ],
                exito: "¡La uva salió durante la RCP y Martín volvió a respirar! La ambulancia lo lleva a revisión, como debe ser después de estas maniobras.",
                fracaso: "Martín pasó demasiado tiempo sin aire. Recuerde: obstrucción grave, 123, 5 golpes, 5 compresiones abdominales y RCP si deja de responder.",
                dice: "Respire hondo. Usted sabe lo que tiene que hacer.",
              },
              {
                tipo: "tarjetas",
                titulo: "Mejor prevenir: lo que más atraganta",
                tarjetas: [
                  { etiqueta: "Uvas y tomates cherry", frente: "¿Cómo se sirven a un niño pequeño?", reverso: "Cortados a lo largo en cuartos. Enteros tienen el tamaño justo para tapar su vía aérea." },
                  { etiqueta: "Salchichas", frente: "¿En rodajas?", reverso: "No: en tiras a lo largo y luego en trozos pequeños. Las rodajas redondas tapan la vía aérea como un corcho." },
                  { etiqueta: "Maní, crispetas y dulces duros", frente: "¿Desde qué edad?", reverso: "Evítelos en menores de 5 años: son difíciles de masticar y fáciles de aspirar." },
                  { etiqueta: "Objetos pequeños", frente: "Monedas, pilas de botón, imanes, tapas, bombas", reverso: "Si cabe por el tubo de cartón del papel higiénico, es peligroso para un niño pequeño. Las pilas de botón y los imanes son una urgencia aunque no atraganten." },
                  { etiqueta: "Al comer", frente: "¿Puede comer mientras corre o juega?", reverso: "No. Que coma sentado, sin pantallas y siempre acompañado por un adulto." },
                ],
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Si tose con fuerza, llora o habla: anímelo a toser y vigílelo.",
                  "Lactante con obstrucción grave: 5 golpes en la espalda y 5 compresiones en el pecho.",
                  "Niño con obstrucción grave: 5 golpes en la espalda y 5 compresiones abdominales.",
                  "Nunca meta el dedo a ciegas en la boca.",
                  "Si deja de responder: 123 y RCP, mirando en la boca antes de ventilar.",
                ],
                insignia: "Vía aérea despejada",
                cierre: "Terminó el segundo mundo. Practique estas maniobras en maniquí: en el momento real, sus manos recordarán lo que practicaron.",
              },
            ],
          },
        },
      ],
    },
    /* ==================================================================== */
    /*  MÓDULO 3                                                             */
    /* ==================================================================== */
    {
      title: "Módulo 3. Fiebre, convulsiones, deshidratación y reacciones alérgicas",
      description:
        "Cuidar a un niño con fiebre, actuar ante una convulsión febril, reconocer y prevenir la deshidratación, y responder a una reacción alérgica grave.",
      lessons: [
        {
          title: "Fiebre y convulsiones febriles",
          description: "Qué es la fiebre, cuándo es una señal de alarma y qué hacer si el niño convulsiona.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: VALENTINA,
            bloques: [
              {
                tipo: "portada",
                titulo: "Fiebre y convulsiones febriles",
                subtitulo: "La fiebre asusta, pero lo que importa es cómo luce el niño.",
                objetivos: [
                  "Medir la temperatura y reconocer la fiebre",
                  "Aplicar medidas seguras de cuidado",
                  "Identificar las señales de alarma",
                  "Actuar ante una convulsión febril",
                ],
                minutos: 20,
                dice: "La fiebre es la consulta más frecuente en pediatría. Casi siempre es una defensa del cuerpo; nuestro trabajo es saber cuándo deja de ser solo eso.",
              },
              {
                tipo: "explicacion",
                titulo: "Qué es la fiebre y cómo cuidarla",
                parrafos: [
                  "Se habla de fiebre cuando la temperatura llega a 38 °C o más. Mídala con un termómetro digital, por ejemplo en la axila; tocar la frente no es una medida confiable.",
                  "La fiebre es una respuesta del cuerpo contra una infección. Más que el número del termómetro, importa cómo luce el niño: si juega, come y está alerta cuando le baja la temperatura, es una buena señal.",
                  "Vístalo con ropa liviana, ofrézcale líquidos con frecuencia (en los lactantes, leche materna o su leche habitual) y déjelo descansar. Los medicamentos para la fiebre solo se dan como los indique el médico, con la dosis que corresponde a su peso.",
                ],
                puntos: [
                  { titulo: "Nunca aspirina", texto: "En niños y adolescentes la aspirina puede causar una enfermedad grave del hígado y el cerebro (síndrome de Reye)." },
                  { titulo: "Nada de alcohol ni baños fríos", texto: "Frotar alcohol o bañarlo en agua fría o con hielo le causa escalofríos y malestar, y el alcohol se absorbe por la piel." },
                  { titulo: "No lo abrigue de más", texto: "Envolverlo en cobijas atrapa el calor y sube la temperatura." },
                ],
                clave: "Todo lactante menor de 3 meses con 38 °C o más debe ir a urgencias de inmediato, aunque se vea bien.",
              },
              {
                tipo: "tarjetas",
                titulo: "¿Mito o realidad?",
                tarjetas: [
                  {
                    frente: "La fiebre alta daña el cerebro.",
                    reverso: "Mito. La fiebre por sí sola no daña el cerebro. Lo que preocupa es la enfermedad que la causa, y por eso se vigilan las señales de alarma.",
                  },
                  {
                    frente: "Los paños con alcohol bajan la fiebre más rápido.",
                    reverso: "Mito. El alcohol se absorbe por la piel del niño y puede intoxicarlo. No lo use.",
                  },
                  {
                    frente: "Que la fiebre baje con el medicamento descarta algo grave.",
                    reverso: "Mito. Una infección grave también puede bajar con medicamento. Lo que tranquiliza es que el niño luzca bien, juegue y coma.",
                  },
                  {
                    frente: "Un bebé de 2 meses con fiebre debe ir a urgencias aunque se vea bien.",
                    reverso: "Realidad. En los menores de 3 meses la fiebre puede ser la única señal de una infección grave.",
                  },
                ],
              },
              {
                tipo: "clasificar",
                titulo: "¿En casa o a urgencias?",
                instruccion: "Decida qué necesita cada niño con fiebre.",
                categorias: [
                  { id: "casa", nombre: "Cuidar en casa y vigilar", pista: "Consultar si persiste o empeora" },
                  { id: "urgencias", nombre: "Urgencias o 123 ya", pista: "Señal de alarma" },
                ],
                elementos: [
                  { texto: "Niño de 3 años con 38,3 °C que juega y toma líquidos", categoria: "casa" },
                  { texto: "Bebé de 2 meses con 38,2 °C", categoria: "urgencias", porque: "Todo menor de 3 meses con fiebre va a urgencias, aunque se vea bien." },
                  { texto: "Manchas rojas o moradas en la piel que no se borran al presionarlas", categoria: "urgencias", porque: "Pueden ser señal de una infección grave en la sangre." },
                  { texto: "Está muy somnoliento y cuesta despertarlo", categoria: "urgencias" },
                  { texto: "Le cuesta respirar o se le hunden las costillas", categoria: "urgencias" },
                  { texto: "Tiene el cuello rígido y llora al moverle la cabeza", categoria: "urgencias" },
                  { texto: "Niña de 5 años con fiebre desde esta mañana, que come y está alerta", categoria: "casa" },
                  { texto: "Lleva más de 8 horas sin orinar", categoria: "urgencias", porque: "Es una señal de deshidratación." },
                ],
              },
              {
                tipo: "decision",
                titulo: "Fiebre en el jardín",
                situacion:
                  "Antonia, de 3 años, amaneció bien, pero a media mañana está decaída y caliente. Usted le toma la temperatura: 38,5 °C. Responde, toma agua y no tiene ninguna señal de alarma.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Le quito la ropa abrigada, le ofrezco líquidos, la dejo descansar vigilada y llamo a los padres para que la recojan y consulten",
                    correcta: true,
                    retro: "Correcto. Medidas de cuidado, vigilancia y aviso a la familia. Si aparece cualquier señal de alarma, se llama al 123.",
                  },
                  {
                    texto: "Le doy la mitad de una aspirina del botiquín de los adultos",
                    retro: "La aspirina está contraindicada en niños, y en el jardín no se dan medicamentos sin fórmula médica y autorización de los padres.",
                  },
                  {
                    texto: "La baño con agua fría para bajarle la temperatura rápido",
                    retro: "El agua fría le da escalofríos y malestar, y no se recomienda. Ropa liviana y líquidos son suficientes mientras la recogen.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "La convulsión febril",
                parrafos: [
                  "Algunos niños, sobre todo entre los 6 meses y los 5 años, convulsionan cuando la temperatura sube rápido. El niño pierde el conocimiento, se pone rígido y tiene sacudidas de brazos y piernas; puede ponerse morado alrededor de la boca.",
                  "Asusta mucho, pero casi siempre dura menos de 5 minutos y el niño se recupera. Después queda somnoliento y confundido un rato.",
                  "Durante la convulsión: póngalo en el piso, lejos de objetos con los que se pueda golpear, aflójele la ropa y mire el reloj. No lo sujete ni le meta nada en la boca: ni dedos, ni cucharas, ni trapos. No se va a tragar la lengua. Cuando pare, póngalo de lado en posición de recuperación y vigile su respiración.",
                ],
                puntos: [
                  { titulo: "Llame al 123 si…", texto: "Dura más de 5 minutos, le cuesta respirar, no se despierta después, se repite o es la primera vez que le pasa." },
                  { titulo: "Siempre", texto: "Después de una convulsión febril, el niño debe ser valorado por un médico para buscar la causa de la fiebre." },
                ],
                clave: "Proteja, cronometre, nada en la boca, de lado cuando pare y llame.",
              },
              {
                tipo: "ordenar",
                titulo: "Ante una convulsión",
                instruccion: "Ordene lo que hace cuando un niño empieza a convulsionar.",
                pasos: [
                  "Mantener la calma y mirar la hora",
                  "Ponerlo en el piso y retirar los objetos cercanos",
                  "Aflojarle la ropa del cuello",
                  "Dejar que la convulsión pase, sin sujetarlo ni meterle nada en la boca",
                  "Cuando pare, ponerlo de lado en posición de recuperación",
                  "Vigilar su respiración y llamar al 123 o llevarlo a valoración",
                ],
                explicacion:
                  "Así es. Saber cuánto duró es clave para el médico y para decidir si es una emergencia. La posición de lado permite que salga la saliva y mantiene la vía aérea abierta.",
              },
              {
                tipo: "contrarreloj",
                titulo: "Los dientes apretados",
                segundos: 10,
                situacion: "Un niño de 2 años con fiebre está convulsionando y tiene los dientes apretados. Alguien trae una cuchara para metérsela en la boca.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Le meto la cuchara para que no se muerda la lengua",
                    retro: "Meter objetos puede romperle los dientes, lastimarle la boca o tapar la vía aérea. Nada en la boca.",
                  },
                  {
                    texto: "Le sujeto los brazos y las piernas con fuerza",
                    retro: "Sujetarlo no detiene la convulsión y lo puede lastimar.",
                  },
                  {
                    texto: "No le meto nada en la boca, lo protejo de golpes y cuento el tiempo",
                    correcta: true,
                    retro: "Correcto. El niño no se va a tragar la lengua. Protéjalo, mire el reloj y póngalo de lado cuando pare.",
                  },
                ],
                alAgotar: "Nada en la boca y nada de sujetarlo: proteja y cronometre.",
              },
              {
                tipo: "mision",
                titulo: "Convulsión en la sala",
                intro:
                  "Son las 8 de la noche. Su hijo Juan José, de 18 meses, tiene fiebre desde la tarde. Está en el sofá y de pronto se pone rígido, pone los ojos en blanco y empieza a sacudir los brazos y las piernas.",
                medidor: { etiqueta: "Seguridad de Juan José", tipo: "vida" },
                velocidad: 1.5,
                penalizacion: 22,
                pasos: [
                  {
                    situacion: "Está en el borde del sofá, junto a la mesa de centro de vidrio.",
                    pregunta: "¿Qué hace primero?",
                    opciones: [
                      {
                        texto: "Lo bajo con cuidado al piso, retiro la mesa y miro la hora",
                        correcta: true,
                        retro: "Bien. En el piso no se cae, y saber la hora le dirá cuánto duró.",
                      },
                      {
                        texto: "Lo cargo y lo sacudo para que reaccione",
                        retro: "Sacudirlo no detiene la convulsión y puede lastimarlo.",
                      },
                      {
                        texto: "Lo meto a la ducha con agua fría",
                        retro: "Un niño que convulsiona en la ducha puede golpearse o aspirar agua. Nunca lo bañe durante una convulsión.",
                      },
                    ],
                  },
                  {
                    situacion: "Sigue con sacudidas y le sale saliva por la boca.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Le aflojo la ropa y espero a su lado sin meterle nada en la boca",
                        correcta: true,
                        retro: "Correcto. La saliva saldrá mejor cuando lo ponga de lado al terminar.",
                      },
                      {
                        texto: "Le meto los dedos para sacarle la lengua",
                        retro: "Se puede lastimar usted y lastimarlo a él. No se va a tragar la lengua.",
                      },
                    ],
                  },
                  {
                    situacion: "Es la primera vez que le pasa. Su pareja está en la casa.",
                    pregunta: "¿Qué le pide?",
                    opciones: [
                      {
                        texto: "Que llame al 123 mientras yo me quedo con el niño",
                        correcta: true,
                        retro: "Bien. Una primera convulsión siempre se consulta, y el 123 lo guía mientras tanto.",
                      },
                      {
                        texto: "Que busque en internet qué hacer",
                        retro: "El 123 le da instrucciones profesionales y envía ayuda. No pierda tiempo buscando.",
                      },
                    ],
                  },
                  {
                    situacion: "A los 2 minutos las sacudidas paran. Juan José respira, pero está muy dormido.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Lo pongo de lado en posición de recuperación y vigilo su respiración",
                        correcta: true,
                        retro: "Correcto. De lado, la vía aérea queda abierta y la saliva sale.",
                      },
                      {
                        texto: "Le doy jugo para que se despierte",
                        retro: "Somnoliento puede atorarse al tragar. Nada por la boca hasta que esté bien despierto.",
                      },
                      {
                        texto: "Lo dejo boca arriba en el sofá para que duerma",
                        retro: "Boca arriba y dormido, la saliva o un vómito le pueden tapar la vía aérea.",
                      },
                    ],
                  },
                  {
                    situacion: "Llega la ambulancia.",
                    pregunta: "¿Qué información es la más útil?",
                    opciones: [
                      {
                        texto: "A qué hora empezó, cuánto duró y cómo fueron los movimientos",
                        correcta: true,
                        retro: "Exacto. Esa información orienta al médico.",
                      },
                      {
                        texto: "Que se asustó mucho",
                        retro: "Es comprensible, pero lo que necesita el equipo de salud es la duración y cómo fue la convulsión.",
                      },
                    ],
                  },
                ],
                exito: "¡Bien hecho! Protegió a Juan José, cronometró la convulsión, lo puso de lado y activó la ayuda. Los médicos tienen todo lo que necesitan.",
                fracaso: "Se pusieron en riesgo la seguridad del niño o su vía aérea. Recuerde: al piso, cronómetro, nada en la boca y de lado cuando pare.",
                dice: "Ahora usted es el papá. Respire, mire la hora y actúe.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Fiebre: 38 °C o más, medida con termómetro.",
                  "Ropa liviana y líquidos; medicamentos solo como los indique el médico. Nunca aspirina.",
                  "Menor de 3 meses con fiebre: urgencias siempre.",
                  "Convulsión: al piso, cronómetro, nada en la boca, de lado cuando pare.",
                  "123 si dura más de 5 minutos, es la primera vez o le cuesta respirar.",
                ],
                insignia: "Guardián de la fiebre",
              },
            ],
          },
        },
        {
          title: "Deshidratación y reacciones alérgicas",
          description: "Reconocer la deshidratación, usar las sales de rehidratación oral y actuar ante una anafilaxia.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: VALENTINA,
            bloques: [
              {
                tipo: "portada",
                titulo: "Deshidratación y alergias",
                subtitulo: "Dos emergencias que avanzan rápido en los niños, y que se pueden frenar a tiempo.",
                objetivos: [
                  "Reconocer las señales de deshidratación",
                  "Preparar y ofrecer las sales de rehidratación oral",
                  "Reconocer una reacción alérgica grave",
                  "Ayudar a usar un autoinyector de adrenalina formulado",
                ],
                minutos: 20,
                dice: "Un niño pequeño se puede deshidratar en horas, y una alergia grave se complica en minutos. Hoy aprenderá a ganarles la carrera.",
              },
              {
                tipo: "explicacion",
                titulo: "Cuando se pierde más líquido del que entra",
                parrafos: [
                  "La diarrea, el vómito y la fiebre hacen que el niño pierda agua y sales. Como tiene poco peso y mucha piel, se deshidrata más rápido que un adulto.",
                  "La Organización Mundial de la Salud recomienda las sales de rehidratación oral (SRO), que se consiguen en farmacias y centros de salud. Prepare el sobre exactamente como dice el empaque, con agua potable o hervida y fría. Ofrézcalas en sorbos pequeños o con cucharita, cada pocos minutos; si vomita, espere unos 10 minutos y vuelva a empezar más despacio.",
                  "Siga dando el pecho y la alimentación habitual. No reemplace las SRO por gaseosas, jugos ni bebidas deportivas: tienen demasiada azúcar y pueden empeorar la diarrea. Deseche lo preparado después de 24 horas.",
                ],
                puntos: [
                  { titulo: "Señales de deshidratación", texto: "Boca y lengua secas, llanto sin lágrimas, orina poco o moja menos pañales, ojos hundidos, mollera hundida en el lactante, irritable o decaído." },
                  { titulo: "Señales de deshidratación grave", texto: "Muy somnoliento o difícil de despertar, no puede beber o vomita todo, manos y pies fríos, la piel pellizcada vuelve muy despacio, no orina en 6 a 8 horas." },
                ],
                clave: "Con señales de deshidratación grave, sangre en las heces o un lactante que no recibe líquidos: urgencias de inmediato.",
              },
              {
                tipo: "clasificar",
                titulo: "¿SRO en casa o urgencias?",
                instruccion: "Clasifique a cada niño con diarrea.",
                categorias: [
                  { id: "casa", nombre: "SRO en casa y vigilar", pista: "Sin señales graves" },
                  { id: "urgencias", nombre: "Urgencias ya", pista: "Señal de alarma" },
                ],
                elementos: [
                  { texto: "Tres deposiciones líquidas hoy, juega, toma bien y orina normal", categoria: "casa" },
                  { texto: "Vomita todo lo que recibe, incluso las SRO a cucharaditas", categoria: "urgencias" },
                  { texto: "Está muy dormido y cuesta despertarlo", categoria: "urgencias" },
                  { texto: "Tiene sangre en las deposiciones", categoria: "urgencias" },
                  { texto: "Un poco de sed y la boca algo seca, pero recibe bien las SRO", categoria: "casa" },
                  { texto: "Bebé con la mollera hundida y llanto sin lágrimas", categoria: "urgencias", porque: "En un lactante, estas señales indican una deshidratación importante." },
                ],
              },
              {
                tipo: "decision",
                titulo: "Diarrea en casa",
                situacion:
                  "Su hija Luciana, de 2 años, tiene diarrea desde ayer. Está un poco decaída pero juega, recibe líquidos y no tiene señales de alarma. Usted tiene un sobre de SRO en el botiquín.",
                pregunta: "¿Qué le ofrece?",
                opciones: [
                  {
                    texto: "Gaseosa sin gas, que es lo que le daba la abuela",
                    retro: "Tiene mucho azúcar y casi nada de sales: puede empeorar la diarrea. No es un reemplazo de las SRO.",
                  },
                  {
                    texto: "Un tetero grande de SRO de una sola vez",
                    retro: "Tomar mucho de golpe le puede provocar vómito. Sorbos pequeños y frecuentes funcionan mejor.",
                  },
                  {
                    texto: "SRO preparadas como dice el empaque, en sorbos pequeños y frecuentes, y su comida habitual",
                    correcta: true,
                    retro: "Correcto. Así repone agua y sales sin provocar vómito. Si aparecen señales de alarma, a urgencias.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Reacciones alérgicas y anafilaxia",
                parrafos: [
                  "Una reacción alérgica puede aparecer minutos después de comer un alimento (maní, huevo, leche, mariscos), de una picadura de abeja o avispa o de un medicamento.",
                  "Si solo aparecen ronchas o picazón en una parte del cuerpo, vigile al niño, avise a la familia y consulte. Pero si además le cuesta respirar, se le hinchan los labios, la lengua o la cara, se pone ronco, vomita repetidamente, se pone pálido, mareado o se desmaya, es una anafilaxia: una emergencia que puede matar en minutos.",
                  "Ante una anafilaxia, llame al 123. Si el niño tiene un autoinyector de adrenalina formulado por su médico, ayúdele a usarlo de inmediato, en la cara externa del muslo, siguiendo las instrucciones del dispositivo y del plan de emergencia del niño.",
                ],
                puntos: [
                  { titulo: "Si está pálido o mareado", texto: "Acuéstelo con las piernas elevadas." },
                  { titulo: "Si le cuesta respirar", texto: "Déjelo sentado en la posición que le sea más cómoda." },
                  { titulo: "Nunca", texto: "Lo ponga de pie de golpe ni lo haga caminar, aunque mejore." },
                ],
                clave: "Un antialérgico en jarabe no detiene una anafilaxia. Ante la duda, 123 y autoinyector si está formulado.",
              },
              {
                tipo: "tarjetas",
                titulo: "¿Mito o realidad?",
                tarjetas: [
                  {
                    frente: "Si el niño mejora después de la adrenalina, ya no necesita ir al hospital.",
                    reverso: "Mito. La reacción puede volver horas después. Siempre debe ser valorado en urgencias.",
                  },
                  {
                    frente: "El autoinyector se puede aplicar a través de la ropa.",
                    reverso: "Realidad. Se aplica en la cara externa del muslo y no hace falta quitar el pantalón. Siga las instrucciones de su dispositivo.",
                  },
                  {
                    frente: "Un antialérgico en jarabe es suficiente si se le cierra la garganta.",
                    reverso: "Mito. Solo la adrenalina actúa rápido en una anafilaxia. El jarabe no reemplaza al autoinyector ni a la ambulancia.",
                  },
                  {
                    frente: "En el jardín deben saber qué niños tienen alergias graves.",
                    reverso: "Realidad. Cada niño con alergia grave debe tener su plan de emergencia y su autoinyector a mano, y el personal debe conocerlos.",
                  },
                ],
              },
              {
                tipo: "contrarreloj",
                titulo: "La picadura",
                segundos: 12,
                situacion:
                  "En el parque del jardín, a Daniel, de 6 años, lo pica una abeja. A los pocos minutos tiene la cara hinchada, se le oye un silbido al respirar y está pálido. En su maleta está su autoinyector formulado.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Le pongo hielo en la picadura y espero a ver si mejora",
                    retro: "La hinchazón de la cara y el silbido al respirar indican anafilaxia. Esperar puede costarle la vida.",
                  },
                  {
                    texto: "Pido que llamen al 123 y le ayudo a usar su autoinyector en la cara externa del muslo",
                    correcta: true,
                    retro: "Correcto. La adrenalina va de inmediato y la ambulancia en camino. Anote la hora en que se aplicó.",
                  },
                  {
                    texto: "Llamo a la mamá para pedir permiso antes de usar el autoinyector",
                    retro: "El autoinyector está formulado justamente para esta situación. Cada minuto cuenta: úselo y avise después.",
                  },
                ],
                alAgotar: "Ante una anafilaxia no hay tiempo para dudar: 123 y autoinyector.",
              },
              {
                tipo: "ordenar",
                titulo: "Ayudar con el autoinyector",
                instruccion: "Ordene los pasos. Recuerde que cada dispositivo trae sus propias instrucciones: síganlas.",
                pasos: [
                  "Pedir que llamen al 123",
                  "Verificar que el autoinyector sea del niño y no esté vencido",
                  "Retirar la tapa de seguridad sin tocar la punta",
                  "Apoyar la punta en la cara externa del muslo y presionar con firmeza",
                  "Sostenerlo el tiempo que indica el dispositivo",
                  "Anotar la hora y acomodar al niño acostado o sentado según cómo respire",
                  "Entregar el autoinyector usado al personal de la ambulancia",
                ],
                explicacion:
                  "Así es. Anotar la hora y entregar el dispositivo usado le dice al equipo de salud cuánta adrenalina recibió el niño y cuándo.",
              },
              {
                tipo: "mision",
                titulo: "La galleta de la integración",
                intro:
                  "Es el día de la familia de la empresa. Sara, de 7 años, hija de una compañera, es alérgica al maní. Comió una galleta del refrigerio y ahora se rasca la boca y le cuesta tragar. Su mamá está en otra actividad y lleva el autoinyector en el bolso.",
                medidor: { etiqueta: "Respiración de Sara", tipo: "vida" },
                velocidad: 2,
                penalizacion: 22,
                pasos: [
                  {
                    situacion: "Sara tiene los labios hinchados, la voz ronca y empieza a toser.",
                    pregunta: "¿Qué está pasando?",
                    opciones: [
                      {
                        texto: "Es una anafilaxia: una reacción alérgica grave",
                        correcta: true,
                        retro: "Exacto. Hinchazón de labios, voz ronca y dificultad para tragar o respirar son señales de anafilaxia.",
                      },
                      {
                        texto: "Es una molestia leve: se le pasa con agua",
                        retro: "Con labios hinchados y voz ronca, la vía aérea se está cerrando. No es leve.",
                      },
                    ],
                  },
                  {
                    situacion: "Hay varios compañeros alrededor.",
                    pregunta: "¿Qué pide?",
                    opciones: [
                      {
                        texto: "Que uno llame al 123 y otro traiga ya a la mamá con el autoinyector",
                        correcta: true,
                        retro: "Bien. Dos tareas a dos personas distintas: así se gana tiempo.",
                      },
                      {
                        texto: "Que busquen un antialérgico en el botiquín de la empresa",
                        retro: "El antialérgico no detiene una anafilaxia. Lo que necesita es la adrenalina de su autoinyector y la ambulancia.",
                      },
                    ],
                  },
                  {
                    situacion: "Sara se siente mareada y está muy pálida.",
                    pregunta: "¿Cómo la acomoda?",
                    opciones: [
                      {
                        texto: "Acostada con las piernas elevadas, sin dejarla levantarse",
                        correcta: true,
                        retro: "Correcto. Si está mareada y pálida, esa posición ayuda a que la sangre llegue al cerebro. Si le costara mucho respirar, la dejaría sentada.",
                      },
                      {
                        texto: "La llevo caminando al parqueadero para esperar la ambulancia",
                        retro: "Ponerla de pie o hacerla caminar en plena anafilaxia puede hacer que colapse.",
                      },
                    ],
                  },
                  {
                    situacion: "Llega la mamá con el autoinyector, temblando de los nervios.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Le ayudo a aplicarlo en la cara externa del muslo, siguiendo las instrucciones del dispositivo, y anotamos la hora",
                        correcta: true,
                        retro: "Bien. La adrenalina actúa en minutos. La hora es un dato clave para la ambulancia.",
                      },
                      {
                        texto: "Lo aplico en el brazo, que es más fácil",
                        retro: "El autoinyector se aplica en la cara externa del muslo, como indica el dispositivo.",
                      },
                    ],
                  },
                  {
                    situacion: "A los pocos minutos, Sara respira mejor y dice que ya se siente bien.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Espero la ambulancia: debe ir a urgencias aunque se sienta bien",
                        correcta: true,
                        retro: "Correcto. La reacción puede volver horas después. Entregue el autoinyector usado al personal de salud.",
                      },
                      {
                        texto: "Cancelo la ambulancia: ya pasó",
                        retro: "La anafilaxia puede regresar. Sara debe quedar en observación médica.",
                      },
                    ],
                  },
                ],
                exito: "¡Sara está a salvo! Reconoció la anafilaxia, activó el 123, la acomodó bien y la adrenalina llegó a tiempo.",
                fracaso: "La reacción avanzó demasiado. Recuerde: anafilaxia es 123 y autoinyector de inmediato, sin esperar a ver si mejora.",
                dice: "Las reacciones alérgicas graves no esperan. Usted tampoco.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Deshidratación: boca seca, sin lágrimas, poca orina, ojos o mollera hundidos.",
                  "SRO preparadas según el empaque, en sorbos pequeños y frecuentes, sin suspender la alimentación.",
                  "Nada de gaseosas ni bebidas deportivas en lugar de las SRO.",
                  "Anafilaxia: dificultad para respirar, hinchazón de cara o labios, mareo o desmayo.",
                  "123 y autoinyector formulado de inmediato; siempre a urgencias después.",
                ],
                insignia: "Escudo contra alergias",
                cierre: "Terminó el tercer mundo. En el último verá los accidentes más frecuentes en la casa y en el jardín, y cómo prevenirlos.",
              },
            ],
          },
        },
      ],
    },
    /* ==================================================================== */
    /*  MÓDULO 4                                                             */
    /* ==================================================================== */
    {
      title: "Módulo 4. Accidentes en el hogar y en el jardín",
      description:
        "Caídas y golpes en la cabeza, quemaduras, intoxicaciones, ahogamiento, lesiones eléctricas y una lista de chequeo para prevenirlos.",
      lessons: [
        {
          title: "Caídas, golpes en la cabeza y quemaduras",
          description: "Las señales de alarma después de un golpe en la cabeza y la atención correcta de una quemadura.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: VALENTINA,
            bloques: [
              {
                tipo: "portada",
                titulo: "Caídas y quemaduras",
                subtitulo: "Los accidentes más frecuentes en la casa y en el jardín, y los que más secuelas dejan si se atienden mal.",
                objetivos: [
                  "Reconocer las señales de alarma después de un golpe en la cabeza",
                  "Saber cuándo no mover a un niño",
                  "Enfriar una quemadura de la forma correcta",
                  "Descartar los remedios caseros que hacen daño",
                ],
                minutos: 20,
                dice: "La mayoría de los accidentes infantiles pasan en casa, a pocos metros de un adulto. Saber qué hacer en los primeros minutos cambia mucho el resultado.",
              },
              {
                tipo: "explicacion",
                titulo: "Después del golpe en la cabeza",
                parrafos: [
                  "Por su cabeza grande y pesada, los niños pequeños caen de cabeza con frecuencia. La mayoría de los golpes son leves: el niño llora enseguida, se calma y sigue jugando. Puede ponerle frío envuelto en un trapo sobre el chichón y vigilarlo durante las siguientes 24 horas.",
                  "Si el niño cayó desde una altura importante, está inconsciente o se queja del cuello, no lo mueva salvo que esté en peligro donde está: puede tener una lesión de la columna. Llame al 123 y manténgale la cabeza quieta, alineada con el cuerpo.",
                ],
                puntos: [
                  { titulo: "Perdió el conocimiento", texto: "Aunque sea por unos segundos." },
                  { titulo: "Vomita varias veces", texto: "O vomita y además está decaído." },
                  { titulo: "Está muy somnoliento o confundido", texto: "Le cuesta despertarse, no reconoce a los suyos o se comporta raro." },
                  { titulo: "Convulsiona", texto: "Cualquier convulsión después de un golpe es una emergencia." },
                  { titulo: "Sale sangre o líquido claro", texto: "Por la nariz o los oídos." },
                  { titulo: "Otras señales", texto: "Pupilas de distinto tamaño, debilidad de un lado del cuerpo, dolor de cabeza que empeora o mollera abombada en el lactante." },
                ],
                clave: "Con cualquiera de estas señales, o si es un lactante que cayó de una altura, llame al 123 o vaya a urgencias.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Vigilar o urgencias?",
                instruccion: "Clasifique a cada niño después de una caída.",
                categorias: [
                  { id: "vigilar", nombre: "Frío local y vigilar 24 horas", pista: "Sin señales de alarma" },
                  { id: "urgencias", nombre: "123 o urgencias", pista: "Señal de alarma" },
                ],
                elementos: [
                  { texto: "Lloró enseguida, le salió un chichón y a los minutos ya juega", categoria: "vigilar" },
                  { texto: "Quedó inconsciente unos segundos y luego despertó", categoria: "urgencias", porque: "Cualquier pérdida de conocimiento requiere valoración médica." },
                  { texto: "Ha vomitado tres veces desde la caída", categoria: "urgencias" },
                  { texto: "Le sale un líquido claro por la nariz", categoria: "urgencias" },
                  { texto: "Se raspó la frente, está alerta y come normal", categoria: "vigilar" },
                  { texto: "Está muy dormido y cuesta despertarlo", categoria: "urgencias" },
                  { texto: "Bebé de 5 meses que se cayó de la cama de los papás y tiene la mollera abombada", categoria: "urgencias" },
                ],
              },
              {
                tipo: "decision",
                titulo: "El camarote",
                situacion:
                  "Felipe, de 6 años, se cayó del camarote. Lloró de inmediato y ahora, una hora después, ha vomitado dos veces y dice que le duele mucho la cabeza.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Le doy algo para el dolor y lo acuesto a dormir",
                    retro: "Vómito repetido y dolor de cabeza fuerte después de un golpe son señales de alarma. Medicarlo y dormirlo puede ocultar que empeora.",
                  },
                  {
                    texto: "Lo llevo a urgencias o llamo al 123, sin darle nada de comer ni medicamentos",
                    correcta: true,
                    retro: "Correcto. Necesita valoración médica hoy. Vigílelo en el camino y llame al 123 si se pone muy somnoliento o convulsiona.",
                  },
                  {
                    texto: "Espero hasta mañana para ver cómo amanece",
                    retro: "Una lesión dentro de la cabeza puede empeorar en horas. No espere con señales de alarma.",
                  },
                ],
              },
              {
                tipo: "decision",
                titulo: "La caída del balcón",
                situacion:
                  "Una niña de 8 años se cayó desde el balcón de un segundo piso al patio. Está consciente, llora y dice que le duele el cuello. Un vecino quiere cargarla para llevarla al carro.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Le pido al vecino que no la mueva, llamo al 123 y le mantengo la cabeza quieta y alineada",
                    correcta: true,
                    retro: "Correcto. Por la altura y el dolor de cuello puede tener una lesión de la columna. Moverla sin inmovilización puede causar un daño permanente.",
                  },
                  {
                    texto: "La cargamos rápido al carro: el hospital está cerca",
                    retro: "Cargarla sin inmovilizar el cuello puede convertir una lesión de la columna en una parálisis. Que la muevan los profesionales.",
                  },
                  {
                    texto: "Le pido que se ponga de pie para ver si puede caminar",
                    retro: "Ponerse de pie con una posible lesión de la columna es muy peligroso. Debe quedarse quieta.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Quemaduras: agua corriente, 20 minutos",
                parrafos: [
                  "Las quemaduras más comunes en niños pequeños son por líquidos calientes: café, sopa, agua de la tina o del tetero. Como su piel es más delgada, se queman más profundo y más rápido que un adulto.",
                  "Aleje al niño de la fuente de calor. Ponga la zona quemada bajo agua corriente fresca, no helada, durante 20 minutos. Mientras tanto, retire la ropa y las joyas que no estén pegadas a la piel; si algo está pegado, no lo arranque.",
                  "Después, cubra la quemadura con papel vinipel limpio o con un paño limpio que no suelte pelusa, sin apretar. Enfríe la quemadura, pero mantenga abrigado al resto del niño: los pequeños se enfrían muy rápido.",
                ],
                puntos: [
                  { titulo: "Consulte siempre", texto: "Si es un lactante, si la quemadura es más grande que la palma de la mano del niño, si tiene ampollas, o si está en la cara, las manos, los pies, los genitales o las articulaciones." },
                  { titulo: "Llame al 123", texto: "Si es extensa, es eléctrica o química, afecta la cara o hubo humo, o si el niño está decaído o le cuesta respirar." },
                  { titulo: "Químicas", texto: "Retire la ropa contaminada y lave con abundante agua corriente durante al menos 20 minutos." },
                ],
                clave: "Agua corriente fresca durante 20 minutos. Nada de hielo, crema dental, mantequilla, café ni remedios caseros.",
              },
              {
                tipo: "tarjetas",
                titulo: "¿Mito o realidad?",
                tarjetas: [
                  { frente: "La crema dental alivia las quemaduras.", reverso: "Mito. Retiene el calor, ensucia la herida y dificulta la valoración médica. Lo mismo pasa con la mantequilla, el aceite, el huevo y el café." },
                  { frente: "El hielo es mejor que el agua porque enfría más.", reverso: "Mito. El hielo daña todavía más la piel quemada y puede enfriar demasiado al niño. Agua corriente fresca." },
                  { frente: "Las ampollas se deben reventar para que sanen.", reverso: "Mito. La ampolla protege la piel de abajo contra la infección. No la reviente." },
                  { frente: "Enfriar la quemadura sirve incluso si ya pasaron varios minutos.", reverso: "Realidad. Enfriarla con agua corriente es útil hasta unas 3 horas después de la quemadura." },
                ],
              },
              {
                tipo: "ordenar",
                titulo: "Atención de una quemadura",
                instruccion: "Ordene los pasos ante un niño que se quemó con un líquido caliente.",
                pasos: [
                  "Alejar al niño de la fuente de calor",
                  "Poner la zona bajo agua corriente fresca",
                  "Retirar la ropa y las joyas que no estén pegadas, sin dejar de enfriar",
                  "Completar 20 minutos de agua corriente",
                  "Cubrir con vinipel limpio o un paño limpio, sin apretar",
                  "Abrigar al niño y llevarlo a valoración o llamar al 123 según la quemadura",
                ],
                explicacion:
                  "Así es. La ropa empapada en líquido caliente sigue quemando, por eso se retira mientras se enfría. Y el vinipel protege sin pegarse a la herida.",
              },
              {
                tipo: "contrarreloj",
                titulo: "¡El café!",
                segundos: 12,
                situacion: "Sebastián, de 2 años, jaló el mantel y se le regó encima un pocillo de café caliente. Tiene la camiseta empapada y el pecho rojo.",
                pregunta: "¿Qué hace primero?",
                opciones: [
                  {
                    texto: "Le pongo crema dental en el pecho",
                    retro: "La crema dental retiene el calor y no enfría. Lo urgente es el agua corriente.",
                  },
                  {
                    texto: "Lo envuelvo en una cobija para calmarlo",
                    retro: "La cobija atrapa el calor de la camiseta empapada y la quemadura sigue avanzando.",
                  },
                  {
                    texto: "Lo llevo al chorro de agua fresca y le quito la camiseta mientras lo enfrío",
                    correcta: true,
                    retro: "Correcto. 20 minutos de agua corriente, cubrir con vinipel y llevarlo a valoración: es una quemadura en el pecho de un niño pequeño.",
                  },
                ],
                alAgotar: "En una quemadura cada segundo cuenta: agua corriente, ya.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Después de un golpe en la cabeza, vigile 24 horas y conozca las señales de alarma.",
                  "Pérdida de conocimiento, vómito repetido, somnolencia o convulsión: 123 o urgencias.",
                  "Caída de altura o dolor de cuello: no lo mueva y llame al 123.",
                  "Quemadura: agua corriente fresca durante 20 minutos y cubrir con vinipel.",
                  "Nada de hielo, crema dental ni remedios caseros, y no reviente ampollas.",
                ],
                insignia: "Protector del hogar",
              },
            ],
          },
        },
        {
          title: "Intoxicaciones, ahogamiento, electricidad y prevención",
          description: "Qué hacer si un niño traga un producto peligroso, cae al agua o recibe una descarga, y la lista de chequeo para el hogar y el jardín.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: VALENTINA,
            bloques: [
              {
                tipo: "portada",
                titulo: "Peligros silenciosos",
                subtitulo: "Un frasco al alcance, un balde con agua o un tomacorriente destapado bastan para una tragedia.",
                objetivos: [
                  "Actuar ante una intoxicación o la ingestión de un producto",
                  "Rescatar y atender a un niño que se está ahogando",
                  "Atender una lesión eléctrica sin convertirse en víctima",
                  "Revisar el hogar y el jardín con una lista de chequeo",
                ],
                minutos: 20,
                dice: "Último nivel. Estos accidentes son silenciosos: un niño que se ahoga no grita y uno que se intoxica puede verse bien al principio.",
              },
              {
                tipo: "explicacion",
                titulo: "Si se tomó o se comió algo peligroso",
                parrafos: [
                  "Los niños pequeños prueban todo: medicamentos, productos de limpieza, plaguicidas, cosméticos, pilas de botón. Muchas intoxicaciones ocurren con productos guardados en botellas de gaseosa o al alcance de la mano.",
                  "Retire lo que tenga en la boca, aleje el producto y guarde el empaque: le van a preguntar el nombre, la cantidad aproximada y la hora. No provoque el vómito ni le dé leche, aceite, agua con sal ni ningún remedio casero: algunos productos queman de nuevo al subir y otros pasan a los pulmones.",
                  "Si el niño no responde, convulsiona, le cuesta respirar o está muy somnoliento, llame al 123 de inmediato. Si está bien, llame igual a la Línea Nacional de Toxicología o al 123 para que le digan qué hacer: muchos productos hacen efecto horas después.",
                ],
                puntos: [
                  { titulo: "Línea Nacional de Toxicología", texto: "01 8000 916012, gratuita, del Ministerio de Salud y Protección Social." },
                  { titulo: "Línea de emergencias", texto: "123, si hay síntomas o cualquier duda." },
                  { titulo: "Pilas de botón e imanes", texto: "Si se tragó una, vaya a urgencias de inmediato aunque se vea bien: pueden causar lesiones graves por dentro en pocas horas." },
                  { titulo: "En la piel o los ojos", texto: "Lave con abundante agua corriente durante al menos 15 a 20 minutos." },
                ],
                clave: "No provoque el vómito. Guarde el empaque y llame a la Línea Nacional de Toxicología (01 8000 916012) o al 123.",
              },
              {
                tipo: "decision",
                titulo: "La botella de gaseosa",
                situacion:
                  "Su hijo Andrés, de 3 años, tomó un sorbo de una botella de gaseosa en la que alguien guardó límpido. Llora, dice que le arde la boca y respira normal.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Le meto los dedos en la garganta para que vomite",
                    retro: "Provocar el vómito hace que el producto vuelva a quemar el esófago y la boca, y puede pasar a los pulmones.",
                  },
                  {
                    texto: "Le doy un vaso grande de leche para cortar el efecto",
                    retro: "La leche no neutraliza el producto y puede provocar vómito. No le dé nada sin indicación.",
                  },
                  {
                    texto: "Le retiro lo que tenga en la boca, guardo la botella y llamo a la Línea Nacional de Toxicología o al 123",
                    correcta: true,
                    retro: "Correcto. Con el nombre del producto y la cantidad, le dirán qué hacer y adónde llevarlo. Si aparece dificultad para respirar o babeo intenso, 123 de inmediato.",
                  },
                ],
                dice: "Y para que no vuelva a pasar: nunca guarde productos químicos en envases de bebidas.",
              },
              {
                tipo: "explicacion",
                titulo: "Agua y electricidad",
                parrafos: [
                  "Un niño pequeño se puede ahogar en pocos centímetros de agua: un balde, una tina, una alberca, un tanque o una piscina inflable. Pasa en silencio y en segundos, a veces con adultos cerca.",
                  "Si encuentra a un niño en el agua, sáquelo solo si puede hacerlo sin ponerse en riesgo. Si no responde y no respira con normalidad, llame al 123 y empiece la RCP. En el ahogamiento el problema es la falta de oxígeno, así que las ventilaciones son indispensables. No pierda tiempo intentando sacarle el agua ni le haga compresiones en el abdomen.",
                  "Todo niño rescatado del agua debe ir a urgencias, aunque se vea bien: pueden aparecer complicaciones en los pulmones horas después. Quítele la ropa mojada y abríguelo.",
                ],
                puntos: [
                  {
                    titulo: "Descarga eléctrica · primero usted",
                    texto: "No toque al niño mientras siga en contacto con la corriente. Baje el breaker o los tacos. Si no puede, sepárelo con un objeto seco que no conduzca, como un palo de escoba de madera, parado sobre una superficie seca.",
                  },
                  {
                    titulo: "Descarga eléctrica · después",
                    texto: "Revise si responde y respira; si no, 123 y RCP. Enfríe las quemaduras con agua. Toda lesión eléctrica va a urgencias: la corriente puede dañar el corazón y los órganos por dentro aunque la piel se vea poco afectada.",
                  },
                ],
                clave: "Niño rescatado del agua o que recibió una descarga: siempre a urgencias, aunque se vea bien.",
              },
              {
                tipo: "contrarreloj",
                titulo: "La alberca",
                segundos: 12,
                situacion: "Encuentra a su sobrina de 2 años boca abajo dentro de la alberca del patio, que tenía agua hasta la mitad.",
                pregunta: "¿Qué hace primero?",
                opciones: [
                  {
                    texto: "La saco del agua de inmediato y reviso si responde y respira",
                    correcta: true,
                    retro: "Correcto. La alberca no representa riesgo para usted: sáquela ya y evalúela.",
                  },
                  {
                    texto: "La cuelgo de los pies para sacarle el agua",
                    retro: "Así no sale el agua de los pulmones y se pierde un tiempo vital. Lo que necesita es oxígeno: RCP si no respira.",
                  },
                  {
                    texto: "Salgo a la calle a pedir ayuda",
                    retro: "Mientras busca ayuda, la niña sigue en el agua. Primero sáquela y grite pidiendo ayuda desde ahí.",
                  },
                ],
                alAgotar: "En un ahogamiento cada segundo sin oxígeno cuenta. Sáquela ya.",
              },
              {
                tipo: "mision",
                titulo: "Silencio en el patio",
                intro:
                  "Es domingo en la casa. Mientras usted contesta una llamada, Tomás, de 3 años, sale al patio. Cuando vuelve a mirar, lo ve flotando boca abajo en la piscina inflable. Su hermana está en la cocina. Cada segundo cuenta.",
                medidor: { etiqueta: "Oxígeno de Tomás", tipo: "vida" },
                velocidad: 2.3,
                penalizacion: 22,
                pasos: [
                  {
                    situacion: "La piscina inflable tiene unos 40 centímetros de agua.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Lo saco del agua de inmediato y lo acuesto boca arriba en el piso",
                        correcta: true,
                        retro: "Bien. No hay riesgo para usted: sacarlo ya es lo primero.",
                      },
                      {
                        texto: "Corro a la cocina a buscar a mi hermana",
                        retro: "Tomás sigue boca abajo en el agua. Grite desde el patio, pero sáquelo primero.",
                      },
                    ],
                  },
                  {
                    situacion: "Le habla fuerte y le toca los hombros. No responde.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Grito pidiendo ayuda y que mi hermana llame al 123 en altavoz",
                        correcta: true,
                        retro: "Correcto. La ayuda se activa sin que usted se separe del niño.",
                      },
                      {
                        texto: "Le echo agua fría en la cara",
                        retro: "Ya estuvo en el agua. No es lo que necesita: necesita que lo evalúen y pedir ayuda.",
                      },
                    ],
                  },
                  {
                    situacion: "Revisa la respiración durante 10 segundos: no respira, solo hace una bocanada aislada.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Empiezo RCP: 30 compresiones con una mano y 2 ventilaciones",
                        correcta: true,
                        retro: "Bien. Las bocanadas no son respiración normal. En el ahogamiento, las ventilaciones son indispensables.",
                      },
                      {
                        texto: "Le aprieto el abdomen para sacarle el agua",
                        retro: "No saca el agua de los pulmones, puede provocar vómito y retrasa la RCP.",
                      },
                      {
                        texto: "Espero, porque hizo una respiración",
                        retro: "Una bocanada aislada no es respirar. Si no respira con normalidad, se empieza RCP.",
                      },
                    ],
                  },
                  {
                    situacion: "Después de unos ciclos, Tomás tose, vomita agua y empieza a respirar y llorar.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Lo pongo de lado, le quito la ropa mojada, lo abrigo y espero la ambulancia vigilando su respiración",
                        correcta: true,
                        retro: "Correcto. De lado no se atora con el vómito, y abrigado no se enfría.",
                      },
                      {
                        texto: "Lo siento y le doy agua para que se pase el susto",
                        retro: "Acaba de vomitar y aún está confundido: puede atorarse. Nada por la boca.",
                      },
                    ],
                  },
                  {
                    situacion: "Ya llora fuerte y parece estar bien. Su hermana pregunta si cancelan la ambulancia.",
                    pregunta: "¿Qué responde?",
                    opciones: [
                      {
                        texto: "No: todo niño que se ahogó debe ser valorado en urgencias",
                        correcta: true,
                        retro: "Exacto. Pueden aparecer complicaciones en los pulmones horas después.",
                      },
                      {
                        texto: "Sí: ya se recuperó",
                        retro: "Que llore no descarta daño en los pulmones. Debe ir a urgencias.",
                      },
                    ],
                  },
                ],
                exito: "¡Tomás respira y va camino a urgencias! Lo sacó rápido, activó el 123 sin separarse de él y no dudó en empezar la RCP.",
                fracaso: "Tomás pasó demasiado tiempo sin oxígeno. Recuerde: sacarlo, 123, RCP con ventilaciones y siempre a urgencias.",
                dice: "Esta es la misión más difícil del curso. Use todo lo que aprendió en el segundo mundo.",
              },
              {
                tipo: "decision",
                titulo: "El cable de la lámpara",
                situacion:
                  "Escucha un grito en el cuarto y encuentra a su hija de 4 años en el piso, agarrada a un cable pelado de una lámpara conectada. Está temblando y no se suelta.",
                pregunta: "¿Qué hace primero?",
                opciones: [
                  {
                    texto: "La agarro del brazo y la jalo con fuerza",
                    retro: "Si la toca mientras la corriente pasa por ella, la corriente pasará también por usted y serán dos víctimas.",
                  },
                  {
                    texto: "Corto la corriente desde el breaker o desconecto la lámpara desde el enchufe sin tocar el cable dañado",
                    correcta: true,
                    retro: "Correcto. Solo cuando no hay corriente se acerca. Después revise si responde y respira, y llévela a urgencias.",
                  },
                  {
                    texto: "Le echo un vaso de agua para que se suelte",
                    retro: "El agua conduce la electricidad y aumenta el riesgo para ella y para usted.",
                  },
                ],
              },
              {
                tipo: "clasificar",
                titulo: "Ronda de seguridad",
                instruccion: "Usted revisa la casa y el jardín infantil. Clasifique lo que encuentra.",
                categorias: [
                  { id: "seguro", nombre: "Está bien", pista: "Protege al niño" },
                  { id: "peligro", nombre: "Hay que corregirlo", pista: "Riesgo de accidente" },
                ],
                elementos: [
                  { texto: "Medicamentos y productos de limpieza bajo llave y en lo alto", categoria: "seguro" },
                  { texto: "Límpido guardado en una botella de gaseosa", categoria: "peligro", porque: "El niño lo confunde con una bebida. Los químicos van siempre en su envase original." },
                  { texto: "Tomacorrientes con protectores", categoria: "seguro" },
                  { texto: "Balde con agua del trapeado en el patio", categoria: "peligro", porque: "Un niño pequeño se puede ahogar en pocos centímetros de agua. Vacíe baldes y tinas apenas los use." },
                  { texto: "Mangos de las ollas hacia adentro de la estufa", categoria: "seguro" },
                  { texto: "Ventana del segundo piso sin malla ni seguro, con una silla debajo", categoria: "peligro" },
                  { texto: "Bebé durmiendo boca arriba en su cuna, sin almohadas ni peluches", categoria: "seguro", porque: "Así se reduce el riesgo de asfixia y de muerte súbita del lactante." },
                  { texto: "Pilas de botón sueltas en la mesa de noche", categoria: "peligro" },
                  { texto: "Tanque de agua tapado y con seguro", categoria: "seguro" },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Lista de chequeo para la casa y el jardín",
                parrafos: [
                  "La mayoría de estos accidentes se pueden evitar. Use esta lista para revisar su casa o su jardín infantil, y repítala cada vez que el niño aprenda algo nuevo: gatear, caminar, trepar o abrir puertas.",
                ],
                puntos: [
                  { titulo: "Intoxicaciones", texto: "Medicamentos y químicos bajo llave, en lo alto y en su envase original. Pilas de botón e imanes fuera de su alcance." },
                  { titulo: "Agua", texto: "Nunca deje a un niño solo en la tina ni cerca del agua. Baldes vacíos, tanques y albercas tapados, piscinas con cerco." },
                  { titulo: "Caídas", texto: "Rejas en las escaleras, mallas o seguros en ventanas y balcones, muebles altos anclados a la pared, sin sillas debajo de las ventanas." },
                  { titulo: "Quemaduras", texto: "Mangos de las ollas hacia adentro, niños fuera de la cocina, bebidas calientes lejos de ellos y agua del baño probada antes de meterlos." },
                  { titulo: "Electricidad", texto: "Protectores en los tomacorrientes y cables en buen estado, lejos de su alcance." },
                  { titulo: "Atragantamiento y asfixia", texto: "Alimentos cortados en trozos pequeños, juguetes adecuados a la edad, cordones de cortinas fuera de su alcance y bebé durmiendo boca arriba en superficie firme." },
                  { titulo: "Preparación", texto: "Botiquín completo, el 123 y la Línea Nacional de Toxicología visibles, planes de emergencia de niños con alergias y personal entrenado en primeros auxilios pediátricos." },
                ],
                clave: "La mejor emergencia es la que no ocurre: revise, corrija y vigile.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Intoxicación: no provoque el vómito, guarde el empaque y llame a la Línea Nacional de Toxicología (01 8000 916012) o al 123.",
                  "Pila de botón tragada: urgencias de inmediato.",
                  "Ahogamiento: sacarlo si es seguro, 123 y RCP con ventilaciones; siempre a urgencias.",
                  "Descarga eléctrica: primero corte la corriente; después atienda y lleve a urgencias.",
                  "Prevenir es la mejor atención: use la lista de chequeo.",
                ],
                insignia: "Héroe de los pequeños",
                cierre: "Terminó todos los mundos del curso. En el desafío final va a poner a prueba lo aprendido. Recuerde complementar la RCP y la desobstrucción con práctica presencial.",
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
      /* Módulo 1 */
      {
        statement: "En primeros auxilios, ¿hasta qué edad se considera lactante a un bebé?",
        explanation: "Lactante es el menor de un año. Desde el año hasta la pubertad se usan las técnicas de niño.",
        options: [
          { text: "Hasta los 6 meses", ok: false },
          { text: "Hasta antes de cumplir un año", ok: true },
          { text: "Hasta los 2 años", ok: false },
          { text: "Hasta que deja el tetero", ok: false },
        ],
      },
      {
        statement: "¿Cuáles son los tres lados del triángulo de evaluación pediátrica?",
        explanation: "Apariencia, trabajo respiratorio y circulación de la piel. Se evalúan en 30 a 60 segundos, sin tocar al niño.",
        options: [
          { text: "Pulso, presión arterial y temperatura", ok: false },
          { text: "Edad, peso y estatura", ok: false },
          { text: "Apariencia, trabajo respiratorio y circulación de la piel", ok: true },
          { text: "Llanto, apetito y sueño", ok: false },
        ],
      },
      {
        statement: "¿Cuál de estas situaciones es una señal para llamar de inmediato al 123?",
        explanation: "Los labios morados con mucha dificultad para respirar indican que al niño no le está llegando suficiente oxígeno.",
        options: [
          { text: "Labios morados y mucha dificultad para respirar", ok: true },
          { text: "Un raspón en la rodilla después de jugar", ok: false },
          { text: "Llanto fuerte que se calma en brazos de la mamá", ok: false },
          { text: "Un poco de mocos sin dificultad para respirar", ok: false },
        ],
      },
      /* Módulo 2 */
      {
        statement: "Si usted es el único reanimador, ¿qué relación de compresiones y ventilaciones usa en un niño?",
        explanation: "Un reanimador: 30 compresiones y 2 ventilaciones. Con dos reanimadores entrenados se usa 15:2.",
        options: [
          { text: "15 compresiones y 1 ventilación", ok: false },
          { text: "30 compresiones y 2 ventilaciones", ok: true },
          { text: "5 compresiones y 1 ventilación", ok: false },
          { text: "Solo ventilaciones, sin compresiones", ok: false },
        ],
      },
      {
        statement: "¿Qué profundidad deben tener las compresiones en un lactante?",
        explanation: "Al menos un tercio del grosor del pecho: unos 4 centímetros en el lactante y unos 5 en el niño.",
        options: [
          { text: "Apenas 1 centímetro, para no lastimarlo", ok: false },
          { text: "Unos 8 centímetros, como en un adulto grande", ok: false },
          { text: "No importa la profundidad, solo el ritmo", ok: false },
          { text: "Un tercio del pecho, unos 4 centímetros", ok: true },
        ],
      },
      {
        statement:
          "Está solo, sin celular, y encuentra a un niño que no responde y no respira. No vio cuándo se desplomó. ¿Qué hace?",
        explanation:
          "En un niño que se desplomó sin testigos, lo más probable es la falta de oxígeno: primero unos 2 minutos de RCP y luego se activa el 123.",
        options: [
          { text: "Ir a buscar un teléfono sin hacer nada antes", ok: false },
          { text: "Esperar a que alguien llegue", ok: false },
          { text: "Hacer unos 2 minutos de RCP y luego ir a llamar al 123", ok: true },
          { text: "Sacudirlo hasta que reaccione", ok: false },
        ],
      },
      {
        statement: "Un lactante atragantado no puede llorar ni toser. ¿Qué maniobra se aplica?",
        explanation: "En el lactante se alternan 5 golpes en la espalda y 5 compresiones en el pecho. Nunca compresiones abdominales.",
        options: [
          { text: "Compresiones abdominales, como en el adulto", ok: false },
          { text: "Colgarlo de los pies y sacudirlo", ok: false },
          { text: "5 golpes en la espalda y 5 compresiones en el pecho, alternados", ok: true },
          { text: "Darle agua para que pase el objeto", ok: false },
        ],
      },
      {
        statement:
          "Verdadero o falso: si un lactante se atraganta, hay que meterle el dedo en la boca para buscar el objeto aunque no se vea.",
        explanation: "Falso. El barrido a ciegas puede empujar el objeto más adentro. Solo se saca si se ve y se puede agarrar con facilidad.",
        type: "verdadero_falso",
        options: VF(false),
      },
      /* Módulo 3 */
      {
        statement: "Un niño con fiebre empieza a convulsionar. ¿Qué es lo correcto?",
        explanation:
          "Se le protege de golpes, se cronometra y no se le mete nada en la boca. Cuando pare, se pone de lado. Si dura más de 5 minutos o es la primera vez, 123.",
        options: [
          { text: "Protegerlo de golpes, contar el tiempo y no meterle nada en la boca", ok: true },
          { text: "Meterle una cuchara para que no se muerda la lengua", ok: false },
          { text: "Sujetarle con fuerza los brazos y las piernas", ok: false },
          { text: "Meterlo a la ducha con agua fría", ok: false },
        ],
      },
      {
        statement: "Un niño de 2 años tiene diarrea, sin señales de alarma. ¿Qué se le ofrece?",
        explanation:
          "Sales de rehidratación oral preparadas según el empaque, en sorbos pequeños y frecuentes, sin suspender la alimentación ni la leche materna.",
        options: [
          { text: "Gaseosa sin gas", ok: false },
          { text: "Bebidas deportivas", ok: false },
          { text: "Sales de rehidratación oral en sorbos pequeños y frecuentes", ok: true },
          { text: "Nada de líquidos hasta que pare la diarrea", ok: false },
        ],
      },
      {
        statement:
          "A una niña alérgica al maní se le hinchan los labios y le cuesta respirar. Tiene un autoinyector de adrenalina formulado. ¿Qué hace?",
        explanation:
          "Es una anafilaxia: se llama al 123 y se le ayuda a usar el autoinyector en la cara externa del muslo, siguiendo las instrucciones del dispositivo.",
        options: [
          { text: "Darle un antialérgico en jarabe y esperar", ok: false },
          { text: "Llamar al 123 y ayudarle a usar el autoinyector en la cara externa del muslo", ok: true },
          { text: "Darle agua y ponerla a caminar", ok: false },
          { text: "Esperar a que llegue su mamá para decidir", ok: false },
        ],
      },
      {
        statement: "Verdadero o falso: la aspirina es una buena opción para bajar la fiebre en los niños.",
        explanation:
          "Falso. En niños y adolescentes la aspirina puede causar el síndrome de Reye, una enfermedad grave del hígado y el cerebro. Los medicamentos para la fiebre solo se dan como los indique el médico.",
        type: "verdadero_falso",
        options: VF(false),
      },
      /* Módulo 4 */
      {
        statement: "Un niño se quema con un líquido caliente. ¿Qué es lo primero que se hace con la quemadura?",
        explanation:
          "Agua corriente fresca durante 20 minutos. El hielo, la crema dental y los remedios caseros empeoran la lesión.",
        options: [
          { text: "Ponerle hielo directamente", ok: false },
          { text: "Untarle crema dental o mantequilla", ok: false },
          { text: "Reventarle las ampollas", ok: false },
          { text: "Enfriarla con agua corriente fresca durante 20 minutos", ok: true },
        ],
      },
      {
        statement: "Un niño se tomó un producto de limpieza. ¿Qué es lo correcto?",
        explanation:
          "No se provoca el vómito ni se dan remedios caseros. Se guarda el empaque y se llama a la Línea Nacional de Toxicología (01 8000 916012) o al 123.",
        options: [
          { text: "No provocar el vómito, guardar el empaque y llamar a la Línea Nacional de Toxicología o al 123", ok: true },
          { text: "Provocarle el vómito con los dedos", ok: false },
          { text: "Darle leche para cortar el efecto", ok: false },
          { text: "Esperar a ver si le da algún síntoma", ok: false },
        ],
      },
      {
        statement: "Verdadero o falso: un niño pequeño se puede ahogar en pocos centímetros de agua, por ejemplo en un balde o en una alberca.",
        explanation:
          "Verdadero. Basta con unos centímetros de agua y unos segundos. Por eso se vacían los baldes, se tapan tanques y albercas y nunca se deja solo a un niño cerca del agua.",
        type: "verdadero_falso",
        options: VF(true),
      },
    ],
  },
};
