ALTER TABLE "frontend-account"."users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "frontend-account"."users" ADD COLUMN "username" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "frontend-account"."users" ADD COLUMN "password" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "frontend-account"."users" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "frontend-account"."users" DROP COLUMN "displayName";--> statement-breakpoint
ALTER TABLE "frontend-account"."users" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "frontend-account"."users" DROP COLUMN "remark";--> statement-breakpoint
ALTER TABLE "frontend-account"."users" DROP COLUMN "active";--> statement-breakpoint
ALTER TABLE "frontend-account"."users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");