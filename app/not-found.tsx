import Link from "next/link";
import { Box } from "lucide-react";
export default function NotFound(){return <section className="empty-page"><Box/><p className="eyebrow">404 · Nothing packed here</p><h1>This box seems empty.</h1><p>The page you’re looking for couldn’t be found.</p><div><Link className="button button-primary" href="/">Return home</Link><Link className="button button-secondary" href="/custom-boxes">Explore packaging</Link></div></section>}
