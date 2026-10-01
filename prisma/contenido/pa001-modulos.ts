/**
 * KG-PA-001 · CURSO BÁSICO DE PRIMEROS AUXILIOS · MÓDULOS 4 A 7
 *
 * BORRADOR escrito por Claude a pedido de Diego. Los módulos 1 a 3 son
 * presentaciones de Genially entregadas por KG; estos cuatro se escribieron
 * como lecciones interactivas nativas (src/lib/leccion-interactiva.ts) para
 * completar el temario oficial.
 *
 * IMPORTANTE: está PENDIENTE DE VALIDACIÓN TÉCNICA por los profesionales de
 * salud de KG. El contenido sigue las recomendaciones generales vigentes de
 * primeros auxilios (ILCOR, AHA, IFRC y Cruz Roja Colombiana) para un primer
 * respondiente no profesional, pero nadie debe certificarse con él hasta que
 * KG lo revise y lo apruebe.
 *
 * El Módulo 5 es coherente con la técnica de control de hemorragias del curso
 * KG-PA-004 (prisma/cursos-interactivos.ts).
 */
import type { CursoInteractivo, Pregunta } from "../cursos-interactivos";

const CAMILA = { nombre: "Camila Rojas", rol: "Coordinadora de brigada", avatar: "brigadista" as const };

const VF = (ok: boolean) => [
  { text: "Verdadero", ok },
  { text: "Falso", ok: !ok },
];

