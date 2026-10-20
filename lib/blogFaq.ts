export interface BlogFaqItem {
  question: string;
  answer: string;
}

export function normalizeBlogFaqs(faqs: unknown): BlogFaqItem[] {
  if (!faqs) return [];

  let list: unknown = faqs;
  if (typeof faqs === "string") {
    try {
      list = JSON.parse(faqs);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(list)) return [];

  return list
    .map((item) => ({
      question: String((item as BlogFaqItem)?.question ?? "").trim(),
      answer: String((item as BlogFaqItem)?.answer ?? "").trim(),
    }))
    .filter((item) => item.question);
}

export function parseBlogFaqsFromForm(formData: FormData): BlogFaqItem[] {
  const raw = formData.get("faqs");
  if (!raw || typeof raw !== "string") return [];
  return normalizeBlogFaqs(raw);
}
