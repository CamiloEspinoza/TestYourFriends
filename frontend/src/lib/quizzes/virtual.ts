export type Dimension = "A" | "P" | "V" | "S";

export interface QuizOption {
  text: string;
  dimension: Dimension;
}

export interface QuizQuestion {
  id: number;
  situation: string;
  options: QuizOption[];
}

export interface Character {
  name: string;
  description: string;
  philosophy: string;
  dimensions: [Dimension, Dimension] | [Dimension];
  photo: string;
}

export const QUIZ_TITLE = "¿Realidad o Virtualidad?";
export const QUIZ_DESCRIPTION =
  "10 escenarios donde la realidad virtual ofrece alternativas tentadoras. Descubre qué valoras más y dónde está tu punto de inflexión entre lo real y lo virtual.";

export const questions: QuizQuestion[] = [
  {
    id: 1,
    situation:
      "Tu pareja falleció hace un año. Una empresa ofrece una simulación perfecta: su voz, sus gestos, sus recuerdos compartidos. Puedes cenar con ella cada noche. ¿Qué haces?",
    options: [
      {
        text: "Lo rechazo. Por más perfecta que sea la copia, no es ella. Prefiero el dolor real al consuelo artificial.",
        dimension: "A",
      },
      {
        text: "Lo acepto sin dudarlo. Si la experiencia es indistinguible, el bienestar que me da es real.",
        dimension: "P",
      },
      {
        text: "Lo rechazo. Esa simulación no puede amarme de vuelta. Sin reciprocidad, es un monólogo disfrazado de diálogo.",
        dimension: "V",
      },
      {
        text: "Lo rechazo. El duelo es parte de haber amado. Evitar el dolor sería traicionar lo que significó esa relación.",
        dimension: "S",
      },
    ],
  },
  {
    id: 2,
    situation:
      "Puedes tener el trabajo de tus sueños en una simulación — liderar proyectos, ser reconocido, sentir la satisfacción del logro — o quedarte con tu trabajo real, mediocre pero tangible. ¿Qué eliges?",
    options: [
      {
        text: "Me quedo con lo real. Un logro simulado es una mentira que me cuento a mí mismo.",
        dimension: "A",
      },
      {
        text: "Elijo lo virtual. Si la satisfacción y el aprendizaje se sienten reales, ¿qué más da dónde ocurren?",
        dimension: "P",
      },
      {
        text: "Me quedo con lo real. Prefiero el reconocimiento imperfecto de personas reales que la admiración programada.",
        dimension: "V",
      },
      {
        text: "Me quedo con lo real. La frustración del trabajo mediocre me impulsa a mejorar; sin eso, me estancaría.",
        dimension: "S",
      },
    ],
  },
  {
    id: 3,
    situation:
      "Te ofrecen un avatar virtual: un cuerpo que nunca envejece, nunca se enferma, siempre en su mejor forma. Tu cuerpo real seguirá deteriorándose. ¿Qué eliges?",
    options: [
      {
        text: "Me quedo con mi cuerpo real. Mis cicatrices y arrugas cuentan mi historia.",
        dimension: "A",
      },
      {
        text: "Acepto el avatar. Si puedo vivir sin dolor físico ni limitaciones, ¿por qué no hacerlo?",
        dimension: "P",
      },
      {
        text: "Me quedo con lo real. Quiero que las personas me conozcan como soy, no como una versión idealizada.",
        dimension: "V",
      },
      {
        text: "Me quedo con lo real. Las limitaciones del cuerpo me enseñan disciplina, paciencia y gratitud.",
        dimension: "S",
      },
    ],
  },
  {
    id: 4,
    situation:
      "Puedes tener amigos virtuales diseñados para ser perfectamente compatibles contigo: nunca te traicionan, siempre te entienden, siempre están disponibles. ¿O prefieres tus amistades reales, con sus defectos?",
    options: [
      {
        text: "Me quedo con lo real. Una amistad sin riesgo de decepción no es amistad, es un servicio.",
        dimension: "A",
      },
      {
        text: "Acepto las virtuales. Si me hacen sentir acompañado y comprendido, cumplen la función de una amistad.",
        dimension: "P",
      },
      {
        text: "Me quedo con lo real. Necesito saber que el otro elige estar conmigo, no que está programado para ello.",
        dimension: "V",
      },
      {
        text: "Me quedo con lo real. Los conflictos con amigos me han hecho crecer más que cualquier conversación fácil.",
        dimension: "S",
      },
    ],
  },
  {
    id: 5,
    situation:
      "En la virtualidad puedes crear obras maestras al instante: novelas, sinfonías, pinturas. Sientes la misma euforia creativa. En la realidad, luchas durante meses para terminar algo mediocre. ¿Qué eliges?",
    options: [
      {
        text: "Lo real. Una obra que no costó esfuerzo no es mía. El proceso es parte de la creación.",
        dimension: "A",
      },
      {
        text: "Lo virtual. Si la alegría de crear es la misma, prefiero producir más y disfrutar más.",
        dimension: "P",
      },
      {
        text: "Lo real. Quiero que mi arte conecte con otros desde la imperfección y la humanidad compartida.",
        dimension: "V",
      },
      {
        text: "Lo real. La lucha creativa me define. Cada borrador fallido me enseña algo sobre mí mismo.",
        dimension: "S",
      },
    ],
  },
  {
    id: 6,
    situation:
      "Existe un mundo virtual donde nadie sufre: sin hambre, sin enfermedad, sin violencia, sin pérdida. El mundo real sigue siendo un lugar de dolor inevitable. ¿A cuál te vas?",
    options: [
      {
        text: "Me quedo en la realidad. Un mundo sin sufrimiento es hermoso pero no es verdadero.",
        dimension: "A",
      },
      {
        text: "Me voy al virtual. Si puedo evitar el sufrimiento de todos, sería inmoral no hacerlo.",
        dimension: "P",
      },
      {
        text: "Me quedo en la realidad. Prefiero consolar a alguien real que celebrar con fantasmas digitales.",
        dimension: "V",
      },
      {
        text: "Me quedo en la realidad. El sufrimiento es el precio de una vida con significado. Sin sombras, la luz no se ve.",
        dimension: "S",
      },
    ],
  },
  {
    id: 7,
    situation:
      "Puedes tener hijos virtuales: perfectamente sanos, felices, que te aman incondicionalmente. O tener hijos reales, con la incertidumbre de quiénes serán, cómo sufrirán, si te decepcionarán. ¿Qué eliges?",
    options: [
      {
        text: "Hijos reales. Un hijo que no puede desobedecerme no es un hijo, es un juguete.",
        dimension: "A",
      },
      {
        text: "Hijos virtuales. Si puedo garantizar su felicidad y la mía, ¿por qué arriesgarme con la realidad?",
        dimension: "P",
      },
      {
        text: "Hijos reales. Quiero verlos elegir su propio camino, aunque sea diferente al que imaginé.",
        dimension: "V",
      },
      {
        text: "Hijos reales. Las noches sin dormir, las peleas, los miedos — todo eso es ser padre de verdad.",
        dimension: "S",
      },
    ],
  },
  {
    id: 8,
    situation:
      "En la virtualidad tienes acceso a todo el conocimiento del universo: puedes entender cualquier cosa al instante. En la realidad, vives en la ignorancia relativa, pero cada descubrimiento te emociona. ¿Qué prefieres?",
    options: [
      {
        text: "La realidad. El conocimiento sin el proceso de descubrirlo es información vacía.",
        dimension: "A",
      },
      {
        text: "Lo virtual. Más conocimiento significa mejores decisiones y más capacidad de hacer el bien.",
        dimension: "P",
      },
      {
        text: "La realidad. Prefiero aprender algo de alguien, en conversación, que recibir datos de un servidor.",
        dimension: "V",
      },
      {
        text: "La realidad. La emoción de descubrir algo después de años de búsqueda no tiene precio.",
        dimension: "S",
      },
    ],
  },
  {
    id: 9,
    situation:
      "Puedes vivir en una sociedad virtual utópica: justicia perfecta, igualdad total, cero corrupción. O quedarte en la sociedad real, con todas sus injusticias pero también con la posibilidad de cambiarla. ¿Qué eliges?",
    options: [
      {
        text: "La realidad. Una justicia que nadie construyó no es justicia, es decorado.",
        dimension: "A",
      },
      {
        text: "Lo virtual. Si el resultado es un mundo justo, el origen importa menos que el efecto.",
        dimension: "P",
      },
      {
        text: "La realidad. Prefiero luchar junto a otros por un mundo mejor que habitar uno perfecto solo.",
        dimension: "V",
      },
      {
        text: "La realidad. La lucha contra la injusticia es lo que da sentido a la vida en sociedad.",
        dimension: "S",
      },
    ],
  },
  {
    id: 10,
    situation:
      "Última oferta: inmersión total y permanente en una virtualidad perfecta. Todo lo que siempre quisiste, para siempre. Tu cuerpo real se mantiene con vida artificialmente. ¿Aceptas?",
    options: [
      {
        text: "No acepto. Prefiero una vida real imperfecta a una eternidad de ilusiones perfectas.",
        dimension: "A",
      },
      {
        text: "Acepto. Si la experiencia subjetiva es todo lo que tenemos, elegiría la mejor versión posible.",
        dimension: "P",
      },
      {
        text: "No acepto. No puedo abandonar a las personas reales que me necesitan y a quienes necesito.",
        dimension: "V",
      },
      {
        text: "No acepto. Una vida sin obstáculos no es vida. Necesito la posibilidad de fracasar para que el éxito signifique algo.",
        dimension: "S",
      },
    ],
  },
];

