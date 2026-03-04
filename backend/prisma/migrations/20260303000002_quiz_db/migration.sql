-- CreateTable QuizCategory
CREATE TABLE "QuizCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" VARCHAR(32) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizCategory_slug_key" ON "QuizCategory"("slug");

-- CreateTable Quiz
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scenario_label" VARCHAR(32) NOT NULL,
    "category_id" TEXT NOT NULL,
    "dimension_labels" JSONB NOT NULL,
    "questions" JSONB NOT NULL,
    "characters" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_slug_key" ON "Quiz"("slug");

-- CreateIndex
CREATE INDEX "Quiz_category_id_idx" ON "Quiz"("category_id");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_category_id_fkey"
    FOREIGN KEY ("category_id") REFERENCES "QuizCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed initial categories (minimal set needed for FK migration)
INSERT INTO "QuizCategory" ("id", "slug", "label", "description", "icon", "sort_order") VALUES
    ('cat_dark',  'dark-personality', 'Personalidad Oscura',     'Descubre tu lado más oscuro',           'Skull',    1),
    ('cat_social','social',           'Social y Relaciones',      'Cómo te relacionas con el mundo',       'Users',    2),
    ('cat_moral', 'moral',            'Moral y Controversia',     'Tus dilemas y contradicciones',         'Scale',    3),
    ('cat_life',  'life',             'Vida y Ambición',          'Lo que te mueve y define',              'Target',   4),
    ('cat_pop',   'pop-culture',      'Cultura Pop y Diversión',  'Diversión pura entre amigos',           'Gamepad2', 5),
    ('cat_rel',   'relationships',    'Amor y Pareja',            'Tu lado romántico al descubierto',      'Heart',    6);

