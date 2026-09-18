export type Product = {
  name: string;
  slug: string;
  subtitle: string;
  image: string;
  alt: string;
  badge?: "Popular" | "Luxury" | "Flexible";
  description: string;
};

export const homeProducts: Product[] = [
  {
    name: "Mailer Boxes",
    slug: "mailer-boxes",
    subtitle: "Built for memorable unboxing",
    image: "/images/products/mailer-box.webp",
    alt: "Premium custom mailer box packaging",
    badge: "Popular",
    description: "Custom printed mailer boxes designed for ecommerce, gifting and a brand moment at the door — protective in transit, beautiful when opened.",
  },
  {
    name: "Rigid Boxes",
    slug: "rigid-boxes",
    subtitle: "Premium structure, elevated reveal",
    image: "/images/products/rigid-box.webp",
    alt: "Luxury rigid box packaging",
    badge: "Luxury",
    description: "Heavyweight presentation boxes with a refined reveal. Ideal for beauty, electronics, luxury gifting and products that deserve a slower unboxing.",
  },
  {
    name: "Folding Cartons",
    slug: "folding-cartons",
    subtitle: "Lightweight, versatile and refined",
    image: "/images/products/folding-carton.webp",
    alt: "Custom folding carton packaging",
    description: "Crisp cartons for retail shelves and everyday products. Lightweight, print-friendly and easy to customize in size, structure and finish.",
  },
  {
    name: "Shipping Boxes",
    slug: "shipping-boxes",
    subtitle: "Strong protection for every journey",
    image: "/images/products/shipping-box.webp",
    alt: "Corrugated shipping box packaging",
    description: "Corrugated shipping boxes built for strength, branding and safe delivery. Add custom print, inserts and the right board grade for your product.",
  },
  {
    name: "Display Boxes",
    slug: "display-boxes",
    subtitle: "Designed to stand out on shelf",
    image: "/images/products/display-box.webp",
    alt: "Custom retail display packaging",
    description: "Retail-ready display packaging that presents product clearly, protects on shelf and gives your brand a stronger presence in-store.",
  },
  {
    name: "Mylar Bags",
    slug: "mylar-bags",
    subtitle: "Flexible packaging that stays fresh",
    image: "/images/products/mylar-bag.webp",
    alt: "Custom printed mylar bag packaging",
    badge: "Flexible",
    description: "Flexible pouches with a premium print finish. A practical choice for food, wellness and products that need freshness, barrier protection and stand-up presence.",
  },
];