export const characters: Character[] = [
  {
    name: "Aristóteles",
    dimensions: ["A"],
    photo: "/characters/aristoteles.jpg",
    description: "Defensor de la vida auténtica y la virtud practicada en el mundo real.",
    philosophy:
      "Para ti, la buena vida requiere autenticidad. No basta con sentir placer — necesitas saber que tus experiencias son genuinas. Como Aristóteles, crees que la eudaimonía solo se alcanza viviendo según la virtud en el mundo real, no en simulaciones.",
  },
  {
    name: "Epicuro",
    dimensions: ["P"],
    photo: "/characters/epicuro.jpg",
    description: "Filósofo del placer que evalúa la experiencia por su calidad, no su origen.",
    philosophy:
      "Para ti, lo que importa es la calidad de la experiencia. Si una simulación produce bienestar genuino, su origen artificial es irrelevante. Como Epicuro, crees que el sumo bien es el placer tranquilo, y no discriminas su fuente.",
  },
  {
    name: "Martin Buber",
    dimensions: ["V"],
    photo: "/characters/buber.jpg",
    description: "Filósofo del diálogo que prioriza las conexiones humanas genuinas.",
    philosophy:
      "Para ti, el significado de la vida emerge del encuentro genuino con el otro. Ninguna simulación puede replicar la relación Yo-Tú. Como Buber, crees que sin reciprocidad real, toda experiencia es un monólogo vacío.",
  },
  {
    name: "Viktor Frankl",
    dimensions: ["S"],
    photo: "/characters/frankl.jpg",
    description: "Psiquiatra que encontró sentido en el sufrimiento y la adversidad.",
    philosophy:
      "Para ti, el sufrimiento no es un error a corregir sino un camino hacia el sentido. Evitar toda adversidad vaciaría la vida de propósito. Como Frankl, crees que quien tiene un 'por qué' puede soportar cualquier 'cómo'.",
  },
  {
    name: "Albert Camus",
    dimensions: ["A", "S"],
    photo: "/characters/camus.jpg",
    description: "Rebelde que abraza lo absurdo de la realidad con autenticidad radical.",
    philosophy:
      "Para ti, hay que imaginar a Sísifo feliz. La vida es absurda y difícil, pero enfrentarla con honestidad es el único acto de rebeldía que vale. Como Camus, rechazas los paraísos artificiales porque la lucha misma basta para llenar un corazón.",
  },
  {
    name: "John Stuart Mill",
    dimensions: ["P", "V"],
    photo: "/characters/mill.jpg",
    description: "Utilitarista que calcula el bienestar considerando los vínculos sociales.",
    philosophy:
      "Para ti, el bienestar se mide en sus efectos sobre las personas reales. Aceptas la tecnología cuando mejora vidas, pero nunca a costa de los vínculos genuinos. Como Mill, distingues entre placeres superiores e inferiores según su impacto social.",
  },
  {
    name: "Simone de Beauvoir",
    dimensions: ["V", "S"],
    photo: "/characters/beauvoir.jpg",
    description: "Existencialista que une la lucha personal con la conexión auténtica.",
    philosophy:
      "Para ti, existir es comprometerse con otros en la lucha compartida. La libertad no se disfruta sola ni sin esfuerzo. Como Beauvoir, crees que la existencia auténtica requiere tanto vínculos genuinos como la voluntad de enfrentar la adversidad.",
  },
  {
    name: "Robert Nozick",
    dimensions: ["A", "P"],
    photo: "/characters/nozick.jpg",
    description: "Creador de la Máquina de Experiencias que eligió la realidad con pragmatismo.",
    philosophy:
      "Para ti, la realidad importa, pero no eres dogmático. Valoras lo auténtico y al mismo tiempo reconoces el peso del bienestar. Como Nozick, inventaste el dilema y concluiste que sí, preferimos la realidad — pero entiendes por qué alguien elegiría la máquina.",
  },
];

