ALTER TABLE "two" RENAME COLUMN "player_id" TO "member_id";--> statement-breakpoint
ALTER TABLE "two" DROP CONSTRAINT "two_player_id_player_id_fk";
--> statement-breakpoint
ALTER TABLE "two" ADD COLUMN "competition_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "two" ADD CONSTRAINT "two_competition_id_competition_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competition"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "two" ADD CONSTRAINT "two_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "twos_comp_idx" ON "two" USING btree ("competition_id");--> statement-breakpoint
CREATE INDEX "twos_player_idx" ON "two" USING btree ("member_id");--> statement-breakpoint
ALTER TABLE "two" ADD CONSTRAINT "no_duplicate_twos" UNIQUE("competition_id","member_id","hole");