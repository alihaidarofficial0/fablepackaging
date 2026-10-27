"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function inject(html: string, target: "head" | "body") {
  const parent = target === "head" ? document.head : document.body;
  const template = document.createElement("template");
  template.innerHTML = html;
  const added: ChildNode[] = [];

  Array.from(template.content.childNodes).forEach((node) => {
    if (node.nodeName === "SCRIPT") {
      const source = node as HTMLScriptElement;
      const script = document.createElement("script");
      Array.from(source.attributes).forEach((attr) => script.setAttribute(attr.name, attr.value));
      script.text = source.text;
      parent.appendChild(script);
      added.push(script);
      return;
    }
    const clone = node.cloneNode(true);
    parent.appendChild(clone);
    added.push(clone);
  });

  return () => {
    added.forEach((node) => node.parentNode?.removeChild(node));
  };
}

export function SiteScripts({ header, footer }: { header?: string; footer?: string }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin || !header) return;
    return inject(header, "head");
  }, [header, isAdmin]);

  useEffect(() => {
    if (isAdmin || !footer) return;
    return inject(footer, "body");
  }, [footer, isAdmin]);

  return null;
}
