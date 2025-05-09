CREATE TABLE "competition" (
	"id" serial PRIMARY KEY NOT NULL,
	"comp_date" date DEFAULT now() NOT NULL,
	"entry_fee" integer DEFAULT 2 NOT NULL,
	"comp_form_id" integer NOT NULL,
	"computer_entries" integer NOT NULL,
	"sheet_entries" integer GENERATED ALWAYS AS ("competition"."computer_entries") STORED,
	"twos_entered" integer NOT NULL,
	"player_count" integer NOT NULL,
	"created_at" timestamp (2) DEFAULT now() NOT NULL,
	"updated_at" timestamp (2),
	CONSTRAINT "twos_entry_check" CHECK ("competition"."twos_entered" <= "competition"."sheet_entries")
);
--> statement-breakpoint
CREATE TABLE "comp_form" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(120) NOT NULL,
	"team_size" integer[] DEFAULT '{1}'::integer[] NOT NULL,
	"is_medal" boolean DEFAULT true NOT NULL,
	"is_stableford" boolean DEFAULT false NOT NULL,
	"is_scramble" boolean DEFAULT false NOT NULL,
	"is_major" boolean DEFAULT false NOT NULL,
	"created_at" timestamp (2) DEFAULT now() NOT NULL,
	"updated_at" timestamp (2),
	CONSTRAINT "not_both_formats" CHECK ("comp_form"."is_medal" <> "comp_form"."is_stableford")
);
--> statement-breakpoint
CREATE TABLE "comp_form_to_tee" (
	"comp_form_id" integer NOT NULL,
	"tee_id" integer NOT NULL,
	CONSTRAINT "comp_form_to_tee_pk" PRIMARY KEY("comp_form_id","tee_id")
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" serial PRIMARY KEY NOT NULL,
	"surname" varchar(64) NOT NULL,
	"fore_name" varchar(64) NOT NULL,
	"created_at" timestamp (2) DEFAULT now(),
	"updated_at" timestamp (2)
);
--> statement-breakpoint
CREATE TABLE "player" (
	"id" serial PRIMARY KEY NOT NULL,
	"competition_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	"handicap" integer NOT NULL,
	"division" integer NOT NULL,
	"signed_in" boolean DEFAULT true NOT NULL,
	"in_twos" boolean DEFAULT false NOT NULL,
	"two_holes" integer[] DEFAULT '{}'::integer[],
	"position" integer NOT NULL,
	"team_no" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tee" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"mens" boolean DEFAULT true,
	"ladies" boolean DEFAULT false,
	"created_at" timestamp (2) DEFAULT now() NOT NULL,
	"updated_at" timestamp (2),
	CONSTRAINT "tee_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "competition" ADD CONSTRAINT "competition_comp_form_id_comp_form_id_fk" FOREIGN KEY ("comp_form_id") REFERENCES "public"."comp_form"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comp_form_to_tee" ADD CONSTRAINT "comp_form_to_tee_comp_form_id_comp_form_id_fk" FOREIGN KEY ("comp_form_id") REFERENCES "public"."comp_form"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comp_form_to_tee" ADD CONSTRAINT "comp_form_to_tee_tee_id_tee_id_fk" FOREIGN KEY ("tee_id") REFERENCES "public"."tee"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player" ADD CONSTRAINT "player_competition_id_competition_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competition"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player" ADD CONSTRAINT "player_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "comp_format_and_date_idx" ON "competition" USING btree ("comp_form_id","comp_date");--> statement-breakpoint
CREATE UNIQUE INDEX "member_name_idx" ON "member" USING btree ("surname","fore_name");