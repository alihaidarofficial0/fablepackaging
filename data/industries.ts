export type Industry = {
  name: string;
  slug: string;
  description: string;
  image: string;
  alt: string;
};

export const homeIndustries: Industry[] = [
  { name: "Cosmetics & Beauty", slug: "cosmetics-beauty", description: "Elegant packaging for skincare, makeup and fragrance.", image: "/images/industries/cosmetics-beauty.webp", alt: "Blush and cream cosmetic packaging in a premium studio setting" },
  { name: "Food & Beverage", slug: "food-beverage", description: "Packaging designed for freshness, presentation and shelf appeal.", image: "/images/industries/food-beverage.webp", alt: "Natural kraft food cartons and premium flexible pouch packaging" },
  { name: "Retail & E-Commerce", slug: "ecommerce", description: "Branded packaging built for shipping and memorable unboxing.", image: "/images/industries/ecommerce.webp", alt: "Open navy ecommerce mailer box with tissue paper and kraft insert" },
  { name: "Health & Wellness", slug: "health-wellness", description: "Clean, trustworthy packaging for modern wellness brands.", image: "/images/industries/health-wellness.webp", alt: "White and soft blue wellness cartons with an amber bottle" },
  { name: "Electronics", slug: "electronics", description: "Protective structures with a refined premium presentation.", image: "/images/industries/electronics.webp", alt: "Deep navy electronics rigid box with protective insert" },
  { name: "Apparel & Fashion", slug: "apparel-fashion", description: "Thoughtful packaging for clothing, accessories and lifestyle brands.", image: "/images/industries/apparel-fashion.webp", alt: "Cream apparel gift box with tissue paper and burnt orange ribbon" },
];