-- Seed ethics quiz (needed to migrate existing sessions)
INSERT INTO "Quiz" ("id", "slug", "title", "description", "scenario_label", "category_id", "dimension_labels", "questions", "characters", "is_active", "sort_order", "updated_at") VALUES (
  'quiz_ethics',
  'ethics',
  'Dilemas Éticos',
  '10 situaciones éticas complejas que revelarán cómo piensas. Al final, descubre qué personaje histórico comparte tu filosofía de vida.',
  'Dilema',
  'cat_moral',
  '{"P":"Pragmatismo","I":"Idealismo","E":"Empatía","R":"Rebeldía"}'::jsonb,
  $questions$[
    {"id":1,"situation":"Un tren descontrolado se dirige hacia cinco personas atadas a las vías. Puedes desviar el tren a otra vía donde solo hay una persona. ¿Qué haces?","options":[{"text":"Desvío el tren. Salvar cinco vidas a costa de una es la decisión más lógica.","dimension":"P"},{"text":"No intervengo. No tengo derecho a decidir quién vive y quién muere.","dimension":"I"},{"text":"Intento advertir a todos gritando, aunque sea poco probable que funcione.","dimension":"E"},{"text":"Busco una tercera opción: sabotear el tren, bloquear las vías, lo que sea necesario.","dimension":"R"}]},
    {"id":2,"situation":"Descubres que tu mejor amigo, que es funcionario público, está desviando fondos. Nadie más lo sabe. ¿Qué haces?","options":[{"text":"Lo denuncio anónimamente. El daño público es mayor que nuestra amistad.","dimension":"P"},{"text":"Lo denuncio abiertamente. La corrupción debe enfrentarse sin importar quién sea.","dimension":"I"},{"text":"Hablo primero con él en privado para entender su situación y darle la oportunidad de corregirlo.","dimension":"E"},{"text":"Filtro la información a la prensa para que el sistema rinda cuentas.","dimension":"R"}]},
    {"id":3,"situation":"Tu pareja necesita un medicamento que cuesta una fortuna y no pueden pagarlo. La farmacia se niega a hacer excepciones. ¿Qué haces?","options":[{"text":"Negocio agresivamente: busco genéricos, programas de ayuda, crowdfunding. Hay que ser estratégico.","dimension":"P"},{"text":"Jamás robaría. Busco todas las vías legales posibles aunque tome más tiempo.","dimension":"I"},{"text":"Robo el medicamento sin dudarlo. La vida de mi pareja vale más que cualquier ley.","dimension":"E"},{"text":"Organizo una protesta pública contra el precio abusivo del medicamento.","dimension":"R"}]},
    {"id":4,"situation":"Durante la guerra, escondes a una familia perseguida en tu casa. Soldados tocan tu puerta y preguntan si hay alguien escondido. ¿Qué haces?","options":[{"text":"Miento sin dudarlo. Es la única forma realista de protegerlos.","dimension":"P"},{"text":"Me niego a responder. No puedo mentir, pero tampoco voy a delatarlos.","dimension":"I"},{"text":"Miento y además los invito a pasar café para ganar su confianza y alejar sospechas.","dimension":"E"},{"text":"Los enfrento directamente: 'Aunque los tuviera, no se los entregaría.'","dimension":"R"}]},
    {"id":5,"situation":"Te ofrecen un trabajo increíblemente bien pagado en una empresa que contamina ríos en comunidades pobres. ¿Qué haces?","options":[{"text":"Acepto el trabajo y uso mi posición interna para impulsar cambios graduales.","dimension":"P"},{"text":"Lo rechazo. No puedo ser cómplice de algo que viola mis principios.","dimension":"I"},{"text":"Lo rechazo y además busco formas de ayudar a las comunidades afectadas.","dimension":"E"},{"text":"Acepto, recopilo evidencia desde dentro y luego la hago pública.","dimension":"R"}]},
    {"id":6,"situation":"Descubres que tu padre tiene una segunda familia secreta. Tu madre no sabe nada. La verdad destruiría a tu familia, pero el secreto te consume. ¿Qué haces?","options":[{"text":"Confronto a mi padre en privado y le doy un plazo para resolver la situación.","dimension":"P"},{"text":"Le digo la verdad a mi madre. Tiene derecho a saber, pase lo que pase.","dimension":"I"},{"text":"Busco apoyo profesional primero. Necesito entender cómo minimizar el daño emocional para todos.","dimension":"E"},{"text":"Enfrento a mi padre públicamente en una reunión familiar. Se acabaron los secretos.","dimension":"R"}]},
    {"id":7,"situation":"Vives en un país donde una nueva ley prohíbe dar comida a personas sin hogar en espacios públicos. ¿Qué haces?","options":[{"text":"Busco vacíos legales: reparto comida en propiedad privada o creo un comedor social.","dimension":"P"},{"text":"Desobedezco la ley abiertamente. Una ley injusta no merece obediencia.","dimension":"I"},{"text":"Sigo ayudando discretamente y además conecto a estas personas con servicios sociales.","dimension":"E"},{"text":"Organizo desobediencia civil masiva para presionar y cambiar la ley.","dimension":"R"}]},
    {"id":8,"situation":"Alguien que te hizo mucho daño en el pasado ahora está pasando por una crisis terrible y te pide ayuda. ¿Qué haces?","options":[{"text":"Lo ayudo, pero establezco límites claros. No olvido, pero soy práctico.","dimension":"P"},{"text":"Lo ayudo porque es lo correcto, independientemente de lo que me haya hecho.","dimension":"I"},{"text":"Lo ayudo de corazón. El sufrimiento de cualquier persona me conmueve.","dimension":"E"},{"text":"No lo ayudo. Las acciones tienen consecuencias y debe enfrentarlas.","dimension":"R"}]},
    {"id":9,"situation":"Eres un científico que descubre que tu empresa farmacéutica ocultó efectos secundarios graves de un medicamento popular. Denunciar destruiría tu carrera. ¿Qué haces?","options":[{"text":"Documento todo meticulosamente y busco un abogado antes de hacer cualquier movimiento.","dimension":"P"},{"text":"Denuncio inmediatamente ante las autoridades. La salud pública no puede esperar.","dimension":"I"},{"text":"Pienso en los pacientes afectados y sus familias. Denuncio, pero también busco cómo apoyarlos.","dimension":"E"},{"text":"Filtro toda la información a medios independientes para que la empresa no pueda silenciarlo.","dimension":"R"}]},
    {"id":10,"situation":"Un hospital propone usar IA para decidir qué pacientes reciben tratamiento prioritario cuando los recursos son limitados. ¿Qué opinas?","options":[{"text":"A favor, si los datos son buenos. La IA puede ser más objetiva y eficiente que los humanos.","dimension":"P"},{"text":"En contra. Decisiones de vida o muerte deben ser tomadas por personas con criterio moral.","dimension":"I"},{"text":"Solo si se garantiza que la IA considera factores humanos y no solo estadísticas frías.","dimension":"E"},{"text":"En contra. Es peligroso ceder poder de decisión sobre vidas a sistemas que no podemos cuestionar.","dimension":"R"}]}
  ]$questions$::jsonb,
  $characters$[
    {"name":"Winston Churchill","dimensions":["P"],"photo":"/characters/churchill.jpg","description":"Pragmático implacable que toma decisiones difíciles por el bien mayor.","philosophy":"Ves el mundo como es, no como quisieras que fuera. Tomas decisiones difíciles cuando otros dudan, priorizando resultados sobre sentimientos. Tu fortaleza está en la claridad estratégica."},
    {"name":"Mahatma Gandhi","dimensions":["I"],"photo":"/characters/gandhi.jpg","description":"Idealista que no transige en principios sin importar las consecuencias.","philosophy":"Tus principios no son negociables. Crees que el fin nunca justifica los medios y que la coherencia moral es la mayor fortaleza. Inspiras a otros con tu integridad inquebrantable."},
    {"name":"Princesa Diana","dimensions":["E"],"photo":"/characters/diana.jpg","description":"Guiada por la compasión y la conexión humana ante todo.","philosophy":"Sientes profundamente el dolor ajeno y actúas desde el corazón. Tu brújula moral es la empatía, y crees que el mundo cambia una persona a la vez, a través de la conexión humana genuina."},
    {"name":"Che Guevara","dimensions":["R"],"photo":"/characters/che.jpg","description":"Rebelde que desafía el sistema cuando lo considera injusto.","philosophy":"No aceptas el status quo cuando es injusto. Prefieres la acción directa sobre la diplomacia, y crees que el cambio real requiere valentía para enfrentar al sistema de frente."},
    {"name":"Nelson Mandela","dimensions":["P","I"],"photo":"/characters/mandela.jpg","description":"Combina visión pragmática con principios inquebrantables.","philosophy":"Sabes cuándo ser firme y cuándo ser flexible. Combinas la estrategia con la integridad, entendiendo que los grandes cambios requieren tanto paciencia como convicción."},
    {"name":"Oprah Winfrey","dimensions":["P","E"],"photo":"/characters/oprah.jpg","description":"Pragmática pero siempre centrada en las personas.","philosophy":"Eres efectivo/a y estratégico/a, pero nunca pierdes de vista a las personas. Crees que el éxito real viene de combinar inteligencia práctica con genuino interés por el bienestar de otros."},
    {"name":"Martin Luther King Jr.","dimensions":["I","R"],"photo":"/characters/mlk.jpg","description":"Idealista que desafía lo establecido de forma pacífica.","philosophy":"Crees en un mundo mejor y estás dispuesto/a a luchar por él, pero desde los principios. Desafías la injusticia no con violencia, sino con la fuerza moral de tus convicciones."},
    {"name":"Frida Kahlo","dimensions":["E","R"],"photo":"/characters/frida.jpg","description":"Empática y auténtica, rompe moldes desde la vulnerabilidad.","philosophy":"Tu sensibilidad es tu superpoder. Sientes profundamente y no temes mostrarlo, desafiando las normas desde la autenticidad. Crees que la vulnerabilidad es una forma de rebeldía."}
  ]$characters$::jsonb,
  true,
  1,
  CURRENT_TIMESTAMP
);

