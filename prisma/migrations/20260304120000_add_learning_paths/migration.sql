-- CreateTable
CREATE TABLE "learning_paths" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "jlpt_level" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_path_milestones" (
    "id" TEXT NOT NULL,
    "path_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "target_count" INTEGER NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "jlpt_level" TEXT,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "link_href" TEXT,

    CONSTRAINT "learning_path_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_learning_paths" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "path_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "user_learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "learning_paths_name_key" ON "learning_paths"("name");

-- CreateIndex
CREATE UNIQUE INDEX "learning_paths_slug_key" ON "learning_paths"("slug");

-- CreateIndex
CREATE INDEX "learning_paths_display_order_idx" ON "learning_paths"("display_order");

-- CreateIndex
CREATE INDEX "learning_path_milestones_path_id_display_order_idx" ON "learning_path_milestones"("path_id", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "user_learning_paths_user_id_path_id_key" ON "user_learning_paths"("user_id", "path_id");

-- CreateIndex
CREATE INDEX "user_learning_paths_user_id_idx" ON "user_learning_paths"("user_id");

-- AddForeignKey
ALTER TABLE "learning_path_milestones" ADD CONSTRAINT "learning_path_milestones_path_id_fkey" FOREIGN KEY ("path_id") REFERENCES "learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_learning_paths" ADD CONSTRAINT "user_learning_paths_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_learning_paths" ADD CONSTRAINT "user_learning_paths_path_id_fkey" FOREIGN KEY ("path_id") REFERENCES "learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;
