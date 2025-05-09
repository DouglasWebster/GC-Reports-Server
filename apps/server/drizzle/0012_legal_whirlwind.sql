ALTER TABLE "two" DROP CONSTRAINT "hole_number_above_0";--> statement-breakpoint
ALTER TABLE "two" DROP CONSTRAINT "hole_number_below_19";--> statement-breakpoint
ALTER TABLE "two" ADD CONSTRAINT "hole_check1" CHECK ("two"."hole" > 0);--> statement-breakpoint
ALTER TABLE "two" ADD CONSTRAINT "hole_check2" CHECK ("two"."hole" < 19);