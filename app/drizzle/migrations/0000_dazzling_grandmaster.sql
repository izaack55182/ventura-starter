CREATE TABLE "passkeys" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"aaguid" varchar(255) NOT NULL,
	"public_key" "bytea" NOT NULL,
	"user_id" integer NOT NULL,
	"webauthn_user_id" varchar(255) NOT NULL,
	"counter" integer NOT NULL,
	"device_type" varchar(255) NOT NULL,
	"backed_up" boolean DEFAULT false NOT NULL,
	"transports" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"action" varchar(255) NOT NULL,
	"entity" varchar(255) NOT NULL,
	"access" varchar(255) NOT NULL,
	"description" varchar(1024) DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "permissions_action_entity_access_unique" UNIQUE("action","entity","access")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" integer NOT NULL,
	"permission_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(191),
	"created_at" timestamp,
	"updated_at" timestamp,
	"display_name" varchar(255),
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"expiration_date" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role-user" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"user_type" varchar(255) NOT NULL,
	"branch_id" integer,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(191),
	"password" varchar(191),
	"last_name" varchar(191),
	"email" varchar(191) NOT NULL,
	"username" varchar(191) NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"status_account" varchar(191),
	"name" text GENERATED ALWAYS AS (COALESCE("users"."first_name", '') || ' ' || COALESCE("users"."last_name", '')) STORED,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"alt_text" varchar(191),
	"object_key" varchar(191) NOT NULL,
	"content_type" varchar(191),
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_images_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"type" varchar(255) NOT NULL,
	"target" varchar(255) NOT NULL,
	"secret" varchar(255) NOT NULL,
	"algorithm" varchar(255) NOT NULL,
	"digits" integer NOT NULL,
	"period" integer NOT NULL,
	"char_set" varchar(255) NOT NULL,
	"expires_at" timestamp,
	CONSTRAINT "verification_target_type_unique" UNIQUE("target","type")
);
--> statement-breakpoint
ALTER TABLE "passkeys" ADD CONSTRAINT "passkeys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "role-user" ADD CONSTRAINT "role-user_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_images" ADD CONSTRAINT "user_images_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "role_permission_role_id_index" ON "role_permissions" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "role_permission_permission_id_index" ON "role_permissions" USING btree ("permission_id");--> statement-breakpoint
CREATE INDEX "role_user_role_id_foreign" ON "role-user" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "role_user_branch_id_foreign" ON "role-user" USING btree ("branch_id");--> statement-breakpoint
CREATE INDEX "role_user_user_id_foreign" ON "role-user" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "email" ON "users" USING btree ("email");