ALTER TABLE "competition" ALTER COLUMN "sheet_entries" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "competition" ALTER COLUMN "twos_entered" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "competition" ALTER COLUMN "player_count" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "player" ADD COLUMN "handicap_index" integer;