-- Seed virtual quiz (needed to migrate existing sessions)
INSERT INTO "Quiz" ("id", "slug", "title", "description", "scenario_label", "category_id", "dimension_labels", "questions", "characters", "is_active", "sort_order", "updated_at") VALUES (
  'quiz_virtual',
  'virtual',
  '¿Realidad o Virtualidad?',
  '10 escenarios donde la realidad virtual ofrece alternativas tentadoras. Descubre qué valoras más y dónde está tu punto de inflexión entre lo real y lo virtual.',
  'Escenario',
  'cat_pop',
  '{"A":"Autenticidad","P":"Placer","V":"Vínculo","S":"Sentido"}'::jsonb,
  $vquestions$[
    {"id":1,"situation":"Tu pareja falleció hace un año. Una empresa ofrece una simulación perfecta: su voz, sus gestos, sus recuerdos compartidos. Puedes cenar con ella cada noche. ¿Qué haces?","options":[{"text":"Lo rechazo. Por más perfecta que sea la copia, no es ella. Prefiero el dolor real al consuelo artificial.","dimension":"A"},{"text":"Lo acepto sin dudarlo. Si la experiencia es indistinguible, el bienestar que me da es real.","dimension":"P"},{"text":"Lo rechazo. Esa simulación no puede amarme de vuelta. Sin reciprocidad, es un monólogo disfrazado de diálogo.","dimension":"V"},{"text":"Lo rechazo. El duelo es parte de haber amado. Evitar el dolor sería traicionar lo que significó esa relación.","dimension":"S"}]},
    {"id":2,"situation":"Puedes tener el trabajo de tus sueños en una simulación — liderar proyectos, ser reconocido, sentir la satisfacción del logro — o quedarte con tu trabajo real, mediocre pero tangible. ¿Qué eliges?","options":[{"text":"Me quedo con lo real. Un logro simulado es una mentira que me cuento a mí mismo.","dimension":"A"},{"text":"Elijo lo virtual. Si la satisfacción y el aprendizaje se sienten reales, ¿qué más da dónde ocurren?","dimension":"P"},{"text":"Me quedo con lo real. Prefiero el reconocimiento imperfecto de personas reales que la admiración programada.","dimension":"V"},{"text":"Me quedo con lo real. La frustración del trabajo mediocre me impulsa a mejorar; sin eso, me estancaría.","dimension":"S"}]},
    {"id":3,"situation":"Te ofrecen un avatar virtual: un cuerpo que nunca envejece, nunca se enferma, siempre en su mejor forma. Tu cuerpo real seguirá deteriorándose. ¿Qué eliges?","options":[{"text":"Me quedo con mi cuerpo real. Mis cicatrices y arrugas cuentan mi historia.","dimension":"A"},{"text":"Acepto el avatar. Si puedo vivir sin dolor físico ni limitaciones, ¿por qué no hacerlo?","dimension":"P"},{"text":"Me quedo con lo real. Quiero que las personas me conozcan como soy, no como una versión idealizada.","dimension":"V"},{"text":"Me quedo con lo real. Las limitaciones del cuerpo me enseñan disciplina, paciencia y gratitud.","dimension":"S"}]},
    {"id":4,"situation":"Puedes tener amigos virtuales diseñados para ser perfectamente compatibles contigo: nunca te traicionan, siempre te entienden, siempre están disponibles. ¿O prefieres tus amistades reales, con sus defectos?","options":[{"text":"Me quedo con lo real. Una amistad sin riesgo de decepción no es amistad, es un servicio.","dimension":"A"},{"text":"Acepto las virtuales. Si me hacen sentir acompañado y comprendido, cumplen la función de una amistad.","dimension":"P"},{"text":"Me quedo con lo real. Necesito saber que el otro elige estar conmigo, no que está programado para ello.","dimension":"V"},{"text":"Me quedo con lo real. Los conflictos con amigos me han hecho crecer más que cualquier conversación fácil.","dimension":"S"}]},
    {"id":5,"situation":"En la virtualidad puedes crear obras maestras al instante: novelas, sinfonías, pinturas. Sientes la misma euforia creativa. En la realidad, luchas durante meses para terminar algo mediocre. ¿Qué eliges?","options":[{"text":"Lo real. Una obra que no costó esfuerzo no es mía. El proceso es parte de la creación.","dimension":"A"},{"text":"Lo virtual. Si la alegría de crear es la misma, prefiero producir más y disfrutar más.","dimension":"P"},{"text":"Lo real. Quiero que mi arte conecte con otros desde la imperfección y la humanidad compartida.","dimension":"V"},{"text":"Lo real. La lucha creativa me define. Cada borrador fallido me enseña algo sobre mí mismo.","dimension":"S"}]},
    {"id":6,"situation":"Existe un mundo virtual donde nadie sufre: sin hambre, sin enfermedad, sin violencia, sin pérdida. El mundo real sigue siendo un lugar de dolor inevitable. ¿A cuál te vas?","options":[{"text":"Me quedo en la realidad. Un mundo sin sufrimiento es hermoso pero no es verdadero.","dimension":"A"},{"text":"Me voy al virtual. Si puedo evitar el sufrimiento de todos, sería inmoral no hacerlo.","dimension":"P"},{"text":"Me quedo en la realidad. Prefiero consolar a alguien real que celebrar con fantasmas digitales.","dimension":"V"},{"text":"Me quedo en la realidad. El sufrimiento es el precio de una vida con significado. Sin sombras, la luz no se ve.","dimension":"S"}]},
    {"id":7,"situation":"Puedes tener hijos virtuales: perfectamente sanos, felices, que te aman incondicionalmente. O tener hijos reales, con la incertidumbre de quiénes serán, cómo sufrirán, si te decepcionarán. ¿Qué eliges?","options":[{"text":"Hijos reales. Un hijo que no puede desobedecerme no es un hijo, es un juguete.","dimension":"A"},{"text":"Hijos virtuales. Si puedo garantizar su felicidad y la mía, ¿por qué arriesgarme con la realidad?","dimension":"P"},{"text":"Hijos reales. Quiero verlos elegir su propio camino, aunque sea diferente al que imaginé.","dimension":"V"},{"text":"Hijos reales. Las noches sin dormir, las peleas, los miedos — todo eso es ser padre de verdad.","dimension":"S"}]},
    {"id":8,"situation":"En la virtualidad tienes acceso a todo el conocimiento del universo: puedes entender cualquier cosa al instante. En la realidad, vives en la ignorancia relativa, pero cada descubrimiento te emociona. ¿Qué prefieres?","options":[{"text":"La realidad. El conocimiento sin el proceso de descubrirlo es información vacía.","dimension":"A"},{"text":"Lo virtual. Más conocimiento significa mejores decisiones y más capacidad de hacer el bien.","dimension":"P"},{"text":"La realidad. Prefiero aprender algo de alguien, en conversación, que recibir datos de un servidor.","dimension":"V"},{"text":"La realidad. La emoción de descubrir algo después de años de búsqueda no tiene precio.","dimension":"S"}]},
    {"id":9,"situation":"Puedes vivir en una sociedad virtual utópica: justicia perfecta, igualdad total, cero corrupción. O quedarte en la sociedad real, con todas sus injusticias pero también con la posibilidad de cambiarla. ¿Qué eliges?","options":[{"text":"La realidad. Una justicia que nadie construyó no es justicia, es decorado.","dimension":"A"},{"text":"Lo virtual. Si el resultado es un mundo justo, el origen importa menos que el efecto.","dimension":"P"},{"text":"La realidad. Prefiero luchar junto a otros por un mundo mejor que habitar uno perfecto solo.","dimension":"V"},{"text":"La realidad. La lucha contra la injusticia es lo que da sentido a la vida en sociedad.","dimension":"S"}]},
    {"id":10,"situation":"Última oferta: inmersión total y permanente en una virtualidad perfecta. Todo lo que siempre quisiste, para siempre. Tu cuerpo real se mantiene con vida artificialmente. ¿Aceptas?","options":[{"text":"No acepto. Prefiero una vida real imperfecta a una eternidad de ilusiones perfectas.","dimension":"A"},{"text":"Acepto. Si la experiencia subjetiva es todo lo que tenemos, elegiría la mejor versión posible.","dimension":"P"},{"text":"No acepto. No puedo abandonar a las personas reales que me necesitan y a quienes necesito.","dimension":"V"},{"text":"No acepto. Una vida sin obstáculos no es vida. Necesito la posibilidad de fracasar para que el éxito signifique algo.","dimension":"S"}]}
  ]$vquestions$::jsonb,
  $vcharacters$[
    {"name":"Aristóteles","dimensions":["A"],"photo":"/characters/aristoteles.jpg","description":"Defensor de la vida auténtica y la virtud practicada en el mundo real.","philosophy":"Para ti, la buena vida requiere autenticidad. No basta con sentir placer — necesitas saber que tus experiencias son genuinas. Como Aristóteles, crees que la eudaimonía solo se alcanza viviendo según la virtud en el mundo real, no en simulaciones."},
    {"name":"Epicuro","dimensions":["P"],"photo":"/characters/epicuro.jpg","description":"Filósofo del placer que evalúa la experiencia por su calidad, no su origen.","philosophy":"Para ti, lo que importa es la calidad de la experiencia. Si una simulación produce bienestar genuino, su origen artificial es irrelevante. Como Epicuro, crees que el sumo bien es el placer tranquilo, y no discriminas su fuente."},
    {"name":"Martin Buber","dimensions":["V"],"photo":"/characters/buber.jpg","description":"Filósofo del diálogo que prioriza las conexiones humanas genuinas.","philosophy":"Para ti, el significado de la vida emerge del encuentro genuino con el otro. Ninguna simulación puede replicar la relación Yo-Tú. Como Buber, crees que sin reciprocidad real, toda experiencia es un monólogo vacío."},
    {"name":"Viktor Frankl","dimensions":["S"],"photo":"/characters/frankl.jpg","description":"Psiquiatra que encontró sentido en el sufrimiento y la adversidad.","philosophy":"Para ti, el sufrimiento no es un error a corregir sino un camino hacia el sentido. Evitar toda adversidad vaciaría la vida de propósito. Como Frankl, crees que quien tiene un 'por qué' puede soportar cualquier 'cómo'."},
    {"name":"Albert Camus","dimensions":["A","S"],"photo":"/characters/camus.jpg","description":"Rebelde que abraza lo absurdo de la realidad con autenticidad radical.","philosophy":"Para ti, hay que imaginar a Sísifo feliz. La vida es absurda y difícil, pero enfrentarla con honestidad es el único acto de rebeldía que vale. Como Camus, rechazas los paraísos artificiales porque la lucha misma basta para llenar un corazón."},
    {"name":"John Stuart Mill","dimensions":["P","V"],"photo":"/characters/mill.jpg","description":"Utilitarista que calcula el bienestar considerando los vínculos sociales.","philosophy":"Para ti, el bienestar se mide en sus efectos sobre las personas reales. Aceptas la tecnología cuando mejora vidas, pero nunca a costa de los vínculos genuinos. Como Mill, distingues entre placeres superiores e inferiores según su impacto social."},
    {"name":"Simone de Beauvoir","dimensions":["V","S"],"photo":"/characters/beauvoir.jpg","description":"Existencialista que une la lucha personal con la conexión auténtica.","philosophy":"Para ti, existir es comprometerse con otros en la lucha compartida. La libertad no se disfruta sola ni sin esfuerzo. Como Beauvoir, crees que la existencia auténtica requiere tanto vínculos genuinos como la voluntad de enfrentar la adversidad."},
    {"name":"Robert Nozick","dimensions":["A","P"],"photo":"/characters/nozick.jpg","description":"Creador de la Máquina de Experiencias que eligió la realidad con pragmatismo.","philosophy":"Para ti, la realidad importa, pero no eres dogmático. Valoras lo auténtico y al mismo tiempo reconoces el peso del bienestar. Como Nozick, inventaste el dilema y concluiste que sí, preferimos la realidad — pero entiendes por qué alguien elegiría la máquina."}
  ]$vcharacters$::jsonb,
  true,
  2,
  CURRENT_TIMESTAMP
);

