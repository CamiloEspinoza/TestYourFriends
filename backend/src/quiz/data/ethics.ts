export type Dimension = 'P' | 'I' | 'E' | 'R';

export interface Character {
  name: string;
  description: string;
  philosophy: string;
  dimensions: [Dimension, Dimension] | [Dimension];
  photo: string;
}

export interface QuizQuestion {
  id: number;
  situation: string;
  options: { text: string; dimension: Dimension }[];
}

export const questions: QuizQuestion[] = [
  {
    id: 1,
    situation:
      'Un tren descontrolado se dirige hacia cinco personas atadas a las vías. Puedes desviar el tren a otra vía donde solo hay una persona. ¿Qué haces?',
    options: [
      { text: 'Desvío el tren. Salvar cinco vidas a costa de una es la decisión más lógica.', dimension: 'P' },
      { text: 'No intervengo. No tengo derecho a decidir quién vive y quién muere.', dimension: 'I' },
      { text: 'Intento advertir a todos gritando, aunque sea poco probable que funcione.', dimension: 'E' },
      { text: 'Busco una tercera opción: sabotear el tren, bloquear las vías, lo que sea necesario.', dimension: 'R' },
    ],
  },
  {
    id: 2,
    situation:
      'Descubres que tu mejor amigo, que es funcionario público, está desviando fondos. Nadie más lo sabe. ¿Qué haces?',
    options: [
      { text: 'Lo denuncio anónimamente. El daño público es mayor que nuestra amistad.', dimension: 'P' },
      { text: 'Lo denuncio abiertamente. La corrupción debe enfrentarse sin importar quién sea.', dimension: 'I' },
      { text: 'Hablo primero con él en privado para entender su situación y darle la oportunidad de corregirlo.', dimension: 'E' },
      { text: 'Filtro la información a la prensa para que el sistema rinda cuentas.', dimension: 'R' },
    ],
  },
  {
    id: 3,
    situation:
      'Tu pareja necesita un medicamento que cuesta una fortuna y no pueden pagarlo. La farmacia se niega a hacer excepciones. ¿Qué haces?',
    options: [
      { text: 'Negocio agresivamente: busco genéricos, programas de ayuda, crowdfunding. Hay que ser estratégico.', dimension: 'P' },
      { text: 'Jamás robaría. Busco todas las vías legales posibles aunque tome más tiempo.', dimension: 'I' },
      { text: 'Robo el medicamento sin dudarlo. La vida de mi pareja vale más que cualquier ley.', dimension: 'E' },
      { text: 'Organizo una protesta pública contra el precio abusivo del medicamento.', dimension: 'R' },
    ],
  },
  {
    id: 4,
    situation:
      'Durante la guerra, escondes a una familia perseguida en tu casa. Soldados tocan tu puerta y preguntan si hay alguien escondido. ¿Qué haces?',
    options: [
      { text: 'Miento sin dudarlo. Es la única forma realista de protegerlos.', dimension: 'P' },
      { text: 'Me niego a responder. No puedo mentir, pero tampoco voy a delatarlos.', dimension: 'I' },
      { text: 'Miento y además los invito a pasar café para ganar su confianza y alejar sospechas.', dimension: 'E' },
      { text: "Los enfrento directamente: 'Aunque los tuviera, no se los entregaría.'", dimension: 'R' },
    ],
  },
  {
    id: 5,
    situation:
      'Te ofrecen un trabajo increíblemente bien pagado en una empresa que contamina ríos en comunidades pobres. ¿Qué haces?',
    options: [
      { text: 'Acepto el trabajo y uso mi posición interna para impulsar cambios graduales.', dimension: 'P' },
      { text: 'Lo rechazo. No puedo ser cómplice de algo que viola mis principios.', dimension: 'I' },
      { text: 'Lo rechazo y además busco formas de ayudar a las comunidades afectadas.', dimension: 'E' },
      { text: 'Acepto, recopilo evidencia desde dentro y luego la hago pública.', dimension: 'R' },
    ],
  },
  {
    id: 6,
    situation:
      'Descubres que tu padre tiene una segunda familia secreta. Tu madre no sabe nada. La verdad destruiría a tu familia, pero el secreto te consume. ¿Qué haces?',
    options: [
      { text: 'Confronto a mi padre en privado y le doy un plazo para resolver la situación.', dimension: 'P' },
      { text: 'Le digo la verdad a mi madre. Tiene derecho a saber, pase lo que pase.', dimension: 'I' },
      { text: 'Busco apoyo profesional primero. Necesito entender cómo minimizar el daño emocional para todos.', dimension: 'E' },
      { text: 'Enfrento a mi padre públicamente en una reunión familiar. Se acabaron los secretos.', dimension: 'R' },
    ],
  },
  {
    id: 7,
    situation:
      'Vives en un país donde una nueva ley prohíbe dar comida a personas sin hogar en espacios públicos. ¿Qué haces?',
    options: [
      { text: 'Busco vacíos legales: reparto comida en propiedad privada o creo un comedor social.', dimension: 'P' },
      { text: 'Desobedezco la ley abiertamente. Una ley injusta no merece obediencia.', dimension: 'I' },
      { text: 'Sigo ayudando discretamente y además conecto a estas personas con servicios sociales.', dimension: 'E' },
      { text: 'Organizo desobediencia civil masiva para presionar y cambiar la ley.', dimension: 'R' },
    ],
  },
  {
    id: 8,
    situation:
      'Alguien que te hizo mucho daño en el pasado ahora está pasando por una crisis terrible y te pide ayuda. ¿Qué haces?',
    options: [
      { text: 'Lo ayudo, pero establezco límites claros. No olvido, pero soy práctico.', dimension: 'P' },
      { text: 'Lo ayudo porque es lo correcto, independientemente de lo que me haya hecho.', dimension: 'I' },
      { text: 'Lo ayudo de corazón. El sufrimiento de cualquier persona me conmueve.', dimension: 'E' },
      { text: 'No lo ayudo. Las acciones tienen consecuencias y debe enfrentarlas.', dimension: 'R' },
    ],
  },
  {
    id: 9,
    situation:
      'Eres un científico que descubre que tu empresa farmacéutica ocultó efectos secundarios graves de un medicamento popular. Denunciar destruiría tu carrera. ¿Qué haces?',
    options: [
      { text: 'Documento todo meticulosamente y busco un abogado antes de hacer cualquier movimiento.', dimension: 'P' },
      { text: 'Denuncio inmediatamente ante las autoridades. La salud pública no puede esperar.', dimension: 'I' },
      { text: 'Pienso en los pacientes afectados y sus familias. Denuncio, pero también busco cómo apoyarlos.', dimension: 'E' },
      { text: 'Filtro toda la información a medios independientes para que la empresa no pueda silenciarlo.', dimension: 'R' },
    ],
  },
  {
    id: 10,
    situation:
      'Un hospital propone usar IA para decidir qué pacientes reciben tratamiento prioritario cuando los recursos son limitados. ¿Qué opinas?',
    options: [
      { text: 'A favor, si los datos son buenos. La IA puede ser más objetiva y eficiente que los humanos.', dimension: 'P' },
      { text: 'En contra. Decisiones de vida o muerte deben ser tomadas por personas con criterio moral.', dimension: 'I' },
      { text: 'Solo si se garantiza que la IA considera factores humanos y no solo estadísticas frías.', dimension: 'E' },
      { text: 'En contra. Es peligroso ceder poder de decisión sobre vidas a sistemas que no podemos cuestionar.', dimension: 'R' },
    ],
  },
];

