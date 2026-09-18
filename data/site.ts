import { Box, Gem, PackageOpen, ShoppingBag, Truck, Wine, Sparkles, Leaf, Smartphone, Shirt, HeartPulse, UtensilsCrossed } from "lucide-react";

export const products = [
  { name: "Mailer Boxes", slug: "mailer-boxes", note: "Stylish & durable", tone: "terracotta", icon: PackageOpen },
  { name: "Rigid Boxes", slug: "rigid-boxes", note: "A premium reveal", tone: "navy", icon: Gem },
  { name: "Folding Cartons", slug: "folding-cartons", note: "Versatile & refined", tone: "kraft", icon: Box },
  { name: "Shipping Boxes", slug: "shipping-boxes", note: "Strong & reliable", tone: "sand", icon: Truck },
  { name: "Display Boxes", slug: "display-boxes", note: "Designed to sell", tone: "rose", icon: ShoppingBag },
  { name: "Mylar Bags", slug: "mylar-bags", note: "Fresh & flexible", tone: "olive", icon: Wine },
];

export const industries = [
  { name: "Cosmetics & Beauty", slug: "cosmetics", tone: "rose", icon: Sparkles },
  { name: "Food & Beverage", slug: "food", tone: "olive", icon: UtensilsCrossed },
  { name: "Retail & E-Commerce", slug: "retail", tone: "navy", icon: ShoppingBag },
  { name: "Health & Wellness", slug: "health", tone: "sky", icon: HeartPulse },
  { name: "Electronics", slug: "electronics", tone: "charcoal", icon: Smartphone },
  { name: "Apparel & Fashion", slug: "apparel", tone: "kraft", icon: Shirt },
];

export const nav = [
  { label: "Custom Boxes", href: "/custom-boxes" },
  { label: "Industries", href: "/industries" },
  { label: "Materials", href: "/materials" },
  { label: "Design Support", href: "/design-support" },
  { label: "About", href: "/about" },
];

export const faqs = [
  ["What is your minimum order quantity?", "Most box styles start at 100 units. Our specialists can recommend the best structure and print method for your volume."],
  ["Can you help with artwork and dielines?", "Yes. Every order includes dieline support, artwork checks and a digital proof before production."],
  ["How long does production take?", "Typical production is 10–15 business days after proof approval. Complex finishes or freight programs may require more time."],
  ["Do you ship internationally?", "We support worldwide delivery with transparent options for air, express and sea freight."],
];
