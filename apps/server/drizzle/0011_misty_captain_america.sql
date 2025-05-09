ALTER TABLE "two" DROP CONSTRAINT "valid_hole_number";--> statement-breakpoint
ALTER TABLE "two" ADD CONSTRAINT "hole_number_above_0" CHECK ("two"."hole" > 0);--> statement-breakpoint
ALTER TABLE "two" ADD CONSTRAINT "hole_number_below_19" CHECK ("two"."hole" < 19);