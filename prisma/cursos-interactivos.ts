/**
 * CURSOS INTERACTIVOS DE DEMOSTRACIÓN
 *
 * Dos cursos construidos con el motor de lecciones nativo de KG Academy
 * (contentType "interactivo"), para mostrar qué se puede lograr sin depender
 * de presentaciones externas: decisiones con consecuencias, pasos para ordenar,
 * clasificación, contrarreloj, tarjetas y puntos de práctica.
 *
 * IMPORTANTE: son PROTOTIPOS. El contenido sigue las recomendaciones generales
 * de primeros auxilios y de uso de extintores, pero debe ser revisado y
 * aprobado por los profesionales de KG antes de certificar a nadie con él.
 * Por eso solo se siembran en la base de demostración (prisma/seed.ts), nunca
 * en producción.
 */
import type { LeccionInteractiva } from "../src/lib/leccion-interactiva";

type Pregunta = {
  statement: string;
  explanation: string;
  type?: "unica" | "verdadero_falso";
  options: { text: string; ok: boolean }[];
};

export type CursoInteractivo = {
  code: string;
  slug: string;
  title: string;
  subtitle: string;
  objective: string;
  targetAudience: string;
  requirements: string;
  methodology: string;
  level: "basico" | "intermedio" | "avanzado";
  durationHours: number;
  categoria: string;
  modules: {
    title: string;
    description: string;
    lessons: { title: string; description: string; durationMin: number; contenido: LeccionInteractiva }[];
  }[];
  examen: {
    title: string;
    description: string;
    minScore: number;
    maxAttempts: number;
    timeLimitMin: number;
    preguntas: Pregunta[];
  };
};

const VF = (ok: boolean) => [
  { text: "Verdadero", ok },
  { text: "Falso", ok: !ok },
];

/* ======================================================================== */
/*  CURSO 1 · FUEGO BAJO CONTROL                                             */
/* ======================================================================== */

const LUCIA = { nombre: "Lucía Torres", rol: "Líder de brigada", avatar: "brigadista" as const };