-- Add quiz_id column to Session (nullable initially for migration)
ALTER TABLE "Session" ADD COLUMN "quiz_id" TEXT;

-- Populate quiz_id from quiz_slug
UPDATE "Session" s
SET "quiz_id" = q."id"
FROM "Quiz" q
WHERE q."slug" = s."quiz_slug";

-- Default any unmatched sessions to ethics quiz
UPDATE "Session"
SET "quiz_id" = 'quiz_ethics'
WHERE "quiz_id" IS NULL;

-- Make quiz_id NOT NULL
ALTER TABLE "Session" ALTER COLUMN "quiz_id" SET NOT NULL;

-- Add FK constraint
ALTER TABLE "Session" ADD CONSTRAINT "Session_quiz_id_fkey"
    FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create index
CREATE INDEX "Session_quiz_id_idx" ON "Session"("quiz_id");

-- Drop old quiz_slug column
ALTER TABLE "Session" DROP COLUMN "quiz_slug";

-- Add scores JSON column to Participant
ALTER TABLE "Participant" ADD COLUMN "scores" JSONB;

-- Populate scores from actual answers (recalculate from answer table — correct for all quizzes)
UPDATE "Participant" p
SET "scores" = (
    SELECT jsonb_object_agg(a.dimension, a.cnt)
    FROM (
        SELECT dimension, COUNT(*)::int AS cnt
        FROM "Answer"
        WHERE participant_id = p.id
        GROUP BY dimension
    ) a
)
WHERE p.completed = true;

-- Drop old hardcoded score columns
ALTER TABLE "Participant" DROP COLUMN IF EXISTS "score_p";
ALTER TABLE "Participant" DROP COLUMN IF EXISTS "score_i";
ALTER TABLE "Participant" DROP COLUMN IF EXISTS "score_e";
ALTER TABLE "Participant" DROP COLUMN IF EXISTS "score_r";
