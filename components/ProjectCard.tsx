import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project; featured?: boolean }) {
  return <Link href="/projects" className="group cursor-pointer overflow-hidden rounded-[14px] border border-[#E7DDD2] bg-white outline-none transition-colors duration-[250ms] hover:border-[#D96B2B]/65 focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-4"><div className="relative aspect-[4/3] overflow-hidden bg-[#F3E8DA]"><Image src={project.image} alt={project.alt} fill sizes="(max-width: 419px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 20vw" className="object-cover"/></div><div className="flex min-h-[82px] items-center justify-between gap-3 p-4"><div><h3 className="font-serif text-[17px] font-medium leading-5 tracking-[-0.02em] text-[#0B1F33] transition-colors group-hover:text-[#D96B2B]">{project.name}</h3><p className="mt-1 text-[12px] text-[#667085]">{project.category}</p></div><span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#E7DDD2] bg-[#FFF9F2] text-[#D96B2B] transition-colors group-hover:bg-[#D96B2B] group-hover:text-white"><ArrowUpRight className="size-4" aria-hidden="true"/></span></div></Link>;
}
