ALTER TABLE "competition" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "competition" ALTER COLUMN "updated_at" SET NOT NULL;