-- Convert Quiz text columns from VARCHAR/TEXT to JSONB keyed by 'es'
ALTER TABLE "Quiz"
  ALTER COLUMN "title" TYPE JSONB USING jsonb_build_object('es', title),
  ALTER COLUMN "description" TYPE JSONB USING jsonb_build_object('es', description),
  ALTER COLUMN "scenario_label" TYPE JSONB USING jsonb_build_object('es', scenario_label);

-- Convert QuizCategory text columns from VARCHAR/TEXT to JSONB keyed by 'es'
ALTER TABLE "QuizCategory"
  ALTER COLUMN "label" TYPE JSONB USING jsonb_build_object('es', label),
  ALTER COLUMN "description" TYPE JSONB USING jsonb_build_object('es', description);
