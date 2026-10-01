/**
 * CURSO KG-PA-003 · PRIMEROS AUXILIOS PSICOLÓGICOS
 *
 * Curso completo en formato interactivo (contentType "interactivo"): cuatro
 * módulos de dos lecciones, con el modelo ABCDE y los principios de primeros
 * auxilios psicológicos de la OMS (Observar, Escuchar, Conectar).
 *
 * BORRADOR redactado por Claude a solicitud de Diego. Sigue las guías
 * generales de la OMS y de la Federación Internacional de la Cruz Roja sobre
 * primeros auxilios psicológicos y las recomendaciones de comunicación
 * responsable sobre suicidio, pero está PENDIENTE DE VALIDACIÓN TÉCNICA por los
 * profesionales de psicología de KG antes de certificar a nadie con él. En
 * particular deben confirmarse las líneas de atención citadas (123, Línea 192
 * opción 4 del Ministerio de Salud y Línea 106 de Bogotá) y las referencias
 * normativas colombianas.
 */
import type { CursoInteractivo } from "../cursos-interactivos";

const VF = (ok: boolean) => [
  { text: "Verdadero", ok },
  { text: "Falso", ok: !ok },
];

const DANIEL = { nombre: "Daniel Ospina", rol: "Psicólogo de SST", avatar: "brigadista" as const };