export const MODULOS_PA001: CursoInteractivo["modules"] = [
  /* ====================================================================== */
  /*  MÓDULO 4 · VÍA AÉREA Y OVACE                                           */
  /* ====================================================================== */
  {
    title: "Módulo 4. Manejo de la Vía Aérea y Obstrucción (OVACE)",
    description:
      "Abrir y proteger la vía aérea de una persona inconsciente, la posición lateral de seguridad y la obstrucción por cuerpo extraño en casos especiales.",
    lessons: [
      {
        title: "Abrir la vía aérea y la posición lateral de seguridad",
        description:
          "Frente-mentón, tracción mandibular cuando se sospecha trauma y cómo dejar de lado a una persona inconsciente que respira.",
        durationMin: 20,
        contenido: {
          version: 1,
          guia: CAMILA,
          bloques: [
            {
              tipo: "portada",
              titulo: "Una vía aérea abierta",
              subtitulo: "Si el aire no entra, nada de lo demás sirve.",
              objetivos: [
                "Explicar por qué se cierra la vía aérea de una persona inconsciente",
                "Abrirla con la maniobra frente-mentón o con la tracción mandibular, según el caso",
                "Colocar a una persona en posición lateral de seguridad y saber cuándo hacerlo",
              ],
              minutos: 20,
              dice: "Soy Camila Rojas, coordinadora de la brigada. En el módulo 3 vio la RCP y el atragantamiento básico; ahora vamos un paso más allá con la vía aérea.",
            },
            {
              tipo: "explicacion",
              titulo: "Por qué se cierra la vía aérea",
              parrafos: [
                "Cuando una persona pierde el conocimiento, los músculos se relajan. La lengua cae hacia atrás y puede tapar la garganta, aunque la persona siga intentando respirar.",
                "También pueden bloquearla el vómito, la sangre, una prótesis dental suelta o un trozo de comida. Por eso, al abrir la vía aérea, se mira dentro de la boca.",
                "Si ve algo, retírelo con los dedos. Si no lo ve, no meta los dedos a ciegas: puede empujar el objeto más adentro.",
              ],
              puntos: [
                {
                  titulo: "Frente-mentón",
                  texto: "Una mano en la frente para inclinar la cabeza hacia atrás y dos dedos de la otra bajo la parte dura del mentón para levantarlo. Es la maniobra habitual.",
                },
                {
                  titulo: "Tracción mandibular",
                  texto: "Arrodillado detrás de la cabeza, ponga los dedos detrás de los ángulos de la mandíbula, a ambos lados, y empújela hacia adelante sin mover el cuello. Se usa si sospecha trauma.",
                },
              ],
              clave: "Respirar es lo primero. Si con la tracción mandibular no logra abrir la vía aérea, use frente-mentón: sin aire, la persona no sobrevive.",
            },
            {
              tipo: "ordenar",
              titulo: "Frente-mentón paso a paso",
              instruccion: "La persona no responde y no hay sospecha de trauma. Ordene los pasos para abrir la vía aérea y revisar si respira.",
              pasos: [
                "Arrodillarse a un lado de la persona, a la altura de los hombros",
                "Poner una mano en la frente y los dedos de la otra bajo la parte dura del mentón",
                "Inclinar la cabeza hacia atrás y levantar el mentón",
                "Mirar dentro de la boca y retirar solo lo que se vea",
                "Revisar durante no más de 10 segundos si respira con normalidad",
              ],
              explicacion: "Así es. No apriete la parte blanda debajo del mentón: eso empuja la lengua hacia arriba y vuelve a cerrar el paso del aire.",
            },
            {
              tipo: "decision",
              titulo: "Caída del andamio",
              situacion:
                "Un trabajador cayó de un andamio de unos tres metros en la obra. La zona ya es segura. No responde, pero se le ve el pecho moviéndose con dificultad y ronca al respirar.",
              pregunta: "¿Cómo le abre la vía aérea?",
              dice: "Piense en lo que pudo pasarle al cuello en esa caída.",
              opciones: [
                {
                  texto: "Con tracción mandibular, sin mover el cuello",
                  correcta: true,
                  retro: "Correcto. Una caída de altura hace sospechar lesión de columna. La tracción mandibular abre la vía aérea sin inclinar la cabeza. Mientras tanto, que otro llame al 123 y active la brigada.",
                },
                {
                  texto: "Con frente-mentón, inclinando bien la cabeza hacia atrás",
                  retro: "Con sospecha de trauma, inclinar la cabeza puede agravar una lesión del cuello. Empiece por la tracción mandibular y use frente-mentón solo si no logra abrir la vía aérea.",
                },
                {
                  texto: "Sentarlo para que respire mejor",
                  retro: "Sentar a alguien que cayó de altura mueve la columna y puede dejarle una lesión permanente. Además, inconsciente, se le iría la cabeza hacia adelante.",
                },
                {
                  texto: "Ponerle una chaqueta doblada debajo de la cabeza",
                  retro: "Una almohada empuja la barbilla hacia el pecho y cierra todavía más la vía aérea.",
                },
              ],
            },
            {
              tipo: "explicacion",
              titulo: "La posición lateral de seguridad",
              parrafos: [
                "Se usa cuando la persona no responde pero respira con normalidad. De lado, la lengua no tapa la garganta y, si vomita, el líquido sale por la boca en vez de irse a los pulmones.",
                "No se usa si la persona no respira o solo boquea: en ese caso se deja boca arriba y se inicia la RCP. Tampoco se usa de rutina si sospecha lesión de columna; ahí se mantiene la cabeza alineada y, si vomita, se gira en bloque con ayuda.",
                "Una vez de lado, revise la respiración de forma continua. Si deja de respirar con normalidad, vuélvala boca arriba e inicie la RCP. Si está embarazada, póngala sobre el lado izquierdo.",
              ],
              clave: "No responde y respira normal: de lado. No responde y no respira normal: boca arriba y RCP.",
              dice: "Esta posición la va a usar más de lo que cree: desmayos, convulsiones, intoxicaciones.",
            },
            {
              tipo: "ordenar",
              titulo: "Colocar de lado",
              instruccion: "Ordene los pasos para colocar a una persona en posición lateral de seguridad.",
              pasos: [
                "Arrodillarse a un lado y retirarle las gafas y los objetos grandes de los bolsillos",
                "Poner el brazo más cercano a usted en ángulo recto, con la palma hacia arriba",
                "Cruzar el otro brazo sobre el pecho y apoyar el dorso de esa mano contra la mejilla más cercana a usted",
                "Doblar la rodilla de la pierna más lejana, con el pie apoyado en el suelo",
                "Halar de esa rodilla hacia usted para girar a la persona de lado",
                "Acomodar la pierna de arriba en ángulo recto y, con la cabeza ligeramente hacia atrás, revisar que respire",
              ],
              explicacion: "Muy bien. La mano bajo la mejilla sostiene la cabeza y la pierna doblada impide que la persona se voltee boca abajo. Siga vigilando la respiración hasta que llegue la ayuda.",
            },
            {
              tipo: "clasificar",
              titulo: "¿De lado, RCP o no mover?",
              instruccion: "Para cada persona, elija qué hace después de valorarla.",
              categorias: [
                { id: "lado", nombre: "Posición lateral de seguridad", pista: "No responde y respira normal" },
                { id: "rcp", nombre: "Boca arriba y RCP", pista: "No respira normal" },
                { id: "alinear", nombre: "No mover y mantener la cabeza alineada", pista: "Sospecha de trauma" },
              ],
              elementos: [
                {
                  texto: "Se desmayó en la oficina sin golpearse fuerte, no responde y respira con normalidad",
                  categoria: "lado",
                },
                {
                  texto: "No responde y no respira",
                  categoria: "rcp",
                  porque: "Es un paro cardíaco: pida el DEA, llame al 123 e inicie compresiones.",
                },
                {
                  texto: "No responde y solo hace bocanadas aisladas, como si boqueara",
                  categoria: "rcp",
                  porque: "El boqueo no es respiración normal. Trátelo como un paro.",
                },
                {
                  texto: "Cayó de una escalera, no responde y respira con normalidad",
                  categoria: "alinear",
                  porque: "Con sospecha de columna se sostiene la cabeza alineada y se vigila. Si vomita, se gira en bloque con ayuda.",
                },
                {
                  texto: "Terminó una convulsión, sigue sin responder y respira con normalidad",
                  categoria: "lado",
                },
                {
                  texto: "Tomó mucho licor en la integración, no responde, respira y tiene náuseas",
                  categoria: "lado",
                  porque: "De lado, si vomita, no se ahoga con el vómito.",
                },
              ],
            },
            {
              tipo: "contrarreloj",
              titulo: "Vigilar no es opcional",
              segundos: 15,
              situacion:
                "Dejó de lado a una compañera que se desmayó y respiraba bien. Mientras espera la ambulancia, nota que ya no se le mueve el pecho.",
              pregunta: "¿Qué hace?",
              opciones: [
                {
                  texto: "La pongo boca arriba, pido el DEA e inicio compresiones",
                  correcta: true,
                  retro: "Exacto. Si deja de respirar con normalidad es un paro: boca arriba, DEA y RCP de inmediato. Avise al 123 que la situación cambió.",
                },
                {
                  texto: "La dejo de lado y espero a la ambulancia",
                  retro: "La posición lateral es para quien respira. Sin respiración, cada minuto sin RCP reduce mucho sus posibilidades.",
                },
                {
                  texto: "La cambio al otro lado por si es la posición",
                  retro: "Cambiar de lado no la hace respirar. No pierda tiempo: boca arriba y RCP.",
                },
              ],
              alAgotar: "Sin respiración no hay tiempo que perder: boca arriba, DEA y compresiones.",
            },
            {
              tipo: "resumen",
              titulo: "Lo que se lleva de esta lección",
              puntos: [
                "Inconsciente, la lengua puede tapar la garganta.",
                "Frente-mentón de rutina; tracción mandibular si sospecha trauma. Si no logra abrir la vía aérea, respirar es primero.",
                "Retire solo lo que vea en la boca: nunca meta los dedos a ciegas.",
                "No responde y respira normal: posición lateral de seguridad y vigilancia continua.",
                "Si deja de respirar normal: boca arriba, DEA y RCP.",
              ],
              insignia: "Guardián de la vía aérea",
              cierre: "En la siguiente lección vuelve el atragantamiento, ahora con los casos que no salen en el manual básico.",
            },
          ],
        },
      },
      {
        title: "OVACE en casos especiales",
        description:
          "Embarazadas, personas con obesidad, la víctima que pierde el conocimiento y qué hacer si usted se atraganta estando solo.",
        durationMin: 20,
        contenido: {
          version: 1,
          guia: CAMILA,
          bloques: [
            {
              tipo: "portada",
              titulo: "OVACE en casos especiales",
              subtitulo: "La maniobra de Heimlich no siempre se puede hacer igual.",
              objetivos: [
                "Reconocer en segundos una obstrucción grave de la vía aérea",
                "Adaptar la técnica en embarazadas y personas con obesidad",
                "Actuar cuando la víctima pierde el conocimiento",
                "Ayudarse a sí mismo si se atraganta estando solo",
              ],
              minutos: 20,
              dice: "Ya sabe hacer compresiones abdominales. Ahora le muestro qué hacer cuando no se pueden hacer, o cuando no funcionan.",
            },
            {
              tipo: "explicacion",
              titulo: "Repaso en 30 segundos",
              parrafos: [
                "OVACE es la obstrucción de la vía aérea por un cuerpo extraño: casi siempre comida en los adultos.",
                "Si la persona tose con fuerza, habla o llora, la obstrucción es leve: anímela a seguir tosiendo y no la golpee ni le dé agua. Quédese a su lado.",
                "Si no puede hablar, ni toser, ni respirar, se lleva las manos al cuello o los labios se le ponen morados, la obstrucción es grave: pregúntele si se está atorando y, si asiente, actúe ya con compresiones abdominales, como vio en el módulo 3.",
              ],
              clave: "Tos fuerte: anime a toser. No puede hablar ni toser: actúe de inmediato.",
            },
            {
              tipo: "explicacion",
              titulo: "Cuando la técnica cambia",
              parrafos: [
                "Hay situaciones en las que empujar el abdomen no es posible o no es seguro. Para eso existen las compresiones en el pecho.",
                "Se hacen desde atrás, pasando los brazos por debajo de las axilas de la persona. El puño va en el centro del pecho, sobre la mitad inferior del esternón, con la otra mano encima, y se hala con fuerza hacia atrás, hacia usted.",
              ],
              puntos: [
                {
                  titulo: "Embarazo avanzado",
                  texto: "Nunca compresiones abdominales: se hacen compresiones en el pecho para no lastimar al bebé.",
                },
                {
                  titulo: "Persona con obesidad",
                  texto: "Si sus brazos no alcanzan a rodear el abdomen, haga compresiones en el pecho.",
                },
                {
                  titulo: "Pierde el conocimiento",
                  texto: "Bájela al suelo con cuidado, pida el 123 y el DEA, e inicie la RCP. Cada vez que abra la boca para ventilar, mire: si ve el objeto, retírelo.",
                },
                {
                  titulo: "Bebés y niños pequeños",
                  texto: "La técnica es distinta y se enseña en el curso de primeros auxilios pediátricos de KG.",
                },
              ],
              clave: "Aunque el objeto salga, toda persona que recibió compresiones abdominales o en el pecho debe ser valorada por un médico: la maniobra puede causar lesiones internas.",
            },
            {
              tipo: "decision",
              titulo: "Almuerzo en el casino",
              situacion:
                "En el casino de la empresa, una compañera con siete meses de embarazo se lleva las manos al cuello. No puede hablar ni toser y empieza a ponerse morada.",
              pregunta: "¿Qué hace?",
              opciones: [
                {
                  texto: "Darle palmaditas suaves en la espalda y esperar a que tosa",
                  retro: "No está tosiendo: es una obstrucción grave. Esperar puede costarle la vida a ella y al bebé.",
                },
                {
                  texto: "Hacerle compresiones en el pecho desde atrás, con el puño en el centro del esternón",
                  correcta: true,
                  retro: "Correcto. En un embarazo avanzado, las compresiones en el pecho reemplazan a las abdominales. Que alguien llame al 123 y active la brigada mientras usted actúa.",
                },
                {
                  texto: "Hacerle compresiones abdominales como a cualquier adulto",
                  retro: "Con el útero tan grande, empujar el abdomen no desaloja bien el objeto y puede lastimar al bebé. Se hacen en el pecho.",
                },
                {
                  texto: "Darle agua para que pase el bocado",
                  retro: "Si el aire no pasa, el agua tampoco: puede ahogarla todavía más.",
                },
              ],
            },
            {
              tipo: "tarjetas",
              titulo: "¿Mito o realidad?",
              instruccion: "Toque cada tarjeta para ver la respuesta.",
              tarjetas: [
                {
                  frente: "A quien se atora hay que darle agua o pan para que pase el bocado.",
                  reverso: "Mito. Si la vía aérea está bloqueada, lo que le dé por boca empeora la obstrucción.",
                },
                {
                  frente: "Si la persona tose con fuerza, no se le hace la maniobra.",
                  reverso: "Realidad. La tos fuerte es la mejor forma de expulsar el objeto. Anímela y vigílela.",
                },
                {
                  frente: "Hay que meter los dedos hasta el fondo de la garganta para buscar el objeto.",
                  reverso: "Mito. Buscar a ciegas puede empujar el objeto más adentro. Solo se retira lo que se ve.",
                },
                {
                  frente: "Si el objeto salió y la persona ya respira, no necesita médico.",
                  reverso: "Mito. Las compresiones pueden lesionar órganos internos. Siempre debe ser valorada.",
                },
              ],
            },
            {
              tipo: "explicacion",
              titulo: "Si usted se atraganta y está solo",
              parrafos: [
                "Primero intente llamar la atención de alguien: golpee una mesa, acérquese a donde haya gente o salga a un pasillo. Una persona a su lado puede hacerle la maniobra mejor que usted mismo.",
                "Si nadie llega, hágase compresiones abdominales: ponga el puño un poco por encima del ombligo, cúbralo con la otra mano y empuje con fuerza hacia adentro y hacia arriba, varias veces.",
                "También puede apoyar la parte alta del abdomen contra el espaldar de una silla firme o el borde de una mesa y dejar caer el peso del cuerpo con fuerza, una y otra vez, hasta que el objeto salga.",
              ],
              clave: "Silla firme, abdomen contra el espaldar y empujones fuertes. Después, consulte al médico aunque se sienta bien.",
              dice: "Esto puede pasarle en la casa, en el carro o en la oficina a la hora del almuerzo. Vale la pena saberlo.",
            },
            {
              tipo: "contrarreloj",
              titulo: "Solo en la oficina",
              segundos: 12,
              situacion:
                "Se quedó trabajando hasta tarde y come un pandebono en su escritorio. Un pedazo se le atora: no puede toser ni hablar. Ya golpeó la mesa y nadie responde.",
              pregunta: "¿Qué hace?",
              opciones: [
                {
                  texto: "Tomo agua para que el pedazo pase",
                  retro: "Si el aire no pasa, el agua tampoco: puede empeorar la obstrucción y le hace perder segundos.",
                },
                {
                  texto: "Me acuesto en el piso a esperar que se pase",
                  retro: "Acostado no se puede ayudar y la obstrucción no se va a resolver sola.",
                },
                {
                  texto: "Apoyo la parte alta del abdomen contra el espaldar de una silla firme y empujo con fuerza, varias veces",
                  correcta: true,
                  retro: "Correcto. Con su peso contra el espaldar, o con su propio puño, se hace la misma compresión abdominal. Después, consulte al médico.",
                },
              ],
              alAgotar: "Sin aire, tiene muy poco tiempo antes de perder el conocimiento. Silla firme y empujones fuertes, ya.",
            },
            {
              tipo: "clasificar",
              titulo: "¿Qué técnica corresponde?",
              instruccion: "Clasifique cada situación de atragantamiento en un adulto.",
              categorias: [
                { id: "toser", nombre: "Animar a toser", pista: "Obstrucción leve" },
                { id: "abdominal", nombre: "Compresiones abdominales", pista: "Grave, caso habitual" },
                { id: "pecho", nombre: "Compresiones en el pecho", pista: "Grave, caso especial" },
                { id: "rcp", nombre: "RCP", pista: "Perdió el conocimiento" },
              ],
              elementos: [
                { texto: "Tose con fuerza y dice que se le fue por el otro lado", categoria: "toser" },
                { texto: "Adulto consciente que no puede hablar ni toser", categoria: "abdominal" },
                {
                  texto: "Mujer con embarazo avanzado que no puede respirar",
                  categoria: "pecho",
                  porque: "En el embarazo avanzado no se comprime el abdomen.",
                },
                {
                  texto: "Persona con obesidad a la que usted no alcanza a rodear el abdomen",
                  categoria: "pecho",
                },
                {
                  texto: "Se desvaneció mientras usted le hacía la maniobra",
                  categoria: "rcp",
                  porque: "Si pierde el conocimiento, se baja al suelo y se inicia la RCP.",
                },
                {
                  texto: "Usted mismo, solo en la oficina y sin poder respirar",
                  categoria: "abdominal",
                  porque: "Con su propio puño o contra el espaldar de una silla firme.",
                },
              ],
            },
            {
              tipo: "mision",
              titulo: "Atragantamiento en el comedor",
              intro:
                "Es la hora del almuerzo en la planta. Don Hernando, un operario corpulento, se pone de pie de golpe con las manos en el cuello. Usted es brigadista y está en la mesa de al lado. Sin aire, su oxígeno baja cada segundo.",
              medidor: { etiqueta: "Oxígeno del paciente", tipo: "vida" },
              velocidad: 2,
              penalizacion: 20,
              pasos: [
                {
                  situacion: "Don Hernando tiene los ojos muy abiertos y no emite ningún sonido.",
                  pregunta: "¿Qué hace primero?",
                  opciones: [
                    {
                      texto: "Le pregunto si se está atorando y le pido a alguien que llame al 123 y a la brigada",
                      correcta: true,
                      retro: "Bien. Si asiente y no puede hablar, la obstrucción es grave. La ayuda tiene que venir en camino desde ya.",
                    },
                    {
                      texto: "Le doy un vaso de agua",
                      retro: "Si no pasa el aire, tampoco el agua. Pierde segundos y puede empeorar la obstrucción.",
                    },
                    {
                      texto: "Espero un momento a ver si tose",
                      retro: "No está tosiendo: no puede. Cada segundo sin aire cuenta.",
                    },
                  ],
                },
                {
                  situacion: "Asiente con desesperación. Usted se ubica detrás de él, pero sus brazos no alcanzan a rodearle el abdomen.",
                  pregunta: "¿Cómo sigue?",
                  opciones: [
                    {
                      texto: "Paso los brazos bajo sus axilas y hago compresiones en el centro del pecho",
                      correcta: true,
                      retro: "Correcto. Si no alcanza el abdomen, las compresiones en el pecho son la alternativa.",
                    },
                    {
                      texto: "Le hago compresiones abdominales como pueda, con las manos a los lados",
                      retro: "Sin un buen agarre la compresión no tiene fuerza. Cambie a compresiones en el pecho.",
                    },
                    {
                      texto: "Le doy golpes fuertes con el puño en la espalda",
                      retro: "Golpear con el puño cerrado no es una técnica de desobstrucción y puede lesionarlo. Use compresiones en el pecho.",
                    },
                  ],
                },
                {
                  situacion: "Tras varias compresiones, el objeto no sale. Don Hernando se afloja y empieza a caer.",
                  pregunta: "¿Qué hace?",
                  opciones: [
                    {
                      texto: "Lo sostengo y lo bajo al suelo con cuidado, boca arriba",
                      correcta: true,
                      retro: "Así evita que se golpee la cabeza al caer y queda listo para la RCP.",
                    },
                    {
                      texto: "Lo siento en una silla para seguir con las compresiones",
                      retro: "Inconsciente no puede sostenerse y las compresiones de pie ya no sirven. Ahora toca la RCP en el suelo.",
                    },
                    {
                      texto: "Lo pongo de lado en posición de seguridad",
                      retro: "La posición lateral es para quien respira. Él no está respirando.",
                    },
                  ],
                },
                {
                  situacion: "Está en el suelo, no responde y no respira.",
                  pregunta: "¿Qué hace ahora?",
                  opciones: [
                    {
                      texto: "Confirmo que pidieron el DEA e inicio compresiones torácicas",
                      correcta: true,
                      retro: "Exacto. Las compresiones de la RCP también empujan el objeto y mantienen la sangre circulando.",
                    },
                    {
                      texto: "Le busco el objeto con los dedos hasta el fondo de la garganta",
                      retro: "Buscar a ciegas puede empujarlo más adentro y retrasa la RCP. Compresiones ya.",
                    },
                    {
                      texto: "Espero a la ambulancia sin tocarlo",
                      retro: "Sin aire y sin RCP, el daño cerebral empieza en pocos minutos.",
                    },
                  ],
                },
                {
                  situacion: "Al abrirle la boca para ventilar, ve un trozo de carne en la entrada de la garganta.",
                  pregunta: "¿Qué hace?",
                  opciones: [
                    {
                      texto: "Lo retiro con los dedos porque lo veo, y sigo con la RCP",
                      correcta: true,
                      retro: "Correcto. Lo que se ve, se retira. Luego siga con las ventilaciones y compresiones.",
                    },
                    {
                      texto: "Lo empujo hacia adentro para despejar la boca",
                      retro: "Empujarlo lo hunde en la vía aérea. Retírelo hacia afuera.",
                    },
                  ],
                },
                {
                  situacion: "Don Hernando tose, empieza a respirar por sí mismo y abre los ojos. Diez minutos después dice que ya está bien y que quiere volver a su turno.",
                  pregunta: "¿Qué le dice?",
                  opciones: [
                    {
                      texto: "Que debe esperar la ambulancia y ser valorado, y que se reportará el evento a SST",
                      correcta: true,
                      retro: "Así es. Las compresiones y la RCP pueden causar lesiones que no se notan al principio. El evento se reporta al responsable de SST.",
                    },
                    {
                      texto: "Que puede volver al turno si se siente bien",
                      retro: "Sentirse bien no descarta una lesión interna por las compresiones. Debe ser valorado por un médico.",
                    },
                  ],
                },
              ],
              exito: "¡Lo logró! Don Hernando respira y sale en la ambulancia para ser valorado. Usted adaptó la técnica y no perdió un segundo.",
              fracaso: "Se perdió demasiado tiempo sin aire. Recuerde: preguntar y pedir ayuda, compresiones en el pecho si no alcanza el abdomen, y RCP si pierde el conocimiento.",
              dice: "Respire usted primero. Ahora, vamos.",
            },
            {
              tipo: "resumen",
              titulo: "Lo que se lleva de esta lección",
              puntos: [
                "Tos fuerte: anime a toser. Sin tos ni voz: actúe ya.",
                "Embarazo avanzado u obesidad: compresiones en el pecho.",
                "Si pierde el conocimiento: al suelo, 123, DEA y RCP. Retire solo lo que vea.",
                "Solo y atragantado: su puño o el espaldar de una silla firme.",
                "Siempre valoración médica después de la maniobra.",
              ],
              insignia: "Aire para todos",
              cierre: "Bebés y niños tienen su propia técnica: la encontrará en el curso de primeros auxilios pediátricos.",
            },
          ],
        },
      },
    ],
  },

  /* ====================================================================== */
  /*  MÓDULO 5 · HEMORRAGIAS, HERIDAS Y QUEMADURAS                          */
  /* ====================================================================== */
  {
    title: "Módulo 5. Control de Hemorragias, Heridas y Quemaduras",
    description:
      "Presión directa, empaquetamiento y torniquete; cuidado básico de heridas y atención inicial de quemaduras térmicas, químicas y eléctricas.",
    lessons: [
      {
        title: "Detener una hemorragia grave",
        description: "Reconocer el sangrado que amenaza la vida y detenerlo con presión directa, empaquetamiento o torniquete.",
        durationMin: 20,
        contenido: {
          version: 1,
          guia: CAMILA,
          bloques: [
            {
              tipo: "portada",
              titulo: "Detener una hemorragia grave",
              subtitulo: "Una persona puede desangrarse antes de que llegue la ambulancia. Sus manos lo evitan.",
              objetivos: [
                "Reconocer una hemorragia que amenaza la vida",
                "Aplicar presión directa y saber cuándo empaquetar",
                "Decidir cuándo y dónde poner un torniquete, y qué no hacer después",
              ],
              minutos: 20,
              dice: "En una hemorragia grave, los primeros minutos los gana o los pierde quien está al lado. Hoy ese es usted.",
            },
            {
              tipo: "explicacion",
              titulo: "¿Cuándo es grave?",
              parrafos: [
                "Trate un sangrado como grave si la sangre sale a chorros, no para, empapa la ropa o las gasas, forma un charco, o si hay una amputación.",
                "Antes de tocar, asegure la escena y protéjase: guantes si los hay y, si no, una bolsa plástica o una tela gruesa como barrera. Nunca deje de ayudar por no tener guantes.",
                "Pida que alguien llame al 123 y active la brigada. Si está solo, ponga el celular en altavoz y hable mientras presiona.",
              ],
              puntos: [
                { titulo: "Arterial", texto: "Roja brillante, a chorros, al ritmo del pulso. La más peligrosa." },
                { titulo: "Venosa", texto: "Rojo oscuro, sale de forma continua. Puede ser abundante." },
                { titulo: "Capilar", texto: "En gotas, como en un raspón. Casi siempre para con presión leve." },
              ],
              clave: "Escena segura, barrera de protección, 123 y presión: en ese orden y en pocos segundos.",
            },
            {
              tipo: "explicacion",
              titulo: "Presión directa",
              parrafos: [
                "Cubra la herida con una gasa o una tela limpia y presione con fuerza, directamente sobre el punto que sangra, con una mano encima de la otra y usando el peso de su cuerpo.",
                "Mantenga la presión sin soltar para mirar. Cada vez que levanta las manos, el coágulo que se está formando se rompe y el sangrado vuelve.",
              ],
              ilustracion: "presion-directa",
              clave: "Si la gasa se empapa, no la retire: ponga otra encima y presione más fuerte.",
            },
            {
              tipo: "decision",
              titulo: "La gasa roja",
              situacion:
                "Lleva un minuto presionando una herida en el antebrazo de un compañero que se cortó con una lámina. La gasa está empapada y la sangre sale por los bordes.",
              pregunta: "¿Qué hace?",
              opciones: [
                {
                  texto: "Quito la gasa empapada y pongo una limpia",
                  retro: "Al retirarla arranca el coágulo que empezaba a formarse y el sangrado vuelve con fuerza.",
                },
                {
                  texto: "Suelto un momento para ver de dónde sale exactamente",
                  retro: "Cada vez que suelta, pierde lo que había ganado. La presión debe ser continua.",
                },
                {
                  texto: "Pongo más gasa encima y presiono con más fuerza",
                  correcta: true,
                  retro: "Correcto. Se agrega encima y se aumenta la presión. Si en un brazo o una pierna aun así no para, es momento del torniquete.",
                },
              ],
            },
            {
              tipo: "explicacion",
              titulo: "Empaquetar una herida profunda",
              parrafos: [
                "En zonas donde no se puede poner torniquete, como la ingle o la axila, una herida profunda puede no detenerse solo con presión desde afuera.",
                "Empaquetar es rellenar la herida con gasa o tela limpia, empujándola hacia adentro con los dedos hasta llenarla, y luego presionar encima con fuerza sin soltar hasta que llegue la ayuda.",
                "Esta técnica se entrena en práctica presencial con la brigada. Aquí la conoce para saber que existe y cuándo se usa.",
              ],
              clave: "Ingle y axila no admiten torniquete: presión directa y, si la herida es profunda, empaquetar.",
            },
            {
              tipo: "contrarreloj",
              titulo: "Herida en la axila",
              segundos: 12,
              situacion: "Un operario se hirió la axila con una pieza metálica afilada. Tiene una herida profunda que sangra mucho.",
              pregunta: "¿Qué hace?",
              opciones: [
                {
                  texto: "Pongo un torniquete en el brazo",
                  retro: "Un torniquete en el brazo queda por debajo de la herida: no detiene un sangrado que está en la axila.",
                },
                {
                  texto: "Presiono con fuerza y, como es profunda, la empaqueto con gasa",
                  correcta: true,
                  retro: "Así es. En la axila no hay torniquete posible: presión firme y empaquetamiento, sin soltar.",
                },
                {
                  texto: "Le levanto el brazo y espero",
                  retro: "Elevar el brazo, por sí solo, no controla una hemorragia grave. La presión directa sí.",
                },
              ],
              alAgotar: "Una herida profunda en la axila puede desangrar muy rápido. Presión, ya.",
            },
            {
              tipo: "explicacion",
              titulo: "El torniquete",
              parrafos: [
                "Se usa en un brazo o una pierna cuando el sangrado es grave y la presión directa no lo detiene, o cuando hay una amputación.",
                "Colóquelo entre 5 y 7 centímetros por encima de la herida, nunca sobre una articulación como el codo o la rodilla. Si no puede ver bien dónde está la herida, o hay varias, póngalo alto y apretado: lo más arriba posible en la extremidad.",
                "Apriete hasta que el sangrado se detenga. Duele, y es normal: explíqueselo a la persona y no lo afloje por el dolor.",
              ],
              ilustracion: "torniquete",
              clave: "Anote la hora en que lo puso, a la vista, y nunca lo afloje ni lo retire: eso lo hace el personal de salud.",
              dice: "Durante años se dijo que el torniquete era peligroso. Hoy sabemos que, bien usado, salva vidas.",
            },
            {
              tipo: "ordenar",
              titulo: "Poner el torniquete",
              instruccion: "Ordene los pasos.",
              pasos: [
                "Confirmar que el sangrado es grave, está en un brazo o una pierna y no para con presión",
                "Ubicar el torniquete entre 5 y 7 cm por encima de la herida, sin quedar sobre la articulación",
                "Ajustar la correa firme alrededor de la extremidad",
                "Girar la varilla hasta que el sangrado se detenga",
                "Asegurar la varilla para que no se devuelva",
                "Anotar la hora en que se puso",
              ],
              explicacion: "Correcto. La hora le dice al equipo médico cuánto tiempo lleva la extremidad sin circulación.",
            },
            {
              tipo: "mision",
              titulo: "Accidente en la bodega",
              intro:
                "En la bodega se rompió un vidrio de gran tamaño y le hizo una herida profunda en el muslo a un auxiliar. La sangre sale a chorros. Usted es el brigadista más cercano.",
              medidor: { etiqueta: "Vida del paciente", tipo: "vida" },
              velocidad: 1.8,
              penalizacion: 20,
              pasos: [
                {
                  situacion: "Hay vidrios rotos en el piso alrededor del herido.",
                  pregunta: "¿Qué hace primero?",
                  opciones: [
                    {
                      texto: "Me acerco mirando dónde piso y aparto los vidrios del lugar donde me voy a arrodillar",
                      correcta: true,
                      retro: "Bien: unos segundos de seguridad evitan que usted se convierta en el segundo herido.",
                    },
                    {
                      texto: "Corro y me arrodillo junto a él sin mirar",
                      retro: "Arrodillarse sobre un vidrio lo deja a usted herido y sin poder ayudar.",
                    },
                  ],
                },
                {
                  situacion: "Ya está a su lado. El botiquín de la bodega está a un paso.",
                  pregunta: "¿Qué hace?",
                  opciones: [
                    {
                      texto: "Me pongo guantes y le pido a un compañero que llame al 123 y active la brigada",
                      correcta: true,
                      retro: "Correcto: protección y ayuda en camino, todo en segundos.",
                    },
                    {
                      texto: "Le pido a un compañero que busque un carro para llevarlo",
                      retro: "Trasladarlo sin controlar el sangrado aumenta la pérdida de sangre. Primero controle y pida la ambulancia.",
                    },
                    {
                      texto: "Atiendo con las manos desnudas: no hay tiempo",
                      retro: "Sí hay tiempo para una barrera; si no hubiera guantes, sirve una bolsa o una tela.",
                    },
                  ],
                },
                {
                  situacion: "Tiene gasas en la mano y la sangre sigue saliendo a chorros.",
                  pregunta: "¿Qué hace?",
                  opciones: [
                    {
                      texto: "Pongo la gasa encima con suavidad para no lastimarlo",
                      retro: "Sin presión firme la sangre sigue saliendo. Tiene que presionar con fuerza.",
                    },
                    {
                      texto: "Presiono directo sobre la herida, con fuerza y con las dos manos",
                      correcta: true,
                      retro: "Esa es la primera herramienta para detener un sangrado.",
                    },
                    {
                      texto: "Lavo primero la herida",
                      retro: "En un sangrado grave lo urgente es detenerlo. La limpieza viene después.",
                    },
                  ],
                },
                {
                  situacion: "Presiona con todo su peso, pero la sangre sigue empapando las gasas.",
                  pregunta: "¿Qué hace?",
                  opciones: [
                    {
                      texto: "Pido el torniquete y lo pongo 5 a 7 cm por encima de la herida, en el muslo",
                      correcta: true,
                      retro: "Correcto: en una pierna que no para con presión, el torniquete es la respuesta.",
                    },
                    {
                      texto: "Pongo el torniquete sobre la rodilla",
                      retro: "Sobre la articulación el torniquete no comprime bien la arteria, y además queda por debajo de la herida.",
                    },
                    {
                      texto: "Sigo presionando igual y espero",
                      retro: "Si la presión no basta, cada minuto de espera es sangre que no se recupera.",
                    },
                  ],
                },
                {
                  situacion: "El sangrado se detuvo. El auxiliar se queja de que el torniquete le duele mucho.",
                  pregunta: "¿Qué hace?",
                  opciones: [
                    {
                      texto: "Lo aflojo un poco para que no le duela",
                      retro: "Aflojarlo hace que vuelva el sangrado. El dolor es señal de que está funcionando.",
                    },
                    {
                      texto: "Anoto la hora, le explico que el dolor es normal y no lo aflojo",
                      correcta: true,
                      retro: "Así es. El equipo médico necesita saber a qué hora se puso.",
                    },
                  ],
                },
                {
                  situacion: "Está pálido, sudoroso y le pide agua con insistencia.",
                  pregunta: "¿Qué hace?",
                  opciones: [
                    {
                      texto: "Lo mantengo acostado, lo abrigo, le hablo y no le doy de beber",
                      correcta: true,
                      retro: "Son señales de shock. Nada por boca: puede necesitar cirugía.",
                    },
                    {
                      texto: "Lo siento y le doy agua para que se recupere",
                      retro: "Sentarlo puede hacerlo desmayar y beber puede causarle vómito. Acostado, abrigado y sin nada por boca.",
                    },
                  ],
                },
              ],
              exito: "¡Sangrado controlado! La ambulancia recibe al auxiliar con el torniquete bien puesto y la hora anotada. Usted le salvó la vida.",
              fracaso: "El paciente perdió demasiada sangre. Recuerde el orden: escena, protección, 123, presión y torniquete si no para.",
              dice: "Esto ya lo conoce. Ahora hágalo contra el reloj.",
            },
            {
              tipo: "resumen",
              titulo: "Lo que se lleva de esta lección",
              puntos: [
                "Grave: a chorros, no para, empapa, forma charco o hay amputación.",
                "Presión directa firme y continua. Gasa empapada: otra encima.",
                "Ingle y axila: presión y, si es profunda, empaquetar.",
                "Torniquete en brazo o pierna: 5 a 7 cm arriba, nunca en la articulación; si no ve la herida, alto y apretado.",
                "Anote la hora. Nunca lo afloje ni lo retire.",
              ],
              insignia: "Manos que detienen",
            },
          ],
        },
      },
      {
        title: "Heridas y quemaduras",
        description:
          "Tipos de heridas y su cuidado básico; quemaduras térmicas, químicas y eléctricas, y las señales para escalar la atención.",
        durationMin: 20,
        contenido: {
          version: 1,
          guia: CAMILA,
          bloques: [
            {
              tipo: "portada",
              titulo: "Heridas y quemaduras",
              subtitulo: "Agua limpia, paciencia y nada de remedios caseros.",
              objetivos: [
                "Reconocer los tipos de heridas y cuáles necesitan valoración médica",
                "Hacer el cuidado básico de una herida leve",
                "Enfriar y cubrir una quemadura de forma correcta",
                "Actuar con seguridad ante quemaduras químicas y eléctricas",
              ],
              minutos: 20,
              dice: "Café en la herida, crema dental en la quemadura… Hoy vamos a desmontar los remedios de la abuela.",
            },
            {
              tipo: "explicacion",
              titulo: "Tipos de heridas",
              parrafos: [
                "Una herida es una ruptura de la piel. Según cómo se produjo, cambia el riesgo de sangrado, de infección y de lesión de lo que hay debajo.",
              ],
              puntos: [
                { titulo: "Raspón o abrasión", texto: "Superficial, por roce contra una superficie áspera. Sangra poco, pero suele quedar sucia." },
                { titulo: "Cortante", texto: "Por un borde afilado como un vidrio, un bisturí o una lámina. Bordes limpios; puede sangrar mucho." },
                { titulo: "Punzante", texto: "Por un objeto con punta, como una puntilla. Por fuera se ve pequeña, pero puede ser profunda y se infecta con facilidad." },
                { titulo: "Contusa o lacerada", texto: "Por un golpe o aplastamiento. Bordes irregulares y moretones alrededor." },
                { titulo: "Avulsión", texto: "Un colgajo de piel arrancado total o parcialmente." },
              ],
              clave: "Las heridas punzantes, las mordeduras y las que tienen suciedad incrustada siempre necesitan valoración médica, aunque parezcan pequeñas.",
            },
            {
              tipo: "ordenar",
              titulo: "Cuidar una herida leve",
              instruccion: "Un compañero tiene un raspón con tierra en el antebrazo. Ordene los pasos.",
              pasos: [
                "Lavarse las manos y ponerse guantes",
                "Detener el sangrado con presión suave si lo hay",
                "Lavar la herida con abundante agua limpia corriente",
                "Retirar con el chorro de agua la suciedad superficial, sin raspar",
                "Cubrir con una gasa o un apósito limpio",
                "Registrar la atención e indicarle que consulte si aparecen signos de infección",
              ],
              explicacion:
                "Muy bien. El agua limpia corriente es lo que más ayuda. No eche alcohol, agua oxigenada ni remedios como café o tierra: dañan el tejido o lo ensucian más. Enrojecimiento que crece, calor, pus o fiebre son señales de infección.",
            },
            {
              tipo: "clasificar",
              titulo: "¿Botiquín o médico?",
              instruccion: "Decida si cada herida se atiende con el botiquín de la empresa o necesita valoración médica. En ambos casos, la atención se registra.",
              categorias: [
                { id: "botiquin", nombre: "Botiquín y seguimiento", pista: "Leve y limpia" },
                { id: "medico", nombre: "Valoración médica", pista: "Profunda, sucia o de riesgo" },
              ],
              elementos: [
                { texto: "Un raspón superficial en la rodilla", categoria: "botiquin" },
                { texto: "Una cortadura pequeña con papel que para con presión", categoria: "botiquin" },
                {
                  texto: "Una puntilla oxidada que atravesó la suela de la bota",
                  categoria: "medico",
                  porque: "Las heridas punzantes pueden ser profundas y tienen riesgo de tétanos.",
                },
                {
                  texto: "Un corte con los bordes abiertos que no se juntan",
                  categoria: "medico",
                  porque: "Probablemente necesita puntos, y eso lo decide el personal de salud.",
                },
                {
                  texto: "La mordedura del perro guardián",
                  categoria: "medico",
                  porque: "Las mordeduras se infectan con facilidad y pueden requerir vacunas.",
                },
                {
                  texto: "Una herida en la cara o sobre una articulación",
                  categoria: "medico",
                },
                {
                  texto: "Una herida con grasa o arena incrustada que no sale con agua",
                  categoria: "medico",
                },
              ],
            },
            {
              tipo: "explicacion",
              titulo: "Quemaduras: enfriar es lo primero",
              parrafos: [
                "Aleje a la persona de la fuente de calor. Luego enfríe la quemadura con agua corriente fresca, no helada, durante 20 minutos. Ese enfriamiento detiene el daño que el calor sigue haciendo en la piel.",
                "Mientras enfría, retire con cuidado anillos, relojes, pulseras y la ropa que no esté pegada: la zona se va a hinchar. Si la ropa está pegada a la piel, no la arranque.",
                "Después, cubra la quemadura sin apretar con película plástica de cocina o con una tela limpia que no suelte pelusa. Abrigue el resto del cuerpo: enfriar a alguien entero puede causarle hipotermia.",
              ],
              clave: "Agua corriente fresca por 20 minutos. Nada de hielo, mantequilla, crema dental, aceite ni clara de huevo. Las ampollas no se revientan.",
            },
            {
              tipo: "tarjetas",
              titulo: "¿Mito o realidad?",
              instruccion: "Toque cada tarjeta para ver la respuesta.",
              tarjetas: [
                {
                  frente: "La crema dental alivia las quemaduras.",
                  reverso: "Mito. Guarda el calor, irrita la piel y hay que retirarla después en urgencias, lo que causa más daño.",
                },
                {
                  frente: "El hielo es lo mejor para enfriar una quemadura.",
                  reverso: "Mito. El hielo daña todavía más la piel quemada. Se usa agua corriente fresca.",
                },
                {
                  frente: "Hay que reventar las ampollas para que sane más rápido.",
                  reverso: "Mito. La ampolla protege la piel de abajo contra la infección. Se deja intacta.",
                },
                {
                  frente: "Veinte minutos de agua parecen mucho, pero son necesarios.",
                  reverso: "Realidad. Enfriar menos tiempo deja que el calor siga dañando las capas profundas de la piel.",
                },
              ],
            },
            {
              tipo: "explicacion",
              titulo: "¿Cuándo es grave una quemadura?",
              parrafos: [
                "Después de enfriarla, decida si basta con el seguimiento o si hay que escalar. Ante la duda, llame al 123 o consulte a la línea de la ARL.",
              ],
              puntos: [
                { titulo: "Tamaño", texto: "Más grande que la palma de la mano de la persona, o que rodea por completo un brazo, una pierna o el tronco." },
                { titulo: "Ubicación", texto: "Cara, cuello, manos, pies, genitales o articulaciones." },
                { titulo: "Profundidad", texto: "Piel blanca, acartonada, café o negra, a veces sin dolor porque se dañaron los nervios." },
                { titulo: "Vía aérea", texto: "Hollín en la nariz o la boca, voz ronca, tos o dificultad para respirar tras un incendio en un lugar cerrado." },
                { titulo: "Origen", texto: "Toda quemadura eléctrica y las químicas extensas o en los ojos." },
              ],
              clave: "Con cualquiera de estas señales: llame al 123, siga enfriando y vigile la respiración.",
            },
            {
              tipo: "decision",
              titulo: "Salpicadura de soda cáustica",
              situacion:
                "En la planta de limpieza, a un operario le salpicó soda cáustica en el antebrazo y le mojó la manga de la camisa. Dice que le arde mucho.",
              pregunta: "¿Qué hace?",
              dice: "En una quemadura química, la sustancia sigue quemando mientras esté sobre la piel.",
              opciones: [
                {
                  texto: "Le echo vinagre para neutralizar la soda",
                  retro: "Neutralizar produce calor y empeora la quemadura. Solo agua, y abundante.",
                },
                {
                  texto: "Le pongo crema y una gasa encima",
                  retro: "Cubrir sin lavar deja la sustancia en contacto con la piel: la quemadura sigue avanzando.",
                },
                {
                  texto: "Con guantes, le retiro la manga contaminada y lavo con abundante agua corriente por al menos 20 minutos",
                  correcta: true,
                  retro: "Correcto. Protéjase usted, retire lo contaminado y lave con mucha agua. Pida la hoja de seguridad del producto y llame al 123: el operador necesita saber qué sustancia es.",
                },
                {
                  texto: "Lo mando a la enfermería a pie para que lo revisen",
                  retro: "Cada minuto sin lavar es más quemadura. El lavado se empieza ya, en la ducha o el lavaojos más cercano.",
                },
              ],
            },
            {
              tipo: "contrarreloj",
              titulo: "Pegado al cable",
              segundos: 12,
              situacion:
                "En el cuarto de máquinas, un técnico quedó tendido junto a un tablero abierto. Su mano sigue tocando un cable y el cuerpo tiembla.",
              pregunta: "¿Qué hace primero?",
              opciones: [
                {
                  texto: "Lo halo del brazo para separarlo del cable",
                  retro: "Si toca a alguien que sigue con corriente, la descarga pasa a usted. Ahora hay dos víctimas.",
                },
                {
                  texto: "No lo toco: corto la energía en el breaker o el interruptor general, y si no puedo, mantengo a todos alejados y llamo al 123",
                  correcta: true,
                  retro: "Así es. Primero se corta la energía. Después, valore la respiración y esté listo para RCP y DEA. Toda quemadura eléctrica va al hospital: el daño por dentro suele ser mayor de lo que se ve.",
                },
                {
                  texto: "Le echo agua para enfriar la quemadura",
                  retro: "El agua conduce la electricidad. Nunca hasta que la energía esté cortada.",
                },
              ],
              alAgotar: "Ante la duda, no lo toque: primero la energía, después la persona.",
            },
            {
              tipo: "resumen",
              titulo: "Lo que se lleva de esta lección",
              puntos: [
                "Heridas leves: agua limpia corriente y cubrir. Nada de alcohol, café ni remedios caseros.",
                "Punzantes, mordeduras, sucias o profundas: valoración médica.",
                "Quemaduras: agua corriente fresca 20 minutos, retirar anillos, cubrir con película plástica y abrigar.",
                "Ni hielo, ni mantequilla, ni crema dental. Las ampollas no se revientan.",
                "Química: protéjase, retire lo contaminado y lave con mucha agua. Eléctrica: primero cortar la energía.",
              ],
              insignia: "Piel protegida",
            },
          ],
        },
      },
    ],
  },

  /* ====================================================================== */
  /*  MÓDULO 6 · OSTEOMUSCULAR, SHOCK Y CONCIENCIA                          */
  /* ====================================================================== */
  {
    title: "Módulo 6. Lesiones Osteomusculares, Shock y Alteraciones de Conciencia",
    description:
      "Esguinces, fracturas y sospecha de lesión de columna; el shock; desmayo, convulsiones, hipoglucemia, ataque cerebrovascular e infarto.",
    lessons: [
      {
        title: "Fracturas, columna y shock",
        description: "Inmovilizar como se encuentra, no mover a quien pudo lesionarse la columna y reconocer el shock a tiempo.",
        durationMin: 20,
        contenido: {
          version: 1,
          guia: CAMILA,
          bloques: [
            {
              tipo: "portada",
              titulo: "Huesos, columna y shock",
              subtitulo: "A veces la mejor ayuda es no mover nada.",
              objetivos: [
                "Reconocer un posible esguince, luxación o fractura",
                "Inmovilizar una extremidad tal como se encuentra",
                "Saber cuándo sospechar una lesión de columna y qué hacer",
                "Reconocer el shock y acomodar a la persona",
              ],
              minutos: 20,
              dice: "El instinto dice enderezar, levantar, sentar. Hoy aprendemos a frenar ese instinto.",
            },
            {
              tipo: "explicacion",
              titulo: "Esguince, luxación o fractura",
              parrafos: [
                "Un esguince es una lesión de los ligamentos de una articulación, como un tobillo torcido. Una luxación es un hueso que se salió de su articulación. Una fractura es un hueso roto.",
                "Sin una radiografía no se pueden distinguir con seguridad. Por eso, en primeros auxilios, toda lesión con dolor fuerte, hinchazón, deformidad o imposibilidad de mover se trata como si fuera una fractura.",
              ],
              puntos: [
                { titulo: "Dolor e hinchazón", texto: "Aumentan al tocar o al intentar mover la zona." },
                { titulo: "Deformidad", texto: "La extremidad tiene una forma o un ángulo que no es normal." },
                { titulo: "Pérdida de función", texto: "No puede apoyar el pie o mover la mano." },
                { titulo: "Fractura abierta", texto: "Hay una herida y a veces se ve el hueso. Cubra con gasa limpia y nunca intente meter el hueso." },
              ],
              clave: "Ante la duda, trátela como fractura. No pida a la persona que mueva la zona para probar.",
            },
            {
              tipo: "explicacion",
              titulo: "Inmovilizar como se encuentra",
              parrafos: [
                "No intente enderezar ni acomodar el hueso. Inmovilice la extremidad en la posición en que la encontró, con una férula del botiquín o con lo que tenga: cartón, una revista enrollada, una tabla acolchada o la otra pierna.",
                "La férula debe abarcar la articulación de arriba y la de abajo de la lesión. Para un antebrazo, desde la muñeca hasta el codo; para la pierna, desde el tobillo hasta la rodilla.",
                "Antes y después de inmovilizar, revise la circulación por debajo de la lesión: color y temperatura de la piel, si siente cuando lo toca y si puede mover los dedos. Si después de inmovilizar los dedos se ponen fríos, pálidos o morados, afloje las amarras.",
              ],
              clave: "Como se encuentra, articulación de arriba y de abajo, y circulación revisada antes y después.",
            },
            {
              tipo: "ordenar",
              titulo: "Inmovilizar un antebrazo",
              instruccion: "Una compañera se cayó en la escalera y tiene el antebrazo deformado. Ordene los pasos.",
              pasos: [
                "Asegurar la escena, explicarle lo que va a hacer y pedir ayuda",
                "Revisar color, temperatura, sensibilidad y movimiento de los dedos",
                "Acolchar la férula y colocarla sin enderezar el brazo, de la muñeca al codo",
                "Fijarla con vendas, sin apretar justo sobre la lesión",
                "Volver a revisar la circulación de los dedos",
                "Sostener el brazo con un cabestrillo y aplicar frío envuelto en tela",
              ],
              explicacion:
                "Correcto. El frío va siempre envuelto, nunca el hielo directo sobre la piel, y por no más de 20 minutos. La compañera debe ser valorada en un servicio de salud.",
            },
            {
              tipo: "decision",
              titulo: "El tobillo del vigilante",
              situacion:
                "El vigilante se cayó al bajar del bus de la empresa. El tobillo está muy hinchado y torcido hacia afuera. Un compañero le dice: «Déjeme se lo acomodo, que yo sé».",
              pregunta: "¿Qué hace usted?",
              opciones: [
                {
                  texto: "Dejar que se lo acomode para aliviarle el dolor",
                  retro: "Manipular una posible fractura o luxación puede romper vasos sanguíneos y nervios. Eso no lo hace un primer respondiente.",
                },
                {
                  texto: "Pedirle que camine un poco para ver si es grave",
                  retro: "Apoyar una posible fractura la agrava y aumenta mucho el dolor.",
                },
                {
                  texto: "Detener al compañero, inmovilizar el tobillo como está y revisar la circulación del pie",
                  correcta: true,
                  retro: "Muy bien. Se inmoviliza sin acomodar, abarcando rodilla y pie, se revisan los dedos antes y después y se gestiona el traslado para valoración médica.",
                },
              ],
            },
            {
              tipo: "explicacion",
              titulo: "Sospecha de lesión de columna",
              parrafos: [
                "Sospeche una lesión de la columna si hubo una caída de altura, un golpe fuerte en la cabeza, un accidente de tránsito, un aplastamiento o una zambullida en aguas poco profundas.",
                "También si la persona tiene dolor en el cuello o la espalda, hormigueo, debilidad o no siente brazos o piernas, o si está inconsciente después de un trauma.",
                "No la mueva. Pídale que no se mueva, arrodíllese detrás de su cabeza y sosténgala con las manos a ambos lados, en la posición en que la encontró, hasta que llegue la ayuda. Solo se mueve si la escena es insegura, por ejemplo por fuego, gas o riesgo de derrumbe, o si necesita RCP.",
              ],
              clave: "Con sospecha de columna: no mover, sostener la cabeza alineada y llamar al 123.",
            },
            {
              tipo: "contrarreloj",
              titulo: "Caída de la escalera",
              segundos: 15,
              situacion:
                "Un electricista cayó de una escalera de unos dos metros. Está consciente, le duele el cuello y dice que siente hormigueo en las manos. La zona es segura. Un compañero quiere sentarlo para que «se reponga».",
              pregunta: "¿Qué hace?",
              opciones: [
                {
                  texto: "Lo ayudo a sentarse despacio",
                  retro: "Sentarlo mueve la columna. Con dolor de cuello y hormigueo, eso puede convertir una lesión en una parálisis.",
                },
                {
                  texto: "Lo llevo con el compañero hasta la enfermería",
                  retro: "Cargarlo sin equipo ni técnica mueve la columna. La escena es segura: no hay razón para moverlo.",
                },
                {
                  texto: "Le pido que no se mueva, le sostengo la cabeza alineada y pido que llamen al 123",
                  correcta: true,
                  retro: "Correcto. Hormigueo y dolor de cuello tras una caída son señales de alarma. La inmovilización y el traslado los hace el personal con equipo.",
                },
              ],
              alAgotar: "Ante la duda tras una caída, nadie mueve a nadie: cabeza alineada y 123.",
            },
            {
              tipo: "explicacion",
              titulo: "El shock",
              parrafos: [
                "El shock aparece cuando la sangre no alcanza a llevar suficiente oxígeno a los órganos. Lo pueden causar una hemorragia, quemaduras extensas, una alergia grave, un infarto o una deshidratación severa.",
                "Acueste a la persona boca arriba. Si no tiene lesiones en las piernas, la cadera o la columna y no le causa dolor, puede elevarle las piernas unos 30 centímetros. Abríguela, trate la causa si puede, no le dé comida ni bebida y llame al 123.",
              ],
              puntos: [
                { titulo: "Piel", texto: "Pálida, fría y sudorosa." },
                { titulo: "Pulso y respiración", texto: "Rápidos y débiles." },
                { titulo: "Mente", texto: "Ansiedad, confusión o somnolencia." },
                { titulo: "Otras", texto: "Sed intensa, náuseas o mareo." },
              ],
              clave: "Acostar, abrigar, acompañar, vigilar y nada por boca.",
            },
            {
              tipo: "clasificar",
              titulo: "Persona en shock: ¿se hace o no?",
              instruccion: "Clasifique cada acción.",
              categorias: [
                { id: "si", nombre: "Sí se hace" },
                { id: "no", nombre: "No se hace" },
              ],
              elementos: [
                { texto: "Acostarla boca arriba", categoria: "si" },
                { texto: "Abrigarla con una chaqueta o una manta", categoria: "si" },
                {
                  texto: "Elevarle las piernas aunque tenga una fractura de fémur",
                  categoria: "no",
                  porque: "Con lesiones en piernas, cadera o columna, las piernas no se elevan.",
                },
                {
                  texto: "Darle agua con azúcar porque tiene sed",
                  categoria: "no",
                  porque: "Puede necesitar cirugía y, si bebe, vomitar.",
                },
                { texto: "Hablarle con calma y vigilar su respiración", categoria: "si" },
                {
                  texto: "Sentarla para que tome aire",
                  categoria: "no",
                  porque: "Sentada puede desmayarse: el cerebro recibe todavía menos sangre.",
                },
              ],
            },
            {
              tipo: "resumen",
              titulo: "Lo que se lleva de esta lección",
              puntos: [
                "Ante la duda, trátela como fractura.",
                "Inmovilice como se encuentra, abarcando la articulación de arriba y la de abajo.",
                "Revise la circulación por debajo de la lesión antes y después.",
                "Sospecha de columna: no mover, sostener la cabeza y 123. Solo se mueve si la escena es insegura.",
                "Shock: acostar, piernas arriba si no hay trauma, abrigar y nada por boca.",
              ],
              insignia: "Mano quieta",
            },
          ],
        },
      },
      {
        title: "Desmayo, convulsiones, diabetes, ACV e infarto",
        description:
          "Qué hacer ante un síncope o una convulsión, cómo ayudar a un diabético con azúcar baja y cómo reconocer un ataque cerebrovascular o un infarto.",
        durationMin: 20,
        contenido: {
          version: 1,
          guia: CAMILA,
          bloques: [
            {
              tipo: "portada",
              titulo: "Cuando la conciencia se altera",
              subtitulo: "Cinco emergencias que empiezan con una persona que «no está bien».",
              objetivos: [
                "Atender un desmayo y saber cuándo preocuparse",
                "Proteger a una persona durante una convulsión",
                "Ayudar a un diabético consciente con azúcar baja",
                "Reconocer un ataque cerebrovascular y un infarto, y no perder tiempo",
              ],
              minutos: 20,
              dice: "En estas emergencias su herramienta principal es observar bien y llamar a tiempo.",
            },
            {
              tipo: "explicacion",
              titulo: "El desmayo (síncope)",
              parrafos: [
                "Un desmayo es una pérdida breve del conocimiento porque al cerebro le llega menos sangre por un momento. Suele avisar: mareo, palidez, sudor frío, visión borrosa o náuseas.",
                "Si alguien siente que se va a desmayar, que se siente o se acueste de inmediato. Cruzar las piernas apretando los músculos o apretar las manos con fuerza puede ayudar a que no pierda el conocimiento.",
                "Si ya se desmayó, acuéstela boca arriba y, si no se golpeó, elévele las piernas. Debe recuperarse en uno o dos minutos. Si no responde, valore la respiración: de lado si respira normal, RCP si no.",
              ],
              clave: "Llame al 123 si no se recupera rápido, si tiene dolor en el pecho, si se golpeó al caer, si está embarazada, si convulsiona o si es la primera vez que le pasa.",
            },
            {
              tipo: "explicacion",
              titulo: "Convulsiones",
              parrafos: [
                "En una convulsión la persona pierde el conocimiento y el cuerpo se pone rígido y se sacude. Puede morderse la lengua, babear o perder el control de esfínteres. Es impresionante de ver, pero casi siempre termina sola en pocos minutos.",
              ],
              puntos: [
                { titulo: "Proteja", texto: "Retire objetos con los que se pueda golpear y ponga algo blando bajo su cabeza." },
                { titulo: "No sujete", texto: "No intente frenar los movimientos: puede lesionarla o lesionarse usted." },
                { titulo: "Nada en la boca", texto: "Ni cucharas, ni dedos, ni trapos. No se va a tragar la lengua y puede romperle los dientes o asfixiarla." },
                { titulo: "Tome el tiempo", texto: "Mire la hora en que empezó. Si dura 5 minutos o más, llame al 123." },
                { titulo: "Después", texto: "Póngala en posición lateral de seguridad, vigile su respiración y háblele con calma: despierta confundida." },
              ],
              clave: "Llame también al 123 si es la primera convulsión, si se repite sin despertar, si se lesionó, si está embarazada o es diabética, o si le cuesta respirar después.",
            },
            {
              tipo: "contrarreloj",
              titulo: "Convulsión en la recepción",
              segundos: 12,
              situacion:
                "La recepcionista cae al piso y empieza a sacudirse. Un visitante saca una cuchara de la cafetería y dice que hay que ponérsela en la boca para que no se trague la lengua.",
              pregunta: "¿Qué hace?",
              opciones: [
                {
                  texto: "Le sostengo los brazos con fuerza para que no se golpee",
                  retro: "Sujetarla puede causarle luxaciones o fracturas. Proteja el entorno, no frene los movimientos.",
                },
                {
                  texto: "Detengo al visitante, retiro objetos cercanos, le protejo la cabeza y miro la hora",
                  correcta: true,
                  retro: "Correcto. Nada en la boca y nadie la sujeta. Tomar la hora le dice si llegan los 5 minutos que obligan a llamar al 123.",
                },
                {
                  texto: "Le pongo la cuchara entre los dientes con cuidado",
                  retro: "Puede romperle los dientes, cortarle la boca o hacer que se ahogue con un pedazo. Nunca se pone nada en la boca.",
                },
              ],
              alAgotar: "Mientras duda, ella sigue convulsionando. Proteja, no sujete, nada en la boca y mire la hora.",
            },
            {
              tipo: "explicacion",
              titulo: "Azúcar baja en un diabético",
              parrafos: [
                "Una persona con diabetes puede bajar de azúcar si se saltó una comida, hizo más esfuerzo del habitual o se aplicó su medicamento sin comer. La hipoglucemia aparece rápido.",
                "Las señales son sudor, temblor, palidez, hambre, irritabilidad, confusión o un comportamiento extraño que se puede confundir con borrachera.",
                "Si está consciente y puede tragar, dele azúcar de inmediato: medio vaso de jugo o de gaseosa normal, no dietética, tres o cuatro sobres de azúcar disueltos en agua, o sus tabletas de glucosa si las tiene. Si mejora en 10 a 15 minutos, que coma algo. Si no mejora o empeora, llame al 123.",
              ],
              clave: "Si no está consciente o no puede tragar, nada por boca: posición lateral de seguridad y 123.",
              dice: "Ante la duda en un diabético consciente, el azúcar ayuda mucho más de lo que puede hacer daño.",
            },
            {
              tipo: "decision",
              titulo: "El supervisor raro",
              situacion:
                "A media mañana, el supervisor de turno, que es diabético, está sudando, le tiemblan las manos y responde de mal genio y sin sentido. Le cuenta que no desayunó. Está consciente y puede tragar.",
              pregunta: "¿Qué hace?",
              opciones: [
                {
                  texto: "Le doy medio vaso de jugo o de gaseosa normal y me quedo con él",
                  correcta: true,
                  retro: "Correcto. El azúcar de rápida absorción corrige la hipoglucemia. Si en 10 a 15 minutos no mejora o empeora, llame al 123.",
                },
                {
                  texto: "Le doy una gaseosa dietética para no subirle el azúcar",
                  retro: "La gaseosa dietética no tiene azúcar: no sirve para una hipoglucemia.",
                },
                {
                  texto: "Le aplico su insulina, que está en el cajón",
                  retro: "La insulina baja el azúcar: le empeoraría la hipoglucemia. Además, aplicar medicamentos no le corresponde al primer respondiente.",
                },
                {
                  texto: "Lo dejo descansar solo en la oficina para que se le pase",
                  retro: "Sin azúcar puede perder el conocimiento o convulsionar. No lo deje solo.",
                },
              ],
            },
            {
              tipo: "tarjetas",
              titulo: "Ataque cerebrovascular: Rostro, Brazo, Habla, Tiempo",
              instruccion: "Un ataque cerebrovascular (ACV) se reconoce en segundos. Toque cada tarjeta.",
              tarjetas: [
                {
                  etiqueta: "R",
                  frente: "Rostro",
                  reverso: "Pídale que sonría. ¿Un lado de la cara se ve caído o no se mueve igual?",
                },
                {
                  etiqueta: "B",
                  frente: "Brazo",
                  reverso: "Pídale que levante los dos brazos. ¿Uno se cae o no lo puede levantar?",
                },
                {
                  etiqueta: "H",
                  frente: "Habla",
                  reverso: "Pídale que repita una frase sencilla. ¿Habla enredado, raro o no le salen las palabras?",
                },
                {
                  etiqueta: "T",
                  frente: "Tiempo",
                  reverso: "Con una sola de estas señales, anote la hora en que empezó y llame al 123 ya. El tratamiento depende de cuánto tiempo ha pasado.",
                },
              ],
            },
            {
              tipo: "explicacion",
              titulo: "El infarto",
              parrafos: [
                "La señal típica es dolor, presión u opresión en el pecho que dura más de unos minutos o que va y viene. Puede irse hacia el brazo izquierdo, la mandíbula, el cuello o la espalda, y acompañarse de sudor frío, náuseas o falta de aire.",
                "En mujeres, personas mayores y diabéticos puede presentarse distinto: cansancio extremo, falta de aire o malestar en la parte alta del abdomen, sin un dolor de pecho claro.",
                "Llame al 123 de inmediato. Deje a la persona en reposo, sentada o semisentada, como respire mejor, y aflójele la ropa. Si tiene un medicamento para el corazón formulado por su médico, ayúdele a tomarlo. Pida que tengan listo el DEA.",
              ],
              clave: "Dolor en el pecho: 123, reposo y DEA a mano. Si deja de responder y no respira normal, RCP.",
            },
            {
              tipo: "clasificar",
              titulo: "¿Qué le está pasando?",
              instruccion: "Clasifique cada situación según lo que más probablemente está ocurriendo.",
              categorias: [
                { id: "sincope", nombre: "Desmayo", pista: "Breve, se recupera" },
                { id: "hipo", nombre: "Azúcar baja", pista: "Diabético" },
                { id: "acv", nombre: "Ataque cerebrovascular", pista: "Rostro, Brazo, Habla" },
                { id: "infarto", nombre: "Infarto", pista: "Pecho" },
              ],
              elementos: [
                {
                  texto: "Estuvo mucho tiempo de pie al sol en la formación, se puso pálida, cayó y se recuperó al acostarla",
                  categoria: "sincope",
                },
                {
                  texto: "Un diabético que no almorzó está sudando, tembloroso e irritable",
                  categoria: "hipo",
                },
                {
                  texto: "De repente se le torció la boca hacia un lado y no puede levantar el brazo derecho",
                  categoria: "acv",
                },
                {
                  texto: "Opresión en el pecho desde hace 15 minutos, que baja al brazo izquierdo, con sudor frío",
                  categoria: "infarto",
                },
                {
                  texto: "En plena reunión empezó a hablar enredado, sin sentido",
                  categoria: "acv",
                  porque: "La alteración súbita del habla es una de las señales del ACV.",
                },
                {
                  texto: "Una señora de 58 años con falta de aire, náuseas y dolor en la mandíbula",
                  categoria: "infarto",
                  porque: "En mujeres el infarto a veces no da el dolor de pecho típico.",
                },
              ],
            },
            {
              tipo: "mision",
              titulo: "Turno de la noche",
              intro:
                "Son las 10:40 p. m. en el centro de distribución. Don Álvaro, de 61 años, deja caer el tinto y, cuando usted le pregunta qué le pasa, no le salen bien las palabras. Cada minuto que pasa, el cerebro pierde neuronas.",
              medidor: { etiqueta: "Cerebro a salvo", tipo: "vida" },
              velocidad: 1.5,
              penalizacion: 20,
              pasos: [
                {
                  situacion: "Don Álvaro está sentado, consciente, pero habla enredado.",
                  pregunta: "¿Qué hace primero?",
                  opciones: [
                    {
                      texto: "Le pido que sonría, que levante los dos brazos y que repita una frase",
                      correcta: true,
                      retro: "Bien: Rostro, Brazo y Habla le confirman la sospecha en segundos.",
                    },
                    {
                      texto: "Le ofrezco otro tinto para que se despierte",
                      retro: "Puede tener dificultad para tragar y atorarse. A una persona con sospecha de ACV no se le da nada por boca.",
                    },
                    {
                      texto: "Le digo que se vaya a descansar al carro",
                      retro: "Dejarlo solo con estas señales es perder el tiempo que necesita el tratamiento.",
                    },
                  ],
                },
                {
                  situacion: "La comisura izquierda de la boca está caída y el brazo izquierdo no sube igual.",
                  pregunta: "¿Qué hace?",
                  opciones: [
                    {
                      texto: "Espero media hora para ver si se le pasa",
                      retro: "En un ACV cada minuto cuenta. El tratamiento depende de llegar a tiempo.",
                    },
                    {
                      texto: "Miro la hora en que empezaron los síntomas y llamo al 123",
                      correcta: true,
                      retro: "Correcto. La hora de inicio es el dato más importante que le va a pedir el equipo médico.",
                    },
                  ],
                },
                {
                  situacion: "Mientras espera la ambulancia, un compañero trae una pastilla «para la presión» de su propio botiquín personal.",
                  pregunta: "¿Qué hace?",
                  opciones: [
                    {
                      texto: "No se la doy y le explico que no se le puede dar nada por boca",
                      correcta: true,
                      retro: "Así es. Ni medicamentos ajenos ni comida ni bebida: puede atorarse y un medicamento equivocado puede hacer daño.",
                    },
                    {
                      texto: "Se la doy con un poco de agua",
                      retro: "No es su medicamento y puede tener dificultad para tragar. Nada por boca.",
                    },
                  ],
                },
                {
                  situacion: "A los pocos minutos dice que ya puede mover el brazo y que se siente mejor. Quiere seguir trabajando.",
                  pregunta: "¿Qué hace?",
                  opciones: [
                    {
                      texto: "Le explico que aun así debe esperar la ambulancia y ser valorado",
                      correcta: true,
                      retro: "Correcto. Unos síntomas que desaparecen pueden ser el aviso de un ACV mayor. Debe ser valorado igual.",
                    },
                    {
                      texto: "Cancelo la ambulancia porque ya se recuperó",
                      retro: "Los síntomas pasajeros también son una emergencia: pueden anunciar un ACV más grave en las horas siguientes.",
                    },
                  ],
                },
                {
                  situacion: "De pronto se pone somnoliento, deja de responder y vomita. Respira con normalidad.",
                  pregunta: "¿Qué hace?",
                  opciones: [
                    {
                      texto: "Lo dejo sentado en la silla",
                      retro: "Inconsciente y sentado, la cabeza cae hacia adelante y el vómito puede irse a los pulmones.",
                    },
                    {
                      texto: "Lo bajo al piso, lo pongo en posición lateral de seguridad y vigilo su respiración",
                      correcta: true,
                      retro: "Muy bien: de lado, el vómito sale y la vía aérea queda abierta. Avise al 123 del cambio.",
                    },
                    {
                      texto: "Lo pongo boca arriba e inicio compresiones",
                      retro: "Respira con normalidad: no necesita RCP, sino proteger la vía aérea. Vigílelo por si eso cambia.",
                    },
                  ],
                },
                {
                  situacion: "Llega la ambulancia.",
                  pregunta: "¿Qué es lo primero que les dice?",
                  opciones: [
                    {
                      texto: "A qué hora empezaron los síntomas, qué señales vio y qué hizo",
                      correcta: true,
                      retro: "Exacto. Con la hora de inicio, el equipo decide qué tratamiento es posible.",
                    },
                    {
                      texto: "Que le parece que es un problema de estrés",
                      retro: "El diagnóstico lo hace el personal de salud. Usted aporta los hechos: hora, señales y lo que hizo.",
                    },
                  ],
                },
              ],
              exito: "¡Bien hecho! Don Álvaro llega al hospital a tiempo, con la hora de inicio anotada. Ese dato puede cambiar su recuperación.",
              fracaso: "Se perdió tiempo valioso. En un ACV: Rostro, Brazo, Habla y Tiempo. Hora de inicio, 123 y nada por boca.",
              dice: "Rostro, Brazo, Habla, Tiempo. Vamos.",
            },
            {
              tipo: "resumen",
              titulo: "Lo que se lleva de esta lección",
              puntos: [
                "Desmayo: acostar y elevar piernas; si no se recupera pronto, valorar respiración y llamar al 123.",
                "Convulsión: proteger, no sujetar, nada en la boca, tomar el tiempo y de lado al terminar.",
                "Diabético consciente con azúcar baja: azúcar de inmediato. Si no puede tragar, nada por boca.",
                "ACV: Rostro, Brazo, Habla, Tiempo. Anote la hora de inicio y llame al 123.",
                "Infarto: 123, reposo, su propio medicamento si lo tiene formulado, y DEA a mano.",
              ],
              insignia: "Ojo atento",
            },
          ],
        },
      },
    ],
  },

  /* ====================================================================== */
  /*  MÓDULO 7 · MOVILIZACIÓN, TRANSPORTE Y CASOS PRÁCTICOS                  */
  /* ====================================================================== */
  {
    title: "Módulo 7. Movilización, Transporte de Pacientes y Casos Prácticos",
    description:
      "Cuándo mover y cuándo no, arrastres y cargas de emergencia, rodamiento en bloque, camillas, entrega al sistema de emergencias y caso final integrador.",
    lessons: [
      {
        title: "Mover o no mover: arrastres, cargas y camillas",
        description:
          "Las razones para mover a una persona, las técnicas de emergencia con uno o dos auxiliadores, el rodamiento en bloque y el uso básico de camillas.",
        durationMin: 20,
        contenido: {
          version: 1,
          guia: CAMILA,
          bloques: [
            {
              tipo: "portada",
              titulo: "Mover o no mover",
              subtitulo: "Mover sin necesidad puede empeorar una lesión. Dejar a alguien en peligro lo puede matar.",
              objetivos: [
                "Decidir cuándo se justifica mover a una persona antes de que llegue la ayuda",
                "Elegir el arrastre o la carga adecuada",
                "Hacer un rodamiento en bloque en equipo",
                "Conocer el uso básico de camillas y camillas improvisadas",
              ],
              minutos: 20,
              dice: "En la brigada la regla es clara: no se mueve a nadie, salvo que quedarse ahí sea más peligroso.",
            },
            {
              tipo: "explicacion",
              titulo: "Cuándo mover",
              parrafos: [
                "Por regla general, a una persona lesionada se le atiende donde está y se espera a la brigada o al 123 con el equipo adecuado.",
                "Se mueve de inmediato solo si hay un peligro que no se puede controlar: fuego o humo, fuga de gas o de químicos, riesgo de derrumbe o explosión, tráfico, agua o electricidad que no se puede cortar. También si hay que ponerla sobre una superficie firme para la RCP, o si está bloqueando el acceso a otra víctima más grave.",
                "Al moverla, proteja también su espalda: doble las rodillas, mantenga la espalda recta, acerque la carga a su cuerpo, no se gire con el peso y coordine en voz alta con los demás.",
              ],
              clave: "Siempre se hala a lo largo del eje del cuerpo, de la cabeza o de los pies, nunca de lado.",
            },
            {
              tipo: "clasificar",
              titulo: "¿Se mueve ya?",
              instruccion: "Decida en cada caso si se justifica mover a la persona antes de que llegue la ayuda.",
              categorias: [
                { id: "mover", nombre: "Mover ya", pista: "Peligro inmediato o RCP" },
                { id: "quieto", nombre: "Atender donde está", pista: "Escena segura" },
              ],
              elementos: [
                { texto: "Inconsciente en una bodega que se está llenando de humo", categoria: "mover" },
                {
                  texto: "Fractura de pierna en un pasillo despejado y seguro",
                  categoria: "quieto",
                  porque: "Se inmoviliza en el sitio y se espera la camilla.",
                },
                {
                  texto: "En paro cardíaco sobre un colchón en la enfermería",
                  categoria: "mover",
                  porque: "Las compresiones no sirven sobre una superficie blanda: se baja al piso.",
                },
                { texto: "Huele fuerte a gas en el cuarto donde está desmayado", categoria: "mover" },
                {
                  texto: "Cayó de una escalera, está consciente y le duele el cuello; la zona es segura",
                  categoria: "quieto",
                  porque: "Con sospecha de columna y escena segura, no se mueve.",
                },
                { texto: "Atropellado en la vía interna, con montacargas que siguen pasando y no se pueden detener", categoria: "mover" },
              ],
            },
            {
              tipo: "explicacion",
              titulo: "Arrastres y cargas de emergencia",
              parrafos: ["Elija la técnica según el estado de la persona, cuántos auxiliadores hay y el espacio disponible."],
              puntos: [
                {
                  titulo: "Arrastre por las axilas (Rautek)",
                  texto: "Desde atrás, siente un poco a la persona, pase sus brazos bajo las axilas, tome con las dos manos uno de sus antebrazos cruzado sobre el pecho y hale hacia atrás. Su pecho le sostiene la cabeza.",
                },
                {
                  titulo: "Arrastre con manta o chaqueta",
                  texto: "Acueste a la persona sobre una manta o chaqueta y hálela desde la cabeza, a lo largo del cuerpo. Útil en pisos lisos y bajo el humo.",
                },
                {
                  titulo: "Muleta humana",
                  texto: "Para alguien consciente que puede apoyar un pie: usted se pone a su lado, pasa el brazo de la persona sobre sus propios hombros y la sujeta por la cintura.",
                },
                {
                  titulo: "Silla de cuatro manos",
                  texto: "Dos auxiliadores se toman de las muñecas y forman un asiento. La persona debe estar consciente y poder sujetarse de sus hombros.",
                },
                {
                  titulo: "Silla de dos manos",
                  texto: "Dos auxiliadores, uno a cada lado, unen un brazo bajo los muslos y otro detrás de la espalda. Sirve para alguien que no puede sujetarse bien.",
                },
              ],
              clave: "Ninguna de estas técnicas protege la columna. Úselas solo cuando el peligro de quedarse es mayor.",
            },
            {
              tipo: "decision",
              titulo: "Humo en el archivo",
              situacion:
                "Se activó la alarma de incendio. En el archivo, que se está llenando de humo, hay un compañero inconsciente en el piso. Usted está solo y la salida está a 10 metros.",
              pregunta: "¿Cómo lo saca?",
              opciones: [
                {
                  texto: "Lo cargo sobre los hombros y salgo de pie",
                  retro: "De pie respira el humo más denso y cargar a alguien inconsciente solo es muy difícil: puede caerse con él.",
                },
                {
                  texto: "Lo arrastro por las axilas o sobre una chaqueta, hacia atrás y agachado bajo el humo",
                  correcta: true,
                  retro: "Correcto. El arrastre le permite moverlo solo, por el eje del cuerpo, con la cabeza protegida y usted agachado, donde el aire es más limpio.",
                },
                {
                  texto: "Lo halo de un brazo para ir más rápido",
                  retro: "Halar de una sola extremidad puede luxarle el hombro y le tuerce la columna.",
                },
                {
                  texto: "Salgo a buscar ayuda y vuelvo por él",
                  retro: "Con el humo avanzando, quizás no pueda volver a entrar. Si puede sacarlo de forma segura, hágalo ahora.",
                },
              ],
            },
            {
              tipo: "explicacion",
              titulo: "Rodamiento en bloque y camillas",
              parrafos: [
                "El rodamiento en bloque sirve para girar a una persona con sospecha de lesión de columna, por ejemplo para ponerla sobre una camilla rígida o para que no se ahogue si vomita. Se necesitan al menos tres personas y el cuerpo gira como un tronco: cabeza, cuello y espalda siempre alineados.",
                "Quien sostiene la cabeza es el líder: da todas las órdenes, en voz alta y con una cuenta clara.",
                "Una camilla rígida se asegura con correas en el pecho, la cadera y las piernas, y se transporta con la cabeza hacia adelante cuando se sube y con los pies hacia adelante en terreno plano o de bajada, según indique el líder. Si no hay camilla, se puede improvisar con dos palos firmes y dos o tres chaquetas abotonadas o una cobija doblada; pruébela con el peso de un compañero antes de usarla.",
              ],
              clave: "En el rodamiento en bloque y en cada levantamiento, manda una sola voz: la de quien sostiene la cabeza.",
            },
            {
              tipo: "ordenar",
              titulo: "Rodamiento en bloque",
              instruccion: "Ordene los pasos para girar en bloque a una persona boca arriba.",
              pasos: [
                "El líder se arrodilla detrás de la cabeza y la sostiene alineada con el cuerpo",
                "Los demás se arrodillan del mismo lado, a la altura del hombro, la cadera y las piernas",
                "Se alinean los brazos y las piernas de la persona a lo largo del cuerpo",
                "Cada uno toma a la persona del lado opuesto: hombro, cadera y rodilla",
                "A la cuenta del líder, todos giran a la vez hacia ellos, como un solo bloque",
                "Se acerca la camilla y, a la orden del líder, se baja a la persona en bloque",
              ],
              explicacion:
                "Muy bien. Si alguien se adelanta, el cuello se tuerce. Por eso nadie se mueve hasta que el líder termina la cuenta. Esta maniobra se practica en los simulacros de la brigada.",
            },
            {
              tipo: "contrarreloj",
              titulo: "¿Quién da la orden?",
              segundos: 10,
              situacion: "Cuatro brigadistas van a levantar a un trabajador que está sobre una camilla rígida.",
              pregunta: "¿Quién da la cuenta para levantar?",
              opciones: [
                {
                  texto: "El brigadista con más antigüedad, esté donde esté",
                  retro: "La antigüedad no importa aquí: importa quién está protegiendo la cabeza y puede ver todo el cuerpo.",
                },
                {
                  texto: "Cada uno levanta cuando está listo",
                  retro: "Sin una sola voz la camilla se inclina y el paciente se tuerce o se cae.",
                },
                {
                  texto: "El que está en la cabeza del paciente",
                  correcta: true,
                  retro: "Correcto. Quien está en la cabeza coordina: así cuello y espalda se mueven siempre alineados.",
                },
              ],
              alAgotar: "Una sola voz, la de la cabeza. Sin coordinación, el paciente sufre.",
            },
            {
              tipo: "resumen",
              titulo: "Lo que se lleva de esta lección",
              puntos: [
                "Se mueve solo si hay un peligro que no se puede controlar o para hacer RCP.",
                "Proteja su espalda: rodillas dobladas, espalda recta, carga cerca y sin girar.",
                "Solo y con alguien inconsciente: arrastre por las axilas o sobre una manta, por el eje del cuerpo.",
                "Consciente: muleta humana o sillas de dos o de cuatro manos.",
                "Rodamiento en bloque con al menos tres personas; manda quien sostiene la cabeza.",
              ],
              insignia: "Movimiento seguro",
            },
          ],
        },
      },
      {
        title: "La entrega al 123 y el caso final",
        description:
          "Qué información entregar al equipo de emergencias, qué hacer después del evento y una misión final que integra todo el curso.",
        durationMin: 20,
        contenido: {
          version: 1,
          guia: CAMILA,
          bloques: [
            {
              tipo: "portada",
              titulo: "La entrega y el caso final",
              subtitulo: "Su atención termina cuando el paciente queda en buenas manos y con toda la información.",
              objetivos: [
                "Entregar al paciente con información clara y ordenada",
                "Saber qué hacer después de la emergencia",
                "Integrar en un caso real lo aprendido en el curso",
              ],
              minutos: 20,
              dice: "Llegamos al final. Primero le enseño a cerrar bien una atención y después lo pongo a prueba con un caso completo.",
            },
            {
              tipo: "explicacion",
              titulo: "Entregar al paciente",
              parrafos: [
                "Cuando llega la ambulancia, el equipo necesita saber en menos de un minuto lo que usted vio e hizo. Hable claro, en orden y con datos, no con suposiciones.",
                "Si puede, anote los datos en un papel o en el celular mientras atiende: en la emergencia la memoria falla.",
              ],
              puntos: [
                { titulo: "Qué pasó", texto: "Cómo ocurrió: caída de qué altura, con qué se cortó, qué sustancia, cuánto tiempo estuvo expuesto." },
                { titulo: "Qué encontró", texto: "Si respondía, si respiraba, dónde estaban las lesiones, qué señales vio." },
                { titulo: "Qué hizo", texto: "RCP, descargas del DEA, presión, torniquete, inmovilización, azúcar, posición lateral." },
                { titulo: "A qué horas", texto: "Del evento, del torniquete, del inicio de los síntomas, de la convulsión, de la RCP." },
                { titulo: "Lo que sepa de la persona", texto: "Nombre, edad, enfermedades, alergias y medicamentos que toma, si los conoce." },
              ],
              clave: "Qué pasó, qué encontró, qué hizo y a qué horas.",
            },
            {
              tipo: "ordenar",
              titulo: "El informe de entrega",
              instruccion: "Ordene la entrega que le hace al paramédico.",
              pasos: [
                "Decir su nombre y que es brigadista de la empresa",
                "Contar qué pasó y a qué hora",
                "Describir qué encontró al llegar",
                "Explicar qué hizo y a qué horas",
                "Informar cómo está ahora y lo que sabe de sus enfermedades, alergias y medicamentos",
              ],
              explicacion: "Correcto. Así la información sigue el orden en que ocurrieron las cosas y el equipo no tiene que adivinar.",
            },
            {
              tipo: "decision",
              titulo: "Llega la ambulancia",
              situacion:
                "Atendió a un operario que se cortó la pierna con una pulidora. Le puso un torniquete. Llega el paramédico y le pregunta qué pasó.",
              pregunta: "¿Qué le dice?",
              opciones: [
                {
                  texto: "«Se cortó, ahí está todo»",
                  retro: "Sin datos el equipo pierde tiempo averiguando, y no sabe cuánto lleva el torniquete.",
                },
                {
                  texto: "Le cuento todo lo que pasó en el turno desde la mañana",
                  retro: "Demasiada información desordenada esconde lo importante. Sea breve y vaya a los hechos.",
                },
                {
                  texto: "«Se cortó el muslo con la pulidora a las 2:10. Sangraba a chorros, no paró con presión y le puse el torniquete a las 2:14. No ha perdido el conocimiento»",
                  correcta: true,
                  retro: "Excelente. Qué pasó, qué encontró, qué hizo y a qué horas, en pocos segundos.",
                },
              ],
            },
            {
              tipo: "explicacion",
              titulo: "Después de la emergencia",
              parrafos: [
                "La atención no termina cuando se va la ambulancia. Lávese bien las manos, deseche guantes y gasas en una bolsa roja de residuos biológicos si la hay, y reponga lo que usó del botiquín.",
                "Informe al responsable de SST para que registre el evento. Si fue un accidente de trabajo, la empresa debe reportarlo a la ARL dentro de los dos días hábiles siguientes. Su relato como brigadista ayuda en la investigación del accidente.",
                "Si tuvo contacto con sangre en piel lastimada, ojos o boca, repórtelo de inmediato. Y si lo que vivió le sigue afectando, dígalo: la empresa y la ARL pueden orientarle.",
              ],
              clave: "Lávese, reponga, reporte y cuídese usted también.",
            },
            {
              tipo: "mision",
              titulo: "Caso final: incendio en el taller de mantenimiento",
              intro:
                "Viernes, 3:20 p. m. Un recipiente de solvente se incendió en el taller de mantenimiento. El conato ya fue controlado por otro brigadista, pero queda humo y huele a solvente. Junto al banco de trabajo hay un mecánico en el piso, con el antebrazo quemado y sangrando mucho del muslo. Usted dirige la atención.",
              medidor: { etiqueta: "Vida del paciente", tipo: "vida" },
              velocidad: 1.6,
              penalizacion: 18,
              pasos: [
                {
                  situacion: "Usted está en la puerta del taller con su radio.",
                  pregunta: "¿Qué hace primero?",
                  opciones: [
                    {
                      texto: "Reporto por radio a la brigada, pido que llamen al 123 y que traigan el botiquín, el torniquete y el DEA",
                      correcta: true,
                      retro: "Bien: la ayuda y el equipo vienen en camino antes de que usted entre.",
                    },
                    {
                      texto: "Entro corriendo sin avisar a nadie",
                      retro: "Si algo le pasa adentro, nadie sabrá que hay dos víctimas. Primero avise.",
                    },
                  ],
                },
                {
                  situacion: "Adentro el humo es espeso a la altura de la cabeza y el olor a solvente es fuerte. El mecánico gime pero no se levanta.",
                  pregunta: "¿Qué hace?",
                  opciones: [
                    {
                      texto: "Lo atiendo ahí mismo para no moverlo",
                      retro: "Con humo y vapores de solvente, quedarse es más peligroso que moverlo. Este es uno de los casos en que se mueve.",
                    },
                    {
                      texto: "Con otro brigadista, lo saco agachados con un arrastre por las axilas hasta el patio",
                      correcta: true,
                      retro: "Correcto. El peligro no está controlado: se mueve por el eje del cuerpo, hacia una zona segura.",
                    },
                    {
                      texto: "Lo cargo en brazos de pie y salgo",
                      retro: "De pie respira el humo más denso y el riesgo de caer con él es alto. Agachados y arrastrando.",
                    },
                  ],
                },
                {
                  situacion: "Ya en el patio, se pone los guantes. El mecánico responde cuando le habla y respira. La sangre sale a chorros del muslo y empapa el pantalón.",
                  pregunta: "¿Qué atiende primero?",
                  opciones: [
                    {
                      texto: "La quemadura del antebrazo, que le duele más",
                      retro: "La quemadura duele, pero la hemorragia grave es la que puede matarlo en minutos. Primero el sangrado.",
                    },
                    {
                      texto: "La hemorragia del muslo, con presión directa firme",
                      correcta: true,
                      retro: "Así es. Lo que amenaza la vida primero: una hemorragia grave mata en minutos.",
                    },
                  ],
                },
                {
                  situacion: "Presiona con todo su peso, pero la sangre sigue saliendo y empapando las gasas.",
                  pregunta: "¿Qué hace?",
                  opciones: [
                    {
                      texto: "Retiro las gasas empapadas para ver bien la herida",
                      retro: "Al retirarlas arranca el coágulo y el sangrado vuelve con más fuerza.",
                    },
                    {
                      texto: "Pongo el torniquete en el muslo, 5 a 7 cm por encima de la herida, aprieto hasta que pare y anoto la hora",
                      correcta: true,
                      retro: "Correcto. Son las 3:26: esa hora viaja con el paciente.",
                    },
                    {
                      texto: "Le pongo el torniquete por debajo de la rodilla",
                      retro: "La sangre llega desde arriba: por debajo de la herida no la detiene.",
                    },
                  ],
                },
                {
                  situacion: "El sangrado se detuvo. El antebrazo tiene una quemadura roja con ampollas, del tamaño de dos palmas. Un compañero trae crema dental.",
                  pregunta: "¿Qué hace con la quemadura?",
                  opciones: [
                    {
                      texto: "Retiro el reloj y enfrío con agua corriente fresca durante 20 minutos, sin reventar las ampollas",
                      correcta: true,
                      retro: "Muy bien. Después la cubre con película plástica o una tela limpia y abriga el resto del cuerpo.",
                    },
                    {
                      texto: "Le pongo la crema dental para que no le arda",
                      retro: "La crema dental guarda el calor e irrita. Solo agua corriente fresca.",
                    },
                    {
                      texto: "Le pongo hielo directo para calmar el dolor",
                      retro: "El hielo daña todavía más la piel quemada.",
                    },
                  ],
                },
                {
                  situacion: "El mecánico está cada vez más pálido, frío y sudoroso. Pide agua con insistencia.",
                  pregunta: "¿Qué hace?",
                  opciones: [
                    {
                      texto: "Lo mantengo acostado, lo abrigo sin cubrir el brazo que se enfría, le hablo y no le doy agua",
                      correcta: true,
                      retro: "Correcto. Son señales de shock: acostado, abrigado y nada por boca. No le eleve la pierna con el torniquete.",
                    },
                    {
                      texto: "Le doy agua porque perdió mucho líquido",
                      retro: "Puede necesitar cirugía y, si bebe, vomitar. Nada por boca.",
                    },
                    {
                      texto: "Lo siento contra la pared para que esté más cómodo",
                      retro: "Sentado, al cerebro le llega todavía menos sangre y puede desmayarse.",
                    },
                  ],
                },
                {
                  situacion: "Llega la ambulancia a las 3:41.",
                  pregunta: "¿Qué le dice al paramédico?",
                  opciones: [
                    {
                      texto: "Que el paciente está mal y que se lo lleven rápido",
                      retro: "El equipo necesita datos: sin la hora del torniquete ni lo que se hizo, pierde tiempo valioso.",
                    },
                    {
                      texto: "Que fue un incendio por solvente a las 3:20, que lo sacamos del humo, hemorragia del muslo con torniquete a las 3:26, quemadura del antebrazo enfriada y signos de shock",
                      correcta: true,
                      retro: "Excelente entrega: qué pasó, qué encontró, qué hizo y a qué horas. También mencione que estuvo expuesto al humo y a los vapores.",
                    },
                  ],
                },
                {
                  situacion: "La ambulancia se fue con el mecánico.",
                  pregunta: "¿Qué sigue para usted?",
                  opciones: [
                    {
                      texto: "Me lavo, repongo el botiquín y el torniquete, e informo al responsable de SST para el reporte a la ARL",
                      correcta: true,
                      retro: "Así se cierra una atención: lista para la próxima y con el accidente reportado.",
                    },
                    {
                      texto: "Vuelvo a mi puesto; el reporte lo hará otra persona",
                      retro: "Su relato es clave para el registro y la investigación del accidente, y el botiquín tiene que quedar listo.",
                    },
                  ],
                },
              ],
              exito: "¡Caso resuelto! Movió al paciente fuera del peligro, detuvo la hemorragia, enfrió la quemadura, manejó el shock y entregó toda la información. Eso es un brigadista.",
              fracaso: "El paciente no resistió. Repase el orden: avisar, sacar del peligro, lo que amenaza la vida primero, quemadura, shock y una entrega clara.",
              dice: "Este es su examen práctico. Piense como brigadista: primero lo que mata más rápido.",
            },
            {
              tipo: "clasificar",
              titulo: "¿Va en la entrega?",
              instruccion: "Decida qué le dice al equipo de emergencias y qué no aporta en ese momento.",
              categorias: [
                { id: "decir", nombre: "Se le dice al equipo", pista: "Ayuda a atender" },
                { id: "no", nombre: "No aporta ahora", pista: "Se trata después" },
              ],
              elementos: [
                { texto: "La hora en que se puso el torniquete", categoria: "decir" },
                { texto: "Cuánto duró la convulsión", categoria: "decir" },
                { texto: "Las alergias y medicamentos que usted sabe que toma", categoria: "decir" },
                { texto: "Qué sustancia química le cayó, con su hoja de seguridad", categoria: "decir" },
                {
                  texto: "Quién tuvo la culpa del accidente",
                  categoria: "no",
                  porque: "Las causas se analizan después, en la investigación del accidente.",
                },
                {
                  texto: "Su opinión sobre cuál es el diagnóstico",
                  categoria: "no",
                  porque: "El diagnóstico lo hace el personal de salud. Usted entrega hechos.",
                },
              ],
            },
            {
              tipo: "resumen",
              titulo: "Lo que se lleva del curso",
              puntos: [
                "Entrega: qué pasó, qué encontró, qué hizo y a qué horas.",
                "Después: lávese, reponga el botiquín y reporte al responsable de SST para el reporte a la ARL.",
                "En toda emergencia: escena segura, ayuda en camino y primero lo que amenaza la vida.",
                "Ante la duda, llame al 123 y active la brigada.",
              ],
              insignia: "Brigadista integral",
              cierre: "Terminó la práctica del curso. En la evaluación final va a poner a prueba lo aprendido. Recuerde que las técnicas manuales se complementan con práctica presencial en los simulacros de su brigada.",
            },
          ],
        },
      },
    ],
  },
];

