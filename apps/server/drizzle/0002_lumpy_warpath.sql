ALTER TABLE "competition" ALTER COLUMN "player_count" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "competition" drop column "player_count";--> statement-breakpoint
ALTER TABLE "competition" ADD COLUMN "player_count" integer GENERATED ALWAYS AS ("competition"."computer_entries") STORED;