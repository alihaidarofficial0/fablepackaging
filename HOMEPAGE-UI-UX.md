# Fable Packaging — Homepage UI/UX Specification

## 1. Page Goal

The homepage presents Fable Packaging as a premium, reliable custom-packaging partner for growing international brands. It should quickly answer four questions:

1. What does Fable Packaging provide?
2. Why should a customer trust the company?
3. Which packaging format is right for the customer?
4. How can the customer request a quote?

Primary conversion: **Get a custom quote**  
Secondary conversion: **Explore products**

---

## 2. Visual Direction

The visual language is warm, editorial and product-focused. Cream backgrounds and tactile paper tones keep the page approachable, while navy creates trust and burnt orange highlights important actions.

### Color Palette

| Role | Color |
|---|---|
| Primary navy | `#0B1F33` |
| Burnt orange | `#D96B2B` |
| Orange hover | `#BC5420` |
| Warm cream | `#FFF9F2` |
| Soft beige | `#F3E8DA` |
| Premium gold | `#C99A4A` |
| Main text | `#111827` |
| Secondary text | `#667085` |
| Footer | `#071827` |
| White | `#FFFFFF` |

### Typography

- Display headings: Georgia / premium serif fallback
- Body and interface: Segoe UI / Arial / sans-serif fallback
- Headings use tight line-height and slightly negative letter spacing.
- Eyebrows use uppercase text, strong weight and wide tracking.
- Body copy remains readable with approximately `1.65` line-height.

### Shared UI Rules

- Maximum content width: `1320px`
- Desktop side spacing: `24px`
- Mobile side spacing: `14–16px`
- Primary button height: `50px`
- Default button radius: `9px`
- Cards use fixed transparent borders so hover never changes dimensions.
- Cards never translate or move upward on hover.
- Images and visual areas always reserve their space before loading.
- Hover feedback uses color, border and shadow changes only.
- Reduced-motion preferences disable non-essential transitions.

---

## 3. Announcement Bar

Dark navy strip shown above the main navigation on desktop.

### Left Content

- Free design support
- Low minimum order
- Sustainable packaging

### Right Content

- `hello@fablepack.co`
- `+1 (855) 123-4567`
- Currency selector: USD

### UX

- Hidden on smaller screens to preserve vertical space.
- Contact details are immediately visible without opening another page.
- Height remains fixed to prevent layout movement.

---

## 4. Sticky Header

The header remains available while the user scrolls.

### Brand

- Geometric outlined box mark
- Fable wordmark
- `PACKAGING CO.` descriptor

### Desktop Navigation

- Custom Boxes
- Industries
- Materials
- Design Support
- About
- Search button
- Shopping bag button
- Get a Quote button

### Mega Menu

The Custom Boxes item reveals an absolutely positioned mega menu containing:

- Mailer Boxes
- Rigid Boxes
- Folding Cartons
- Shipping Boxes
- Display Boxes
- Mylar Bags

The panel overlays the page without shifting its content.

### Mobile Navigation

- Replaced with a menu button below `800px`.
- Menu expands beneath the header.
- All links have large touch targets.
- Quote CTA remains visually dominant.

---

## 5. Hero Section

### Content

**Eyebrow:**  
`CUSTOM PACKAGING, MADE MEMORABLE`

**Headline:**  
`Packaging that elevates your brand.`

The words **your brand** use burnt orange.

**Description:**  
`Custom boxes, endless possibilities. Thoughtful packaging solutions that protect your products and make every unboxing count.`

### Actions

- Primary: Get a custom quote
- Secondary: Explore products

### Supporting Benefits

- Free design support
- Low minimums
- Fast turnaround

### Artwork

An original studio photograph displays:

- Open navy mailer box
- Kraft folding carton
- Burnt-orange product box
- Sage-green carton
- Restrained botanical leaves
- Limestone props
- Warm cream studio backdrop

Desktop composition places content on the left and packaging on the right. On mobile, a vertical gradient protects text readability while the product composition remains visible below.

### UX

- Hero artwork uses `Next/Image` with priority loading.
- Image uses explicit layout dimensions through a fixed hero container.
- CTA buttons stack vertically on narrow screens.
- No parallax or continuous motion.

---

## 6. Trust Section

**Label:**  
`TRUSTED BY GROWING BRANDS WORLDWIDE`

Text-based monochrome brand marks:

- NORTH & CO.
- onefolk
- grüvi
- CommonKind
- DAWN
- Hearth
- OLIO

The row becomes a compact grid on tablet and mobile.

---

## 7. Product Discovery

### Heading

`Made for your product`

### Supporting Copy

`Explore our most-loved custom packaging formats.`

### Product Cards

1. Mailer Boxes — Stylish & durable
2. Rigid Boxes — A premium reveal
3. Folding Cartons — Versatile & refined
4. Shipping Boxes — Strong & reliable
5. Display Boxes — Designed to sell
6. Mylar Bags — Fresh & flexible

Each card includes:

- Reserved product-visual area
- Stylized packaging composition
- Product name
- Short descriptor
- Circular detail arrow
- Link to its product page

### UX

- Six-column desktop grid
- Three-column tablet grid
- Two-column mobile grid
- Hover changes border and shadow only.
- Product visual may zoom internally by approximately `1.025`.
- Outer card dimensions never change.

---

## 8. Why Fable

### Eyebrow

`WHY FABLE`

### Heading

`Great packaging should feel simple.`

### Copy

`From first sketch to final delivery, our experts bring structure, clarity and craft to every packaging project.`

### Checklist

- 100% customizable
- Premium materials & finishes
- Free design support
- Sustainable options
- Global shipping

### Primary Action

`Start your project`

### Product Composition

A large navy mailer box carries the message:

