const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(url, key);

const posts = [
  {
    title: "The Tactile Alchemy of Luxury Rigid Boxes in Modern Retail",
    slug: "tactile-alchemy-luxury-rigid-boxes",
    excerpt: "How heavyweight structural paperboard, soft-touch laminates, and subtle debossing create an unforgettable reveal that lingers with consumers long after unboxing.",
    content: "<p>When a product commands attention, its presentation should speak before the lid is even lifted. In high-end packaging design, the tactile experience isn't an afterthought—it is the opening statement.</p><h2>The Anatomy of Weight and Reveal</h2><p>Rigid boxes, crafted from dense greyboard wrapped in art paper, create an unmistakable sense of permanence. Unlike standard cartons, rigid boxes possess structural gravity. The friction of the telescoping lid creates a measured, three-second drop that builds anticipation.</p><blockquote>&ldquo;Tactility is the closest thing design has to a handshake. It builds trust in the dark.&rdquo;</blockquote><h2>Curating Substrates with Purpose</h2><p>From soft-touch coatings that evoke suede to micro-embossed linen finishes, texture communicates craftsmanship without shouting. When paired with hot-stamped matte foils, the interplay between matte paper and lustrous metallic accents achieves a harmonious visual hierarchy.</p>",
    category: "Design & Craft",
    author: "Eleanor Vance",
    image: "/images/products/rigid-box.webp",
    alt: "Luxury navy rigid box with gold embossed foil lettering",
    published_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    active: true,
    featured: true,
    seo_title: "The Tactile Alchemy of Luxury Rigid Boxes | Fable Journal",
    seo_description: "Discover how structural weight, tactile laminates, and foil accents elevate product reveals in luxury retail packaging.",
    sort_order: 10,
  },
  {
    title: "A Pragmatist’s Guide to Sustainable Substrates & Water-Based Inks",
    slug: "guide-sustainable-substrates-water-based-inks",
    excerpt: "Cutting through the noise of greenwashing: an honest appraisal of unbleached kraft, agricultural waste boards, and soy inks that actually biodegrade.",
    content: "<p>Sustainability in modern packaging must move past empty buzzwords and center on life-cycle practicality. True ecological stewardship begins with choosing the right substrate from the forest floor to the curb.</p><h2>The Integrity of Kraft and Agricultural Boards</h2><p>Virgin fibers from certified sustainable forestry and post-consumer recycled waste (PCR) offer distinct structural characteristics. When selecting paperboards, assessing burst strength versus recyclability is paramount.</p><h2>Water and Vegetable Based Pigments</h2><p>Traditional petroleum-derived inks hinder paper repulping during recycling. By adopting soy-based and water-soluble inks, brands preserve vibrant Pantone matching while guaranteeing non-toxic decomposition.</p>",
    category: "Sustainability",
    author: "Julian Thorne",
    image: "/images/products/mailer-box.webp",
    alt: "Natural kraft mailer box with minimalist monochrome print",
    published_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    active: true,
    featured: false,
    seo_title: "Sustainable Packaging Substrates Guide | Fable Journal",
    seo_description: "An honest guide to unbleached kraft, post-consumer waste, and vegetable-based inks.",
    sort_order: 20,
  },
  {
    title: "Dielines, Bleeds & Crease Tolerances: Prepress Notes for Designers",
    slug: "dielines-bleeds-crease-tolerances-prepress-notes",
    excerpt: "Avoid costly press checks and misaligned flaps with this thorough guide to fluting grain directions, safety margins, and vector die preparation.",
    content: "<p>A 3D render might look flawless on a screen, but the physical world answers to the laws of caliper thickness and fold displacement. Here is how master packaging designers prepare production dielines that fold impeccably every single time.</p><h2>Accounting for Paperboard Caliper in Folds</h2><p>When heavy paperboard folds 90 or 180 degrees, the material inside compresses while the outer face stretches. Adding 1.5x paper thickness to dust flaps ensures seamless closures without bulging.</p>",
    category: "How-To & Guides",
    author: "Marcus Reyes",
    image: "/images/products/folding-carton.webp",
    alt: "Clean folding carton dieline proof and structural sample",
    published_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    active: true,
    featured: false,
    seo_title: "Prepress Guide: Dielines and Crease Tolerances | Fable Journal",
    seo_description: "Technical guide to packaging dielines, fold compensation, and prepress vector setup.",
    sort_order: 30,
  },
  {
    title: "The Architectural Unboxing: Structural Engineering in Direct-to-Consumer",
    slug: "architectural-unboxing-structural-engineering-dtc",
    excerpt: "Why choreography matters in DTC deliveries: how internal caddies, tear-strips, and secondary compartments turn logistics into emotional theater.",
    content: "<p>Opening an ecommerce delivery should feel like unlocking a bespoke gift, not wrestling with packing tape. The modern DTC customer evaluates your brand the second their hands make contact with the shipper.</p><h2>Tear-Strip Geometry and Clean Openings</h2><p>A well-engineered zipper rule gives a crisp, satisfying shear without ragged fiber tears. Pairing this with a fold-back presentation lid immediately showcases your product in an elevated stage setting.</p>",
    category: "Industry Trends",
    author: "Sophia Al-Mansoor",
    image: "/images/projects/velora-tea.webp",
    alt: "Velora tea luxury sleeve and sliding presentation box",
    published_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    active: true,
    featured: true,
    seo_title: "Architectural Unboxing in DTC Packaging | Fable Journal",
    seo_description: "How internal structural caddies and clean tear-strips elevate direct-to-consumer unboxing experiences.",
    sort_order: 40,
  },
  {
    title: "Mastering Foil Stamping: Hot Foil, Cold Foil, and Blind Debossing",
    slug: "mastering-foil-stamping-hot-foil-cold-foil-debossing",
    excerpt: "A practical comparison of foil tooling costs, substrate heat resistance, and when to specify micro-etched brass dies over magnesium.",
    content: "<p>Metallic embellishments can transform simple packaging into an heirloom object, but specifying the wrong foil process can lead to flaking, fill-in, or blown budgets.</p><h2>Hot Foil vs. Cold Foil Transfer</h2><p>Hot stamping remains the gold standard for crisp edges on textured paperboards, transferring pigmented or metallic foil via heat and pressure. Cold foil is suited for high-speed inline flexography on smooth films.</p>",
    category: "Materials Guide",
    author: "Eleanor Vance",
    image: "/images/projects/aurora-skincare.webp",
    alt: "Aurora skincare cosmetic boxes with metallic foil accents",
    published_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    active: true,
    featured: false,
    seo_title: "Mastering Foil Stamping & Finishes | Fable Journal",
    seo_description: "Practical comparison of hot foil stamping, cold foil transfer, and debossing on packaging board.",
    sort_order: 50,
  },
  {
    title: "Corrugated Fluting Demystified: E-Flute vs. B-Flute for Retail Shipping",
    slug: "corrugated-fluting-demystified-e-flute-vs-b-flute",
    excerpt: "Caliper strength versus print resolution: choosing between E, B, and microflute boards to balance drop-test survival with crisp retail graphics.",
    content: "<p>Corrugated board is the unsung hero of global commerce. Beneath its humble exterior lies an intricate structural engineering feat that balances fluting frequency, crush resistance, and printability.</p><h2>The Anatomy of Flute Profiles</h2><p>E-flute (approx. 1.6mm) delivers 90 flutes per foot, creating a remarkably smooth surface ideal for direct flexographic or litho-laminated printing. B-flute (approx. 3.2mm) provides superior puncture and compression resistance.</p>",
    category: "Materials Guide",
    author: "Marcus Reyes",
    image: "/images/products/shipping-box.webp",
    alt: "Heavy duty corrugated shipping box in warm kraft finish",
    published_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    active: true,
    featured: false,
    seo_title: "Corrugated Fluting Guide: E-Flute vs B-Flute | Fable Journal",
    seo_description: "Detailed comparison of corrugated board flute profiles for ecommerce mailers and shipping boxes.",
    sort_order: 60,
  },
  {
    title: "Designing for Circularity: Monomaterial Packaging and Plastic-Free Tapes",
    slug: "designing-for-circularity-monomaterial-packaging",
    excerpt: "Eliminating mixed-material waste streams through water-activated gummed tape, molded pulp inserts, and plant-based barrier coatings.",
    content: "<p>The most elegant packaging design is one that leaves no trace. Monomaterial packaging eliminates the friction of consumer disassembly, allowing the entire box, tape, and insert to enter the paper recycling stream together.</p><h2>Replacing Plastic Thermoforms with Molded Pulp</h2><p>Molded fiber trays made from bamboo, sugarcane bagasse, or recycled newspaper now match thermoformed plastic in dimensional precision and impact absorption while being 100% repulpable.</p>",
    category: "Sustainability",
    author: "Julian Thorne",
    image: "/images/projects/bloom-botanics.webp",
    alt: "Bloom botanics 100 percent paper-based botanical gift set",
    published_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    active: true,
    featured: false,
    seo_title: "Monomaterial Packaging & Circularity | Fable Journal",
    seo_description: "How to design zero-plastic packaging using molded pulp inserts and water-activated paper tape.",
    sort_order: 70,
  },
];

async function seed() {
  console.log("Seeding blog posts into Supabase...");
  for (const post of posts) {
    const { data: existing, error: checkErr } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", post.slug)
      .maybeSingle();

    if (checkErr) {
      console.error("Check error for", post.slug, checkErr);
      continue;
    }

    if (existing) {
      console.log("Updating existing post:", post.slug);
      const { error } = await supabase.from("blog_posts").update(post).eq("id", existing.id);
      if (error) console.error("Update error:", error);
    } else {
      console.log("Inserting post:", post.slug);
      const { error } = await supabase.from("blog_posts").insert(post);
      if (error) console.error("Insert error:", error);
    }
  }

  // Also sync to data/blogs.json as fallback
  const { data: allBlogs } = await supabase
    .from("blog_posts")
    .select("*")
    .order("sort_order", { ascending: true });

  if (allBlogs && allBlogs.length > 0) {
    const filePath = path.join(process.cwd(), "data", "blogs.json");
    fs.writeFileSync(filePath, JSON.stringify(allBlogs, null, 2), "utf-8");
    console.log("Successfully synced to data/blogs.json. Total posts:", allBlogs.length);
  }
}

seed().catch(console.error);
