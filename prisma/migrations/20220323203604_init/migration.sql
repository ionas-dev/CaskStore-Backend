-- CreateTable
CREATE TABLE "cask" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR,
    "description" TEXT,

    CONSTRAINT "cask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cask_has_category" (
    "title" VARCHAR,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "cask_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "cask_has_category_pkey" PRIMARY KEY ("category_id","cask_id")
);

-- CreateTable
CREATE TABLE "cask_image" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT,
    "url" VARCHAR,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "cask_id" INTEGER,

    CONSTRAINT "cask_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nc_evolutions" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "titleDown" VARCHAR(255),
    "description" VARCHAR(255),
    "batch" INTEGER,
    "checksum" VARCHAR(255),
    "status" INTEGER,
    "created" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "nc_evolutions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cask_has_category" ADD CONSTRAINT "fk6szp4qten0wa7f315y_8" FOREIGN KEY ("cask_id") REFERENCES "cask"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cask_has_category" ADD CONSTRAINT "fka99h41vi2jr2vbf9azq9" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cask_image" ADD CONSTRAINT "fkirhzcdrd09_44gnm1g46" FOREIGN KEY ("cask_id") REFERENCES "cask"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
