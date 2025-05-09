CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