export const PSICOLOGICOS: CursoInteractivo = {
  code: "KG-PA-003",
  slug: "primeros-auxilios-psicologicos",
  title: "Primeros Auxilios Psicológicos",
  subtitle:
    "Contención emocional en crisis: escucha activa, modelo ABCDE y cuidado de quien ayuda. Aprenda qué decir, qué no decir y a quién llamar cuando alguien se derrumba en el trabajo.",
  objective:
    "Que el participante reconozca las reacciones de una persona en crisis, la acompañe con el modelo ABCDE dentro del entorno laboral, identifique las situaciones que exigen activar la emergencia, la conecte con la red de apoyo adecuada y cuide su propia salud mental como auxiliador, respetando siempre sus límites y los de la persona.",
  targetAudience: "Líderes de equipo, talento humano, brigadistas, COPASST y responsables del SG-SST.",
  requirements:
    "No requiere formación previa en salud mental. El curso no habilita para hacer terapia ni diagnósticos: prepara para dar un primer apoyo y derivar.",
  methodology:
    "100% virtual y en formato de videojuego: mundos y niveles con vidas, XP y estrellas, simulaciones de diálogo con la calma de la persona en juego, misiones contra el reloj, decisiones con consecuencias y desafío final.",
  level: "basico",
  durationHours: 3,
  categoria: "primeros-auxilios",
  modules: [
    /* ==================================================================== */
    /*  MÓDULO 1 · CRISIS Y REACCIÓN HUMANA                                  */
    /* ==================================================================== */
    {
      title: "Módulo 1. Crisis y reacción humana",
      description: "Qué es una crisis, cómo reaccionamos ante lo inesperado y qué son (y qué no son) los primeros auxilios psicológicos.",
      lessons: [
        {
          title: "Cuando todo se desordena",
          description: "Qué es una crisis y cuáles son las reacciones normales ante un hecho anormal.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: DANIEL,
            bloques: [
              {
                tipo: "portada",
                titulo: "Cuando todo se desordena",
                subtitulo: "Una crisis no es debilidad: es la respuesta humana a algo que nos desborda.",
                objetivos: [
                  "Explicar qué es una crisis emocional",
                  "Reconocer reacciones físicas, emocionales, cognitivas y conductuales",
                  "Distinguir los mitos más comunes sobre las crisis",
                  "Identificar las señales que necesitan ayuda inmediata",
                ],
                minutos: 20,
                dice: "Soy Daniel Ospina, psicólogo de SST. En este curso vamos a aprender a acompañar a alguien en uno de los peores momentos de su vida. No se preocupe: no se trata de tener las palabras perfectas, sino de estar presente.",
              },
              {
                tipo: "explicacion",
                titulo: "¿Qué es una crisis?",
                parrafos: [
                  "Una crisis es un estado temporal de desorganización emocional. Aparece cuando una persona enfrenta un hecho que, por un momento, supera su forma habitual de resolver los problemas.",
                  "En el trabajo puede llegar de muchas formas: un accidente grave, la muerte de un compañero, un atraco camino a la empresa, una llamada con una mala noticia, un despido o un conflicto que estalla.",
                  "Lo que define la crisis no es solo el hecho, sino cómo lo vive cada persona. Dos compañeros pueden presenciar lo mismo y reaccionar de forma muy distinta, y ambas reacciones pueden ser normales.",
                ],
                puntos: [
                  { titulo: "Es temporal", texto: "La mayoría de las crisis bajan de intensidad en horas o días, sobre todo si la persona se siente acompañada." },
                  { titulo: "Es personal", texto: "No hay una forma correcta de reaccionar. Compararla con otros solo la hace sentir peor." },
                  { titulo: "Es una oportunidad", texto: "Un buen acompañamiento en las primeras horas ayuda a que la persona recupere el control y busque apoyo." },
                ],
                clave: "Son reacciones normales de personas normales ante una situación anormal.",
                dice: "Grábese esa frase. La va a necesitar para calmar a otros, y también para calmarse usted.",
              },
              {
                tipo: "explicacion",
                titulo: "Cuatro formas de reaccionar",
                parrafos: [
                  "Después de un hecho crítico, el cuerpo y la mente se ponen en modo de alarma. Por eso las reacciones aparecen en varios frentes a la vez.",
                ],
                puntos: [
                  { titulo: "Físicas", texto: "Temblor, palpitaciones, sudor, náuseas, tensión en el cuerpo, cansancio extremo, dificultad para dormir." },
                  { titulo: "Emocionales", texto: "Miedo, tristeza, rabia, culpa, irritabilidad, sensación de vacío o de no sentir nada." },
                  { titulo: "Cognitivas", texto: "Confusión, dificultad para concentrarse o decidir, olvidos, imágenes del hecho que vuelven a la mente." },
                  { titulo: "Conductuales", texto: "Llanto, aislamiento, quedarse paralizado, hablar sin parar, evitar el lugar del hecho, comer o beber más." },
                ],
                clave: "Pida ayuda de inmediato si la persona está desorientada, no puede cuidarse a sí misma, habla de hacerse daño o de dañar a otros.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Qué tipo de reacción es?",
                instruccion: "Toque la categoría a la que pertenece cada reacción.",
                categorias: [
                  { id: "fisica", nombre: "Física", pista: "El cuerpo" },
                  { id: "emocional", nombre: "Emocional", pista: "Lo que se siente" },
                  { id: "cognitiva", nombre: "Cognitiva", pista: "Lo que se piensa" },
                  { id: "conductual", nombre: "Conductual", pista: "Lo que se hace" },
                ],
                elementos: [
                  { texto: "Le tiemblan las manos y siente el corazón acelerado", categoria: "fisica" },
                  { texto: "Siente culpa por no haber visto venir el accidente", categoria: "emocional" },
                  { texto: "No logra concentrarse en el informe que estaba haciendo", categoria: "cognitiva" },
                  { texto: "Evita pasar por la bodega donde ocurrió el hecho", categoria: "conductual", porque: "Evitar lugares es una conducta: algo que la persona hace." },
                  { texto: "Lleva dos noches sin poder dormir", categoria: "fisica" },
                  { texto: "Se le viene a la mente la imagen del compañero herido", categoria: "cognitiva", porque: "Son recuerdos que aparecen sin querer: una reacción del pensamiento." },
                  { texto: "Está irritable y responde mal a todo el mundo", categoria: "emocional" },
                  { texto: "Se encierra en el carro a la hora del almuerzo para no hablar con nadie", categoria: "conductual" },
                ],
              },
              {
                tipo: "tarjetas",
                titulo: "¿Mito o realidad?",
                instruccion: "Lea cada frase, piense si es mito o realidad y toque la tarjeta para comprobarlo.",
                tarjetas: [
                  {
                    frente: "Si no llora, es porque no le afectó.",
                    reverso: "Mito. Hay personas que se quedan quietas, calladas o se ponen a trabajar sin parar. No llorar no significa no sufrir.",
                  },
                  {
                    frente: "Las personas fuertes no entran en crisis.",
                    reverso: "Mito. Cualquiera puede entrar en crisis ante un hecho lo bastante grave. No es falta de carácter.",
                  },
                  {
                    frente: "Hay que hacer que cuente todo lo que vio para que lo saque.",
                    reverso: "Mito. Obligar a alguien a revivir el hecho puede hacerle daño. Se escucha lo que la persona quiera contar, a su ritmo.",
                  },
                  {
                    frente: "La mayoría de las personas se recupera con el apoyo de su entorno.",
                    reverso: "Realidad. Con acompañamiento, información y descanso, la mayoría mejora en días o semanas. Solo una parte necesita ayuda especializada.",
                  },
                ],
              },
              {
                tipo: "decision",
                titulo: "Después del atraco",
                situacion:
                  "Luisa, de servicio al cliente, llega a la oficina pálida y temblando: la atracaron en el bus camino al trabajo. Un compañero le dice «tranquila, eso le pasa a todo el mundo en esta ciudad».",
                pregunta: "¿Qué le dice usted?",
                dice: "Piense en cómo se sentiría usted si acabara de vivir eso.",
                opciones: [
                  {
                    texto: "«Qué susto tan grande. Aquí ya está a salvo. ¿Quiere sentarse un momento conmigo?»",
                    correcta: true,
                    retro: "Muy bien. Reconoce lo que vivió, le da seguridad y le ofrece compañía sin presionarla. Ese es el primer paso de la contención.",
                  },
                  {
                    texto: "«No es para tanto, por lo menos no le hicieron nada.»",
                    retro: "Minimizar le dice que su miedo no es válido. Luisa se va a cerrar y probablemente no vuelva a buscar apoyo.",
                  },
                  {
                    texto: "«¿Y por qué sacó el celular en el bus?»",
                    retro: "Buscar culpables en la víctima aumenta la culpa y la vergüenza justo cuando más necesita sentirse protegida.",
                  },
                ],
              },
              {
                tipo: "contrarreloj",
                titulo: "¿Es normal?",
                segundos: 20,
                situacion:
                  "Tres días después del accidente de un compañero, Pedro le cuenta que duerme mal y que la imagen del accidente se le viene a la cabeza varias veces al día.",
                pregunta: "¿Cómo lo interpreta?",
                opciones: [
                  {
                    texto: "Son reacciones esperables en los primeros días: lo acompaño y estoy pendiente de cómo evoluciona",
                    correcta: true,
                    retro: "Correcto. Es una reacción normal ante un hecho anormal. Si en unas semanas no mejora, empeora o le impide trabajar, conviene buscar apoyo profesional.",
                  },
                  {
                    texto: "Tiene un trastorno y hay que diagnosticarlo ya",
                    retro: "Usted no diagnostica, y a los tres días es muy pronto para hablar de un trastorno. Ponerle una etiqueta puede asustarlo más.",
                  },
                  {
                    texto: "Está exagerando para no trabajar",
                    retro: "Juzgarlo le quita la confianza para contar lo que siente. Pedro se guardará el malestar y puede empeorar en silencio.",
                  },
                ],
                alAgotar: "Pedro nota su duda y cambia de tema. Recuerde: la mayoría de estas reacciones son esperables en los primeros días.",
              },
              {
                tipo: "decision",
                titulo: "La señal que no puede esperar",
                situacion:
                  "Después de una explosión en el cuarto de calderas, sin heridos graves, usted recorre el área para ver cómo está el equipo.",
                pregunta: "¿Cuál de estas personas necesita que active ayuda de inmediato?",
                opciones: [
                  {
                    texto: "Martha, que no sabe dónde está, no reconoce a sus compañeros y repite la misma pregunta",
                    correcta: true,
                    retro: "Exacto. La desorientación es una señal de alerta: puede haber un golpe en la cabeza u otro problema médico. Avise a la brigada y llame al 123.",
                  },
                  {
                    texto: "Jairo, que llora a ratos y dice que se asustó mucho",
                    retro: "Llorar después de un susto así es una reacción esperable. Jairo necesita compañía, pero no es la señal más urgente del grupo.",
                  },
                  {
                    texto: "Diana, que dice que le da miedo volver a entrar al cuarto de calderas",
                    retro: "El miedo a volver al lugar es frecuente y suele bajar con el tiempo. Merece atención, pero no es la situación más urgente.",
                  },
                ],
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Una crisis es temporal y la vive cada persona a su manera.",
                  "Las reacciones pueden ser físicas, emocionales, cognitivas y conductuales.",
                  "Son reacciones normales de personas normales ante una situación anormal.",
                  "Desorientación, no poder cuidarse o hablar de hacerse daño exigen ayuda inmediata.",
                ],
                insignia: "Lector de crisis",
                cierre: "En la próxima lección verá qué son los primeros auxilios psicológicos y, sobre todo, qué no son.",
              },
            ],
          },
        },
        {
          title: "Qué son (y qué no son) los primeros auxilios psicológicos",
          description: "El propósito de los primeros auxilios psicológicos, sus límites y quiénes necesitan más atención.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: DANIEL,
            bloques: [
              {
                tipo: "portada",
                titulo: "Primeros auxilios, pero para la mente",
                subtitulo: "No es terapia ni diagnóstico: es apoyo humano en el momento justo.",
                objetivos: [
                  "Explicar qué son los primeros auxilios psicológicos y para qué sirven",
                  "Diferenciarlos de la terapia y del diagnóstico",
                  "Identificar a las personas con mayor riesgo",
                  "Hacer un primer contacto respetuoso",
                ],
                minutos: 20,
                dice: "Así como un brigadista no opera a nadie, usted tampoco va a hacer terapia. Va a hacer algo más sencillo, y muy poderoso.",
              },
              {
                tipo: "explicacion",
                titulo: "Apoyo humano, práctico y respetuoso",
                parrafos: [
                  "Los primeros auxilios psicológicos (PAP) son el apoyo humano y práctico que se le da a una persona que acaba de vivir un hecho crítico, sin presionarla y respetando sus decisiones.",
                  "Los puede dar cualquier persona preparada: un líder de equipo, alguien de talento humano, un brigadista o un compañero. Buscan tres cosas: que la persona esté segura, que se calme y que quede conectada con quien pueda seguir apoyándola.",
                ],
                puntos: [
                  { titulo: "Lo que sí son", texto: "Escuchar, acompañar, calmar, atender necesidades básicas, dar información veraz y conectar con la red de apoyo." },
                  { titulo: "Lo que no son", texto: "Terapia, diagnóstico, recetar medicamentos, investigar el hecho ni obligar a la persona a contar lo que vivió." },
                  { titulo: "Cuándo se dan", texto: "Durante o poco después del hecho crítico: minutos, horas o los primeros días." },
                ],
                clave: "Usted no tiene que resolverle la vida a nadie: tiene que ayudarle a pasar el momento más difícil y conectarlo con quien pueda seguir.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Es o no es PAP?",
                instruccion: "Decida si cada acción hace parte de los primeros auxilios psicológicos.",
                categorias: [
                  { id: "si", nombre: "Es primeros auxilios psicológicos", pista: "Le corresponde al auxiliador" },
                  { id: "no", nombre: "No le corresponde al auxiliador", pista: "Es de otro profesional o hace daño" },
                ],
                elementos: [
                  { texto: "Escuchar sin presionar", categoria: "si" },
                  { texto: "Ofrecer agua y un lugar tranquilo", categoria: "si" },
                  { texto: "Decirle qué trastorno tiene", categoria: "no", porque: "Diagnosticar le corresponde a un profesional de salud mental, después de una evaluación." },
                  { texto: "Pedirle que cuente con detalle todo lo que vio", categoria: "no", porque: "Forzar el relato puede revivir el miedo. Se escucha lo que quiera contar." },
                  { texto: "Ayudarle a llamar a un familiar", categoria: "si" },
                  { texto: "Recomendarle una pastilla para dormir", categoria: "no", porque: "Solo un médico puede formular medicamentos." },
                  { texto: "Darle información verdadera sobre lo que pasó", categoria: "si" },
                  { texto: "Hacerle sesiones semanales de terapia", categoria: "no", porque: "La terapia la hace un profesional en un proceso aparte. Usted conecta con ese servicio." },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "¿Quién necesita más atención?",
                parrafos: [
                  "Todas las personas afectadas merecen apoyo, pero algunas tienen más probabilidad de pasarla mal y conviene acercarse a ellas primero.",
                ],
                puntos: [
                  { titulo: "Estuvo muy cerca", texto: "Presenció el hecho de frente, resultó herida o atendió a la víctima." },
                  { titulo: "Tenía un vínculo cercano", texto: "Era amiga, familiar o compañera de turno de la persona afectada." },
                  { titulo: "Viene cargando otras pérdidas", texto: "Duelos recientes, problemas de salud mental previos o situaciones difíciles en casa." },
                  { titulo: "Tiene poca red de apoyo", texto: "Vive sola, llegó hace poco de otra ciudad o de otro país, o está lejos de su familia." },
                  { titulo: "Es más vulnerable", texto: "Aprendices muy jóvenes, personas mayores, con discapacidad o con alguna enfermedad." },
                  { titulo: "Siente culpa", texto: "Cree que pudo haber evitado lo que pasó." },
                ],
                clave: "Mayor riesgo no significa que la persona vaya a enfermar: significa que vale la pena acercarse primero y hacer seguimiento.",
              },
              {
                tipo: "decision",
                titulo: "¿A quién se acerca primero?",
                situacion:
                  "Un montacargas golpeó a un operario, que fue llevado a la clínica con lesiones graves. La brigada ya lo atendió. En la zona quedan varias personas afectadas y usted es el único auxiliador disponible por ahora.",
                pregunta: "¿Con quién empieza?",
                opciones: [
                  {
                    texto: "Con Andrés, el aprendiz de 18 años que estaba al lado, llegó hace dos meses de otra ciudad y no deja de temblar",
                    correcta: true,
                    retro: "Bien. Estuvo muy cerca, es muy joven y tiene poca red de apoyo aquí. Reúne varios factores de riesgo.",
                  },
                  {
                    texto: "Con el supervisor, que ya está organizando el reporte del accidente",
                    retro: "El supervisor también necesitará apoyo, pero en este momento está funcionando y ocupado. Otros lo necesitan más ahora.",
                  },
                  {
                    texto: "Con los compañeros del otro turno, que se enteraron por el chat",
                    retro: "Ellos merecen información clara más tarde, pero no presenciaron el hecho. Primero quienes estuvieron en la escena.",
                  },
                ],
              },
              {
                tipo: "tarjetas",
                titulo: "Lo que un auxiliador nunca hace",
                instruccion: "Toque cada tarjeta para ver por qué y qué hacer en su lugar.",
                tarjetas: [
                  {
                    frente: "Prometer que todo va a estar bien",
                    reverso: "Usted no lo sabe, y la persona lo sabe. Mejor: «Estoy aquí con usted y vamos a buscar ayuda juntos».",
                  },
                  {
                    frente: "Inventar o adivinar información",
                    reverso: "Un dato falso destruye la confianza. Si no sabe algo, dígalo y comprométase a averiguarlo.",
                  },
                  {
                    frente: "Juzgar la reacción de la persona",
                    reverso: "Frases como «está exagerando» o «tiene que ser fuerte» cierran la conversación. Cada quien reacciona como puede.",
                  },
                  {
                    frente: "Hacer de la crisis un espectáculo",
                    reverso: "Nada de fotos, videos ni corrillos. La dignidad de la persona se cuida tanto como su salud.",
                  },
                ],
              },
              {
                tipo: "contrarreloj",
                titulo: "El primer contacto",
                segundos: 20,
                situacion:
                  "Después del accidente, encuentra a Andrés sentado en el piso, abrazado a sus rodillas. No lo conoce mucho.",
                pregunta: "¿Qué le dice primero?",
                opciones: [
                  {
                    texto: "«Hola, Andrés. Soy de la brigada y estoy aquí para acompañarlo. ¿Puedo sentarme con usted?»",
                    correcta: true,
                    retro: "Perfecto. Se presenta, explica para qué está y pide permiso. Así la persona recupera un poco de control.",
                  },
                  {
                    texto: "«Cuénteme exactamente qué vio, paso a paso.»",
                    retro: "Andrés todavía está en shock. Pedirle el relato lo obliga a revivir la escena antes de sentirse seguro.",
                  },
                  {
                    texto: "«Ya, ya, no se ponga así, que usted es un hombre.»",
                    retro: "Le dice que su reacción está mal y le exige esconderla. Andrés va a sentir vergüenza además de miedo.",
                  },
                ],
                alAgotar: "Quedarse callado de pie frente a él lo intimida. Preséntese, diga para qué está y pida permiso para acompañarlo.",
              },
              {
                tipo: "mision",
                titulo: "Casi accidente en el patio de cargue",
                intro:
                  "Son las 7:20 de la mañana. Un camión dio reversa sin señalero y casi atropella a Carlos, auxiliar de bodega. No lo tocó, pero quedó temblando junto a la estiba. Usted es brigadista y llega primero. Cada respuesta acertada le ayuda a recuperar la calma; cada error la aleja.",
                medidor: { etiqueta: "Calma de Carlos", tipo: "vida" },
                velocidad: 1,
                penalizacion: 20,
                pasos: [
                  {
                    situacion: "Carlos está de pie junto al camión. Hay gente alrededor y alguien está grabando con el celular.",
                    pregunta: "¿Qué hace primero?",
                    opciones: [
                      {
                        texto: "Verifico que la zona sea segura y lo invito a alejarse conmigo a un lugar tranquilo",
                        correcta: true,
                        retro: "Primero la seguridad. Lejos del camión y de las miradas, Carlos puede empezar a bajar la guardia.",
                      },
                      {
                        texto: "Le pido que se quede ahí mientras llega el supervisor para el informe",
                        retro: "Lo deja expuesto en el lugar del susto y frente a todos. El informe puede esperar.",
                      },
                      {
                        texto: "Dejo que sigan grabando: sirve de evidencia",
                        retro: "La evidencia se recoge después y con respeto. Ser grabado en ese estado aumenta la angustia y la vergüenza.",
                      },
                    ],
                  },
                  {
                    situacion: "Ya en la sala de descanso, Carlos repite: «Casi me muero, casi me muero».",
                    pregunta: "¿Qué le responde?",
                    opciones: [
                      {
                        texto: "Me siento a su lado y le hablo despacio: «Fue un susto muy grande. Ya está a salvo; aquí estoy»",
                        correcta: true,
                        retro: "Reconoce lo que vivió y le recuerda que el peligro pasó. Su voz tranquila le presta calma.",
                      },
                      {
                        texto: "«Pero no le pasó nada, alégrese.»",
                        retro: "Para Carlos sí pasó algo: estuvo a punto de morir. Minimizarlo lo hace sentir incomprendido.",
                      },
                      {
                        texto: "«Usted también tuvo la culpa por pasar por ahí.»",
                        retro: "No es el momento de investigar ni de culpar. Eso le suma culpa al miedo y rompe la confianza.",
                      },
                    ],
                  },
                  {
                    situacion: "Carlos respira rápido y dice que tiene la boca seca.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Le ofrezco agua y le pregunto si quiere que respiremos despacio juntos",
                        correcta: true,
                        retro: "Atiende una necesidad básica y le ofrece una herramienta para calmar el cuerpo, sin imponerla.",
                      },
                      {
                        texto: "Le doy una pastilla para los nervios que tengo en el bolso",
                        retro: "Nunca dé medicamentos: no sabe qué otras condiciones tiene ni cómo le van a caer. Eso le corresponde a un médico.",
                      },
                    ],
                  },
                  {
                    situacion: "Carlos dice: «Necesito llamar a mi esposa, pero no quiero asustarla».",
                    pregunta: "¿Cómo lo apoya?",
                    opciones: [
                      {
                        texto: "Le ayudo a pensar qué decirle y le ofrezco un lugar privado para llamar",
                        correcta: true,
                        retro: "Lo conecta con su red de apoyo y respeta que sea él quien decida qué contar.",
                      },
                      {
                        texto: "«Mejor no le cuente nada, para qué la preocupa.»",
                        retro: "Lo aísla de su principal apoyo. Hablar con alguien de confianza es uno de los mejores protectores.",
                      },
                    ],
                  },
                  {
                    situacion: "Media hora después, Carlos está más tranquilo y quiere volver a su puesto.",
                    pregunta: "¿Qué hace antes de que se vaya?",
                    opciones: [
                      {
                        texto: "Le explico que es normal sentirse inquieto unos días, aviso a su jefe para que esté pendiente y le recuerdo el apoyo de la ARL",
                        correcta: true,
                        retro: "Le da información, deja a alguien pendiente de él y lo conecta con la red de apoyo. Así se cierra bien un primer auxilio psicológico.",
                      },
                      {
                        texto: "Lo dejo volver solo al patio y no vuelvo a preguntar",
                        retro: "Sin seguimiento, nadie notará si en los próximos días Carlos no duerme o no se atreve a volver al patio.",
                      },
                    ],
                  },
                ],
                exito: "¡Carlos recuperó la calma! Lo puso a salvo, lo escuchó, atendió lo que necesitaba y lo dejó conectado con su familia, su jefe y la ARL.",
                fracaso: "Carlos se cerró y volvió al patio con el susto encima. Recuerde: seguridad primero, voz calmada, nada de culpas y conexión con su red de apoyo.",
                dice: "Ahora usted es el primero en llegar. Despacio, con calma, que la calma se contagia.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Los primeros auxilios psicológicos buscan seguridad, calma y conexión con la red de apoyo.",
                  "No son terapia, ni diagnóstico, ni medicación, ni investigación del hecho.",
                  "Acérquese primero a quienes estuvieron más cerca, tenían un vínculo o tienen poca red de apoyo.",
                  "Preséntese, diga para qué está y pida permiso.",
                ],
                insignia: "Primer contacto",
                cierre: "En el próximo módulo aprenderá el modelo ABCDE, la guía paso a paso para acompañar a alguien en crisis.",
              },
            ],
          },
        },
      ],
    },

    /* ==================================================================== */
    /*  MÓDULO 2 · EL MODELO ABCDE                                           */
    /* ==================================================================== */
    {
      title: "Módulo 2. El modelo ABCDE",
      description: "Escucha activa, respiración, necesidades, redes de apoyo y psicoeducación, con los principios de la OMS como complemento.",
      lessons: [
        {
          title: "A y B: escucha activa y respiración",
          description: "Cómo escuchar de verdad y cómo ayudar a alguien a recuperar el ritmo de la respiración.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: DANIEL,
            bloques: [
              {
                tipo: "portada",
                titulo: "A y B: escuchar y respirar",
                subtitulo: "Las dos primeras letras del modelo son las que más calman.",
                objetivos: [
                  "Conocer las cinco letras del modelo ABCDE",
                  "Aplicar la escucha activa",
                  "Reconocer las frases que ayudan y las que lastiman",
                  "Guiar un ejercicio de respiración",
                ],
                minutos: 20,
                dice: "Muchas veces lo que más ayuda no es lo que usted dice, sino cómo escucha.",
              },
              {
                tipo: "explicacion",
                titulo: "El modelo ABCDE",
                parrafos: [
                  "El modelo ABCDE es una guía para la intervención en crisis desarrollada en Chile y muy usada en América Latina. Ordena en cinco letras lo que hace un auxiliador, para que no se le olvide nada aunque también esté nervioso.",
                ],
                puntos: [
                  { titulo: "A · Escucha activa", texto: "Escuchar con atención, sin juzgar, para que la persona se sienta comprendida." },
                  { titulo: "B · Reentrenamiento de la ventilación", texto: "Ayudar a la persona a respirar más despacio para calmar el cuerpo." },
                  { titulo: "C · Categorización de necesidades", texto: "Identificar y priorizar lo que la persona necesita ahora." },
                  { titulo: "D · Derivación a redes de apoyo", texto: "Conectarla con su familia, sus amigos y los servicios que pueden seguir apoyándola." },
                  { titulo: "E · Psicoeducación", texto: "Explicarle qué reacciones puede tener y cuándo pedir más ayuda." },
                ],
                clave: "No es una receta rígida: es un orden que le ayuda a pensar cuando todo está revuelto.",
              },
              {
                tipo: "explicacion",
                titulo: "A: escucha activa",
                parrafos: [
                  "Escuchar activamente es poner toda la atención en la persona y demostrarle que la está entendiendo. No es dar consejos ni contar su propia historia.",
                ],
                puntos: [
                  { titulo: "Esté presente", texto: "Guarde el celular, póngase a su altura, mírela con calma y mantenga una postura abierta." },
                  { titulo: "Respete los silencios", texto: "Un silencio no es un vacío que haya que llenar. A veces la persona lo necesita para ordenar lo que siente." },
                  { titulo: "Parafrasee", texto: "Repita con sus palabras lo que entendió: «Si le entiendo bien, lo que más le preocupa es…»." },
                  { titulo: "Valide", texto: "Reconozca la emoción: «Es comprensible que se sienta así después de lo que pasó»." },
                  { titulo: "Pregunte abierto", texto: "«¿Cómo se siente ahora?» invita a hablar; «¿Está bien?» se responde con un sí que no dice nada." },
                ],
                clave: "Escuchar no es esperar el turno para hablar.",
                dice: "Validar no es darle la razón en todo: es reconocer que lo que siente tiene sentido.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Ayuda o lastima?",
                instruccion: "Decida si cada frase ayuda a la persona o cierra la conversación.",
                categorias: [
                  { id: "ayuda", nombre: "Ayuda", pista: "Acompaña y valida" },
                  { id: "lastima", nombre: "Lastima o cierra", pista: "Minimiza, juzga o presiona" },
                ],
                elementos: [
                  { texto: "«Es comprensible que se sienta así.»", categoria: "ayuda" },
                  { texto: "«No es para tanto.»", categoria: "lastima", porque: "Minimiza lo que la persona vive y le enseña a no contar lo que siente." },
                  { texto: "«Sé exactamente lo que siente.»", categoria: "lastima", porque: "Nadie lo sabe exactamente. Suena a frase hecha y le quita protagonismo a su experiencia." },
                  { texto: "«Tómese el tiempo que necesite.»", categoria: "ayuda" },
                  { texto: "«Tiene que ser fuerte por sus hijos.»", categoria: "lastima", porque: "Le suma presión y culpa. Puede ser fuerte y estar triste al mismo tiempo." },
                  { texto: "«Si le entiendo bien, lo que más le preocupa es su familia.»", categoria: "ayuda" },
                  { texto: "«Todo pasa por algo.»", categoria: "lastima", porque: "Busca darle sentido al dolor antes de tiempo y puede sonar a que lo merecía." },
                  { texto: "«Estoy aquí con usted.»", categoria: "ayuda" },
                  { texto: "«A mí me pasó algo peor.»", categoria: "lastima", porque: "Convierte la conversación en una competencia y deja a la persona sin espacio." },
                ],
              },
              {
                tipo: "decision",
                titulo: "Lágrimas en contabilidad",
                situacion:
                  "Natalia acaba de recibir la noticia de que su mamá fue hospitalizada. Llora en su puesto y le dice: «Me siento una tonta llorando así en el trabajo».",
                pregunta: "¿Qué le responde?",
                opciones: [
                  {
                    texto: "«No tiene nada de tonto. Llorar es una reacción normal cuando uno se preocupa así. Tómese su tiempo.»",
                    correcta: true,
                    retro: "Valida su emoción, le quita la vergüenza y le da permiso de sentir. Natalia se siente acompañada.",
                  },
                  {
                    texto: "«Ya, deje de llorar, que la van a ver los de gerencia.»",
                    retro: "Le confirma que llorar es vergonzoso y la obliga a esconder lo que siente. El malestar se queda adentro.",
                  },
                  {
                    texto: "«Tranquila, a todos nos ha pasado algo peor.»",
                    retro: "Compararla minimiza su preocupación. Natalia va a sentir que exagera y dejará de hablar.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "B: reentrenamiento de la ventilación",
                parrafos: [
                  "Cuando una persona se asusta, respira rápido y corto. Eso trae mareo, hormigueo en las manos y sensación de ahogo, que a su vez aumentan el miedo. Es un círculo.",
                  "Ayudarla a respirar más despacio le da al cuerpo la señal de que el peligro pasó. Siempre pida permiso, explique lo que van a hacer y hágalo con ella, a su ritmo.",
                ],
                puntos: [
                  { titulo: "Inhalar", texto: "Por la nariz, despacio, contando hasta cuatro y llevando el aire hacia el abdomen." },
                  { titulo: "Pausar", texto: "Una pausa breve, sin forzar." },
                  { titulo: "Exhalar", texto: "Por la boca, despacio, contando hasta seis, como si soplara una vela sin apagarla." },
                  { titulo: "Repetir", texto: "Durante unos minutos, respirando usted con ella para que siga su ritmo." },
                ],
                clave: "Nunca use la bolsa de papel: no se recomienda y puede ser peligrosa si el problema es del corazón o de los pulmones.",
              },
              {
                tipo: "ordenar",
                titulo: "Respire conmigo",
                instruccion: "Ordene los pasos para guiar el ejercicio de respiración.",
                pasos: [
                  "Pedir permiso y explicar en qué consiste el ejercicio",
                  "Invitar a la persona a sentarse cómoda, con los pies en el piso",
                  "Inhalar juntos por la nariz contando hasta cuatro",
                  "Hacer una pausa breve",
                  "Exhalar despacio por la boca contando hasta seis",
                  "Repetir varias veces al ritmo de la persona",
                  "Preguntarle cómo se siente ahora",
                ],
                explicacion: "Así es. Pedir permiso le devuelve el control, la exhalación más larga que la inhalación es lo que calma, y preguntar al final le permite saber si necesita algo más.",
              },
              {
                tipo: "mision",
                titulo: "Atraco camino al trabajo",
                intro:
                  "Luisa, la compañera de servicio al cliente, llegó a la oficina después de que la atracaran en el bus. Está en la recepción, llorando, rodeada de compañeros que le hacen preguntas al mismo tiempo. Usted se acerca. Escuche y ayúdele a respirar.",
                medidor: { etiqueta: "Calma de Luisa", tipo: "vida" },
                velocidad: 1,
                penalizacion: 20,
                pasos: [
                  {
                    situacion: "Cinco compañeros le preguntan a la vez qué le robaron, dónde fue y si vio la cara del ladrón.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Le propongo ir a una sala tranquila y les pido a los demás, con amabilidad, que nos den espacio",
                        correcta: true,
                        retro: "Menos estímulos, más calma. Los compañeros tienen buena intención, pero tantas preguntas la abruman.",
                      },
                      {
                        texto: "Dejo que todos le pregunten: así se desahoga",
                        retro: "Responder a cinco personas a la vez es revivir el atraco cinco veces. Luisa se agita más.",
                      },
                    ],
                  },
                  {
                    situacion: "En la sala, Luisa cuenta lo que pasó a pedazos y de pronto se queda callada, mirando al piso.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Respeto el silencio y me quedo a su lado con calma, sin apurarla",
                        correcta: true,
                        retro: "El silencio también acompaña. Luisa siente que no tiene que actuar para usted.",
                      },
                      {
                        texto: "Lleno el silencio contándole cuando a mí me robaron",
                        retro: "La conversación pasa a ser sobre usted. Luisa deja de sentirse escuchada.",
                      },
                      {
                        texto: "Le pido que me cuente todo en orden para entenderlo bien",
                        retro: "No necesita entenderlo todo. Pedirle orden la presiona a revivir el hecho.",
                      },
                    ],
                  },
                  {
                    situacion: "Luisa dice: «Me robaron el celular, y ahí tenía todas las fotos de mi mamá, que murió el año pasado».",
                    pregunta: "¿Qué le responde?",
                    opciones: [
                      {
                        texto: "«Entonces no es solo el celular: perdió unas fotos muy valiosas para usted. Eso duele mucho.»",
                        correcta: true,
                        retro: "Parafrasea y valida. Luisa siente que usted entendió lo que de verdad le duele.",
                      },
                      {
                        texto: "«Tranquila, el celular se recupera con el seguro.»",
                        retro: "Habla del aparato, no de lo que ella siente. Luisa nota que no la entendió.",
                      },
                      {
                        texto: "«Por lo menos usted está viva.»",
                        retro: "Es cierto, pero minimiza su pérdida. Las frases con «por lo menos» casi siempre lastiman.",
                      },
                    ],
                  },
                  {
                    situacion: "Luisa empieza a respirar muy rápido. Dice que se marea y que le hormiguean las manos.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Le pregunto si quiere que respiremos juntos: aire por la nariz contando hasta cuatro y lo soltamos despacio por la boca",
                        correcta: true,
                        retro: "Pide permiso y la acompaña. Con la exhalación lenta, el mareo y el hormigueo empiezan a bajar.",
                      },
                      {
                        texto: "Le traigo una bolsa de papel para que respire adentro",
                        retro: "La bolsa no se recomienda: puede ser peligrosa si hay un problema del corazón o de los pulmones.",
                      },
                      {
                        texto: "Le digo con firmeza: «Cálmese ya»",
                        retro: "Nadie se calma porque se lo ordenen. La orden la hace sentir que está fallando.",
                      },
                    ],
                  },
                  {
                    situacion: "Después de unos minutos de respirar con usted, Luisa está más tranquila.",
                    pregunta: "¿Qué hace ahora?",
                    opciones: [
                      {
                        texto: "Le pregunto cómo se siente y qué le ayudaría en este momento",
                        correcta: true,
                        retro: "Comprueba cómo está y abre la puerta a lo siguiente: sus necesidades. Esa es la letra C.",
                      },
                      {
                        texto: "Le digo que ya pasó y que vuelva a su puesto",
                        retro: "Se calmó la respiración, pero el susto y las preocupaciones siguen ahí. Falta atender lo que necesita.",
                      },
                    ],
                  },
                ],
                exito: "¡Luisa se siente escuchada y respira tranquila! Le dio espacio, respetó sus silencios, entendió lo que de verdad le dolía y la acompañó a respirar.",
                fracaso: "Luisa se cerró y sigue agitada. Recuerde: menos gente, más silencio, validar lo que siente y respirar con ella, sin órdenes.",
                dice: "Ponga en práctica la A y la B. Sin afán: aquí la prisa es enemiga.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "ABCDE: escucha Activa, reentrenamiento de la ventilación (Breathing), Categorización de necesidades, Derivación y psicoEducación.",
                  "Escuchar es estar presente, respetar silencios, parafrasear y validar.",
                  "Evite las frases que minimizan, comparan o presionan.",
                  "Para respirar: permiso, inhalar en cuatro, exhalar en seis, juntos. Nunca la bolsa de papel.",
                ],
                insignia: "Escucha activa",
                cierre: "En la próxima lección completará el modelo con la C, la D y la E.",
              },
            ],
          },
        },
        {
          title: "C, D y E: necesidades, redes y psicoeducación",
          description: "Ordenar lo urgente, conectar con la red de apoyo y explicar qué esperar en los próximos días.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: DANIEL,
            bloques: [
              {
                tipo: "portada",
                titulo: "C, D y E: del alivio a la red de apoyo",
                subtitulo: "Calmar es el comienzo. Ahora hay que ordenar, conectar y explicar.",
                objetivos: [
                  "Identificar y priorizar las necesidades de la persona",
                  "Conectarla con su red de apoyo natural e institucional",
                  "Explicar las reacciones esperables y las señales de alerta",
                  "Aplicar los principios de la OMS: Observar, Escuchar, Conectar",
                ],
                minutos: 20,
                dice: "Una persona en crisis siente que tiene mil problemas encima. Usted le va a ayudar a verlos de uno en uno.",
              },
              {
                tipo: "explicacion",
                titulo: "C: categorización de necesidades",
                parrafos: [
                  "Cuando la persona ya está más calmada, ayúdele a identificar qué necesita y qué es lo más urgente. Primero la seguridad y la salud, luego lo básico, después el contacto con sus seres queridos y, por último, la información y los trámites.",
                  "Ayude a resolver, pero no lo resuelva todo por ella. Devolverle pequeñas decisiones le devuelve la sensación de control.",
                ],
                puntos: [
                  { titulo: "Seguridad y salud", texto: "Heridas, dolor, síntomas físicos, peligro en el lugar." },
                  { titulo: "Necesidades básicas", texto: "Agua, comida, abrigo, un lugar para estar, cómo volver a casa." },
                  { titulo: "Contacto y apoyo", texto: "Hablar con la familia, saber cómo están sus seres queridos." },
                  { titulo: "Información y trámites", texto: "Qué pasó, qué sigue, denuncias, permisos, incapacidades." },
                ],
                clave: "Pregunte, no suponga: «¿Qué es lo que más le preocupa en este momento?».",
              },
              {
                tipo: "clasificar",
                titulo: "¿Qué tipo de necesidad es?",
                instruccion: "Ubique cada necesidad en su categoría.",
                categorias: [
                  { id: "salud", nombre: "Seguridad y salud", pista: "Va primero" },
                  { id: "basica", nombre: "Necesidad básica", pista: "Cuerpo y lugar" },
                  { id: "contacto", nombre: "Contacto y apoyo", pista: "Sus seres queridos" },
                  { id: "info", nombre: "Información o trámite", pista: "Saber y hacer" },
                ],
                elementos: [
                  { texto: "Tiene una cortada en la mano que sigue sangrando", categoria: "salud", porque: "Lo físico va primero: avise a la brigada." },
                  { texto: "Dice que le duele el pecho", categoria: "salud", porque: "Un dolor en el pecho siempre se trata como posible emergencia médica." },
                  { texto: "Tiene frío y sed", categoria: "basica" },
                  { texto: "No tiene cómo volver a su casa", categoria: "basica" },
                  { texto: "Quiere hablar con su hermana", categoria: "contacto" },
                  { texto: "Le preocupa quién va a recoger a su hijo en el colegio", categoria: "contacto", porque: "Tiene que ver con sus seres queridos y con su red de apoyo." },
                  { texto: "Quiere saber cómo sigue el compañero herido", categoria: "info" },
                  { texto: "No sabe cómo poner la denuncia del robo", categoria: "info" },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "D: derivación a redes de apoyo",
                parrafos: [
                  "Derivar no es «quitarse a la persona de encima»: es asegurarse de que llegue a alguien que pueda seguir acompañándola cuando usted ya no esté.",
                  "Hay dos tipos de redes. Las naturales son la familia, los amigos, los compañeros y la comunidad. Las institucionales son los servicios: la EPS, la ARL, el programa de apoyo al empleado si la empresa lo tiene, las líneas de atención y, en una emergencia, el 123.",
                ],
                puntos: [
                  { titulo: "Red natural", texto: "Pregunte a quién de confianza quiere llamar y ayúdele a hacerlo." },
                  { titulo: "EPS", texto: "Atención en salud mental: consulta, urgencias o atención prioritaria." },
                  { titulo: "ARL", texto: "Cuando la crisis se relaciona con el trabajo, como un accidente de trabajo." },
                  { titulo: "Línea 192, opción 4", texto: "Orientación en salud mental del Ministerio de Salud." },
                  { titulo: "123", texto: "Emergencias: cuando hay riesgo para la vida." },
                ],
                clave: "Derivar bien es dejar un nombre, un número y, si se puede, acompañar la primera llamada.",
              },
              {
                tipo: "explicacion",
                titulo: "E: psicoeducación",
                parrafos: [
                  "Psicoeducar es explicarle a la persona, con palabras sencillas, que lo que siente es esperable, que suele bajar en días o semanas y qué puede hacer para cuidarse.",
                  "También es decirle claramente cuándo pedir más ayuda: si después de unas semanas las reacciones no disminuyen, si empeoran, si no puede dormir o trabajar, o si aparecen ideas de hacerse daño.",
                ],
                puntos: [
                  { titulo: "Cuerpo", texto: "Intentar dormir, comer a sus horas y moverse un poco." },
                  { titulo: "Rutina", texto: "Retomar poco a poco las actividades de siempre." },
                  { titulo: "Compañía", texto: "Estar con personas de confianza y hablar cuando quiera, sin obligarse." },
                  { titulo: "Sin atajos", texto: "Evitar el alcohol y otras sustancias para «calmar los nervios»: empeoran el sueño y el ánimo." },
                ],
                clave: "Psicoeducar es normalizar sin minimizar: «lo que siente es esperable» no es lo mismo que «eso no es nada».",
              },
              {
                tipo: "tarjetas",
                titulo: "Los principios de la OMS",
                instruccion: "La Organización Mundial de la Salud resume los primeros auxilios psicológicos en tres verbos. Toque cada uno.",
                tarjetas: [
                  {
                    etiqueta: "Antes",
                    frente: "Prepararse",
                    reverso: "Infórmese de lo que pasó, de los servicios disponibles y de su propia seguridad antes de acercarse.",
                  },
                  {
                    etiqueta: "Principio 1",
                    frente: "Observar",
                    reverso: "Revise la seguridad del lugar, quién tiene necesidades urgentes y quién muestra reacciones de angustia intensa.",
                  },
                  {
                    etiqueta: "Principio 2",
                    frente: "Escuchar",
                    reverso: "Acérquese con respeto, pregunte qué necesita y qué le preocupa, escuche y ayúdele a calmarse.",
                  },
                  {
                    etiqueta: "Principio 3",
                    frente: "Conectar",
                    reverso: "Ayúdele a cubrir sus necesidades básicas, a acceder a servicios, a recibir información y a reunirse con sus seres queridos.",
                  },
                ],
                dice: "Fíjese que encajan con el ABCDE: observar va antes de la A, escuchar es la A y la B, y conectar es la C, la D y la E.",
              },
              {
                tipo: "ordenar",
                titulo: "El ABCDE en orden",
                instruccion: "Ordene las letras del modelo tal como se aplican normalmente.",
                pasos: [
                  "Escuchar de forma activa lo que la persona cuenta",
                  "Ayudarle a respirar más despacio si está agitada",
                  "Identificar y priorizar sus necesidades",
                  "Conectarla con su red de apoyo y los servicios",
                  "Explicarle qué reacciones puede tener y cuándo pedir más ayuda",
                ],
                explicacion: "Así es: A, B, C, D, E. Es una guía, no una camisa de fuerza. Si hay un peligro físico, la seguridad va antes de todo, y si la persona está muy agitada puede empezar por la respiración.",
              },
              {
                tipo: "decision",
                titulo: "¿Es normal?",
                situacion:
                  "Al final del turno, un compañero que presenció el accidente de la mañana le pregunta: «¿Es normal que no pueda dejar de pensar en eso?».",
                pregunta: "¿Qué le responde?",
                opciones: [
                  {
                    texto: "«Sí, es muy común en los primeros días y suele ir bajando. Intente dormir, comer y estar con gente de confianza. Si en unas semanas sigue igual o empeora, buscamos apoyo profesional.»",
                    correcta: true,
                    retro: "Eso es psicoeducación: normaliza, da recomendaciones concretas y deja clara la señal para pedir más ayuda.",
                  },
                  {
                    texto: "«Tómese unos tragos esta noche para relajarse.»",
                    retro: "El alcohol parece calmar, pero empeora el sueño y el ánimo, y puede volverse una forma peligrosa de aguantar.",
                  },
                  {
                    texto: "«Eso es estrés postraumático. Tiene que ir al psiquiatra ya.»",
                    retro: "Usted no diagnostica, y es muy pronto para hablar de un trastorno. La etiqueta lo va a asustar más.",
                  },
                ],
              },
              {
                tipo: "mision",
                titulo: "El resto del camino con Luisa",
                intro:
                  "Luisa ya respira tranquila después del atraco, pero ahora la invaden las preocupaciones. Complete con ella la C, la D y la E del modelo antes de que la angustia vuelva a subir.",
                medidor: { etiqueta: "Calma de Luisa", tipo: "vida" },
                velocidad: 1,
                penalizacion: 20,
                pasos: [
                  {
                    situacion: "Luisa dice: «No sé ni qué hacer. Tengo mil cosas en la cabeza».",
                    pregunta: "¿Qué le responde?",
                    opciones: [
                      {
                        texto: "«Vamos por partes. ¿Qué es lo que más le preocupa ahora mismo?»",
                        correcta: true,
                        retro: "Le ayuda a ordenar y deja que sea ella quien elija por dónde empezar.",
                      },
                      {
                        texto: "Le hago yo una lista de todo y le digo qué hacer primero",
                        retro: "Con buena intención, le quita el control. Luisa necesita sentir que puede decidir.",
                      },
                    ],
                  },
                  {
                    situacion: "«Mi hijo sale del colegio a las tres y siempre lo recojo, pero hoy no me siento capaz.»",
                    pregunta: "¿Cómo la apoya?",
                    opciones: [
                      {
                        texto: "Le pregunto a quién de confianza podría pedirle que lo recoja y le facilito un teléfono para llamar",
                        correcta: true,
                        retro: "Atiende una necesidad real con su propia red de apoyo. Luisa se quita un peso de encima.",
                      },
                      {
                        texto: "«No piense en eso ahora, concéntrese en usted.»",
                        retro: "Para Luisa esa es la prioridad. Ignorarla deja la angustia intacta.",
                      },
                    ],
                  },
                  {
                    situacion: "Le preocupa que usen su línea y no sabe cómo poner la denuncia.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Le doy información concreta para bloquear la línea con el operador y poner la denuncia, y le ofrezco ayuda para hacerlo",
                        correcta: true,
                        retro: "Información clara y práctica: devuelve la sensación de control.",
                      },
                      {
                        texto: "Le digo que eso ya no sirve para nada",
                        retro: "Le quita una forma de actuar y aumenta la impotencia.",
                      },
                    ],
                  },
                  {
                    situacion: "«Siento que me va a dar miedo volver a coger el bus.»",
                    pregunta: "¿Qué le explica?",
                    opciones: [
                      {
                        texto: "Que es una reacción esperable, que suele bajar en días o semanas y que si no mejora puede pedir apoyo psicológico en su EPS",
                        correcta: true,
                        retro: "Normaliza sin minimizar y le deja clara la ruta si el miedo no cede. Eso es la E.",
                      },
                      {
                        texto: "«Eso se le pasa mañana, no le dé más vueltas.»",
                        retro: "Promete algo que no sabe. Si mañana sigue con miedo, Luisa va a pensar que algo anda mal con ella.",
                      },
                      {
                        texto: "«Si le da miedo, es que quedó traumatizada.»",
                        retro: "Ponerle una etiqueta la asusta. El miedo después de un atraco es esperable.",
                      },
                    ],
                  },
                  {
                    situacion: "Luisa decide irse a casa por hoy.",
                    pregunta: "¿Cómo la despide?",
                    opciones: [
                      {
                        texto: "Me aseguro de que alguien la acompañe, le dejo la línea 192 opción 4 y, con su permiso, le aviso a su jefe para que esté pendiente",
                        correcta: true,
                        retro: "La deja conectada con su red natural y con los servicios, y garantiza el seguimiento. Esa es la D.",
                      },
                      {
                        texto: "La despido en la puerta y no vuelvo a preguntar por ella",
                        retro: "Sin seguimiento, nadie notará si en los próximos días no logra volver a la rutina.",
                      },
                    ],
                  },
                ],
                exito: "¡Luisa se va acompañada y con un plan! Ordenó sus necesidades, la conectó con su red de apoyo y le explicó qué esperar en los próximos días.",
                fracaso: "Las preocupaciones volvieron a desbordar a Luisa. Recuerde: preguntar qué le preocupa más, apoyarse en su red, dar información concreta y explicar sin minimizar.",
                dice: "La A y la B ya las hizo. Ahora complete el modelo.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "C: primero seguridad y salud, luego lo básico, el contacto con los suyos y los trámites.",
                  "D: conecte con la red natural y con los servicios (EPS, ARL, línea 192 opción 4, 123).",
                  "E: explique que lo que siente es esperable y cuándo pedir más ayuda.",
                  "OMS: Observar, Escuchar, Conectar.",
                ],
                insignia: "Maestro del ABCDE",
                cierre: "En el próximo módulo va a aplicar todo esto en las situaciones más difíciles que se viven en una empresa.",
              },
            ],
          },
        },
      ],
    },

    /* ==================================================================== */
    /*  MÓDULO 3 · SITUACIONES CRÍTICAS EN EL TRABAJO                        */
    /* ==================================================================== */
    {
      title: "Módulo 3. Situaciones críticas en el trabajo",
      description: "Accidentes y muertes, malas noticias, crisis de pánico, agitación y riesgo de suicidio.",
      lessons: [
        {
          title: "Cuando el golpe llega al equipo",
          description: "Accidente o muerte de un compañero, una mala noticia y una crisis de pánico.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: DANIEL,
            bloques: [
              {
                tipo: "portada",
                titulo: "Cuando el golpe llega al equipo",
                subtitulo: "Tres situaciones que tarde o temprano se viven en una empresa.",
                objetivos: [
                  "Acompañar al equipo después de un accidente grave o una muerte",
                  "Apoyar a quien recibe una mala noticia en el trabajo",
                  "Reconocer una crisis de pánico sin descuidar lo médico",
                ],
                minutos: 20,
                dice: "En estas situaciones, el orden es sagrado: primero lo físico y la seguridad, después lo emocional.",
              },
              {
                tipo: "explicacion",
                titulo: "Accidente grave o muerte de un compañero",
                parrafos: [
                  "Primero la emergencia: escena segura, atención del lesionado por la brigada y llamada al 123. Después, el equipo.",
                  "Retire a los testigos de la escena y llévelos a un lugar tranquilo. No los deje solos. Deles información confirmada y evite los rumores. Pida que no circulen fotos ni videos: lastiman a la familia y vuelven a exponer a quienes lo vivieron.",
                  "La noticia a la familia la da la empresa según su protocolo, con apoyo de la ARL. Nunca por chat ni de forma improvisada por un compañero.",
                ],
                puntos: [
                  { titulo: "Reúna", texto: "Lleve a los testigos a un espacio tranquilo y quédese con ellos." },
                  { titulo: "Informe", texto: "Lo confirmado, sin especular. Si no sabe algo, dígalo." },
                  { titulo: "Cuide la dignidad", texto: "Nada de fotos ni videos. Respeto por quien murió o resultó herido." },
                  { titulo: "Respete el duelo", texto: "Cada quien lo vive distinto. Facilite espacios para despedirse." },
                ],
                clave: "En las primeras horas, la información confirmada calma más que cualquier consejo.",
              },
              {
                tipo: "ordenar",
                titulo: "Las primeras horas después del accidente",
                instruccion: "Ordene lo que se hace después de un accidente grave en el área.",
                pasos: [
                  "Asegurar la escena y activar la atención de emergencia (brigada y 123)",
                  "Retirar a los testigos a un lugar tranquilo y seguro",
                  "Acompañarlos y ofrecerles agua y un lugar para sentarse",
                  "Darles información confirmada, sin especular",
                  "Identificar a quienes necesitan más apoyo",
                  "Conectar con la ARL y la red de apoyo para el seguimiento",
                ],
                explicacion: "Correcto. Sin seguridad no hay contención posible, y sin seguimiento el apoyo se queda a medias. La ARL acompaña a la empresa en la atención de los eventos laborales.",
              },
              {
                tipo: "decision",
                titulo: "El chat del área",
                situacion:
                  "Una hora después del accidente, alguien comparte en el grupo de WhatsApp del área una foto del compañero herido. Varios preguntan si es verdad que murió. Usted es el líder del área y todavía no hay información confirmada.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Pido que borren la foto por respeto a él y a su familia, y aviso que la empresa dará información confirmada pronto",
                    correcta: true,
                    retro: "Protege la dignidad del compañero y frena los rumores sin inventar datos. Después, cumpla: informe apenas sepa.",
                  },
                  {
                    texto: "Confirmo lo que me contaron en el pasillo para que todos sepan",
                    retro: "Un rumor confirmado por el líder se vuelve verdad. Si es falso, el daño a la familia y al equipo es enorme.",
                  },
                  {
                    texto: "Ignoro el chat: no es mi problema",
                    retro: "El silencio deja que la foto siga circulando y que los rumores crezcan. El equipo necesita una voz clara.",
                  },
                ],
              },
              {
                tipo: "decision",
                titulo: "La llamada",
                situacion:
                  "En pleno turno, Sandra recibe una llamada: a su papá le dio un infarto y está en la clínica. Cuelga y se queda paralizada, con el celular en la mano. Ella vino al trabajo en moto.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "La llevo a un lugar privado, me quedo con ella y le pregunto qué necesita para llegar a la clínica",
                    correcta: true,
                    retro: "Le da privacidad y compañía, y atiende la necesidad más urgente: llegar con su papá de forma segura.",
                  },
                  {
                    texto: "Le digo que se vaya ya en su moto para que alcance a llegar",
                    retro: "En crisis, la atención y los reflejos fallan. Manejar así es un riesgo alto de accidente. Ayúdele a buscar otro transporte.",
                  },
                  {
                    texto: "«No piense en lo peor, seguro no es nada.»",
                    retro: "Promete algo que nadie sabe y desconoce su angustia. Si la noticia empeora, la frase le va a doler.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "La crisis de pánico",
                parrafos: [
                  "Una crisis de pánico es un miedo intenso que llega de golpe, con palpitaciones, sensación de ahogo, opresión en el pecho, temblor, mareo, sensación de irrealidad o miedo a morir o a enloquecer. Alcanza su punto más alto en pocos minutos y luego va cediendo.",
                  "Es muy angustiante, pero en sí misma no es peligrosa. El problema es que usted no puede distinguir a simple vista una crisis de pánico de un problema del corazón.",
                ],
                puntos: [
                  { titulo: "Primero lo médico", texto: "Si es la primera vez, hay dolor en el pecho, antecedentes del corazón o los síntomas no ceden, avise a la brigada y llame al 123." },
                  { titulo: "Voz tranquila", texto: "Frases cortas: «Esto que siente es muy fuerte, pero va a pasar. Aquí estoy»." },
                  { titulo: "Respiración", texto: "Respire con la persona: inhalar en cuatro, exhalar en seis." },
                  { titulo: "Anclaje", texto: "Invítela a nombrar cinco cosas que ve, a sentir los pies en el piso o a tocar un objeto cercano." },
                ],
                clave: "Ante la duda, trátelo como una emergencia médica. Llamar al 123 nunca sobra.",
              },
              {
                tipo: "contrarreloj",
                titulo: "Opresión en el pecho",
                segundos: 20,
                situacion:
                  "En plena reunión, Fernando, de 55 años, se lleva la mano al pecho, suda y dice que se ahoga. Nunca le había pasado. Un compañero dice: «Eso es un ataque de pánico, por el estrés del cierre».",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Aviso a la brigada y llamo al 123 mientras lo acompaño con calma",
                    correcta: true,
                    retro: "Correcto. Puede ser un problema del corazón. La atención médica va primero; la calma la acompaña.",
                  },
                  {
                    texto: "Le digo que respire en una bolsa de papel",
                    retro: "La bolsa no se recomienda y, si es un infarto, puede empeorarlo. Además se pierde tiempo valioso.",
                  },
                  {
                    texto: "Le digo que se calme, que es solo estrés",
                    retro: "Nadie en la sala puede saber si es estrés. Suponerlo puede costarle la vida a Fernando.",
                  },
                ],
                alAgotar: "Mientras duda, pasan minutos valiosos. Primera vez, dolor en el pecho y 55 años: es una emergencia médica hasta que se demuestre lo contrario.",
              },
              {
                tipo: "mision",
                titulo: "Pánico en el turno de la noche",
                intro:
                  "Son las 11 de la noche en la planta. Valentina, operaria de empaque, sale corriendo de la línea y se recuesta contra la pared del pasillo. Respira muy rápido y dice: «Me va a dar algo, no puedo respirar». Usted es el brigadista de turno.",
                medidor: { etiqueta: "Calma de Valentina", tipo: "vida" },
                velocidad: 1,
                penalizacion: 20,
                pasos: [
                  {
                    situacion: "Valentina está pálida y tiembla.",
                    pregunta: "¿Qué hace primero?",
                    opciones: [
                      {
                        texto: "Le pregunto si le ha pasado antes, si siente dolor en el pecho o si tiene alguna enfermedad",
                        correcta: true,
                        retro: "Primero descarta una emergencia médica. Esas respuestas le dicen si debe llamar al 123 de inmediato.",
                      },
                      {
                        texto: "Le digo que se calme, que está exagerando",
                        retro: "Juzgarla aumenta el miedo y no le da ninguna información para decidir si es una emergencia médica.",
                      },
                    ],
                  },
                  {
                    situacion: "Responde que ya le ha pasado, que su médico le dijo que son crisis de pánico y que no tiene dolor en el pecho.",
                    pregunta: "¿Qué hace ahora?",
                    opciones: [
                      {
                        texto: "La llevo a un lugar tranquilo, me pongo a su altura y le hablo despacio: «Esto es muy fuerte, pero va a pasar. Aquí estoy»",
                        correcta: true,
                        retro: "Menos estímulos y una voz tranquila. Saber que va a pasar le quita parte del miedo.",
                      },
                      {
                        texto: "Llamo a todos los compañeros de la línea para que me ayuden",
                        retro: "Mucha gente alrededor aumenta la sensación de ahogo y la vergüenza.",
                      },
                    ],
                  },
                  {
                    situacion: "Sigue respirando muy rápido y dice que le hormiguean las manos.",
                    pregunta: "¿Cómo la ayuda?",
                    opciones: [
                      {
                        texto: "Respiro con ella: aire por la nariz contando hasta cuatro y lo soltamos despacio contando hasta seis",
                        correcta: true,
                        retro: "La exhalación lenta corta el círculo de la respiración rápida, y el hormigueo empieza a ceder.",
                      },
                      {
                        texto: "Le pido que respire hondo y rápido para que le llegue más aire",
                        retro: "Respirar rápido es justamente lo que produce el mareo y el hormigueo. Empeora la crisis.",
                      },
                      {
                        texto: "Le traigo una bolsa de papel",
                        retro: "La bolsa no se recomienda. Respirar despacio con usted es más seguro y funciona.",
                      },
                    ],
                  },
                  {
                    situacion: "Dice que siente que nada es real, como si estuviera en un sueño.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "La invito a nombrar cinco cosas que ve a su alrededor y a sentir sus pies en el piso",
                        correcta: true,
                        retro: "El anclaje la trae al presente a través de los sentidos. Poco a poco recupera la sensación de control.",
                      },
                      {
                        texto: "Le digo: «Si sigue así, va a terminar en urgencias»",
                        retro: "Una amenaza aumenta el miedo, que es justamente lo que alimenta la crisis.",
                      },
                    ],
                  },
                  {
                    situacion: "Quince minutos después, Valentina está más tranquila, aunque cansada.",
                    pregunta: "¿Cómo cierra?",
                    opciones: [
                      {
                        texto: "Le pregunto qué necesita, si quiere avisar a alguien, y le sugiero contarle a su médico de la EPS que tuvo una nueva crisis",
                        correcta: true,
                        retro: "Atiende sus necesidades y la conecta con quien lleva su tratamiento. Así cierra el ABCDE.",
                      },
                      {
                        texto: "Le pido que vuelva de inmediato a la línea y que no le cuente a nadie",
                        retro: "Después de una crisis el cuerpo queda agotado. Y esconderla impide que reciba el apoyo que necesita.",
                      },
                    ],
                  },
                ],
                exito: "¡La crisis pasó y Valentina se siente acompañada! Descartó primero lo médico, la llevó a un lugar tranquilo, respiró con ella y la conectó con su EPS. Si en otra ocasión aparece dolor en el pecho o los síntomas no ceden, llame al 123.",
                fracaso: "La angustia de Valentina siguió subiendo. Recuerde: primero descartar lo médico, después lugar tranquilo, voz calmada, respirar juntos y anclaje.",
                dice: "Turno de noche, poca gente y una compañera en crisis. Usted puede con esto.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Tras un accidente: escena segura, testigos a un lugar tranquilo, información confirmada y nada de fotos.",
                  "La noticia a la familia la da la empresa según su protocolo, con apoyo de la ARL.",
                  "Ante una mala noticia: privacidad, compañía y un transporte seguro.",
                  "Pánico: primero descarte lo médico. Ante la duda, 123.",
                ],
                insignia: "Apoyo en la tormenta",
                cierre: "La próxima lección trata las dos situaciones más delicadas: una persona agitada y el riesgo de suicidio.",
              },
            ],
          },
        },
        {
          title: "Agitación y riesgo de suicidio",
          description: "Cómo protegerse ante una persona agitada y cómo preguntar y actuar ante el riesgo de suicidio.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: DANIEL,
            bloques: [
              {
                tipo: "portada",
                titulo: "Agitación y riesgo de suicidio",
                subtitulo: "Dos situaciones en las que su seguridad y la vida de la persona van primero.",
                objetivos: [
                  "Protegerse ante una persona agitada y ayudar a bajar la tensión",
                  "Reconocer las señales de riesgo de suicidio",
                  "Preguntar de forma directa y respetuosa",
                  "Activar la ayuda sin dejar sola a la persona",
                ],
                minutos: 20,
                dice: "Esta lección habla de suicidio. Si el tema le toca de cerca o en algún momento se siente mal, haga una pausa y busque apoyo: la Línea 192, opción 4, del Ministerio de Salud orienta en salud mental, y en una emergencia está el 123.",
              },
              {
                tipo: "explicacion",
                titulo: "Persona agitada: primero su seguridad",
                parrafos: [
                  "Una persona muy alterada puede gritar, golpear objetos o amenazar. Casi siempre detrás hay miedo, rabia o frustración. Su meta es bajar la tensión sin ponerse en riesgo.",
                ],
                puntos: [
                  { titulo: "Distancia", texto: "Más de un brazo de distancia, de lado y no de frente." },
                  { titulo: "Salidas libres", texto: "No la acorrale y no se deje acorralar: usted y ella deben tener por dónde salir." },
                  { titulo: "Una sola voz", texto: "Que hable una sola persona, y retire al público." },
                  { titulo: "Voz baja y frases cortas", texto: "Hable despacio y más bajo que ella. No discuta ni amenace." },
                  { titulo: "Reconozca la emoción", texto: "«Veo que está muy molesto. Quiero entender qué pasó»." },
                  { titulo: "Ofrezca opciones", texto: "«¿Prefiere que hablemos aquí o en la sala?». Elegir le devuelve el control." },
                ],
                clave: "Si hay armas, golpes o amenazas, aléjese, ponga a salvo a los demás y llame a seguridad y al 123. Nunca intente contener físicamente a nadie.",
              },
              {
                tipo: "decision",
                titulo: "Gritos en talento humano",
                situacion:
                  "Ricardo acaba de recibir la carta de terminación de su contrato. Se pone de pie, grita que es una injusticia y golpea el escritorio. Usted está en la oficina con él.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Me pongo de pie despacio, busco quedar con la salida libre y le hablo en voz baja: «Veo que esto le cayó muy mal. Quiero escucharlo»",
                    correcta: true,
                    retro: "Cuida su seguridad, no lo desafía y reconoce su emoción. Así la tensión tiene por dónde bajar.",
                  },
                  {
                    texto: "Le digo con firmeza que si no se calma llamo a la policía",
                    retro: "Una amenaza en ese momento suele escalar la agresión. Si hay peligro real, se sale y se pide ayuda, sin anunciarlo como castigo.",
                  },
                  {
                    texto: "Me acerco y le pongo la mano en el hombro para tranquilizarlo",
                    retro: "Una persona agitada puede sentir el contacto como una agresión y reaccionar con violencia. Mantenga la distancia.",
                  },
                ],
              },
              {
                tipo: "contrarreloj",
                titulo: "La tensión sube",
                segundos: 15,
                situacion: "Ricardo no se calma. Toma un objeto pesado del escritorio y lo levanta en actitud amenazante.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Salgo del lugar, aviso a seguridad y llamo al 123",
                    correcta: true,
                    retro: "Correcto. Su seguridad va primero. Contener a una persona armada le corresponde a la autoridad.",
                  },
                  {
                    texto: "Intento quitarle el objeto",
                    retro: "Forcejear con alguien armado y alterado es la forma más rápida de que alguien salga herido.",
                  },
                  {
                    texto: "Me quedo para convencerlo de que lo suelte",
                    retro: "Ya no es momento de hablar. Con un objeto en la mano, la prioridad es salir y pedir ayuda.",
                  },
                ],
                alAgotar: "Cuando hay un objeto que puede herir, no se duda: salga, aleje a los demás y llame a seguridad y al 123.",
              },
              {
                tipo: "explicacion",
                titulo: "Riesgo de suicidio: las señales y la pregunta",
                parrafos: [
                  "El suicidio se puede prevenir. Muchas personas que piensan en quitarse la vida dan señales y, en el fondo, lo que buscan es que el dolor pare. Su papel no es tratar a la persona: es notar, preguntar, acompañar y conectar con ayuda.",
                  "Esté atento si alguien habla de querer morir, de ser una carga o de no tener salida; si se despide o regala cosas valiosas; si se aísla o aumenta el consumo de alcohol; si muestra cambios bruscos, incluida una calma repentina después de una época muy difícil; o si viene de pérdidas recientes como un despido, una separación, deudas o una enfermedad.",
                  "Si nota señales, pregunte de forma directa y respetuosa: «¿Está pensando en quitarse la vida?». Preguntar no induce la idea; al contrario, suele aliviar y abre la puerta a la ayuda.",
                ],
                puntos: [
                  { titulo: "Pregunte directo", texto: "Con calma y sin rodeos. Las palabras claras demuestran que usted puede escuchar la respuesta." },
                  { titulo: "Escuche sin juzgar", texto: "No discuta, no sermonee, no hable de culpa ni de pecado." },
                  { titulo: "No prometa secreto", texto: "La vida de la persona está por encima de la confidencialidad." },
                  { titulo: "Si el riesgo es inminente", texto: "No la deje sola, aleje lo que pueda usar para hacerse daño solo si es seguro hacerlo y llame al 123." },
                  { titulo: "Si no es inminente", texto: "Busque ayuda con ella ese mismo día: línea 192 opción 4, su EPS, la ARL o el programa de apoyo de la empresa." },
                ],
                clave: "Preguntar directamente por el suicidio no pone la idea en la cabeza de nadie. Puede ser la primera vez que alguien se atreve a escucharle.",
              },
              {
                tipo: "tarjetas",
                titulo: "¿Mito o realidad?",
                tarjetas: [
                  {
                    frente: "Quien habla de suicidio no lo hace.",
                    reverso: "Mito. Muchas personas que llegan a intentarlo lo habían mencionado antes. Tómelo siempre en serio.",
                  },
                  {
                    frente: "Preguntar por el suicidio puede darle la idea a la persona.",
                    reverso: "Mito. Preguntar con respeto no induce la idea. Le muestra que puede hablar y que a alguien le importa.",
                  },
                  {
                    frente: "Si de pronto está muy tranquilo, el riesgo ya pasó.",
                    reverso: "Mito. Una calma repentina después de una época muy difícil puede ser una señal de alerta. Siga pendiente y no suspenda la ayuda.",
                  },
                  {
                    frente: "El suicidio se puede prevenir.",
                    reverso: "Realidad. Notar las señales, preguntar, acompañar, alejar los medios y conectar con ayuda profesional salva vidas.",
                  },
                ],
              },
              {
                tipo: "decision",
                titulo: "¿Qué le responde?",
                situacion:
                  "Mónica, de facturación, lleva semanas callada y llegando tarde. Hoy, mientras toman un tinto, le dice en voz baja: «A veces pienso que todos estarían mejor sin mí».",
                pregunta: "¿Qué le responde?",
                dice: "Respire. La pregunta directa es la que más ayuda.",
                opciones: [
                  {
                    texto: "«Gracias por contármelo. Cuando dice eso, ¿está pensando en quitarse la vida?»",
                    correcta: true,
                    retro: "Agradece la confianza y pregunta de forma directa y serena. Mónica siente que puede hablar sin ser juzgada.",
                  },
                  {
                    texto: "«No diga bobadas, usted tiene todo para ser feliz.»",
                    retro: "Desconoce su dolor y cierra la conversación. Mónica va a sentir que nadie la entiende y dejará de hablar.",
                  },
                  {
                    texto: "«Eso no se dice. Piense en lo que sufriría su familia.»",
                    retro: "Le suma culpa a un dolor que ya es enorme y le enseña a no volver a mencionarlo.",
                  },
                ],
              },
              {
                tipo: "decision",
                titulo: "El secreto",
                situacion:
                  "Mónica responde que sí lo ha pensado, pero que no tiene un plan y que hoy no lo haría. Le pide: «Por favor, no le cuente a nadie».",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Le digo con cariño que no puedo guardar ese secreto porque su vida me importa, y le propongo que busquemos ayuda hoy mismo: la línea 192 opción 4 y una cita prioritaria en su EPS",
                    correcta: true,
                    retro: "Es honesto, respeta su dignidad y no la deja con la conversación a medias. Buscar ayuda el mismo día es lo indicado.",
                  },
                  {
                    texto: "Le prometo no contarle a nadie para no perder su confianza",
                    retro: "Si usted guarda el secreto, la ayuda no llega. La confidencialidad tiene un límite: el riesgo para la vida.",
                  },
                  {
                    texto: "Le digo que lo piense el fin de semana y que el lunes hablamos",
                    retro: "Dejar la ayuda para después la deja sola con esos pensamientos. Se busca apoyo el mismo día.",
                  },
                ],
              },
              {
                tipo: "mision",
                titulo: "Una conversación que puede salvar una vida",
                intro:
                  "Jorge, técnico de mantenimiento, atraviesa una separación y tiene muchas deudas. Al final del turno se queda solo en el taller y le dice: «Ya nada tiene sentido. Sería mejor no estar». Usted es su líder. Cada respuesta acertada fortalece la confianza de Jorge para aceptar ayuda.",
                medidor: { etiqueta: "Confianza de Jorge", tipo: "vida" },
                velocidad: 0.8,
                penalizacion: 20,
                pasos: [
                  {
                    situacion: "Están en el taller y en cualquier momento entra gente.",
                    pregunta: "¿Qué hace primero?",
                    opciones: [
                      {
                        texto: "Le propongo hablar en un lugar más tranquilo y le dejo claro que tengo tiempo para él",
                        correcta: true,
                        retro: "Privacidad y tiempo: Jorge siente que lo que le pasa es importante para usted.",
                      },
                      {
                        texto: "Le digo que hablemos mañana, que ya es tarde",
                        retro: "Cuando alguien dice algo así, no se aplaza. Puede que no vuelva a abrirse.",
                      },
                    ],
                  },
                  {
                    situacion: "Ya a solas, Jorge repite: «Sería mejor no estar. Nadie lo entendería».",
                    pregunta: "¿Qué le dice?",
                    opciones: [
                      {
                        texto: "«Jorge, cuando dice que sería mejor no estar, ¿está pensando en quitarse la vida?»",
                        correcta: true,
                        retro: "Pregunta directa y serena. No pone la idea en su cabeza: le muestra que puede decir la verdad.",
                      },
                      {
                        texto: "«No diga eso, piense en sus hijos.»",
                        retro: "Le suma culpa y cierra la conversación. Jorge va a guardar silencio.",
                      },
                      {
                        texto: "«Usted no es capaz de hacer una cosa así.»",
                        retro: "Suena a desafío y minimiza lo que siente. Nunca rete a alguien en riesgo.",
                      },
                    ],
                  },
                  {
                    situacion: "Jorge responde que sí, que lo ha pensado mucho y que siente que hoy podría hacerlo.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Le digo que no lo voy a dejar solo, que vamos a buscar ayuda ya, y llamo al 123 sin separarme de él",
                        correcta: true,
                        retro: "El riesgo es inminente: no se le deja solo ni un momento y se activa la emergencia.",
                      },
                      {
                        texto: "Le prometo no contarle a nadie si me promete no hacer nada",
                        retro: "Una promesa no protege su vida. Con riesgo inminente, se pide ayuda ya, sin secretos.",
                      },
                      {
                        texto: "Le digo que se vaya a descansar a la casa y mañana hablamos",
                        retro: "Mandarlo solo a casa con riesgo inminente lo deja sin ninguna protección.",
                      },
                    ],
                  },
                  {
                    situacion: "Mientras llega la ayuda, Jorge le cuenta que en su maleta tiene algo con lo que pensaba hacerse daño.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Le pido con calma que me permita guardarlo lejos de su alcance, sin forcejear, y sigo a su lado",
                        correcta: true,
                        retro: "Alejar los medios salva vidas, pero solo si es seguro. Pedirlo con calma lo hace parte de la decisión.",
                      },
                      {
                        texto: "Le arrebato la maleta a la fuerza",
                        retro: "El forcejeo puede terminar en heridos y rompe la confianza justo cuando más la necesita.",
                      },
                      {
                        texto: "No le doy importancia para no alterarlo",
                        retro: "Dejar a su alcance lo que podría usar para hacerse daño aumenta el riesgo. Si es seguro, se aleja.",
                      },
                    ],
                  },
                  {
                    situacion: "Llega el equipo de salud.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Les cuento lo que Jorge dijo y lo que pasó, y le informo al responsable de SST solo lo necesario",
                        correcta: true,
                        retro: "El equipo de salud necesita la información completa. A los demás, solo lo indispensable para apoyarlo.",
                      },
                      {
                        texto: "Les cuento a los compañeros del taller para que estén pendientes de él",
                        retro: "Su situación no es para comentarla en el área. Exponerlo afecta su dignidad y su regreso al trabajo.",
                      },
                    ],
                  },
                ],
                exito: "Jorge aceptó la ayuda y quedó en manos del equipo de salud. Usted preguntó sin rodeos, no lo dejó solo, alejó lo que podía hacerle daño y cuidó su intimidad. Ahora cuídese usted también: hable con alguien de confianza sobre lo que vivió.",
                fracaso: "Jorge dejó de hablar y no aceptó la ayuda por ahora. En la vida real, nunca es tarde para volver a intentarlo. Recuerde: preguntar directo, no dejarlo solo, no prometer secretos y llamar al 123 si el riesgo es inminente.",
                dice: "Esta es la conversación más difícil del curso. No necesita palabras perfectas: necesita preguntar, quedarse y pedir ayuda.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Persona agitada: distancia, salidas libres, voz baja y nunca contacto físico. Con armas o amenazas, salga y llame al 123.",
                  "Ante señales de suicidio, pregunte directo: preguntar no induce la idea.",
                  "Nunca prometa guardar el secreto: la vida va primero.",
                  "Riesgo inminente: no deje sola a la persona, aleje los medios si es seguro y llame al 123.",
                  "Sin riesgo inminente: busquen ayuda el mismo día (línea 192 opción 4, EPS, ARL o programa de apoyo).",
                ],
                insignia: "Guardián de la vida",
                cierre: "Si algo de esta lección le removió emociones, está bien. Hable con alguien de confianza o llame a la línea 192, opción 4.",
              },
            ],
          },
        },
      ],
    },

    /* ==================================================================== */
    /*  MÓDULO 4 · CUIDAR A QUIEN CUIDA Y DERIVAR                            */
    /* ==================================================================== */
    {
      title: "Módulo 4. Cuidar a quien cuida y derivar",
      description: "Rutas de atención, confidencialidad, registro en el SG-SST, autocuidado del auxiliador y reunión de cierre de la brigada.",
      lessons: [
        {
          title: "Derivar, guardar reserva y registrar",
          description: "A dónde llevar cada caso, qué se guarda y qué no, y cómo dejar constancia para el SG-SST.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: DANIEL,
            bloques: [
              {
                tipo: "portada",
                titulo: "Derivar, guardar reserva y registrar",
                subtitulo: "El primer auxilio termina bien cuando la persona queda en buenas manos.",
                objetivos: [
                  "Elegir la ruta de atención adecuada para cada caso",
                  "Manejar la confidencialidad y conocer su límite",
                  "Registrar la atención para el SG-SST sin exponer a la persona",
                ],
                minutos: 20,
                dice: "Usted no está solo en esto. Hay una red detrás, y en esta lección la va a conocer.",
              },
              {
                tipo: "explicacion",
                titulo: "Las rutas de atención",
                parrafos: [
                  "Cada situación tiene su puerta de entrada. Conocerlas antes de necesitarlas le ahorra minutos y angustia.",
                ],
                puntos: [
                  { titulo: "123 · Emergencias", texto: "Riesgo inminente para la vida, agresión con armas o síntomas médicos graves." },
                  { titulo: "EPS", texto: "Atención en salud mental de cada trabajador: consulta, atención prioritaria o urgencias." },
                  { titulo: "ARL", texto: "Eventos relacionados con el trabajo, como un accidente de trabajo o un hecho violento en la empresa. Apoya también a la empresa en la intervención." },
                  { titulo: "Línea 192, opción 4", texto: "Orientación en salud mental del Ministerio de Salud." },
                  { titulo: "Programa de apoyo al empleado", texto: "Si la empresa lo tiene: orientación psicológica para el trabajador y su familia." },
                  { titulo: "Línea 106 (Bogotá)", texto: "Para niños, niñas y adolescentes: por ejemplo, si un trabajador busca orientación para su hijo." },
                ],
                clave: "Tenga a mano la ruta de su empresa: el nombre de la ARL, los teléfonos y a quién avisar en el SG-SST.",
              },
              {
                tipo: "clasificar",
                titulo: "¿A dónde lo deriva?",
                instruccion: "Elija la ruta principal para cada caso.",
                categorias: [
                  { id: "emergencia", nombre: "123 · Emergencias", pista: "Riesgo inminente" },
                  { id: "eps", nombre: "EPS", pista: "Salud mental de cada trabajador" },
                  { id: "arl", nombre: "ARL", pista: "Eventos del trabajo" },
                  { id: "linea", nombre: "Línea 192, opción 4", pista: "Orientación telefónica" },
                ],
                elementos: [
                  { texto: "Un compañero dice que hoy se quiere quitar la vida", categoria: "emergencia", porque: "Riesgo inminente: no se le deja solo y se llama al 123." },
                  { texto: "Un cliente amenaza con un arma al personal de caja", categoria: "emergencia" },
                  { texto: "Un trabajador lleva un mes triste y durmiendo mal después de su separación", categoria: "eps", porque: "No es un evento laboral ni una emergencia: necesita una valoración en su EPS." },
                  { texto: "Una compañera pide atención por una ansiedad que no tiene que ver con el trabajo", categoria: "eps" },
                  { texto: "El equipo que presenció el accidente de trabajo de un compañero necesita acompañamiento", categoria: "arl", porque: "Es un evento laboral: la ARL apoya a la empresa en la intervención." },
                  { texto: "Un operario que se cortó en la máquina tiene pesadillas con el accidente", categoria: "arl", porque: "Las secuelas de un accidente de trabajo se atienden por la ARL." },
                  { texto: "Una trabajadora quiere orientación por teléfono esta noche y no está en riesgo inminente", categoria: "linea" },
                  { texto: "Un líder quiere saber cómo orientar a alguien de su equipo que está pasando por un duelo", categoria: "linea" },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Confidencialidad: lo que se guarda y lo que no",
                parrafos: [
                  "Lo que una persona le cuenta en una crisis es suyo. No se comenta con compañeros, en corrillos ni en chats. La información sobre la salud es un dato sensible y tiene protección especial en Colombia.",
                  "Comparta solo lo necesario con quien necesita saberlo para ayudar, idealmente con la autorización de la persona. Al jefe, por ejemplo, le basta saber que necesita apoyo o el día libre, no los detalles.",
                  "El límite es claro: cuando hay riesgo para la vida de la persona o de otras personas, no hay secreto que valga. Avise a quien pueda protegerla y explíquele a la persona por qué lo hace.",
                ],
                clave: "Nunca prometa un secreto absoluto. Diga: «Lo que me cuente queda entre nosotros, salvo que su vida o la de otros esté en riesgo».",
              },
              {
                tipo: "decision",
                titulo: "El jefe pregunta",
                situacion:
                  "Al día siguiente de la llamada sobre el infarto de su papá, el jefe de Sandra le pregunta a usted: «¿Qué le pasó ayer? Me dijeron que se puso como loca».",
                pregunta: "¿Qué le responde?",
                opciones: [
                  {
                    texto: "«Recibió una noticia familiar muy difícil. Le va a ayudar que le dé flexibilidad estos días. Los detalles es mejor que se los cuente ella si quiere.»",
                    correcta: true,
                    retro: "Le da al jefe lo necesario para apoyarla y protege la intimidad de Sandra. También corrige la etiqueta sin confrontar.",
                  },
                  {
                    texto: "Le cuento todo lo que ella me dijo para que la entienda",
                    retro: "Los detalles son de Sandra. Contarlos sin su permiso rompe la confianza y la expone en su equipo.",
                  },
                  {
                    texto: "«No le puedo decir nada», y me voy",
                    retro: "Cuida la reserva, pero deja al jefe sin lo mínimo para apoyarla, y el rumor de que «se puso como loca» sigue vivo.",
                  },
                ],
              },
              {
                tipo: "contrarreloj",
                titulo: "¿Guardo el secreto?",
                segundos: 20,
                situacion:
                  "Una compañera le cuenta, preocupada: «Juan me dijo que se iba a quitar la vida, pero me hizo prometer que no le diría a nadie».",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Aviso de inmediato al responsable de SST o a la brigada y buscamos a Juan para acompañarlo",
                    correcta: true,
                    retro: "Correcto. Hay riesgo para la vida: la confidencialidad tiene un límite. Lo importante es que Juan reciba ayuda hoy.",
                  },
                  {
                    texto: "Respeto la promesa y no digo nada",
                    retro: "Guardar ese secreto puede dejar a Juan sin ayuda cuando más la necesita.",
                  },
                  {
                    texto: "Lo comento en el grupo del área para que todos estén pendientes",
                    retro: "Exponerlo frente a todos lo avergüenza y puede alejarlo de la ayuda. Se avisa a quien puede actuar, no a todo el mundo.",
                  },
                ],
                alAgotar: "Cuando hay riesgo para la vida, no hay tiempo para dudar: avise a quien pueda ayudar y busquen a la persona.",
              },
              {
                tipo: "explicacion",
                titulo: "El registro para el SG-SST",
                parrafos: [
                  "Toda atención en crisis dentro de la empresa debe quedar registrada para el SG-SST: permite hacer seguimiento, demostrar que se actuó y prevenir que se repita. El registro lo custodia el responsable del SG-SST, con reserva.",
                  "Si la crisis viene de un accidente de trabajo, recuerde que el accidente se reporta a la ARL dentro de los dos días hábiles siguientes. La información de estos eventos también alimenta la gestión del riesgo psicosocial de la empresa.",
                ],
                puntos: [
                  { titulo: "Sí va", texto: "Fecha, hora y lugar; qué ocurrió, en hechos; qué apoyo se dio; a dónde se derivó; quién hace el seguimiento." },
                  { titulo: "No va", texto: "Diagnósticos, opiniones, juicios ni detalles íntimos que no tienen que ver con el evento." },
                ],
                clave: "Registre hechos, no etiquetas: «Llora y dice que no duerme hace tres noches», no «está deprimida».",
              },
              {
                tipo: "ordenar",
                titulo: "Del evento al seguimiento",
                instruccion: "Ordene lo que se hace desde la atención hasta el seguimiento.",
                pasos: [
                  "Atender la crisis con el modelo ABCDE",
                  "Derivar a la ruta que corresponde",
                  "Informar solo lo necesario al responsable del SG-SST",
                  "Registrar los hechos, el apoyo dado y la derivación",
                  "Hacer seguimiento a la persona en los días siguientes",
                ],
                explicacion: "Exacto. Primero la persona, después el papel. Y el seguimiento cierra el ciclo: un simple «¿cómo ha estado?» unos días después puede hacer una gran diferencia.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "123 para emergencias, EPS para la salud mental de cada trabajador, ARL para los eventos del trabajo y línea 192 opción 4 para orientación.",
                  "Lo que la persona cuenta es suyo: comparta solo lo necesario.",
                  "La confidencialidad termina donde empieza el riesgo para la vida.",
                  "Registre hechos, no etiquetas, y haga seguimiento.",
                ],
                insignia: "Puente de ayuda",
                cierre: "En la última lección hablaremos de la persona que más se olvida en una crisis: usted.",
              },
            ],
          },
        },
        {
          title: "Cuidar a quien cuida",
          description: "Desgaste, trauma vicario y agotamiento del auxiliador, autocuidado y reunión de cierre de la brigada.",
          durationMin: 20,
          contenido: {
            version: 1,
            guia: DANIEL,
            bloques: [
              {
                tipo: "portada",
                titulo: "Cuidar a quien cuida",
                subtitulo: "Para ayudar a otros, usted también necesita estar bien.",
                objetivos: [
                  "Reconocer el desgaste, el trauma vicario y el agotamiento",
                  "Aplicar medidas de autocuidado antes, durante y después de ayudar",
                  "Conducir una reunión de cierre de la brigada sin obligar a nadie a contar lo que vivió",
                ],
                minutos: 20,
                dice: "Los brigadistas y los líderes suelen ser los últimos en pedir ayuda. Esta lección es para usted.",
              },
              {
                tipo: "explicacion",
                titulo: "Ayudar también cansa",
                parrafos: [
                  "Acompañar el dolor de otros deja huella. Es normal sentirse cansado o triste después de una crisis, pero a veces el impacto se queda y crece sin que uno lo note.",
                ],
                puntos: [
                  { titulo: "Trauma vicario", texto: "Las imágenes o historias de otros se le «pegan»: aparecen sin querer, le quitan el sueño y cambian su forma de ver el mundo." },
                  { titulo: "Desgaste por empatía", texto: "De tanto ponerse en el lugar de otros, se queda sin energía para sentir o ayudar." },
                  { titulo: "Agotamiento laboral", texto: "Un cansancio que no se va con el descanso, junto con indiferencia y la sensación de que nada de lo que hace sirve." },
                ],
                clave: "Reconocer sus límites no es egoísmo: es lo que le permite seguir ayudando.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Esperable o señal de alerta?",
                instruccion: "Decida si cada situación es esperable después de un evento difícil o una señal para pedir apoyo.",
                categorias: [
                  { id: "esperable", nombre: "Esperable", pista: "Suele pasar con descanso y compañía" },
                  { id: "alerta", nombre: "Señal de alerta", pista: "Pida apoyo" },
                ],
                elementos: [
                  { texto: "Sentirse muy cansado la noche después de atender una crisis", categoria: "esperable" },
                  { texto: "Pensar en lo ocurrido durante uno o dos días", categoria: "esperable" },
                  { texto: "Tener pesadillas con el evento varias semanas después", categoria: "alerta", porque: "Si después de semanas no disminuye, conviene una valoración profesional." },
                  { texto: "Tomar más alcohol para poder dormir", categoria: "alerta", porque: "Es una forma de aguantar que empeora el sueño y el ánimo." },
                  { texto: "Sentir tristeza al recordar al compañero que murió", categoria: "esperable", porque: "La tristeza es parte del duelo." },
                  { texto: "Estar irritable con todo y alejarse de la familia", categoria: "alerta" },
                  { texto: "Sentir que nada de lo que hace sirve para algo", categoria: "alerta", porque: "Es una señal típica de agotamiento." },
                  { texto: "Querer hablar de lo que pasó con alguien de confianza", categoria: "esperable", porque: "Buscar a alguien de confianza es una forma sana de procesar lo vivido." },
                ],
              },
              {
                tipo: "tarjetas",
                titulo: "Su botiquín de autocuidado",
                instruccion: "Toque cada momento para ver qué hacer.",
                tarjetas: [
                  {
                    etiqueta: "Antes",
                    frente: "Prepárese",
                    reverso: "Conozca la ruta de atención, sus propios límites y lo que le afecta más. Nadie ayuda bien improvisando.",
                  },
                  {
                    etiqueta: "Durante",
                    frente: "Cuídese mientras ayuda",
                    reverso: "Respire, tome agua, pida relevo si lo necesita y no atienda solo una situación de riesgo.",
                  },
                  {
                    etiqueta: "Después",
                    frente: "Descargue",
                    reverso: "Descanse, coma, muévase y hable con alguien de confianza, sin dar detalles que expongan a la persona que ayudó. Evite el alcohol para «desconectarse».",
                  },
                  {
                    etiqueta: "Siempre",
                    frente: "Pida apoyo",
                    reverso: "Si las señales de alerta no ceden, busque apoyo profesional en su EPS, la ARL o el programa de apoyo de la empresa.",
                  },
                ],
              },
              {
                tipo: "decision",
                titulo: "Una semana después",
                situacion:
                  "Hace una semana usted acompañó a los testigos de un accidente grave. Desde entonces duerme mal, la escena se le repite en la cabeza y anoche les gritó a sus hijos por una bobada.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Lo hablo con alguien de confianza y pido apoyo a través de la ARL, mi EPS o el programa de la empresa",
                    correcta: true,
                    retro: "Así se cuida quien cuida. Pedir apoyo a tiempo evita que el malestar crezca y le permite seguir ayudando.",
                  },
                  {
                    texto: "Me aguanto: un brigadista tiene que ser fuerte",
                    retro: "Aguantar en silencio no lo hace más fuerte: hace que el malestar crezca y termine afectando su salud y su familia.",
                  },
                  {
                    texto: "Me tomo unos tragos cada noche para poder dormir",
                    retro: "El alcohol empeora el sueño y el ánimo, y puede volverse una dependencia. No es autocuidado.",
                  },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "La reunión de cierre de la brigada",
                parrafos: [
                  "Después de un evento crítico, conviene reunir a la brigada en los días siguientes, cuando todos hayan podido descansar, en un lugar tranquilo y sin prisa.",
                  "El propósito es revisar lo que se hizo, aprender, reconocer el esfuerzo, explicar las reacciones esperables y compartir los recursos de apoyo. No es una sesión de terapia ni una investigación del accidente.",
                  "Nadie debe ser obligado a contar lo que vio o lo que sintió. Las guías de la OMS no recomiendan presionar a las personas para que revivan el evento: hablar es voluntario y quien prefiera escuchar está en su derecho.",
                ],
                puntos: [
                  { titulo: "Lo operativo", texto: "Qué funcionó y qué mejorar en el plan de emergencias, sin buscar culpables." },
                  { titulo: "Voluntario", texto: "Se invita a hablar, nunca se obliga. El silencio también se respeta." },
                  { titulo: "Reconocer", texto: "Agradecer el trabajo de cada uno." },
                  { titulo: "Recursos", texto: "Reacciones esperables, señales de alerta y a dónde acudir." },
                  { titulo: "Seguimiento", texto: "Acordar volver a hablar y acercarse en privado a quien lo necesite." },
                ],
                clave: "En la reunión de cierre se invita, no se obliga: nadie tiene que contar lo que vio para «superarlo».",
              },
              {
                tipo: "ordenar",
                titulo: "La reunión de cierre, paso a paso",
                instruccion: "Ordene los momentos de la reunión de cierre.",
                pasos: [
                  "Convocar a la brigada a un lugar tranquilo, cuando todos hayan descansado",
                  "Explicar el propósito y que participar en la conversación es voluntario",
                  "Revisar lo operativo: qué funcionó y qué mejorar",
                  "Reconocer el trabajo de todos",
                  "Explicar las reacciones esperables y las señales de alerta",
                  "Compartir los recursos de apoyo y acordar el seguimiento",
                ],
                explicacion: "Así es. Empezar dejando claro que hablar es voluntario les quita presión a todos, y terminar con los recursos de apoyo deja abierta la puerta para quien lo necesite después.",
              },
              {
                tipo: "mision",
                titulo: "Después del evento",
                intro:
                  "Hace dos días, la brigada atendió el accidente en el que murió Hernán, operario de la planta. Usted coordina la reunión de cierre. El equipo llega cansado y triste. Cada decisión acertada ayuda a que el grupo se sienta cuidado; cada error lo tensiona.",
                medidor: { etiqueta: "Calma del equipo", tipo: "vida" },
                velocidad: 1,
                penalizacion: 20,
                pasos: [
                  {
                    situacion: "Todos están sentados y en silencio. Usted abre la reunión.",
                    pregunta: "¿Cómo empieza?",
                    opciones: [
                      {
                        texto: "Explico que vamos a revisar cómo actuamos y que nadie está obligado a contar lo que vio o sintió",
                        correcta: true,
                        retro: "Deja claro el propósito y quita la presión. El equipo se relaja un poco.",
                      },
                      {
                        texto: "Pido que cada uno cuente, en detalle y en orden, lo que vio",
                        retro: "Obligar a revivir el evento puede hacer daño, sobre todo a quienes estuvieron más cerca.",
                      },
                    ],
                  },
                  {
                    situacion: "Camilo, que atendió a Hernán, se queda callado y mira al piso todo el tiempo.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Respeto su silencio y, al terminar, me acerco en privado a preguntarle cómo está",
                        correcta: true,
                        retro: "Respeta su ritmo sin dejarlo solo. En privado, Camilo puede decidir qué compartir.",
                      },
                      {
                        texto: "Le pido frente a todos que hable, que le va a hacer bien",
                        retro: "Presionarlo en público lo expone y puede hacerlo sentir peor.",
                      },
                    ],
                  },
                  {
                    situacion: "Una brigadista dice, con la voz quebrada: «Si hubiéramos llegado antes, estaría vivo».",
                    pregunta: "¿Qué responde?",
                    opciones: [
                      {
                        texto: "«Entiendo que lo piense; es muy común sentir culpa después de algo así. Hicimos lo que estaba a nuestro alcance, y lo que podamos mejorar lo vamos a trabajar juntos.»",
                        correcta: true,
                        retro: "Valida la culpa como reacción esperable, reconoce el esfuerzo y deja el aprendizaje como tarea de todos.",
                      },
                      {
                        texto: "«Sí, fallamos. Alguien tiene que responder por esto.»",
                        retro: "La reunión de cierre no es el lugar para buscar culpables. Eso le corresponde a la investigación del accidente.",
                      },
                      {
                        texto: "Cambio de tema rápido para que no se ponga a llorar",
                        retro: "Evitar la emoción le dice que no es bienvenida. La brigadista se queda sola con la culpa.",
                      },
                    ],
                  },
                  {
                    situacion: "Llegan a la revisión de lo operativo.",
                    pregunta: "¿Cómo lo hacen?",
                    opciones: [
                      {
                        texto: "Repasamos qué funcionó y qué mejorar en el plan de emergencias, sin buscar culpables",
                        correcta: true,
                        retro: "Aprender sin culpar fortalece a la brigada para la próxima vez.",
                      },
                      {
                        texto: "Mostramos las fotos del accidente para analizarlo mejor",
                        retro: "Las imágenes vuelven a exponer al equipo a lo que vivió. Para aprender no hacen falta.",
                      },
                    ],
                  },
                  {
                    situacion: "La reunión está por terminar.",
                    pregunta: "¿Cómo cierra?",
                    opciones: [
                      {
                        texto: "Explico las reacciones esperables, comparto los contactos de la ARL, la EPS, la línea 192 opción 4 y el programa de apoyo, y acordamos volver a hablar en unos días",
                        correcta: true,
                        retro: "Psicoeducación, recursos y seguimiento: el equipo sale sabiendo qué esperar y a dónde acudir.",
                      },
                      {
                        texto: "Digo que ya pasó y que hay que seguir como si nada",
                        retro: "Negar el impacto hace que cada uno cargue solo con lo que siente.",
                      },
                    ],
                  },
                ],
                exito: "¡La brigada salió más unida y cuidada! Nadie fue obligado a hablar, se aprendió sin culpar y todos saben a dónde acudir si lo necesitan.",
                fracaso: "El equipo terminó más tenso de lo que llegó. Recuerde: hablar es voluntario, nada de culpas ni imágenes, y cerrar con recursos y seguimiento.",
                dice: "Último reto del curso. Esta vez usted cuida a los que cuidan.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Ayudar deja huella: conozca las señales del trauma vicario y del agotamiento.",
                  "Autocuidado antes, durante y después. Sin alcohol para «desconectarse».",
                  "Si las señales no ceden, pida apoyo: EPS, ARL o programa de la empresa.",
                  "En la reunión de cierre se invita, no se obliga: nadie tiene que contar lo que vivió.",
                ],
                insignia: "Cuidador de cuidadores",
                cierre: "Terminó la parte práctica. En el desafío final va a poner a prueba todo lo aprendido. Gracias por prepararse para acompañar a otros en sus peores momentos.",
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
        statement:
          "Después del accidente de un compañero, Pedro tiembla, llora a ratos y le cuesta concentrarse. En la mayoría de los casos, estas reacciones son:",
        explanation: "Son reacciones normales de personas normales ante una situación anormal. Suelen disminuir en días o semanas con acompañamiento.",
        options: [
          { text: "Un trastorno mental que debe diagnosticarse ese mismo día", ok: false },
          { text: "Reacciones normales ante una situación anormal", ok: true },
          { text: "Una señal de que Pedro no sirve para trabajar en planta", ok: false },
          { text: "Una exageración para llamar la atención", ok: false },
        ],
      },
      {
        statement: "¿Cuál de estas acciones NO hace parte de los primeros auxilios psicológicos?",
        explanation: "Diagnosticar le corresponde a un profesional de salud mental. Los primeros auxilios psicológicos escuchan, calman, atienden necesidades y conectan.",
        options: [
          { text: "Escuchar sin presionar", ok: false },
          { text: "Ofrecer agua y un lugar tranquilo", ok: false },
          { text: "Ayudar a contactar a un familiar", ok: false },
          { text: "Decirle a la persona qué trastorno tiene", ok: true },
        ],
      },
      {
        statement: "Verdadero o falso: los primeros auxilios psicológicos solo los puede brindar un psicólogo.",
        explanation: "Falso. Los puede dar cualquier persona preparada, como un líder, un brigadista o un compañero. No son terapia.",
        type: "verdadero_falso",
        options: VF(false),
      },
      /* ---- Módulo 2 ---- */
      {
        statement: "En el modelo ABCDE, la letra C corresponde a:",
        explanation: "C es la categorización de necesidades: identificar y priorizar lo que la persona necesita, empezando por la seguridad y la salud.",
        options: [
          { text: "Categorización de necesidades", ok: true },
          { text: "Contención física de la persona", ok: false },
          { text: "Confrontación de los pensamientos negativos", ok: false },
          { text: "Consulta obligatoria con el psiquiatra", ok: false },
        ],
      },
      {
        statement: "Una compañera dice: «Me siento una tonta llorando así». ¿Cuál respuesta corresponde a la escucha activa?",
        explanation: "Validar la emoción y dar tiempo es escucha activa. Minimizar, compararse u ordenar que deje de llorar cierra la conversación.",
        options: [
          { text: "«No es para tanto, ya pasó.»", ok: false },
          { text: "«Sé exactamente lo que siente.»", ok: false },
          { text: "«Llorar es normal después de algo así. Tómese su tiempo.»", ok: true },
          { text: "«Deje de llorar, que la van a ver.»", ok: false },
        ],
      },
      {
        statement: "Para el reentrenamiento de la ventilación (letra B), lo recomendado es:",
        explanation: "Se respira con la persona, despacio, con la exhalación más larga que la inhalación. La bolsa de papel no se recomienda.",
        options: [
          { text: "Respirar dentro de una bolsa de papel", ok: false },
          { text: "Respirar rápido y hondo para que entre más aire", ok: false },
          { text: "Contener la respiración el mayor tiempo posible", ok: false },
          { text: "Inhalar por la nariz contando hasta cuatro y soltar el aire despacio por la boca", ok: true },
        ],
      },
      {
        statement: "En los principios de la OMS «Observar, Escuchar, Conectar», conectar significa:",
        explanation: "Conectar es ayudar a la persona a cubrir sus necesidades, acceder a servicios e información y reunirse con sus seres queridos.",
        options: [
          { text: "Ayudar a la persona a llegar a su red de apoyo, a la información y a los servicios", ok: true },
          { text: "Hacer una videollamada con un psicólogo en todos los casos", ok: false },
          { text: "Hacer que la persona vuelva a recordar el evento en detalle", ok: false },
          { text: "Lograr que la persona vuelva a su puesto cuanto antes", ok: false },
        ],
      },
      /* ---- Módulo 3 ---- */
      {
        statement:
          "Verdadero o falso: preguntarle directamente a una persona si está pensando en quitarse la vida puede ponerle la idea en la cabeza.",
        explanation: "Falso. Preguntar de forma directa y respetuosa no induce la idea: suele aliviar y abre la puerta a la ayuda.",
        type: "verdadero_falso",
        options: VF(false),
      },
      {
        statement: "Un compañero le dice que hoy quiere quitarse la vida y que no ve otra salida. ¿Qué hace?",
        explanation: "Es un riesgo inminente: no se le deja solo, se activa el 123 y, si es seguro, se aleja lo que pueda usar para hacerse daño.",
        options: [
          { text: "Le promete guardar el secreto para no perder su confianza", ok: false },
          { text: "No lo deja solo, pide ayuda al 123 y, si es seguro, aleja lo que pueda usar para hacerse daño", ok: true },
          { text: "Le dice que lo piense bien y que mañana hablan", ok: false },
          { text: "Le recuerda que eso haría sufrir a su familia", ok: false },
        ],
      },
      {
        statement: "Un trabajador alterado grita y golpea el escritorio en la oficina. ¿Cuál es la conducta correcta?",
        explanation: "Distancia, salidas libres y voz baja ayudan a bajar la tensión sin ponerse en riesgo. El contacto físico y las amenazas suelen escalarla.",
        options: [
          { text: "Acercarse y tomarlo del brazo para calmarlo", ok: false },
          { text: "Amenazarlo con llamar a la policía si no se calla", ok: false },
          { text: "Mantener distancia, conservar una salida libre y hablarle en voz baja", ok: true },
          { text: "Responderle con el mismo tono para que lo respete", ok: false },
        ],
      },
      {
        statement:
          "Un compañero de 55 años siente opresión en el pecho, suda y dice que se ahoga. Nunca le había pasado. ¿Qué hace?",
        explanation: "A simple vista no se puede distinguir una crisis de pánico de un problema del corazón. Ante la duda, se trata como emergencia médica.",
        options: [
          { text: "Darle una bolsa de papel para que respire", ok: false },
          { text: "Decirle que es estrés y que se calme", ok: false },
          { text: "Esperar media hora a ver si se le pasa", ok: false },
          { text: "Tratarlo como una posible emergencia médica: avisar a la brigada y llamar al 123", ok: true },
        ],
      },
      /* ---- Módulo 4 ---- */
      {
        statement:
          "Una trabajadora quiere orientación en salud mental por teléfono esta noche y no está en riesgo inminente. ¿Qué ruta le sugiere?",
        explanation: "La Línea 192, opción 4, del Ministerio de Salud brinda orientación en salud mental. El 123 se reserva para emergencias.",
        options: [
          { text: "La Línea 192, opción 4, del Ministerio de Salud", ok: true },
          { text: "Esperar a la próxima reunión del COPASST", ok: false },
          { text: "Contarlo en el grupo de WhatsApp del área para recibir consejos", ok: false },
          { text: "Ninguna: es mejor que lo resuelva sola", ok: false },
        ],
      },
      {
        statement: "¿En qué caso se puede romper la confidencialidad de lo que una persona le contó en una crisis?",
        explanation: "Cuando hay riesgo para la vida de la persona o de otros. En ese caso se avisa a quien pueda protegerla y se le explica por qué.",
        options: [
          { text: "Cuando el jefe quiere conocer todos los detalles", ok: false },
          { text: "Cuando hay riesgo para la vida de la persona o de otros", ok: true },
          { text: "Cuando los compañeros preguntan por preocupación", ok: false },
          { text: "En ningún caso, sin excepción", ok: false },
        ],
      },
      {
        statement:
          "Verdadero o falso: en la reunión de cierre de la brigada después de un evento crítico, nadie debe ser obligado a contar lo que vio o sintió.",
        explanation: "Verdadero. Hablar es voluntario: obligar a revivir el evento puede hacer daño. La reunión revisa lo operativo, reconoce el esfuerzo y comparte recursos.",
        type: "verdadero_falso",
        options: VF(true),
      },
      {
        statement: "¿Cuál de estas es una señal de alerta de desgaste en quien ayuda?",
        explanation: "Las pesadillas que persisten semanas después, el alcohol para dormir y la irritabilidad son señales para pedir apoyo. Lo demás es esperable.",
        options: [
          { text: "Sentirse cansado la noche después de atender una crisis", ok: false },
          { text: "Querer hablar del evento con alguien de confianza", ok: false },
          { text: "Pesadillas semanas después, más alcohol para dormir e irritabilidad con todos", ok: true },
          { text: "Sentir tristeza al recordar a un compañero que murió", ok: false },
        ],
      },
    ],
  },
};
