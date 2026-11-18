-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "mercadona_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_en" TEXT,
    "parent_id" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_not_food" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mercadona_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mercadona_products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "brand" TEXT,
    "quantity" DECIMAL(10,2),
    "packaging" TEXT,
    "size_format" TEXT,
    "size" DECIMAL(10,2),
    "ud_size_format" TEXT,
    "ud_size" DECIMAL(10,2),
    "image" TEXT,
    "thumbnail" TEXT,
    "images" TEXT[],
    "product_link" TEXT,
    "price" DECIMAL(10,2),
    "price_per_unit" DECIMAL(10,2),
    "seller" TEXT,
    "protein" DECIMAL(10,2),
    "fat" DECIMAL(10,2),
    "carbohydrates" DECIMAL(10,2),
    "calories" DECIMAL(10,2),
    "calories_per_100g" DECIMAL(10,2),
    "salt" DECIMAL(10,2),
    "sugar" DECIMAL(10,2),
    "fiber" DECIMAL(10,2),
    "saturated_fat" DECIMAL(10,2),
    "monounsaturated_fat" DECIMAL(10,2),
    "polyunsaturated_fat" DECIMAL(10,2),
    "cholesterol" DECIMAL(10,2),
    "sodium" DECIMAL(10,2),
    "vitamins" TEXT[],
    "minerals" TEXT[],
    "nutri_score" TEXT,
    "total_dissolved_solids" DECIMAL(10,2),
    "allergens" TEXT[],
    "storage_conditions" TEXT,
    "date" TEXT,
    "is_disabled" BOOLEAN DEFAULT false,
    "category_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mercadona_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mercadona_category_products" (
    "category_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "mercadona_category_products_pkey" PRIMARY KEY ("category_id","product_id")
);

-- CreateTable
CREATE TABLE "carrefour_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_en" TEXT,
    "parent_id" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_not_food" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carrefour_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrefour_products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "brand" TEXT,
    "quantity" DECIMAL(10,2),
    "packaging" TEXT,
    "size_format" TEXT,
    "size" DECIMAL(10,2),
    "ud_size_format" TEXT,
    "ud_size" DECIMAL(10,2),
    "image" TEXT,
    "thumbnail" TEXT,
    "images" TEXT[],
    "product_link" TEXT,
    "price" DECIMAL(10,2),
    "price_per_unit" DECIMAL(10,2),
    "seller" TEXT,
    "protein" DECIMAL(10,2),
    "fat" DECIMAL(10,2),
    "carbohydrates" DECIMAL(10,2),
    "calories" DECIMAL(10,2),
    "calories_per_100g" DECIMAL(10,2),
    "salt" DECIMAL(10,2),
    "sugar" DECIMAL(10,2),
    "fiber" DECIMAL(10,2),
    "saturated_fat" DECIMAL(10,2),
    "monounsaturated_fat" DECIMAL(10,2),
    "polyunsaturated_fat" DECIMAL(10,2),
    "cholesterol" DECIMAL(10,2),
    "sodium" DECIMAL(10,2),
    "vitamins" TEXT[],
    "minerals" TEXT[],
    "nutri_score" TEXT,
    "total_dissolved_solids" DECIMAL(10,2),
    "allergens" TEXT[],
    "storage_conditions" TEXT,
    "date" TEXT,
    "is_disabled" BOOLEAN DEFAULT false,
    "category_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carrefour_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrefour_category_products" (
    "category_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "carrefour_category_products_pkey" PRIMARY KEY ("category_id","product_id")
);

-- CreateTable
CREATE TABLE "generic_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_en" TEXT,
    "parent_id" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_not_food" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generic_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generic_products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "name_en" TEXT,
    "description_en" TEXT,
    "size_format" TEXT,
    "category_id" TEXT,
    "image" TEXT,
    "thumbnail" TEXT,
    "image_url" TEXT,
    "calories" DECIMAL(10,2),
    "protein" DECIMAL(10,2),
    "fat" DECIMAL(10,2),
    "carbohydrates" DECIMAL(10,2),
    "salt" DECIMAL(10,2),
    "sugar" DECIMAL(10,2),
    "fiber" DECIMAL(10,2),
    "saturated_fat" DECIMAL(10,2),
    "monounsaturated_fat" DECIMAL(10,2),
    "polyunsaturated_fat" DECIMAL(10,2),
    "cholesterol" DECIMAL(10,2),
    "sodium" DECIMAL(10,2),
    "vitamins" TEXT[],
    "minerals" TEXT[],
    "nutri_score" TEXT,
    "total_dissolved_solids" DECIMAL(10,2),
    "allergens" TEXT[],
    "storage_conditions" TEXT,
    "rate" DECIMAL(10,2),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generic_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generic_category_products" (
    "category_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "generic_category_products_pkey" PRIMARY KEY ("category_id","product_id")
);