> Thoughtful outside. Unforgettable inside.

A smaller kraft box carries:

> packaging with purpose

### Supporting Features

- Custom sizes & styles
- Premium finishes
- Planet-minded materials
- Low minimum orders
- Expert support

---

## 9. Industry Solutions

### Eyebrow

`SOLUTIONS BY SECTOR`

### Heading

`Packaging for every industry`

### Cards

- Cosmetics & Beauty
- Food & Beverage
- Retail & E-Commerce
- Health & Wellness
- Electronics
- Apparel & Fashion

Each card uses a unique muted brand color, a large icon, title and navigation hint.

### UX

- Six columns on desktop
- Three columns on medium screens
- Two columns on mobile
- Cards maintain a fixed height.
- Color and shadow provide interaction feedback without movement.

---

## 10. Sustainability Feature

Dark navy-to-green section providing high visual contrast.

### Eyebrow

`PACKAGING WITH A LIGHTER FOOTPRINT`

### Heading

`A better box for a brighter tomorrow.`

### Copy

`Make confident material choices without compromising the experience. Our team helps you reduce waste at every step.`

### Benefits

- Recyclable materials
- Soy-based inks
- FSC® options
- Plastic-free choices
- Lower-impact shipping

### CTA

`Explore sustainable options`

The central kraft box graphic reinforces the natural material story.

---

## 11. How It Works

### Heading

`How it works`

### Supporting Copy

`Four simple steps from idea to delivery.`

### Steps

1. **Choose your style**  
   Start with a structure built for your product.

2. **Make it yours**  
   Pick dimensions, materials, print and finishes.

3. **Get your quote**  
   Receive clear pricing and a digital proof.

4. **We deliver**  
   Approve production and Fable handles the rest.

Desktop uses a horizontal timeline. Mobile changes to a simple vertical sequence with no unstable movement.

---

## 12. Featured Projects

### Heading

`Fresh from the studio`

### Supporting Copy

`Real structures. Original artwork. Packaging made to be remembered.`

### Projects

- Bloom Botanics
- Aurora Skincare
- Better Snacks
- Velora Tea
- Natura Home

Each card includes a color-coordinated package mockup, project name and detail arrow. Fixed card heights prevent content shift.

---

## 13. Testimonial

### Rating

Five gold stars

### Quote

> “Fable made a complex launch feel effortless. The samples were beautiful, communication was clear, and the finished boxes exceeded every expectation.”

### Customer

- Sarah Kim
- Founder, PureGlow

The testimonial remains static rather than auto-rotating, improving readability and preventing layout movement.

---

## 14. Final CTA

### Eyebrow

`READY WHEN YOU ARE`

### Heading

`Let’s create packaging worth opening.`

### Copy

`Tell us what you’re making. We’ll help shape the rest.`

### Actions

- Get a free quote
- Talk to an expert

---

## 15. Footer

Dark navy footer containing:

### Brand Column

- Fable logo
- Short company description
- Facebook
- Instagram
- LinkedIn
- YouTube

### Products

- Mailer Boxes
- Rigid Boxes
- Folding Cartons
- Shipping Boxes
- Display Boxes
- Mylar Bags

### Company

- About Us
- Our Process
- Sustainability
- Reviews
- Blog
- Contact Us

### Support

- Get a Quote
- Artwork Guidelines
- Shipping & Delivery
- FAQs
- Track Your Order
- Help Center

### Newsletter

Heading: `Packaging notes, worth opening.`

Includes email field, subscribe button and payment marks for Visa, Mastercard, PayPal and Stripe.

### Bottom Bar

- Copyright
- Privacy
- Terms
- Sitemap
- Language selector

---

## 16. Responsive Behavior

### Desktop: `1100px+`

- Full announcement bar and navigation
- Six-column product and industry grids
- Three-column Why Fable layout
- Horizontal process timeline

### Tablet: `521px–1099px`

- Mobile menu below `800px`
- Two- or three-column content grids
- Why Fable content stacks
- Sustainability benefits wrap into a grid

### Mobile: `320px–520px`

- Headline scales to approximately `45px`
- Hero CTAs become full-width stacked buttons
- Product and industry cards use two columns
- How It Works uses a vertical flow
- Footer becomes a two-column layout
- Forms use single-column fields
- Touch targets remain at least `44px`

---

## 17. Accessibility

- Semantic header, navigation, main, sections and footer
- Skip-to-content link
- Descriptive image alternative text
- Accessible labels for icon-only buttons
- Keyboard-accessible links, forms and menu controls
- Visible focus states through border and focus-ring changes
- Color contrast suitable for important text and actions
- Reduced-motion support
- Form validation messages displayed beside relevant fields

---

## 18. Performance and Stability

- Hero uses optimized `Next/Image` loading.
- Hero image is marked as priority because it appears above the fold.
- All visual cards have fixed heights or aspect ratios.
- No hover interaction changes padding, margins or border width.
- No autoplay carousels or continuous animations.
- Server Components are used by default.
- Client Components are limited to navigation and interactive forms.
- Fonts use local system stacks, avoiding build-time network requests.

---

## 19. Main Implementation Files

- `app/page.tsx` — homepage sections and content
- `app/globals.css` — complete visual and responsive system
- `app/layout.tsx` — shared page shell and metadata
- `components/Header.tsx` — desktop/mobile navigation and mega menu
- `components/Footer.tsx` — global footer and newsletter
- `components/ui.tsx` — shared headings, product visuals and card links
- `data/site.ts` — product, industry and navigation data
- `public/images/packaging-hero.png` — homepage hero artwork

---

## 20. Homepage Route

Development URL:

```text
http://localhost:3000
```

Start locally with:

```powershell
npm run dev
```
