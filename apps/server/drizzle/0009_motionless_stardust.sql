CREATE TABLE "two" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer NOT NULL,
	"hole" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "two" ADD CONSTRAINT "two_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;