export const PREGUNTAS_PA001: Pregunta[] = [
  /* ---------------- Módulo 4 · Vía aérea y OVACE ---------------- */
  {
    statement: "Un trabajador cayó de un andamio y no responde. Sospecha lesión de cuello. ¿Con qué maniobra intenta primero abrirle la vía aérea?",
    explanation:
      "Con sospecha de trauma se usa la tracción mandibular, que abre la vía aérea sin inclinar la cabeza. Si con ella no se logra, se usa frente-mentón, porque respirar es la prioridad.",
    options: [
      { text: "Poniéndole una almohada bajo la cabeza", ok: false },
      { text: "Sentándolo para que respire mejor", ok: false },
      { text: "Con la tracción mandibular, sin mover el cuello", ok: true },
      { text: "Girándole la cabeza hacia un lado", ok: false },
    ],
  },
  {
    statement: "¿En qué caso se coloca a una persona en posición lateral de seguridad?",
    explanation:
      "La posición lateral de seguridad es para quien no responde pero respira con normalidad y no tiene sospecha de lesión de columna. Si no respira normal, se deja boca arriba y se inicia la RCP.",
    options: [
      { text: "Cuando no responde y no respira", ok: false },
      { text: "Cuando no responde, respira con normalidad y no hay sospecha de lesión de columna", ok: true },
      { text: "Cuando está consciente y tiene dolor en el pecho", ok: false },
      { text: "Cuando cayó de altura y le duele el cuello", ok: false },
    ],
  },
  {
    statement:
      "Verdadero o falso: a una mujer con embarazo avanzado que se está atragantando se le hacen compresiones en el pecho en lugar de compresiones abdominales.",
    explanation:
      "Verdadero. En el embarazo avanzado, y en personas a las que no se alcanza a rodear el abdomen, las compresiones se hacen en el centro del pecho.",
    type: "verdadero_falso",
    options: VF(true),
  },

  /* ---------------- Módulo 5 · Hemorragias, heridas y quemaduras ---------------- */
  {
    statement: "Acaba de poner un torniquete en la pierna de un compañero y el sangrado se detuvo. ¿Qué hace después?",
    explanation:
      "Se anota la hora en que se puso y no se afloja ni se retira: eso lo hace el personal de salud. Aflojarlo hace que vuelva el sangrado.",
    options: [
      { text: "Lo afloja cada 10 minutos para que circule la sangre", ok: false },
      { text: "Lo retira cuando la persona deja de sangrar", ok: false },
      { text: "Lo afloja un poco si la persona se queja del dolor", ok: false },
      { text: "Anota la hora en que lo puso y no lo afloja", ok: true },
    ],
  },
  {
    statement: "¿Cómo se enfría una quemadura térmica?",
    explanation:
      "Con agua corriente fresca, no helada, durante 20 minutos. El hielo, la mantequilla y la crema dental dañan la piel o guardan el calor.",
    options: [
      { text: "Con hielo directo durante 5 minutos", ok: false },
      { text: "Con agua corriente fresca durante 20 minutos", ok: true },
      { text: "Con crema dental para que no arda", ok: false },
      { text: "Con mantequilla o aceite para que no se pegue la ropa", ok: false },
    ],
  },
  {
    statement: "Verdadero o falso: las ampollas de una quemadura se deben reventar para que sane más rápido.",
    explanation: "Falso. La ampolla protege la piel de abajo contra la infección. Se deja intacta y se cubre sin apretar.",
    type: "verdadero_falso",
    options: VF(false),
  },

  /* ---------------- Módulo 6 · Osteomusculares, shock y conciencia ---------------- */
  {
    statement: "Una compañera está convulsionando en el piso. ¿Qué es lo correcto?",
    explanation:
      "Se protege su cabeza, se retiran los objetos cercanos y se toma el tiempo. No se le sujeta ni se le pone nada en la boca. Si dura 5 minutos o más, se llama al 123.",
    options: [
      { text: "Sujetarle los brazos y las piernas con fuerza", ok: false },
      { text: "Ponerle una cuchara en la boca para que no se trague la lengua", ok: false },
      { text: "Protegerle la cabeza, retirar los objetos cercanos y tomar el tiempo", ok: true },
      { text: "Echarle agua en la cara para que reaccione", ok: false },
    ],
  },
  {
    statement:
      "Un compañero diabético está sudando, tembloroso y confundido porque no almorzó. Está consciente y puede tragar. ¿Qué hace?",
    explanation:
      "Es una probable hipoglucemia: se le da azúcar de inmediato, por ejemplo medio vaso de jugo o de gaseosa normal. Si no mejora en 10 a 15 minutos o empeora, se llama al 123.",
    options: [
      { text: "Le da azúcar de inmediato, como medio vaso de jugo o de gaseosa normal", ok: true },
      { text: "Le aplica su insulina", ok: false },
      { text: "Le da una gaseosa dietética", ok: false },
      { text: "Lo deja solo descansando para que se le pase", ok: false },
    ],
  },
  {
    statement: "En la escala «Rostro, Brazo, Habla, Tiempo» para reconocer un ataque cerebrovascular, ¿qué significa «Tiempo»?",
    explanation:
      "Con una sola señal se anota la hora en que empezaron los síntomas y se llama al 123 de inmediato: el tratamiento depende del tiempo transcurrido.",
    options: [
      { text: "Esperar un tiempo prudente para ver si los síntomas pasan", ok: false },
      { text: "Medir cuánto tarda la persona en responder una pregunta", ok: false },
      { text: "Dejar descansar a la persona media hora antes de decidir", ok: false },
      { text: "Anotar la hora en que empezaron los síntomas y llamar al 123 de inmediato", ok: true },
    ],
  },

  /* ---------------- Módulo 7 · Movilización, transporte y casos prácticos ---------------- */
  {
    statement: "¿Cuándo se justifica mover a una persona lesionada antes de que llegue la ayuda?",
    explanation:
      "Solo si hay un peligro que no se puede controlar, como fuego, humo, gas o riesgo de derrumbe, o si hay que ponerla en una superficie firme para la RCP. En los demás casos se atiende donde está.",
    options: [
      { text: "Siempre, para llevarla a un lugar más cómodo", ok: false },
      { text: "Cuando hay un peligro que no se puede controlar o para hacer RCP", ok: true },
      { text: "Cuando la persona lo pide, aunque tenga dolor de cuello", ok: false },
      { text: "Cuando la ambulancia se demora más de cinco minutos", ok: false },
    ],
  },
  {
    statement: "Durante un rodamiento en bloque, ¿quién da las órdenes?",
    explanation:
      "El brigadista que sostiene la cabeza es el líder: da la cuenta para que todos giren a la vez y cabeza, cuello y espalda se mantengan alineados.",
    options: [
      { text: "El brigadista con más antigüedad", ok: false },
      { text: "Cada uno, cuando está listo", ok: false },
      { text: "El brigadista que sostiene la cabeza", ok: true },
      { text: "El que sostiene las piernas", ok: false },
    ],
  },
  {
    statement:
      "Verdadero o falso: al entregar el paciente al equipo de emergencias, lo esencial es contar qué pasó, qué encontró, qué hizo y a qué horas.",
    explanation:
      "Verdadero. Esa información, en orden y con las horas (del evento, del torniquete, del inicio de los síntomas), permite al equipo continuar la atención sin perder tiempo.",
    type: "verdadero_falso",
    options: VF(true),
  },
];