export interface QuizResult {
  character: Character;
  scores: Record<Dimension, number>;
}

export function calculateResult(answers: Record<number, Dimension>): QuizResult {
  const scores: Record<Dimension, number> = { A: 0, P: 0, V: 0, S: 0 };

  for (const dimension of Object.values(answers)) {
    scores[dimension]++;
  }

  // Sort dimensions by score descending
  const sorted = (Object.entries(scores) as [Dimension, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  const top = sorted[0][0];
  const second = sorted[1][0];

  // If there's a clear dominant (3+ points ahead of second), use single-dimension character
  // Otherwise use the two-dimension combo
  const gap = sorted[0][1] - sorted[1][1];

  let match: Character | undefined;

  if (gap >= 3) {
    match = characters.find(
      (c) => c.dimensions.length === 1 && c.dimensions[0] === top
    );
  }

  if (!match) {
    // Look for combo match (order-independent)
    match = characters.find(
      (c) =>
        c.dimensions.length === 2 &&
        c.dimensions.includes(top) &&
        c.dimensions.includes(second)
    );
  }

  // Fallback to single-dimension character
  if (!match) {
    match = characters.find(
      (c) => c.dimensions.length === 1 && c.dimensions[0] === top
    )!;
  }

  return { character: match, scores };
}
