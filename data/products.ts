export type Product = {
  name: string;
  slug: string;
  subtitle: string;
  image: string;
  alt: string;
  badge?: "Popular" | "Luxury" | "Flexible";
};

export const homeProducts: Product[] = [
  { name: "Mailer Boxes", slug: "mailer-boxes", subtitle: "Built for memorable unboxing", image: "/images/products/mailer-box.webp", alt: "Premium custom mailer box packaging", badge: "Popular" },
  { name: "Rigid Boxes", slug: "rigid-boxes", subtitle: "Premium structure, elevated reveal", image: "/images/products/rigid-box.webp", alt: "Luxury rigid box packaging", badge: "Luxury" },
  { name: "Folding Cartons", slug: "folding-cartons", subtitle: "Lightweight, versatile and refined", image: "/images/products/folding-carton.webp", alt: "Custom folding carton packaging" },
  { name: "Shipping Boxes", slug: "shipping-boxes", subtitle: "Strong protection for every journey", image: "/images/products/shipping-box.webp", alt: "Corrugated shipping box packaging" },
  { name: "Display Boxes", slug: "display-boxes", subtitle: "Designed to stand out on shelf", image: "/images/products/display-box.webp", alt: "Custom retail display packaging" },
  { name: "Mylar Bags", slug: "mylar-bags", subtitle: "Flexible packaging that stays fresh", image: "/images/products/mylar-bag.webp", alt: "Custom printed mylar bag packaging", badge: "Flexible" },
];