const fuego: CursoInteractivo = {
  code: "KG-EM-001",
  slug: "fuego-bajo-control",
  title: "Fuego bajo control: extintores y evacuación",
  subtitle:
    "Del triángulo del fuego al punto de encuentro: aprenda a decidir en segundos qué extintor usar, cómo usarlo y cuándo salir.",
  objective:
    "Que cada trabajador reconozca las clases de fuego, elija y use correctamente un extintor portátil en un conato de incendio, y evacúe de forma segura hasta el punto de encuentro siguiendo la organización de la brigada.",
  targetAudience: "Todo el personal, brigadistas, COPASST y responsables del plan de emergencias.",
  requirements: "No requiere conocimientos previos. Se recomienda complementar con práctica presencial de extintores.",
  methodology:
    "100% virtual y en formato de videojuego: mundos y niveles con vidas, XP y estrellas, cacería de riesgos en escenas ilustradas, misiones contra el reloj, decisiones con consecuencias y desafío final.",
  level: "basico",
  durationHours: 4,
  categoria: "emergencias",
  modules: [
    {
      title: "Módulo 1. Conozca al enemigo",
      description: "Cómo nace el fuego, por qué se apaga y por qué no todos los fuegos son iguales.",
      lessons: [
        {
          title: "El triángulo del fuego",
          description: "Los tres elementos que necesita todo incendio y cómo quitar cada uno.",
          durationMin: 12,
          contenido: {
            version: 1,
            guia: LUCIA,
            bloques: [
              {
                tipo: "portada",
                titulo: "El triángulo del fuego",
                subtitulo: "Todo incendio necesita tres cosas al mismo tiempo. Quite una y se apaga.",
                objetivos: [
                  "Nombrar los tres elementos que necesita el fuego",
                  "Explicar por qué tapar una sartén apaga la llama",
                  "Reconocer qué elemento elimina cada forma de apagar un fuego",
                ],
                minutos: 12,
                dice: "Soy Lucía, líder de la brigada. En los próximos minutos va a aprender a pensar como un bombero: el fuego no es magia, es química.",
              },
              {
                tipo: "explicacion",
                titulo: "Tres ingredientes, ni uno menos",
                parrafos: [
                  "Para que haya fuego tienen que coincidir tres cosas: un combustible que arda, el oxígeno del aire y suficiente calor para encenderlo.",
                  "Si falta cualquiera de las tres, el fuego no empieza; y si ya empezó, se apaga. Todas las formas de extinguir un incendio funcionan quitando uno de los lados del triángulo.",
                  "Los especialistas agregan un cuarto elemento, la reacción en cadena, y hablan del tetraedro del fuego. Algunos agentes, como el polvo químico seco, actúan justamente interrumpiéndola.",
                ],
                ilustracion: "triangulo-fuego",
                clave: "Enfriar quita el calor, sofocar quita el oxígeno y retirar el material quita el combustible.",
              },
              {
                tipo: "decision",
                titulo: "Fuego en la cocina",
                situacion:
                  "En la cocina de la cafetería se prende el aceite de una sartén. La llama sube unos 30 centímetros. Tiene a mano la tapa de la sartén y un vaso con agua.",
                pregunta: "¿Qué hace primero?",
                dice: "Piénselo con el triángulo: ¿qué lado puede quitar más rápido?",
                opciones: [
                  {
                    texto: "Tapar la sartén y apagar la estufa",
                    correcta: true,
                    retro: "Exacto. La tapa le quita el oxígeno al fuego y apagar la estufa le quita el calor. Deje la tapa puesta hasta que la sartén se enfríe.",
                  },
                  {
                    texto: "Echarle el vaso de agua",
                    retro: "Peligroso: el agua se hunde en el aceite caliente, hierve de golpe y lanza aceite encendido. Así se producen quemaduras graves.",
                  },
                  {
                    texto: "Llevar la sartén al lavaplatos",
                    retro: "Mover una sartén con aceite en llamas es una de las formas más comunes de quemarse y de regar el fuego por la cocina.",
                  },
                ],
              },
              {
                tipo: "tarjetas",
                titulo: "¿Mito o realidad?",
                tarjetas: [
                  {
                    frente: "En un incendio, el humo es más peligroso que las llamas.",
                    reverso: "Realidad. El humo y sus gases tóxicos causan más muertes que las quemaduras.",
                  },
                  {
                                        frente: "Un incendio tarda en crecer: siempre hay tiempo.",
                    reverso: "Mito. Un fuego pequeño puede volverse incontrolable en pocos minutos. Por eso se actúa al comienzo o se evacúa.",
                  },
                  {
                                        frente: "El agua sirve para cualquier fuego.",
                    reverso: "Mito. El agua conduce la electricidad y hace estallar el aceite caliente. Nunca en tableros eléctricos ni en cocinas con grasa.",
                  },
                  {
                                        frente: "Si el fuego es pequeño, no hace falta avisar.",
                    reverso: "Mito. Siempre se activa la alarma o se avisa a la brigada, aunque usted crea que lo puede apagar solo.",
                  },
                ],
              },
              {
                tipo: "clasificar",
                titulo: "¿Qué lado del triángulo se quita?",
                instruccion: "Para cada acción, toque el elemento que le está quitando al fuego.",
                categorias: [
                  { id: "calor", nombre: "El calor", pista: "Enfriar" },
                  { id: "oxigeno", nombre: "El oxígeno", pista: "Sofocar" },
                  { id: "combustible", nombre: "El combustible", pista: "Retirar" },
                ],
                elementos: [
                  { texto: "Echar agua a una hoguera de madera", categoria: "calor", porque: "El agua enfría la madera por debajo de la temperatura a la que arde." },
                  { texto: "Cubrir con una manta una papelera encendida", categoria: "oxigeno", porque: "La manta impide que llegue el aire." },
                  { texto: "Cerrar la válvula del gas de una estufa", categoria: "combustible", porque: "Sin gas no hay nada que quemar." },
                  { texto: "Tapar una sartén en llamas", categoria: "oxigeno", porque: "La tapa corta el aire." },
                  { texto: "Retirar las cajas de cartón cercanas al fuego", categoria: "combustible", porque: "Se le quita material al fuego antes de que llegue." },
                  { texto: "Usar un extintor de CO₂", categoria: "oxigeno", porque: "El dióxido de carbono desplaza el oxígeno alrededor de la llama." },
                ],
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "El fuego necesita combustible, oxígeno y calor al mismo tiempo.",
                  "Toda forma de apagarlo quita uno de los tres.",
                  "Nunca agua sobre aceite caliente: tape y apague la fuente de calor.",
                  "El humo mata más que las llamas.",
                ],
                insignia: "Conocedor del fuego",
                cierre: "En la próxima lección verá que no todos los fuegos son iguales, y por qué eso cambia el extintor que se usa.",
              },
            ],
          },
        },
        {
          title: "Las clases de fuego",
          description: "A, B, C, D y K: lo que se quema decide cómo se apaga.",
          durationMin: 12,
          contenido: {
            version: 1,
            guia: LUCIA,
            bloques: [
              {
                tipo: "portada",
                titulo: "Cinco clases de fuego",
                subtitulo: "Lo que se quema decide cómo se apaga.",
                objetivos: [
                  "Identificar las clases A, B, C, D y K",
                  "Relacionarlas con ejemplos de su lugar de trabajo",
                  "Saber qué nunca hacer con cada una",
                ],
                minutos: 12,
                dice: "Reconocer la clase de un fuego le toma dos segundos, y le puede salvar la vida.",
              },
              {
                tipo: "explicacion",
                titulo: "Cada fuego tiene su letra",
                parrafos: [
                  "Los fuegos se clasifican con letras según el material que arde, y esa misma letra aparece en la etiqueta de cada extintor.",
                  "Reconocer la clase es el primer paso, porque el agente que apaga un tipo de fuego puede empeorar otro.",
                ],
                puntos: [
                  { titulo: "Clase A · sólidos", texto: "Madera, papel, cartón, tela y plástico. Dejan brasa y ceniza." },
                  { titulo: "Clase B · líquidos inflamables", texto: "Gasolina, ACPM, pinturas, solventes y alcohol." },
                  { titulo: "Clase C · equipos eléctricos", texto: "Tableros, computadores, motores y cables con corriente." },
                  { titulo: "Clase D · metales", texto: "Magnesio, sodio o aluminio en polvo. Propios de la industria; requieren un agente especial." },
                  { titulo: "Clase K · cocinas", texto: "Aceites y grasas de cocina a alta temperatura." },
                ],
                clave: "Un fuego eléctrico deja de comportarse como clase C cuando se corta la energía. Por eso, si es seguro hacerlo, lo primero es bajar el breaker.",
              },
              {
                tipo: "clasificar",
                titulo: "Póngale la letra",
                instruccion: "¿A qué clase pertenece cada fuego?",
                categorias: [
                  { id: "A", nombre: "Clase A", pista: "Sólidos" },
                  { id: "B", nombre: "Clase B", pista: "Líquidos" },
                  { id: "C", nombre: "Clase C", pista: "Eléctricos" },
                  { id: "K", nombre: "Clase K", pista: "Cocinas" },
                ],
                elementos: [
                  { texto: "Papeles en una papelera", categoria: "A" },
                  { texto: "Gasolina derramada en el parqueadero", categoria: "B", porque: "La gasolina es un líquido inflamable." },
                  { texto: "Un computador conectado que echa chispas", categoria: "C", porque: "Está conectado: tiene corriente." },
                  { texto: "La freidora de la cafetería", categoria: "K", porque: "Es aceite de cocina a alta temperatura." },
                  { texto: "Cajas de cartón en la bodega", categoria: "A" },
                  { texto: "Un tablero eléctrico con humo", categoria: "C" },
                  { texto: "Thinner encendido en el taller de pintura", categoria: "B", porque: "El thinner es un solvente: líquido inflamable." },
                  { texto: "Uniformes de tela en el vestier", categoria: "A" },
                ],
              },
              {
                tipo: "decision",
                titulo: "Humo en el escritorio",
                situacion:
                  "De un multitoma de la oficina sale humo y una llama pequeña. Hay un computador conectado. A su lado hay un extintor de agua a presión y, a unos pasos, uno de CO₂.",
                pregunta: "¿Cuál usa?",
                opciones: [
                  {
                    texto: "El de CO₂, después de avisar",
                    correcta: true,
                    retro: "Bien. El CO₂ no conduce la electricidad y no deja residuos sobre los equipos. Si puede, corte la energía desde el breaker.",
                  },
                  {
                    texto: "El de agua, que está más cerca",
                    retro: "El agua conduce la electricidad: se podría electrocutar. Nunca use agua en un fuego clase C.",
                  },
                  {
                    texto: "Desconectar el multitoma de un tirón",
                    retro: "Tocar un equipo energizado en llamas lo expone a quemaduras y descargas. Si va a cortar la energía, hágalo desde el tablero.",
                  },
                ],
              },
              {
                tipo: "contrarreloj",
                titulo: "Rápido: ¿qué clase es?",
                segundos: 12,
                situacion: "En el taller, un trapo empapado en solvente se enciende sobre el mesón.",
                pregunta: "¿Cómo se comporta este fuego?",
                opciones: [
                  {
                    texto: "Como clase B",
                    correcta: true,
                    retro: "Correcto. Lo que alimenta la llama es el solvente, un líquido inflamable, aunque esté empapando una tela.",
                  },
                  { texto: "Como clase A", retro: "El trapo es tela, pero lo que arde con fuerza es el solvente: por eso se trata como clase B." },
                  { texto: "Como clase C", retro: "No hay equipos eléctricos involucrados." },
                ],
                alAgotar: "Mientras duda, el fuego crece. Con práctica, reconocer la clase le tomará un segundo.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "A sólidos, B líquidos, C eléctricos, D metales, K cocinas.",
                  "Nunca agua en fuegos B, C ni K.",
                  "En un fuego eléctrico, corte la energía si puede hacerlo sin riesgo.",
                ],
                insignia: "Lector de fuegos",
              },
            ],
          },
        },
      ],
    },
    {
      title: "Módulo 2. El extintor en sus manos",
      description: "Elegir el extintor correcto, revisarlo y usarlo con la técnica HAAB.",
      lessons: [
        {
          title: "¿Qué extintor uso?",
          description: "Los extintores más comunes, para qué sirve cada uno y cómo saber si está listo.",
          durationMin: 12,
          contenido: {
            version: 1,
            guia: LUCIA,
            bloques: [
              {
                tipo: "portada",
                titulo: "Elegir el extintor correcto",
                subtitulo: "Tres segundos para leer la etiqueta pueden evitar una tragedia.",
                objetivos: [
                  "Reconocer los extintores más comunes",
                  "Elegir el adecuado según la clase de fuego",
                  "Revisar que un extintor esté listo para usarse",
                ],
                minutos: 12,
                dice: "En la mayoría de oficinas va a encontrar tres o cuatro tipos. Conózcalos antes de necesitarlos.",
              },
              {
                tipo: "explicacion",
                titulo: "Los que más va a ver",
                parrafos: [
                  "La etiqueta de cada extintor muestra las clases de fuego para las que sirve. Léala en su próxima ronda por la empresa, no el día de la emergencia.",
                ],
                puntos: [
                  { titulo: "Polvo químico seco (PQS) multipropósito", texto: "Sirve para fuegos A, B y C. Es el más común en oficinas y bodegas. Deja un polvo que ensucia y puede dañar equipos delicados." },
                  { titulo: "Dióxido de carbono (CO₂)", texto: "Para fuegos B y C. No deja residuos, ideal para equipos eléctricos. En espacios cerrados desplaza el oxígeno: úselo y retírese." },
                  { titulo: "Agua a presión", texto: "Solo para fuegos clase A. Nunca en equipos eléctricos ni en líquidos inflamables." },
                  { titulo: "Clase K", texto: "Para cocinas con aceite y grasa. Forma una capa que evita que el fuego se vuelva a encender." },
                ],
                clave: "Antes de usarlo, revise que la aguja del manómetro esté en verde, que el pasador tenga su sello y que la etiqueta corresponda al fuego que tiene enfrente. Los de CO₂ no tienen manómetro: se controlan por peso.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Sirve o no sirve?",
                instruccion: "Decida si cada combinación es correcta.",
                categorias: [
                  { id: "si", nombre: "Sirve", pista: "Es el agente indicado" },
                  { id: "no", nombre: "No sirve o es peligroso", pista: "No lo use" },
                ],
                elementos: [
                  { texto: "Agua a presión en papeles encendidos", categoria: "si" },
                  { texto: "Agua a presión en una freidora", categoria: "no", porque: "El agua hace estallar el aceite caliente." },
                  { texto: "CO₂ en un servidor con humo", categoria: "si" },
                  { texto: "PQS multipropósito en gasolina derramada", categoria: "si" },
                  { texto: "Agua a presión en un tablero eléctrico", categoria: "no", porque: "El agua conduce la electricidad." },
                  { texto: "CO₂ en una pila de cartón encendida", categoria: "no", porque: "El CO₂ no es para fuegos clase A: puede apagar la llama, pero la brasa se vuelve a encender." },
                  { texto: "PQS multipropósito en cajas de madera", categoria: "si" },
                ],
              },
              {
                tipo: "decision",
                titulo: "La ronda de revisión",
                situacion:
                  "Le piden revisar el extintor de su piso. La aguja del manómetro está en la zona roja, a la izquierda, y el pasador no tiene sello.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Reportarlo a la brigada o al responsable de SST para que lo recarguen",
                    correcta: true,
                    retro: "Correcto. La aguja en rojo a la izquierda indica que perdió presión, y sin sello puede que ya lo hayan usado. Un extintor así no sirve en una emergencia.",
                  },
                  {
                    texto: "Dejarlo: la mayoría nunca se usan",
                    retro: "Justamente porque casi nunca se usan hay que revisarlos: el día que lo necesite no podrá esperar a que lo recarguen.",
                  },
                  {
                    texto: "Dispararlo un poco para probar si funciona",
                    retro: "Cada descarga le resta presión y agente. Las pruebas las hace el proveedor autorizado.",
                  },
                ],
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "PQS multipropósito para casi todo, CO₂ para lo eléctrico, agua solo para clase A, K para cocinas.",
                  "La etiqueta le dice para qué fuegos sirve cada extintor.",
                  "Manómetro en verde, pasador con sello y recarga vigente.",
                ],
                insignia: "Guardián de extintores",
              },
            ],
          },
        },
        {
          title: "La técnica HAAB",
          description: "Halar, Apuntar, Apretar y Barrer, y cuándo no intentarlo.",
          durationMin: 15,
          contenido: {
            version: 1,
            guia: LUCIA,
            bloques: [
              {
                tipo: "portada",
                titulo: "La técnica HAAB",
                subtitulo: "Cuatro pasos, en este orden, con el fuego siempre de frente.",
                objetivos: [
                  "Aplicar los cuatro pasos para usar un extintor",
                  "Mantener la distancia y la posición seguras",
                  "Saber cuándo no intentarlo y evacuar",
                ],
                minutos: 15,
                dice: "Un extintor portátil se descarga en muy pocos segundos. No hay tiempo para aprender en el momento.",
              },
              {
                tipo: "explicacion",
                titulo: "Halar, Apuntar, Apretar, Barrer",
                parrafos: [
                  "Antes de empezar, avise o active la alarma y ubíquese entre el fuego y una salida, de modo que siempre tenga por dónde retirarse.",
                  "Colóquese a unos dos o tres metros del fuego. Más cerca se expone al calor; más lejos, el agente no alcanza.",
                ],
                ilustracion: "extintor-haab",
                puntos: [
                  { titulo: "H · Halar", texto: "Retire el pasador de seguridad girándolo para romper el sello." },
                  { titulo: "A · Apuntar", texto: "Dirija la boquilla a la base del fuego, donde está el combustible, no a las llamas." },
                  { titulo: "A · Apretar", texto: "Presione la manija de forma constante." },
                  { titulo: "B · Barrer", texto: "Mueva la boquilla de lado a lado sobre la base hasta que el fuego se apague." },
                ],
                clave: "Apunte a la base, no a las llamas: el fuego se alimenta desde abajo.",
              },
              {
                tipo: "ordenar",
                titulo: "Ponga la técnica en orden",
                instruccion: "Use las flechas para dejar los pasos en el orden correcto.",
                pasos: [
                  "Avisar o activar la alarma",
                  "Ubicarse a 2 o 3 metros, con una salida a la espalda",
                  "Halar el pasador de seguridad",
                  "Apuntar la boquilla a la base del fuego",
                  "Apretar la manija",
                  "Barrer de lado a lado hasta apagarlo",
                  "Retirarse sin darle la espalda al fuego",
                ],
                explicacion: "Así es. Avisar primero asegura que llegue ayuda aunque el extintor no alcance, y retirarse de frente le permite ver si el fuego se reaviva.",
              },
              {
                tipo: "contrarreloj",
                titulo: "¡Fuego en la papelera!",
                segundos: 10,
                situacion:
                  "Una papelera de la sala de reuniones se enciende. El fuego es pequeño, a la altura de la rodilla. Ya avisó a la brigada y tiene el extintor PQS en la mano, sin el pasador.",
                pregunta: "¿Hacia dónde apunta?",
                opciones: [
                  {
                    texto: "A la base del fuego, dentro de la papelera",
                    correcta: true,
                    retro: "Perfecto. Apuntando a la base se ataca el combustible. Barra de lado a lado hasta que no quede llama.",
                  },
                  { texto: "A la punta de las llamas", retro: "Las llamas son gas ardiendo: si dispara ahí, el agente pasa de largo y el fuego sigue." },
                  { texto: "Al techo, para que caiga el polvo", retro: "Así solo desperdicia el agente." },
                ],
                alAgotar: "Un extintor en la mano no sirve si duda. Recuerde: a la base.",
              },
              {
                tipo: "decision",
                titulo: "¿Lo intento o evacúo?",
                situacion:
                  "En la bodega, el fuego ya alcanzó una estantería completa, el humo baja del techo y usted tiene un solo extintor pequeño.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Evacuar, cerrar la puerta si puede y avisar a la brigada",
                    correcta: true,
                    retro: "Correcto. Un extintor portátil es para fuegos que empiezan, más o menos del tamaño de una papelera. Si el fuego supera eso o el humo baja, lo primero es su vida.",
                  },
                  { texto: "Intentarlo: algo alcanzará a hacer", retro: "Con un fuego de ese tamaño el extintor se acaba en segundos y usted queda atrapado entre el humo y las llamas." },
                  { texto: "Subir a buscar otro extintor", retro: "Cada minuto el humo avanza. Salir y avisar es lo que salva vidas." },
                ],
              },
              {
                tipo: "mision",
                titulo: "Conato en la bodega",
                intro: "Son las 10:40. Mientras revisa un pedido en la bodega, ve humo y una llama que sale de una caja de cartón junto a la estantería. El fuego apenas empieza, pero crece cada segundo. Cada decisión correcta lo acerca a controlarlo; cada error le da ventaja al fuego.",
                medidor: {
                  etiqueta: "Tamaño del fuego",
                  tipo: "amenaza"
                },
                velocidad: 2,
                penalizacion: 25,
                pasos: [
                  {
                    situacion: "La llama es del tamaño de una papelera. Nadie más la ha visto.",
                    pregunta: "¿Qué hace primero?",
                    opciones: [
                      {
                        texto: "Grito «¡fuego!» y activo la alarma",
                        correcta: true,
                        retro: "La ayuda viene en camino aunque el extintor no alcance."
                      },
                      {
                        texto: "Voy directo por el extintor sin avisar",
                        retro: "Si el extintor no alcanza, nadie sabrá que hay un incendio. Avisar toma segundos."
                      },
                      {
                        texto: "Le tomo una foto para reportarlo",
                        retro: "El reporte puede esperar; el fuego no."
                      }
                    ]
                  },
                  {
                    situacion: "En la pared hay dos extintores: uno de agua a presión y uno de polvo químico seco (PQS) multipropósito. En la caja hay cartón y una lata de solvente.",
                    pregunta: "¿Cuál toma?",
                    opciones: [
                      {
                        texto: "El de PQS multipropósito",
                        correcta: true,
                        retro: "Sirve para sólidos (A) y líquidos inflamables (B)."
                      },
                      {
                        texto: "El de agua",
                        retro: "Con solvente cerca, el agua puede regar el líquido encendido."
                      }
                    ]
                  },
                  {
                    situacion: "Tiene el extintor en la mano.",
                    pregunta: "¿Dónde se ubica?",
                    opciones: [
                      {
                        texto: "A 2 o 3 metros, con la salida a mi espalda",
                        correcta: true,
                        retro: "Así puede retirarse si el fuego crece."
                      },
                      {
                        texto: "Pegado al fuego, para no desperdiciar agente",
                        retro: "Tan cerca, el calor lo quema y el chorro dispersa el material encendido."
                      },
                      {
                        texto: "Entre el fuego y la pared del fondo",
                        retro: "Quedó atrapado: si el fuego crece, no tiene por dónde salir."
                      }
                    ]
                  },
                  {
                    situacion: "Ya retiró el pasador.",
                    pregunta: "¿Hacia dónde apunta?",
                    opciones: [
                      {
                        texto: "A la base de las llamas, barriendo de lado a lado",
                        correcta: true,
                        retro: "Así ataca el combustible."
                      },
                      {
                        texto: "A la punta de las llamas",
                        retro: "El agente pasa de largo por el gas que arde."
                      }
                    ]
                  },
                  {
                    situacion: "La llama se apagó. Queda humo y la caja humea.",
                    pregunta: "¿Y ahora?",
                    opciones: [
                      {
                        texto: "Me retiro sin darle la espalda, vigilo que no se reavive y espero a la brigada",
                        correcta: true,
                        retro: "Un fuego apagado puede reavivarse: la brigada revisa la zona y reporta."
                      },
                      {
                        texto: "Vuelvo a mi trabajo: ya pasó",
                        retro: "El fuego puede reavivarse desde la brasa, y hay que reportar el evento y recargar el extintor."
                      }
                    ]
                  }
                ],
                exito: "¡Conato controlado! Avisó, eligió el extintor correcto y lo usó con la técnica HAAB. La brigada revisa la zona.",
                fracaso: "El fuego superó lo que un extintor portátil puede controlar. En la vida real, en este punto se evacúa y se deja el trabajo a los bomberos.",
                dice: "Ahora sí: póngalo todo en práctica. Y rápido, que el fuego no espera."
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Avise primero, siempre.",
                  "Halar, Apuntar a la base, Apretar, Barrer.",
                  "A 2 o 3 metros, con la salida a su espalda.",
                  "Si el fuego es más grande que una papelera o el humo baja, evacúe.",
                ],
                insignia: "Operador de extintor",
              },
            ],
          },
        },
      ],
    },
    {
      title: "Módulo 3. Evacuación sin pánico",
      description: "Qué hacer desde que suena la alarma hasta el regreso autorizado.",
      lessons: [
        {
          title: "Cuando suena la alarma",
          description: "Los primeros segundos, el humo, las puertas y la ruta al punto de encuentro.",
          durationMin: 15,
          contenido: {
            version: 1,
            guia: LUCIA,
            bloques: [
              {
                tipo: "portada",
                titulo: "Cuando suena la alarma",
                subtitulo: "Salir rápido no es correr: es salir bien.",
                objetivos: [
                  "Actuar en los primeros segundos de una evacuación",
                  "Protegerse del humo",
                  "Seguir la ruta hasta el punto de encuentro",
                ],
                minutos: 15,
                dice: "Esta vez usted es el protagonista. Son las 3:10 de la tarde, está en el cuarto piso y suena la alarma.",
              },
              {
                tipo: "explicacion",
                titulo: "Cómo moverse por la ruta",
                parrafos: [
                  "Camine rápido, sin correr, por un costado de las escaleras y sujetándose del pasamanos. Correr provoca caídas y empujones.",
                  "Cierre las puertas detrás de usted, sin llave: una puerta cerrada frena el humo.",
                  "No se devuelva por ningún motivo. Si falta alguien, avise al brigadista en el punto de encuentro.",
                ],
                ilustracion: "ruta-evacuacion",
                clave: "Siga la señalización hasta el punto de encuentro, aunque crea conocer un camino más corto.",
              },
              {
                tipo: "mision",
                titulo: "Escape del cuarto piso",
                intro: "Son las 3:10 de la tarde. Está en el cuarto piso y suena la alarma de evacuación: hay fuego en el tercero. El humo empieza a subir por el edificio. Tiene que llegar al punto de encuentro antes de que llene el piso.",
                medidor: {
                  etiqueta: "Humo en el piso",
                  tipo: "amenaza"
                },
                velocidad: 1.8,
                penalizacion: 22,
                pasos: [
                  {
                    situacion: "Tiene un informe a medio guardar y su bolso en el escritorio.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Dejo todo y salgo por la ruta señalizada",
                        correcta: true,
                        retro: "Las cosas se reponen; usted no."
                      },
                      {
                        texto: "Guardo el informe y recojo el bolso",
                        retro: "Esos segundos pueden ser los que le falten."
                      },
                      {
                        texto: "Espero a ver si es un simulacro",
                        retro: "Toda alarma se atiende como real."
                      }
                    ]
                  },
                  {
                    situacion: "El ascensor está frente a su puesto; la escalera, al fondo del pasillo.",
                    pregunta: "¿Por dónde baja?",
                    opciones: [
                      {
                        texto: "Por la escalera",
                        correcta: true,
                        retro: "Siempre escaleras."
                      },
                      {
                        texto: "Por el ascensor, es más rápido",
                        retro: "El ascensor puede quedarse sin energía o abrirse en el piso del incendio."
                      }
                    ]
                  },
                  {
                    situacion: "En el pasillo, un humo gris baja desde el techo.",
                    pregunta: "¿Cómo avanza?",
                    opciones: [
                      {
                        texto: "Agachado, cubriéndome nariz y boca con una tela",
                        correcta: true,
                        retro: "El aire más limpio está cerca del piso."
                      },
                      {
                        texto: "De pie y corriendo",
                        retro: "A la altura de la cara el humo es más denso y tóxico."
                      },
                      {
                        texto: "Me devuelvo a la oficina",
                        retro: "Solo si la ruta está bloqueada por completo. Aquí puede avanzar."
                      }
                    ]
                  },
                  {
                    situacion: "Llega a la puerta de la escalera. No sabe qué hay del otro lado.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Toco la puerta y la manija con el dorso de la mano",
                        correcta: true,
                        retro: "Está fría: puede abrirla despacio."
                      },
                      {
                        texto: "La abro de golpe",
                        retro: "Si hubiera fuego detrás, las llamas saldrían hacia usted."
                      },
                      {
                        texto: "La toco con la palma",
                        retro: "Podría quemarse la mano que necesita para sujetarse."
                      }
                    ]
                  },
                  {
                    situacion: "En la escalera baja mucha gente.",
                    pregunta: "¿Cómo baja?",
                    opciones: [
                      {
                        texto: "Por un costado, sujeto del pasamanos, sin correr",
                        correcta: true,
                        retro: "Así se evitan caídas y tapones."
                      },
                      {
                        texto: "Corro y adelanto a los demás",
                        retro: "Correr causa caídas y empujones en la escalera."
                      },
                      {
                        texto: "Me devuelvo por el celular",
                        retro: "Nunca se devuelva. Nada vale más que su vida."
                      }
                    ]
                  },
                  {
                    situacion: "Ya está afuera del edificio.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Voy al punto de encuentro y me reporto con el brigadista",
                        correcta: true,
                        retro: "Si no se reporta, pueden arriesgar a alguien buscándolo adentro."
                      },
                      {
                        texto: "Me voy para la casa",
                        retro: "La brigada creería que sigue adentro."
                      },
                      {
                        texto: "Me quedo en la puerta mirando",
                        retro: "Estorba la salida de los demás y la entrada de los bomberos."
                      }
                    ]
                  }
                ],
                exito: "¡Llegó al punto de encuentro y la brigada lo contó! Salió rápido, sin correr y sin exponerse al humo.",
                fracaso: "El humo llenó el piso antes de que saliera. Cada segundo cuenta: deje las cosas, use la escalera y avance agachado.",
                dice: "Suena la alarma. Usted está en el cuarto piso. ¡Salga!"
              },
              {
                tipo: "ordenar",
                titulo: "La evacuación, paso a paso",
                instruccion: "Ordene lo que hace desde que suena la alarma.",
                pasos: [
                  "Escuchar la alarma y dejar lo que está haciendo",
                  "Seguir las instrucciones del brigadista de su área",
                  "Salir por la ruta señalizada, sin correr",
                  "Bajar por las escaleras, nunca en ascensor",
                  "Llegar al punto de encuentro",
                  "Reportarse con el brigadista para el conteo",
                ],
                explicacion: "Exacto. El conteo en el punto de encuentro es lo que permite saber si alguien quedó adentro.",
              },
              {
                tipo: "tarjetas",
                titulo: "¿Mito o realidad?",
                tarjetas: [
                  {
                                        frente: "En una evacuación hay que correr para salir primero.",
                    reverso: "Mito. Correr causa caídas y tapona las escaleras. Se camina rápido, en fila y sin empujar.",
                  },
                  {
                                        frente: "Si ya estoy afuera, me puedo ir para mi casa.",
                    reverso: "Mito. Si no se reporta en el punto de encuentro, la brigada puede creer que sigue adentro y arriesgar a alguien buscándolo.",
                  },
                ],
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Deje todo y salga por la ruta señalizada.",
                  "Escaleras siempre, ascensor nunca.",
                  "Con humo, agachado: el aire limpio está abajo.",
                  "Toque las puertas con el dorso de la mano antes de abrirlas.",
                  "Repórtese en el punto de encuentro.",
                ],
                insignia: "Evacuación segura",
              },
            ],
          },
        },
        {
          title: "El punto de encuentro y la brigada",
          description: "El conteo, quién hace qué y por qué nadie vuelve a entrar solo.",
          durationMin: 12,
          contenido: {
            version: 1,
            guia: LUCIA,
            bloques: [
              {
                tipo: "portada",
                titulo: "Del punto de encuentro al regreso",
                subtitulo: "La emergencia no termina al cruzar la puerta.",
                objetivos: [
                  "Entender qué pasa en el punto de encuentro",
                  "Distinguir las tareas del brigadista y las de todo trabajador",
                  "Saber por qué importan los simulacros",
                ],
                minutos: 12,
                dice: "Llegó al punto de encuentro. Ahora empieza la parte que más gente olvida.",
              },
              {
                tipo: "explicacion",
                titulo: "Por qué el conteo es sagrado",
                parrafos: [
                  "En el punto de encuentro, cada brigadista cuenta a las personas de su área con el listado del día, incluidos visitantes y contratistas.",
                  "Si alguien falta, la brigada le informa al coordinador de la emergencia y a los bomberos dónde lo vieron por última vez. Nadie vuelve a entrar por su cuenta.",
                  "El regreso a las instalaciones solo lo autoriza el coordinador de la emergencia o los organismos de socorro.",
                ],
                clave: "Número único de emergencias en Colombia: 123.",
              },
              {
                tipo: "buscar",
                titulo: "Ronda del brigadista",
                instruccion: "Antes de la reunión de brigada le piden inspeccionar esta oficina. Toque los 5 riesgos de incendio o de evacuación que encuentre.",
                escena: "oficina",
                objetivos: [
                  {
                    x: 100,
                    y: 318,
                    r: 42,
                    nombre: "Cable dañado en la cafetera",
                    explicacion: "Un cable pelado puede hacer cortocircuito y encender lo que tiene cerca. Se desconecta y se reporta para cambio."
                  },
                  {
                    x: 300,
                    y: 388,
                    r: 52,
                    nombre: "Multitomas conectadas en cadena",
                    explicacion: "Conectar una multitoma a otra sobrecarga el circuito y recalienta los cables. Cada equipo necesita un tomacorriente adecuado."
                  },
                  {
                    x: 525,
                    y: 372,
                    r: 50,
                    nombre: "Calentador pegado a papel y cartón",
                    explicacion: "El calor del calentador puede encender el papel. Debe tener al menos un metro libre alrededor."
                  },
                  {
                    x: 622,
                    y: 232,
                    r: 46,
                    nombre: "Extintor tapado por cajas",
                    explicacion: "En una emergencia no hay tiempo de mover cajas. El extintor debe estar visible, señalizado y despejado."
                  },
                  {
                    x: 730,
                    y: 292,
                    r: 56,
                    nombre: "Salida de emergencia bloqueada",
                    explicacion: "Una salida obstruida puede atrapar a las personas. Rutas y puertas de evacuación siempre despejadas."
                  }
                ],
                dice: "Los incendios se previenen antes de apagarse. Usted es mis ojos: encuentre lo que está mal."
              },
              {
                tipo: "clasificar",
                titulo: "¿Quién lo hace?",
                instruccion: "Asigne cada tarea a quien le corresponde.",
                categorias: [
                  { id: "brigadista", nombre: "El brigadista", pista: "Organiza y verifica" },
                  { id: "trabajador", nombre: "Todo trabajador", pista: "Actúa y se reporta" },
                ],
                elementos: [
                  { texto: "Verificar que nadie quede en baños y oficinas del área", categoria: "brigadista" },
                  { texto: "Salir sin devolverse por objetos", categoria: "trabajador" },
                  { texto: "Hacer el conteo con el listado del área", categoria: "brigadista" },
                  { texto: "Reportarse en el punto de encuentro", categoria: "trabajador" },
                  { texto: "Informar al coordinador si falta alguien", categoria: "brigadista" },
                  { texto: "Conocer las dos rutas de evacuación de su piso", categoria: "trabajador" },
                  { texto: "Acompañar a visitantes y personas con movilidad reducida", categoria: "brigadista", porque: "La brigada tiene asignado ese apoyo. Si usted ve a alguien con dificultad, avísele al brigadista." },
                ],
              },
              {
                tipo: "decision",
                titulo: "Falta un compañero",
                situacion:
                  "En el conteo falta Julián, de contabilidad. Un compañero dice que lo vio entrar al baño antes de la alarma. Usted conoce bien el edificio.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Decirle de inmediato al brigadista dónde lo vieron por última vez",
                    correcta: true,
                    retro: "Correcto. Esa información le permite a la brigada y a los bomberos buscarlo con equipo de protección. Su tarea es dar el dato, no entrar.",
                  },
                  { texto: "Entrar rápido a buscarlo: sabe dónde es", retro: "Así se producen dos víctimas en vez de una. Sin protección, el humo lo puede desmayar en segundos." },
                  { texto: "Llamarlo al celular y esperar", retro: "Intentar llamarlo no está mal, pero no reemplaza avisarle ya al brigadista." },
                ],
              },
              {
                tipo: "tarjetas",
                titulo: "¿Mito o realidad?",
                tarjetas: [
                  {
                    frente: "Los simulacros son una pérdida de tiempo.",
                    reverso: "Mito. Lo que se practica sale casi solo cuando hay miedo. En una emergencia real no se piensa: se repite lo aprendido.",
                  },
                  {
                                        frente: "El brigadista apaga los incendios grandes.",
                    reverso: "Mito. El brigadista actúa en la fase inicial y organiza la evacuación. Los incendios desarrollados son trabajo de los bomberos.",
                  },
                ],
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "En el punto de encuentro, repórtese y espere instrucciones.",
                  "Si alguien falta, dé la información: nunca entre a buscarlo.",
                  "Solo el coordinador o los organismos de socorro autorizan el regreso.",
                  "El número único de emergencias es el 123.",
                ],
                insignia: "Brigadista en formación",
                cierre: "Terminó la parte práctica. En la evaluación final va a poner a prueba todo lo aprendido.",
              },
            ],
          },
        },
      ],
    },
  ],
  examen: {
    title: "Evaluación final",
    description: "Doce preguntas sobre todo el curso. Nota mínima aprobatoria: 80/100. Tiene tres intentos.",
    minScore: 80,
    maxAttempts: 3,
    timeLimitMin: 20,
    preguntas: [
      {
        statement: "¿Qué tres elementos forman el triángulo del fuego?",
        explanation: "El fuego necesita combustible, oxígeno y calor al mismo tiempo. Si falta uno, se apaga.",
        options: [
          { text: "Combustible, oxígeno y calor", ok: true },
          { text: "Agua, aire y tierra", ok: false },
          { text: "Humo, llama y ceniza", ok: false },
          { text: "Chispa, gas y electricidad", ok: false },
        ],
      },
      {
        statement: "Se prende el aceite de una sartén. ¿Qué es lo correcto?",
        explanation: "La tapa le quita el oxígeno y apagar la estufa le quita el calor. El agua sobre aceite caliente provoca una proyección de aceite en llamas.",
        options: [
          { text: "Tapar la sartén y apagar la estufa", ok: true },
          { text: "Echarle agua", ok: false },
          { text: "Llevarla al lavaplatos", ok: false },
          { text: "Soplar con fuerza", ok: false },
        ],
      },
      {
        statement: "Un fuego en un tablero eléctrico con corriente es de clase:",
        explanation: "Los equipos eléctricos energizados son fuegos clase C.",
        options: [
          { text: "C", ok: true },
          { text: "A", ok: false },
          { text: "B", ok: false },
          { text: "K", ok: false },
        ],
      },
      {
        statement: "¿Qué extintor NO debe usarse en un fuego eléctrico?",
        explanation: "El agua conduce la electricidad y expone a quien lo usa a una descarga.",
        options: [
          { text: "Agua a presión", ok: true },
          { text: "Dióxido de carbono (CO₂)", ok: false },
          { text: "Polvo químico seco multipropósito", ok: false },
        ],
      },
      {
        statement: "En la técnica HAAB, ¿hacia dónde se apunta la boquilla?",
        explanation: "A la base del fuego, donde está el combustible. Las llamas son gas ardiendo: el agente pasa de largo.",
        options: [
          { text: "A la base del fuego", ok: true },
          { text: "A la punta de las llamas", ok: false },
          { text: "Al techo", ok: false },
          { text: "Al humo", ok: false },
        ],
      },
      {
        statement: "¿A qué distancia aproximada del fuego se ubica para usar un extintor portátil?",
        explanation: "Entre 2 y 3 metros: más cerca se expone al calor, más lejos el agente no alcanza.",
        options: [
          { text: "Entre 2 y 3 metros", ok: true },
          { text: "A menos de medio metro", ok: false },
          { text: "A unos 10 metros", ok: false },
          { text: "La distancia no importa", ok: false },
        ],
      },
      {
        statement: "La aguja del manómetro de un extintor PQS está en la zona roja, a la izquierda. Eso significa que:",
        explanation: "Perdió presión: no funcionará bien en una emergencia y debe reportarse para su recarga.",
        options: [
          { text: "Perdió presión y debe reportarse para recargarlo", ok: true },
          { text: "Está listo para usarse", ok: false },
          { text: "Está sobrecargado y es más potente", ok: false },
          { text: "Hay que usarlo pronto antes de que venza", ok: false },
        ],
      },
      {
        statement: "Durante una evacuación, ¿se puede usar el ascensor?",
        explanation: "Nunca. Puede quedarse sin energía o abrirse en el piso del incendio. Siempre escaleras.",
        options: [
          { text: "No, nunca; siempre las escaleras", ok: true },
          { text: "Sí, si hay poca gente", ok: false },
          { text: "Sí, si se está en un piso alto", ok: false },
          { text: "Solo los brigadistas", ok: false },
        ],
      },
      {
        statement: "Si el pasillo está lleno de humo, usted debe:",
        explanation: "El humo caliente sube; el aire más limpio queda cerca del piso.",
        options: [
          { text: "Avanzar agachado o gateando, cubriéndose nariz y boca", ok: true },
          { text: "Correr de pie lo más rápido posible", ok: false },
          { text: "Abrir las ventanas y esperar", ok: false },
          { text: "Contener la respiración y correr", ok: false },
        ],
      },
      {
        statement: "Antes de abrir una puerta durante un incendio, usted:",
        explanation: "Se toca con el dorso de la mano. Si está caliente, no se abre: hay fuego detrás.",
        options: [
          { text: "La toca con el dorso de la mano", ok: true },
          { text: "La abre de golpe", ok: false },
          { text: "La toca con la palma", ok: false },
          { text: "Le echa agua", ok: false },
        ],
      },
      {
        statement: "En el conteo falta un compañero. Lo correcto es:",
        explanation: "Dar la información a la brigada. Entrar sin protección puede producir una segunda víctima.",
        options: [
          { text: "Decirle a la brigada dónde se le vio por última vez", ok: true },
          { text: "Entrar a buscarlo", ok: false },
          { text: "Irse a casa", ok: false },
          { text: "Esperar a que aparezca", ok: false },
        ],
      },
      {
        statement:
          "Verdadero o falso: si el fuego ya alcanzó una estantería completa y el humo baja del techo, lo correcto es intentar apagarlo con un extintor portátil.",
        explanation: "Falso. El extintor portátil es para fuegos que empiezan. En ese punto la prioridad es evacuar y avisar.",
        type: "verdadero_falso",
        options: VF(false),
      },
    ],
  },
};