-- CreateTable
CREATE TABLE "generic_product_matching" (
    "id" TEXT NOT NULL,
    "generic_product_id" TEXT NOT NULL,
    "seller_product_id" TEXT NOT NULL,
    "seller" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generic_product_matching_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dishes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "name_en" TEXT,
    "description_en" TEXT,
    "recipe" TEXT,
    "recipe_en" TEXT,
    "image" TEXT,
    "thumbnail" TEXT,
    "difficulty" TEXT,
    "course" TEXT,
    "cuisine" TEXT,
    "preparation_method" TEXT,
    "dietary_category" TEXT,
    "meal_time" TEXT,
    "prep_time" INTEGER,
    "cook_time" INTEGER,
    "min_portions" INTEGER,
    "expiration_time" INTEGER,
    "tags" TEXT[],
    "order_index" INTEGER,
    "rating" DECIMAL(10,2),
    "is_disabled" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dish_products" (
    "dish_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "seller" TEXT NOT NULL,
    "size" DECIMAL(10,2),
    "size_format" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dish_products_pkey" PRIMARY KEY ("dish_id","product_id","seller")
);

-- CreateTable
CREATE TABLE "prices" (
    "date" DATE NOT NULL,
    "seller" TEXT NOT NULL,
    "total_products" INTEGER NOT NULL DEFAULT 0,
    "prices" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("date","seller")
);

-- CreateIndex
CREATE INDEX "mercadona_categories_parent_id_idx" ON "mercadona_categories"("parent_id");

-- CreateIndex
CREATE INDEX "mercadona_products_category_id_idx" ON "mercadona_products"("category_id");

-- CreateIndex
CREATE INDEX "carrefour_categories_parent_id_idx" ON "carrefour_categories"("parent_id");

-- CreateIndex
CREATE INDEX "carrefour_products_category_id_idx" ON "carrefour_products"("category_id");

-- CreateIndex
CREATE INDEX "generic_categories_parent_id_idx" ON "generic_categories"("parent_id");

-- CreateIndex
CREATE INDEX "generic_products_category_id_idx" ON "generic_products"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "generic_product_matching_generic_product_id_seller_seller_p_key" ON "generic_product_matching"("generic_product_id", "seller", "seller_product_id");

-- CreateIndex
CREATE INDEX "prices_seller_idx" ON "prices"("seller");

-- CreateIndex
CREATE INDEX "prices_date_idx" ON "prices"("date");

-- AddForeignKey
ALTER TABLE "mercadona_products" ADD CONSTRAINT "mercadona_products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "mercadona_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mercadona_category_products" ADD CONSTRAINT "mercadona_category_products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "mercadona_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mercadona_category_products" ADD CONSTRAINT "mercadona_category_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "mercadona_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrefour_products" ADD CONSTRAINT "carrefour_products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "carrefour_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrefour_category_products" ADD CONSTRAINT "carrefour_category_products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "carrefour_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrefour_category_products" ADD CONSTRAINT "carrefour_category_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "carrefour_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generic_products" ADD CONSTRAINT "generic_products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "generic_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generic_category_products" ADD CONSTRAINT "generic_category_products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "generic_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generic_category_products" ADD CONSTRAINT "generic_category_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "generic_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generic_product_matching" ADD CONSTRAINT "generic_product_matching_generic_product_id_fkey" FOREIGN KEY ("generic_product_id") REFERENCES "generic_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dish_products" ADD CONSTRAINT "dish_products_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Keep updated_at current on any SQL update, same as the Supabase tables.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mercadona_categories_updated_at
    BEFORE UPDATE ON mercadona_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mercadona_products_updated_at
    BEFORE UPDATE ON mercadona_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carrefour_categories_updated_at
    BEFORE UPDATE ON carrefour_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carrefour_products_updated_at
    BEFORE UPDATE ON carrefour_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generic_categories_updated_at
    BEFORE UPDATE ON generic_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generic_products_updated_at
    BEFORE UPDATE ON generic_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generic_product_matching_updated_at
    BEFORE UPDATE ON generic_product_matching
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dishes_updated_at
    BEFORE UPDATE ON dishes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dish_products_updated_at
    BEFORE UPDATE ON dish_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prices_updated_at
    BEFORE UPDATE ON prices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
