ALTER TABLE "competition" ALTER COLUMN "twos_entered" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "competition" drop column "twos_entered";--> statement-breakpoint
ALTER TABLE "competition" ADD COLUMN "twos_entered" integer GENERATED ALWAYS AS ("competition"."computer_entries") STORED;