export const characters: Character[] = [
  {
    name: 'Winston Churchill',
    dimensions: ['P'],
    photo: '/characters/churchill.jpg',
    description: 'Pragmático implacable que toma decisiones difíciles por el bien mayor.',
    philosophy: 'Ves el mundo como es, no como quisieras que fuera. Tomas decisiones difíciles cuando otros dudan, priorizando resultados sobre sentimientos. Tu fortaleza está en la claridad estratégica.',
  },
  {
    name: 'Mahatma Gandhi',
    dimensions: ['I'],
    photo: '/characters/gandhi.jpg',
    description: 'Idealista que no transige en principios sin importar las consecuencias.',
    philosophy: 'Tus principios no son negociables. Crees que el fin nunca justifica los medios y que la coherencia moral es la mayor fortaleza. Inspiras a otros con tu integridad inquebrantable.',
  },
  {
    name: 'Princesa Diana',
    dimensions: ['E'],
    photo: '/characters/diana.jpg',
    description: 'Guiada por la compasión y la conexión humana ante todo.',
    philosophy: 'Sientes profundamente el dolor ajeno y actúas desde el corazón. Tu brújula moral es la empatía, y crees que el mundo cambia una persona a la vez, a través de la conexión humana genuina.',
  },
  {
    name: 'Che Guevara',
    dimensions: ['R'],
    photo: '/characters/che.jpg',
    description: 'Rebelde que desafía el sistema cuando lo considera injusto.',
    philosophy: 'No aceptas el status quo cuando es injusto. Prefieres la acción directa sobre la diplomacia, y crees que el cambio real requiere valentía para enfrentar al sistema de frente.',
  },
  {
    name: 'Nelson Mandela',
    dimensions: ['P', 'I'],
    photo: '/characters/mandela.jpg',
    description: 'Combina visión pragmática con principios inquebrantables.',
    philosophy: 'Sabes cuándo ser firme y cuándo ser flexible. Combinas la estrategia con la integridad, entendiendo que los grandes cambios requieren tanto paciencia como convicción.',
  },
  {
    name: 'Oprah Winfrey',
    dimensions: ['P', 'E'],
    photo: '/characters/oprah.jpg',
    description: 'Pragmática pero siempre centrada en las personas.',
    philosophy: 'Eres efectivo/a y estratégico/a, pero nunca pierdes de vista a las personas. Crees que el éxito real viene de combinar inteligencia práctica con genuino interés por el bienestar de otros.',
  },
  {
    name: 'Martin Luther King Jr.',
    dimensions: ['I', 'R'],
    photo: '/characters/mlk.jpg',
    description: 'Idealista que desafía lo establecido de forma pacífica.',
    philosophy: 'Crees en un mundo mejor y estás dispuesto/a a luchar por él, pero desde los principios. Desafías la injusticia no con violencia, sino con la fuerza moral de tus convicciones.',
  },
  {
    name: 'Frida Kahlo',
    dimensions: ['E', 'R'],
    photo: '/characters/frida.jpg',
    description: 'Empática y auténtica, rompe moldes desde la vulnerabilidad.',
    philosophy: 'Tu sensibilidad es tu superpoder. Sientes profundamente y no temes mostrarlo, desafiando las normas desde la autenticidad. Crees que la vulnerabilidad es una forma de rebeldía.',
  },
];

export interface QuizResult {
  character: Character;
  scores: Record<Dimension, number>;
}

export function calculateResult(answers: Record<number, Dimension>): QuizResult {
  const scores: Record<Dimension, number> = { P: 0, I: 0, E: 0, R: 0 };

  for (const dimension of Object.values(answers)) {
    scores[dimension]++;
  }

  const sorted = (Object.entries(scores) as [Dimension, number][]).sort(
    (a, b) => b[1] - a[1],
  );

  const top = sorted[0][0];
  const second = sorted[1][0];
  const gap = sorted[0][1] - sorted[1][1];

  let match: Character | undefined;

  if (gap >= 3) {
    match = characters.find(
      (c) => c.dimensions.length === 1 && c.dimensions[0] === top,
    );
  }

  if (!match) {
    match = characters.find(
      (c) =>
        c.dimensions.length === 2 &&
        c.dimensions.includes(top) &&
        c.dimensions.includes(second),
    );
  }

  if (!match) {
    match = characters.find(
      (c) => c.dimensions.length === 1 && c.dimensions[0] === top,
    )!;
  }

  return { character: match, scores };
}
