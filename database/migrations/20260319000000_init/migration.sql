-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255),
    "bio" TEXT,
    "avatar_url" TEXT,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR(255) NOT NULL,
    "url" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "page_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "pages_user_id_key" ON "pages"("user_id");

-- CreateIndex
CREATE INDEX "idx_links_page_id" ON "links"("page_id");

-- CreateIndex
CREATE INDEX "idx_links_position" ON "links"("page_id", "position");

-- CreateIndex
CREATE INDEX "idx_pages_slug" ON "pages"("slug");

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