/* ======================================================================== */
/*  CURSO 2 · DETÉN EL SANGRADO                                              */
/* ======================================================================== */

const ANDRES = { nombre: "Andrés Rincón", rol: "Paramédico", avatar: "paramedico" as const };

const sangrado: CursoInteractivo = {
  code: "KG-PA-004",
  slug: "control-de-hemorragias",
  title: "Detén el sangrado: control de hemorragias",
  subtitle:
    "Una hemorragia grave puede matar en minutos, antes de que llegue la ambulancia. Aprenda a reconocerla y a detenerla con sus manos.",
  objective:
    "Que el participante reconozca una hemorragia que amenaza la vida, se proteja, active el sistema de emergencias y aplique presión directa, empaquetamiento y torniquete según corresponda, y acompañe a la persona mientras llega la ayuda.",
  targetAudience: "Brigadistas, COPASST, líderes de área y cualquier trabajador que quiera responder ante una emergencia.",
  requirements: "No requiere conocimientos previos. Las técnicas manuales se complementan con práctica presencial.",
  methodology:
    "100% virtual y en formato de videojuego: mundos y niveles con vidas, XP y estrellas, cacería de riesgos, misiones de rescate con la vida del paciente en juego y desafío final.",
  level: "basico",
  durationHours: 4,
  categoria: "primeros-auxilios",
  modules: [
    {
      title: "Módulo 1. Reconocer lo que amenaza la vida",
      description: "Qué tan grave es un sangrado y qué hacer antes de tocar a la persona.",
      lessons: [
        {
          title: "¿Qué tan grave es?",
          description: "Los tipos de sangrado y las señales de una hemorragia que amenaza la vida.",
          durationMin: 12,
          contenido: {
            version: 1,
            guia: ANDRES,
            bloques: [
              {
                tipo: "portada",
                titulo: "¿Qué tan grave es?",
                subtitulo: "Reconocer una hemorragia grave es el primer paso para detenerla.",
                objetivos: [
                  "Distinguir una hemorragia que amenaza la vida de una que no",
                  "Reconocer los tipos de sangrado",
                  "Entender por qué cada minuto cuenta",
                ],
                minutos: 12,
                dice: "Soy Andrés, paramédico. Lo que va a aprender hoy lo he visto salvar vidas en la calle.",
              },
              {
                tipo: "explicacion",
                titulo: "Tres tipos de sangrado",
                parrafos: ["No todo sangrado es igual. Reconocer su tipo le dice qué tan rápido tiene que actuar."],
                puntos: [
                  { titulo: "Arterial", texto: "Sangre roja brillante que sale a chorros, al ritmo del pulso. Es la más peligrosa: se pierde mucha sangre muy rápido." },
                  { titulo: "Venosa", texto: "Sangre rojo oscuro que sale de forma continua, sin pulsar. Puede ser abundante." },
                  { titulo: "Capilar", texto: "Sangre que brota en gotas, como en un raspón. Casi siempre se controla sola o con una presión leve." },
                ],
                clave: "Trátela como grave si la sangre sale a chorros, no para, empapa la ropa o las gasas, forma un charco, o si hay una amputación.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Amenaza la vida?",
                instruccion: "Clasifique cada situación.",
                categorias: [
                  { id: "grave", nombre: "Amenaza la vida", pista: "Actuar ya" },
                  { id: "leve", nombre: "No amenaza la vida", pista: "Atender con calma" },
                ],
                elementos: [
                  { texto: "Sangre que sale a chorros de la pierna", categoria: "grave" },
                  { texto: "Un raspón en la rodilla que gotea", categoria: "leve" },
                  { texto: "El pantalón empapado de sangre en segundos", categoria: "grave" },
                  { texto: "Una cortada pequeña en el dedo que para con presión", categoria: "leve" },
                  { texto: "Un charco de sangre junto a la persona", categoria: "grave" },
                  { texto: "Un dedo amputado por una máquina", categoria: "grave", porque: "Toda amputación se trata como hemorragia grave, aunque en el momento sangre poco." },
                ],
              },
              {
                tipo: "contrarreloj",
                titulo: "Cada segundo cuenta",
                segundos: 12,
                situacion: "Un compañero se corta el antebrazo con una lámina. La sangre sale roja brillante y a chorros.",
                pregunta: "¿Qué tipo de sangrado es y qué tan urgente?",
                opciones: [
                  {
                    texto: "Arterial: hay que actuar de inmediato",
                    correcta: true,
                    retro: "Así es. Roja brillante y a chorros indica una arteria. Cada segundo sin controlarla es sangre que no se recupera.",
                  },
                  { texto: "Venoso: puede esperar a la ambulancia", retro: "La sangre venosa es oscura y continua. Esta pulsa: es arterial y no puede esperar." },
                  { texto: "Capilar: basta una curita", retro: "Un sangrado capilar gotea. Uno que sale a chorros es una emergencia." },
                ],
                alAgotar: "Mientras decide, la persona sigue perdiendo sangre. Roja y a chorros: arterial, ya.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Arterial: roja brillante y a chorros, la más peligrosa.",
                  "Venosa: oscura y continua. Capilar: en gotas.",
                  "Es grave si sale a chorros, no para, empapa o forma un charco.",
                  "Toda amputación se trata como grave.",
                ],
                insignia: "Ojo clínico",
              },
            ],
          },
        },
        {
          title: "Primero usted: seguridad y el 123",
          description: "Asegurar la escena, protegerse de la sangre y pedir ayuda.",
          durationMin: 12,
          contenido: {
            version: 1,
            guia: ANDRES,
            bloques: [
              {
                tipo: "portada",
                titulo: "Primero usted",
                subtitulo: "Un auxiliador herido no ayuda a nadie.",
                objetivos: [
                  "Asegurar la escena antes de acercarse",
                  "Protegerse del contacto con sangre",
                  "Pedir ayuda de forma clara y rápida",
                ],
                minutos: 12,
                dice: "Lo primero no es la herida. Lo primero es que usted no sea la siguiente víctima.",
              },
              {
                tipo: "buscar",
                titulo: "¿Qué lo puede herir a usted?",
                instruccion: "Un compañero está herido junto a la máquina. Antes de acercarse, toque los 5 peligros que podrían convertirlo a usted en la segunda víctima.",
                escena: "taller",
                objetivos: [
                  {
                    x: 390,
                    y: 215,
                    r: 55,
                    nombre: "Máquina todavía encendida",
                    explicacion: "Apáguela con el pulsador de parada, o pida que la apaguen, antes de acercarse."
                  },
                  {
                    x: 230,
                    y: 395,
                    r: 58,
                    nombre: "Aceite derramado en el paso",
                    explicacion: "Un resbalón lo deja fuera de combate. Rodee el charco o cúbralo con aserrín o cartón."
                  },
                  {
                    x: 118,
                    y: 418,
                    r: 42,
                    nombre: "Extensión eléctrica pelada",
                    explicacion: "Un cable dañado cerca del aceite puede electrocutarlo. Desconéctelo desde la toma."
                  },
                  {
                    x: 505,
                    y: 412,
                    r: 46,
                    nombre: "Láminas cortantes en el piso",
                    explicacion: "Pueden cortarlo al arrodillarse. Retírelas con cuidado o arrodíllese en otro lado."
                  },
                  {
                    x: 640,
                    y: 140,
                    r: 52,
                    nombre: "Carga suspendida sobre el herido",
                    explicacion: "Nunca se trabaja bajo una carga colgada. Que la bajen o la aseguren antes de atender."
                  }
                ],
                dice: "Mire bien antes de correr. Toque cada peligro que vea."
              },
              {
                tipo: "explicacion",
                titulo: "Protéjase de la sangre",
                parrafos: [
                  "La sangre puede transmitir infecciones. Si hay guantes en el botiquín, póngaselos antes de tocar la herida.",
                  "Si no hay guantes, use una barrera: una bolsa plástica, una tela gruesa o la misma ropa de la persona. Nunca deje de ayudar por no tener guantes.",
                  "Al terminar, lávese bien las manos con agua y jabón, e informe si tuvo contacto con sangre en piel lastimada, ojos o boca.",
                ],
                clave: "Guantes si los hay; si no, cualquier barrera. Protegerse no es opcional.",
              },
              {
                tipo: "ordenar",
                titulo: "Los primeros pasos",
                instruccion: "Ordene lo que hace al encontrar a alguien con un sangrado grave.",
                pasos: [
                  "Verificar que la escena sea segura",
                  "Protegerse con guantes o una barrera",
                  "Pedir ayuda y llamar al 123",
                  "Buscar de dónde sale el sangrado",
                  "Aplicar presión directa firme",
                ],
                explicacion: "Así es. Si está solo, ponga el celular en altavoz: puede hablar con el 123 mientras presiona la herida.",
              },
              {
                tipo: "decision",
                titulo: "La llamada",
                situacion: "Otra persona se ofrece a llamar a emergencias mientras usted atiende.",
                pregunta: "¿Qué le pide?",
                opciones: [
                  {
                    texto: "Que marque el 123, dé la dirección exacta y lo que pasó, y vuelva a contarle qué le dijeron",
                    correcta: true,
                    retro: "Exacto. Dirección, qué pasó y cuántos heridos. Y que regrese: así usted sabe que la ayuda viene en camino.",
                  },
                  { texto: "Que llame a un familiar del herido", retro: "Primero la ayuda médica. A la familia se le avisa después." },
                  { texto: "Que busque un carro para llevarlo", retro: "Trasladar a alguien con una hemorragia grave sin controlarla aumenta la pérdida de sangre. Primero controle y pida ambulancia." },
                ],
              },
              {
                tipo: "tarjetas",
                titulo: "¿Mito o realidad?",
                tarjetas: [
                  {
                                        frente: "Si no tengo guantes, no debo tocar la herida.",
                    reverso: "Mito. Use cualquier barrera: una bolsa, una tela. Lo que no puede hacer es quedarse quieto ante un sangrado grave.",
                  },
                  {
                                        frente: "Hay que lavar la herida antes de detener el sangrado.",
                    reverso: "Mito. En un sangrado grave lo urgente es detenerlo. La limpieza viene después, en el centro de salud.",
                  },
                ],
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Escena segura antes de acercarse.",
                  "Guantes o cualquier barrera.",
                  "123: dirección, qué pasó y cuántos heridos.",
                  "En un sangrado grave, detenerlo es lo primero.",
                ],
                insignia: "Auxiliador seguro",
              },
            ],
          },
        },
      ],
    },
    {
      title: "Módulo 2. Sus manos salvan vidas",
      description: "Presión directa, empaquetamiento y torniquete.",
      lessons: [
        {
          title: "Presión directa",
          description: "Cómo presionar, qué hacer si la gasa se empapa y cuándo empaquetar.",
          durationMin: 15,
          contenido: {
            version: 1,
            guia: ANDRES,
            bloques: [
              {
                tipo: "portada",
                titulo: "Presión directa",
                subtitulo: "La herramienta más poderosa para detener un sangrado son sus manos.",
                objetivos: [
                  "Aplicar presión directa de forma correcta",
                  "Saber qué hacer si la gasa se empapa",
                  "Conocer cuándo se empaqueta una herida",
                ],
                minutos: 15,
                dice: "La mayoría de los sangrados se controlan con esto. Hágalo bien y hágalo fuerte.",
              },
              {
                tipo: "explicacion",
                titulo: "Cómo presionar",
                parrafos: [
                  "Cubra la herida con una gasa, un trapo limpio o la tela que tenga a mano.",
                  "Ponga una mano encima de la otra y presione con fuerza, directamente sobre el punto que sangra, usando el peso de su cuerpo. No es un toque: es presión firme.",
                  "Mantenga la presión sin soltar para mirar. Cada vez que levanta las manos, el sangrado vuelve a empezar.",
                ],
                ilustracion: "presion-directa",
                clave: "Si la gasa se empapa, no la retire: ponga otra encima y siga presionando.",
              },
              {
                tipo: "decision",
                titulo: "La gasa empapada",
                situacion: "Lleva un minuto presionando la herida del muslo. La gasa ya está roja y la sangre empieza a salir por los bordes.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Poner más gasa encima y presionar con más fuerza",
                    correcta: true,
                    retro: "Correcto. Quitar la gasa arranca el coágulo que se está formando. Agregue encima y aumente la presión. Si en un brazo o una pierna no para, piense en el torniquete.",
                  },
                  { texto: "Quitar la gasa empapada y poner una limpia", retro: "Al retirarla se desprende el coágulo que empezaba a formarse y el sangrado vuelve con fuerza." },
                  { texto: "Soltar un momento para ver de dónde sale", retro: "Cada vez que suelta, pierde lo que había ganado. Mantenga la presión continua." },
                ],
              },
              {
                tipo: "explicacion",
                titulo: "Empaquetar una herida profunda",
                parrafos: [
                  "Cuando la herida es profunda y está en una zona donde no se puede poner un torniquete, como la ingle o la axila, la presión desde afuera puede no alcanzar.",
                  "Empaquetar es rellenar la herida con gasa o tela limpia, empujándola hacia adentro con los dedos hasta llenarla, y luego presionar encima con fuerza sin soltar.",
                  "Esta técnica se entrena en práctica presencial. Aquí la conoce para saber que existe y cuándo se usa.",
                ],
                clave: "La ingle y la axila no admiten torniquete. Ahí la respuesta es presión y, si la herida es profunda, empaquetarla.",
              },
              {
                tipo: "contrarreloj",
                titulo: "Sangrado en la ingle",
                segundos: 12,
                situacion: "Un trabajador tiene una herida profunda en la ingle que sangra mucho.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Presión directa fuerte y, si es profunda, empaquetar la herida",
                    correcta: true,
                    retro: "Así es. En la ingle no se puede poner torniquete. Presión y empaquetamiento, sin soltar hasta que llegue la ayuda.",
                  },
                  { texto: "Ponerle un torniquete en la pierna", retro: "Un torniquete en la pierna no detiene un sangrado que está por encima de él, en la ingle." },
                  { texto: "Levantarle la pierna y esperar", retro: "Elevar la pierna, por sí solo, no controla una hemorragia grave. La presión directa sí." },
                ],
                alAgotar: "Una hemorragia en la ingle puede vaciar a una persona muy rápido. Presión, ya.",
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Presión firme, continua y directa sobre la herida.",
                  "Gasa empapada: agregue otra encima, no la retire.",
                  "Ingle y axila: presión y, si es profunda, empaquetar.",
                ],
                insignia: "Manos firmes",
              },
            ],
          },
        },
        {
          title: "El torniquete",
          description: "Cuándo, dónde y cómo, y lo que nunca se hace después.",
          durationMin: 15,
          contenido: {
            version: 1,
            guia: ANDRES,
            bloques: [
              {
                tipo: "portada",
                titulo: "El torniquete",
                subtitulo: "Cuando la presión no basta en un brazo o una pierna.",
                objetivos: [
                  "Saber cuándo usar un torniquete",
                  "Ubicarlo en el lugar correcto",
                  "Saber qué no hacer después de ponerlo",
                ],
                minutos: 15,
                dice: "Durante años se dijo que el torniquete era peligroso. Hoy sabemos que, bien usado, salva vidas.",
              },
              {
                tipo: "explicacion",
                titulo: "Dónde y cómo",
                parrafos: [
                  "Use el torniquete en un brazo o una pierna cuando el sangrado es grave y la presión directa no lo detiene, o cuando hay una amputación.",
                  "Colóquelo entre cinco y siete centímetros por encima de la herida, nunca sobre una articulación como el codo o la rodilla. Si no sabe exactamente dónde está la herida, póngalo lo más arriba posible en la extremidad.",
                  "Apriete hasta que el sangrado se detenga. Duele, y es normal: significa que está funcionando.",
                ],
                ilustracion: "torniquete",
                clave: "Anote la hora en que lo puso y no lo afloje ni lo retire: eso lo hace el personal de salud.",
              },
              {
                tipo: "ordenar",
                titulo: "Poner el torniquete",
                instruccion: "Ordene los pasos.",
                pasos: [
                  "Confirmar que el sangrado es grave y está en un brazo o una pierna",
                  "Ubicar el torniquete entre 5 y 7 cm por encima de la herida",
                  "Ajustar la correa firme alrededor de la extremidad",
                  "Girar la varilla hasta que el sangrado se detenga",
                  "Asegurar la varilla para que no se devuelva",
                  "Anotar la hora en que se puso",
                ],
                explicacion: "Correcto. La hora es vital: el equipo médico necesita saber cuánto tiempo lleva la extremidad sin circulación.",
              },
              {
                tipo: "decision",
                titulo: "Justo debajo de la rodilla",
                situacion: "La herida está justo debajo de la rodilla y la presión no alcanza. Usted tiene un torniquete.",
                pregunta: "¿Dónde lo pone?",
                ilustracion: "torniquete",
                opciones: [
                  {
                    texto: "En el muslo, por encima de la rodilla",
                    correcta: true,
                    retro: "Así es. Sobre la articulación el torniquete no comprime bien la arteria. Súbalo por encima de la rodilla.",
                  },
                  { texto: "Justo sobre la rodilla", retro: "Los huesos de la articulación impiden que el torniquete apriete la arteria: el sangrado sigue." },
                  { texto: "Por debajo de la herida", retro: "La sangre llega desde arriba. Un torniquete por debajo no la detiene." },
                ],
              },
              {
                tipo: "tarjetas",
                titulo: "¿Mito o realidad?",
                tarjetas: [
                  {
                                        frente: "Hay que aflojar el torniquete cada cierto tiempo para que circule la sangre.",
                    reverso: "Mito. Aflojarlo hace que vuelva el sangrado y se pierda más sangre. Solo lo retira el personal de salud.",
                  },
                  {
                                        frente: "Un cordón o un cable sirven igual que un torniquete.",
                    reverso: "Mito. Una correa delgada corta la piel y no comprime bien. Si no hay torniquete comercial, use una tela ancha con una varilla para girarla, y siga presionando.",
                  },
                  {
                    frente: "Si el torniquete duele mucho, es señal de que está bien puesto.",
                    reverso: "Realidad. Un torniquete eficaz duele. Explíqueselo a la persona y no lo afloje por el dolor.",
                  },
                ],
              },
              {
                tipo: "mision",
                titulo: "Rescate en la planta",
                intro: "Un operario se cortó el antebrazo con una lámina. La sangre sale roja brillante y a chorros. La ambulancia tarda y usted es quien está más cerca: cada segundo sin control, la vida del paciente baja.",
                medidor: {
                  etiqueta: "Vida del paciente",
                  tipo: "vida"
                },
                velocidad: 1.6,
                penalizacion: 20,
                pasos: [
                  {
                    situacion: "La máquina sigue encendida y hay virutas en el piso.",
                    pregunta: "¿Qué hace primero?",
                    opciones: [
                      {
                        texto: "Pido que apaguen la máquina y miro dónde piso",
                        correcta: true,
                        retro: "Dos segundos para asegurar la escena evitan una segunda víctima."
                      },
                      {
                        texto: "Me lanzo a presionar la herida",
                        retro: "Si la máquina lo alcanza o se resbala, habrá dos heridos."
                      },
                      {
                        texto: "Espero lejos a que llegue la ambulancia",
                        retro: "Una hemorragia así no espera: puede ser mortal en minutos."
                      }
                    ]
                  },
                  {
                    situacion: "El botiquín está a dos pasos.",
                    pregunta: "¿Cómo se protege?",
                    opciones: [
                      {
                        texto: "Me pongo guantes o uso una bolsa como barrera",
                        correcta: true,
                        retro: "Correcto: la sangre puede transmitir infecciones."
                      },
                      {
                        texto: "Atiendo con las manos desnudas: no hay tiempo",
                        retro: "Sí hay tiempo para una barrera; si no hay guantes, sirve una bolsa o una tela."
                      }
                    ]
                  },
                  {
                    situacion: "Un compañero mira sin saber qué hacer.",
                    pregunta: "¿Qué le pide?",
                    opciones: [
                      {
                        texto: "Que llame al 123, dé la dirección exacta y vuelva a contarme",
                        correcta: true,
                        retro: "Así sabe que la ayuda viene en camino."
                      },
                      {
                        texto: "Que busque un carro para llevarlo",
                        retro: "Trasladarlo sin controlar el sangrado aumenta la pérdida de sangre."
                      },
                      {
                        texto: "Que llame a la familia",
                        retro: "Primero la ayuda médica. A la familia se le avisa después."
                      }
                    ]
                  },
                  {
                    situacion: "Tiene gasa en la mano.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Presiono directo sobre la herida, con fuerza, con las dos manos",
                        correcta: true,
                        retro: "Esa es la herramienta más poderosa para detener un sangrado."
                      },
                      {
                        texto: "Primero lavo la herida",
                        retro: "En un sangrado grave lo urgente es detenerlo. La limpieza viene después."
                      },
                      {
                        texto: "Pongo la gasa encima con suavidad, sin apretar",
                        retro: "Sin presión firme, la sangre sigue saliendo."
                      }
                    ]
                  },
                  {
                    situacion: "La gasa se empapó y la sangre sale por los bordes.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Pongo más gasa encima y presiono más fuerte",
                        correcta: true,
                        retro: "Retirarla arrancaría el coágulo que se está formando."
                      },
                      {
                        texto: "Quito la gasa empapada y pongo una limpia",
                        retro: "Al quitarla, el sangrado vuelve con fuerza."
                      }
                    ]
                  },
                  {
                    situacion: "Aun así no para. La herida está en el antebrazo.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "Pongo el torniquete 5 a 7 cm arriba de la herida y aprieto hasta que pare",
                        correcta: true,
                        retro: "Correcto: en un brazo que no para con presión, el torniquete salva vidas."
                      },
                      {
                        texto: "Pongo el torniquete debajo de la herida",
                        retro: "La sangre llega desde arriba: por debajo no la detiene."
                      },
                      {
                        texto: "Sigo presionando igual y espero",
                        retro: "Si la presión no basta, cada minuto de espera es sangre que no se recupera."
                      }
                    ]
                  },
                  {
                    situacion: "El sangrado se detuvo.",
                    pregunta: "¿Y ahora?",
                    opciones: [
                      {
                        texto: "Anoto la hora del torniquete y acompaño al paciente sin aflojarlo",
                        correcta: true,
                        retro: "El equipo médico necesita saber cuánto tiempo lleva puesto."
                      },
                      {
                        texto: "Aflojo el torniquete para que circule la sangre",
                        retro: "Aflojarlo hace que vuelva el sangrado. Solo lo retira el personal de salud."
                      }
                    ]
                  }
                ],
                exito: "¡Sangrado controlado! Llega la ambulancia y el paramédico recibe al paciente con el torniquete y la hora anotada. Usted le salvó la vida.",
                fracaso: "El paciente perdió demasiada sangre. En una hemorragia grave cada decisión cuesta segundos: seguridad, protección, 123, presión y torniquete si no para.",
                dice: "Esto es lo que se hace en la calle. Vamos a hacerlo juntos, contra el reloj."
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Solo en brazos y piernas, cuando la presión no basta.",
                  "Entre 5 y 7 cm por encima de la herida, nunca sobre la articulación.",
                  "Apriete hasta que pare. Duele, y es normal.",
                  "Anote la hora. No lo afloje ni lo retire.",
                ],
                insignia: "Torniquete salvavidas",
              },
            ],
          },
        },
      ],
    },
    {
      title: "Módulo 3. Después del sangrado",
      description: "El shock y tres casos con reglas propias: nariz, objetos clavados y amputaciones.",
      lessons: [
        {
          title: "Shock: el peligro que no se ve",
          description: "Reconocer el shock y acompañar a la persona hasta que llegue la ayuda.",
          durationMin: 12,
          contenido: {
            version: 1,
            guia: ANDRES,
            bloques: [
              {
                tipo: "portada",
                titulo: "Shock: el peligro que no se ve",
                subtitulo: "El sangrado paró. La emergencia todavía no.",
                objetivos: [
                  "Reconocer las señales de shock",
                  "Mantener a la persona estable mientras llega la ayuda",
                  "Saber qué no darle",
                ],
                minutos: 12,
                dice: "Después de perder mucha sangre, el cuerpo entra en crisis. Hay que saber verlo.",
              },
              {
                tipo: "explicacion",
                titulo: "Las señales",
                parrafos: ["El shock aparece cuando el cuerpo no recibe suficiente sangre. Puede presentarse aunque el sangrado ya esté controlado."],
                puntos: [
                  { titulo: "Piel", texto: "Pálida, fría y sudorosa." },
                  { titulo: "Pulso y respiración", texto: "Rápidos y débiles." },
                  { titulo: "Mente", texto: "Confusión, ansiedad o somnolencia." },
                  { titulo: "Otras", texto: "Sed intensa, náuseas o mareo." },
                ],
                clave: "Acuéstela, abríguela, vigílela y no le dé comida ni bebida. Espere la ambulancia a su lado.",
              },
              {
                tipo: "clasificar",
                titulo: "¿Se hace o no se hace?",
                instruccion: "La persona está en shock. Clasifique cada acción.",
                categorias: [
                  { id: "si", nombre: "Sí se hace" },
                  { id: "no", nombre: "No se hace" },
                ],
                elementos: [
                  { texto: "Mantenerla acostada", categoria: "si" },
                  { texto: "Abrigarla con una chaqueta o una manta", categoria: "si" },
                  { texto: "Darle agua porque tiene sed", categoria: "no", porque: "Puede necesitar cirugía, y si bebe puede vomitar. No le dé comida ni bebida." },
                  { texto: "Hablarle y tranquilizarla", categoria: "si" },
                  { texto: "Dejarla sola para ir a buscar ayuda", categoria: "no", porque: "Si está solo, llame al 123 en altavoz sin separarse de ella." },
                  { texto: "Vigilar si sigue consciente y respirando", categoria: "si" },
                  { texto: "Darle un medicamento para el dolor", categoria: "no", porque: "Ningún medicamento por boca: puede enmascarar síntomas y complicar la atención." },
                ],
              },
              {
                tipo: "decision",
                titulo: "Pide agua",
                situacion: "El sangrado del brazo está controlado con el torniquete. La persona está pálida, suda frío y le pide agua con insistencia.",
                pregunta: "¿Qué hace?",
                opciones: [
                  {
                    texto: "Explicarle que no puede beber, abrigarla y acompañarla",
                    correcta: true,
                    retro: "Correcto. La sed es una señal de shock. Puede necesitar cirugía y, si bebe, vomitar. Abríguela y acompáñela hasta que llegue la ambulancia.",
                  },
                  { texto: "Darle un vaso de agua para que se calme", retro: "Beber puede causarle vómito y complicar una cirugía. La sed se atiende en el hospital." },
                  { texto: "Sentarla para que tome aire", retro: "Sentarla puede hacerla desmayar. Manténgala acostada." },
                ],
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Shock: piel pálida, fría y sudorosa, pulso rápido, confusión y sed.",
                  "Acostar, abrigar, acompañar y vigilar.",
                  "Nada de comida, bebida ni medicamentos.",
                ],
                insignia: "Guardián del paciente",
              },
            ],
          },
        },
        {
          title: "Casos especiales",
          description: "Sangrado de nariz, objetos clavados y amputaciones.",
          durationMin: 15,
          contenido: {
            version: 1,
            guia: ANDRES,
            bloques: [
              {
                tipo: "portada",
                titulo: "Casos especiales",
                subtitulo: "Nariz, objetos clavados y amputaciones: tres situaciones con reglas propias.",
                objetivos: [
                  "Controlar un sangrado de nariz",
                  "Actuar ante un objeto clavado",
                  "Cuidar una parte amputada",
                ],
                minutos: 15,
                dice: "En estos tres casos, lo que la mayoría hace por instinto es justo lo contrario de lo correcto.",
              },
              {
                tipo: "decision",
                titulo: "Sangrado de nariz",
                situacion: "A una compañera le sangra la nariz en la oficina. Alguien le dice que eche la cabeza hacia atrás.",
                pregunta: "¿Qué le recomienda usted?",
                opciones: [
                  {
                    texto: "Sentarse, inclinarse hacia adelante y apretar la parte blanda de la nariz",
                    correcta: true,
                    retro: "Así es. Apriete la parte blanda de la nariz, debajo del hueso, de 10 a 15 minutos sin soltar. Si no para en ese tiempo o fue por un golpe fuerte, busque atención médica.",
                  },
                  { texto: "Echar la cabeza hacia atrás", retro: "Así la sangre se va a la garganta: puede atragantarla o hacerla vomitar, y esconde cuánto está sangrando." },
                  { texto: "Acostarse boca arriba", retro: "Igual que echar la cabeza hacia atrás: la sangre baja por la garganta." },
                ],
              },
              {
                tipo: "contrarreloj",
                titulo: "Un objeto clavado",
                segundos: 10,
                situacion: "Una varilla quedó clavada en el muslo de un trabajador. Sangra alrededor de la varilla.",
                pregunta: "¿Qué hace con la varilla?",
                opciones: [
                  {
                    texto: "Dejarla donde está, inmovilizarla y presionar alrededor",
                    correcta: true,
                    retro: "Correcto. El objeto puede estar taponando el sangrado. Fíjelo con gasas a los lados para que no se mueva y presione alrededor, nunca encima.",
                  },
                  { texto: "Sacarla con cuidado", retro: "Al retirarla puede liberar un sangrado que el objeto estaba conteniendo. Solo se retira en el hospital." },
                  { texto: "Presionar directamente sobre la varilla", retro: "Presionar el objeto lo hunde más y daña los tejidos. La presión va alrededor." },
                ],
                alAgotar: "Ante la duda, no toque el objeto: inmovilice y presione alrededor.",
              },
              {
                tipo: "explicacion",
                titulo: "Una amputación",
                parrafos: [
                  "Primero, controle el sangrado. En una extremidad amputada, lo indicado suele ser el torniquete.",
                  "Después, si es seguro, recupere la parte amputada. Envuélvala en una gasa o tela limpia, métala en una bolsa plástica cerrada y ponga esa bolsa sobre hielo o agua fría.",
                  "La parte nunca debe tocar el hielo directamente: el frío directo la daña. Entréguesela al personal de la ambulancia.",
                ],
                clave: "La vida primero, la parte después: nunca retrase el control del sangrado por buscar la parte amputada.",
              },
              {
                tipo: "tarjetas",
                titulo: "¿Mito o realidad?",
                tarjetas: [
                  {
                                        frente: "La parte amputada se pone directamente en el hielo.",
                    reverso: "Mito. El hielo directo la congela y la daña. Va envuelta, en una bolsa cerrada, y la bolsa sobre el hielo.",
                  },
                  {
                                        frente: "Si sangra la nariz, hay que echar la cabeza hacia atrás.",
                    reverso: "Mito. Hacia adelante, apretando la parte blanda de la nariz de 10 a 15 minutos.",
                  },
                  {
                                        frente: "Un objeto clavado hay que sacarlo rápido.",
                    reverso: "Mito. Se deja donde está y se inmoviliza: puede estar conteniendo el sangrado.",
                  },
                ],
              },
              {
                tipo: "mision",
                titulo: "Accidente en la línea de corte",
                intro: "Una compañera se amputó la punta de un dedo con la cizalla. Está pálida y sangra. Usted llega primero y lo que haga en los próximos minutos cuenta.",
                medidor: {
                  etiqueta: "Vida de la paciente",
                  tipo: "vida"
                },
                velocidad: 1.5,
                penalizacion: 20,
                pasos: [
                  {
                    situacion: "La cizalla sigue conectada y encendida.",
                    pregunta: "¿Qué hace primero?",
                    opciones: [
                      {
                        texto: "Pido que la apaguen y la desconecten antes de acercarme",
                        correcta: true,
                        retro: "Bien: primero la escena, después la persona."
                      },
                      {
                        texto: "Saco la punta del dedo de la máquina de inmediato",
                        retro: "Con la máquina encendida puede herirse usted. La parte amputada viene al final."
                      }
                    ]
                  },
                  {
                    situacion: "Ya es seguro. Tiene guantes y gasa.",
                    pregunta: "¿Cómo controla el sangrado?",
                    opciones: [
                      {
                        texto: "Presiono con gasa directamente sobre la herida, con fuerza y sin soltar",
                        correcta: true,
                        retro: "Correcto: en la punta de un dedo, la presión directa firme casi siempre basta."
                      },
                      {
                        texto: "Le pongo un torniquete en el brazo",
                        retro: "El torniquete se reserva para hemorragias graves de brazos o piernas que no paran con presión. Aquí basta la presión directa."
                      },
                      {
                        texto: "Intento poner la punta del dedo en su lugar",
                        retro: "Eso no detiene el sangrado y puede dañar el tejido. Presión directa."
                      }
                    ]
                  },
                  {
                    situacion: "Otro compañero ya llamó al 123. Con la presión, sangra mucho menos.",
                    pregunta: "¿Qué hace con la parte amputada?",
                    opciones: [
                      {
                        texto: "Pido que la envuelvan en gasa, la metan en una bolsa cerrada y pongan la bolsa sobre hielo",
                        correcta: true,
                        retro: "Así se conserva sin que el frío la dañe."
                      },
                      {
                        texto: "La meto directamente en un vaso con hielo",
                        retro: "El hielo directo congela y daña el tejido. Siempre envuelta y en bolsa."
                      },
                      {
                        texto: "La lavo con alcohol",
                        retro: "El alcohol daña el tejido. Solo se envuelve limpia y se conserva en frío."
                      }
                    ]
                  },
                  {
                    situacion: "La compañera está pálida, sudorosa y pide agua con insistencia.",
                    pregunta: "¿Qué hace?",
                    opciones: [
                      {
                        texto: "La acuesto, la abrigo, le hablo y no le doy de beber",
                        correcta: true,
                        retro: "Son señales de shock. Nada por boca: puede necesitar cirugía."
                      },
                      {
                        texto: "Le doy agua con azúcar para que se reponga",
                        retro: "Beber puede causarle vómito y complicar una cirugía."
                      }
                    ]
                  },
                  {
                    situacion: "Llega la ambulancia.",
                    pregunta: "¿Qué hace al entregarla?",
                    opciones: [
                      {
                        texto: "Entrego la bolsa con la parte amputada y cuento qué pasó y qué hice",
                        correcta: true,
                        retro: "Esa información y la parte bien conservada ayudan al equipo médico."
                      },
                      {
                        texto: "Me quedo con la bolsa para llevarla después",
                        retro: "La parte amputada viaja con la paciente, ahora."
                      }
                    ]
                  }
                ],
                exito: "¡Misión cumplida! La compañera llega al hospital con el sangrado controlado y la parte amputada bien conservada.",
                fracaso: "La paciente perdió demasiada sangre o se perdió tiempo valioso. Recuerde el orden: escena segura, presión directa, 123 y conservar la parte.",
                dice: "Último reto del curso: una amputación. Tranquilidad y orden."
              },
              {
                tipo: "resumen",
                titulo: "Lo que se lleva de esta lección",
                puntos: [
                  "Nariz: hacia adelante y presión de 10 a 15 minutos.",
                  "Objeto clavado: no se retira; se inmoviliza y se presiona alrededor.",
                  "Amputación: primero el sangrado; la parte, envuelta, en bolsa y sobre hielo sin contacto directo.",
                ],
                insignia: "Primer respondiente",
                cierre: "Terminó la práctica. En la evaluación final va a poner a prueba lo aprendido. Recuerde que las técnicas manuales se complementan con práctica presencial.",
              },
            ],
          },
        },
      ],
    },
  ],
  examen: {
    title: "Evaluación final",
    description: "Doce preguntas sobre todo el curso. Nota mínima aprobatoria: 80/100. Tiene tres intentos.",
    minScore: 80,
    maxAttempts: 3,
    timeLimitMin: 20,
    preguntas: [
      {
        statement: "¿Qué caracteriza a un sangrado arterial?",
        explanation: "La sangre arterial es roja brillante y sale a chorros, al ritmo del pulso. Es la más peligrosa.",
        options: [
          { text: "Sangre roja brillante que sale a chorros, al ritmo del pulso", ok: true },
          { text: "Sangre rojo oscuro que sale de forma continua", ok: false },
          { text: "Sangre en gotas, como en un raspón", ok: false },
          { text: "Líquido transparente", ok: false },
        ],
      },
      {
        statement: "¿Qué es lo primero al llegar donde hay una persona que sangra?",
        explanation: "Verificar que la escena sea segura. Un auxiliador herido no puede ayudar.",
        options: [
          { text: "Verificar que la escena sea segura", ok: true },
          { text: "Aplicar un torniquete", ok: false },
          { text: "Lavar la herida", ok: false },
          { text: "Darle agua", ok: false },
        ],
      },
      {
        statement: "¿Cuál es el número único de emergencias en Colombia?",
        explanation: "El 123 es la línea única de emergencias.",
        options: [
          { text: "123", ok: true },
          { text: "911", ok: false },
          { text: "0800", ok: false },
          { text: "411", ok: false },
        ],
      },
      {
        statement: "La gasa que presiona sobre la herida se empapó. ¿Qué hace?",
        explanation: "Se agrega otra gasa encima y se sigue presionando. Retirarla arranca el coágulo que se estaba formando.",
        options: [
          { text: "Pone otra gasa encima y sigue presionando", ok: true },
          { text: "La retira y pone una limpia", ok: false },
          { text: "Suelta un momento para mirar", ok: false },
          { text: "Lava la herida", ok: false },
        ],
      },
      {
        statement: "¿Dónde se coloca un torniquete?",
        explanation: "Entre 5 y 7 cm por encima de la herida, sin quedar sobre una articulación.",
        options: [
          { text: "Entre 5 y 7 cm por encima de la herida, sin quedar sobre una articulación", ok: true },
          { text: "Justo encima de la herida, tocándola", ok: false },
          { text: "Por debajo de la herida", ok: false },
          { text: "Sobre la rodilla o el codo", ok: false },
        ],
      },
      {
        statement: "Después de poner un torniquete, lo correcto es:",
        explanation: "Anotar la hora y no aflojarlo ni retirarlo. Eso lo hace el personal de salud.",
        options: [
          { text: "Anotar la hora y no aflojarlo", ok: true },
          { text: "Aflojarlo cada 10 minutos", ok: false },
          { text: "Retirarlo cuando pare de sangrar", ok: false },
          { text: "Aflojarlo si la persona se queja del dolor", ok: false },
        ],
      },
      {
        statement: "Una herida profunda en la ingle sangra mucho. ¿Qué hace?",
        explanation: "En la ingle no se puede poner torniquete: presión directa fuerte y, si es profunda, empaquetar.",
        options: [
          { text: "Presión directa fuerte y, si es profunda, empaquetar la herida", ok: true },
          { text: "Poner un torniquete en el tobillo", ok: false },
          { text: "Elevar la pierna y esperar", ok: false },
          { text: "Poner hielo sobre la herida", ok: false },
        ],
      },
      {
        statement: "¿Cuál de estas es una señal de shock?",
        explanation: "Piel pálida, fría y sudorosa, junto con pulso rápido y débil, confusión y sed.",
        options: [
          { text: "Piel pálida, fría y sudorosa", ok: true },
          { text: "Piel roja y caliente", ok: false },
          { text: "Mucha hambre", ok: false },
          { text: "Pulso lento y fuerte", ok: false },
        ],
      },
      {
        statement: "Una persona en shock le pide agua. ¿Qué hace?",
        explanation: "No se le da bebida: puede necesitar cirugía y vomitar. Se abriga y se acompaña.",
        options: [
          { text: "No le da de beber; la abriga y la acompaña", ok: true },
          { text: "Le da agua para que se calme", ok: false },
          { text: "Le da un café", ok: false },
          { text: "Le da suero oral", ok: false },
        ],
      },
      {
        statement: "Ante un sangrado de nariz, lo correcto es:",
        explanation: "Inclinarse hacia adelante y apretar la parte blanda de la nariz de 10 a 15 minutos.",
        options: [
          { text: "Inclinarse hacia adelante y apretar la parte blanda de la nariz", ok: true },
          { text: "Echar la cabeza hacia atrás", ok: false },
          { text: "Acostarse boca arriba", ok: false },
          { text: "Taponar con algodón y echar la cabeza hacia atrás", ok: false },
        ],
      },
      {
        statement: "Una varilla quedó clavada en el muslo de un trabajador. ¿Qué hace?",
        explanation: "No se retira: se inmoviliza y se presiona alrededor. Puede estar conteniendo el sangrado.",
        options: [
          { text: "La deja, la inmoviliza y presiona alrededor", ok: true },
          { text: "La saca con cuidado", ok: false },
          { text: "Presiona directamente sobre la varilla", ok: false },
          { text: "La corta al ras de la piel", ok: false },
        ],
      },
      {
        statement: "Verdadero o falso: la parte amputada debe ponerse directamente sobre el hielo para conservarla.",
        explanation: "Falso. El hielo directo la daña: se envuelve, se mete en una bolsa cerrada y la bolsa va sobre el hielo.",
        type: "verdadero_falso",
        options: VF(false),
      },
    ],
  },
};

export const CURSOS_INTERACTIVOS: CursoInteractivo[] = [fuego, sangrado];
