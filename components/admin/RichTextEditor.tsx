"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline,
  Undo2,
  Unlink,
} from "lucide-react";

type ToolbarButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function ToolbarButton({ label, active = false, disabled = false, onClick, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`grid size-9 place-items-center rounded-md border text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
        active
          ? "border-[#D96B2B] bg-[#FFF0E2] text-[#BC5420]"
          : "border-transparent text-[#526171] hover:border-[#E7DDD2] hover:bg-white hover:text-[#D96B2B]"
      }`}
    >
      {children}
    </button>
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function convertLegacyHeadingParagraphs(value: string) {
  return value
    .replace(/<p>\s*###\s*([\s\S]*?)<\/p>/gi, "<h3>$1</h3>")
    .replace(/<p>\s*##\s*([\s\S]*?)<\/p>/gi, "<h2>$1</h2>")
    .replace(/<(h[2-4])>\s*#{1,6}\s*/gi, "<$1>");
}

function normalizeInitialContent(value: string) {
  if (!value.trim()) return "";
  if (/<(?:p|h[1-6]|ul|ol|blockquote|pre|hr)\b/i.test(value)) {
    return convertLegacyHeadingParagraphs(value);
  }

  return value
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      const content = escapeHtml(trimmed).replace(/\n/g, "<br>");
      if (trimmed.startsWith("### ")) return `<h3>${content.slice(4)}</h3>`;
      if (trimmed.startsWith("## ")) return `<h2>${content.slice(3)}</h2>`;
      return `<p>${content}</p>`;
    })
    .join("");
}

export function RichTextEditor({ name, initialContent }: { name: string; initialContent: string }) {
  const normalizedInitialContent = normalizeInitialContent(initialContent);
  const [html, setHtml] = useState(normalizedInitialContent);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          HTMLAttributes: { rel: "noopener noreferrer nofollow" },
        },
      }),
      Placeholder.configure({ placeholder: "Write the full article here…" }),
    ],
    content: normalizedInitialContent,
    editorProps: {
      attributes: {
        class: "admin-rich-text-content",
        "aria-label": "Article content",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      setHtml(currentEditor.isEmpty ? "" : currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const nextContent = normalizeInitialContent(initialContent);
    if (editor.getHTML() !== nextContent) {
      editor.commands.setContent(nextContent, { emitUpdate: false });
      setHtml(nextContent);
    }
  }, [editor, initialContent]);

  function editLink() {
    if (!editor) return;
    const previousUrl = String(editor.getAttributes("link").href || "");
    const url = window.prompt("Enter a link URL", previousUrl);
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  return (
    <div className="admin-rich-text overflow-hidden rounded-lg border border-[#D9D0C7] bg-white focus-within:border-[#D96B2B] focus-within:ring-4 focus-within:ring-[#D96B2B]/10">
      <input type="hidden" name={name} value={html} />
      <div className="flex flex-wrap items-center gap-1 border-b border-[#E7DDD2] bg-[#FFF9F2] p-2" role="toolbar" aria-label="Article formatting">
        <ToolbarButton label="Heading 2 (28 px)" active={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="size-4" /></ToolbarButton>
        <ToolbarButton label="Heading 3 (22 px)" active={editor?.isActive("heading", { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="size-4" /></ToolbarButton>
        <span className="mx-1 h-6 w-px bg-[#DED5CC]" aria-hidden="true" />
        <ToolbarButton label="Bold" active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold className="size-4" /></ToolbarButton>
        <ToolbarButton label="Italic" active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic className="size-4" /></ToolbarButton>
        <ToolbarButton label="Underline" active={editor?.isActive("underline")} onClick={() => editor?.chain().focus().toggleUnderline().run()}><Underline className="size-4" /></ToolbarButton>
        <ToolbarButton label="Strikethrough" active={editor?.isActive("strike")} onClick={() => editor?.chain().focus().toggleStrike().run()}><Strikethrough className="size-4" /></ToolbarButton>
        <ToolbarButton label="Inline code" active={editor?.isActive("code")} onClick={() => editor?.chain().focus().toggleCode().run()}><Code2 className="size-4" /></ToolbarButton>
        <span className="mx-1 h-6 w-px bg-[#DED5CC]" aria-hidden="true" />
        <ToolbarButton label="Bullet list" active={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()}><List className="size-4" /></ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()}><ListOrdered className="size-4" /></ToolbarButton>
        <ToolbarButton label="Blockquote" active={editor?.isActive("blockquote")} onClick={() => editor?.chain().focus().toggleBlockquote().run()}><Quote className="size-4" /></ToolbarButton>
        <ToolbarButton label="Horizontal line" onClick={() => editor?.chain().focus().setHorizontalRule().run()}><Minus className="size-4" /></ToolbarButton>
        <span className="mx-1 h-6 w-px bg-[#DED5CC]" aria-hidden="true" />
        <ToolbarButton label="Add or edit link" active={editor?.isActive("link")} onClick={editLink}><Link2 className="size-4" /></ToolbarButton>
        <ToolbarButton label="Remove link" disabled={!editor?.isActive("link")} onClick={() => editor?.chain().focus().unsetLink().run()}><Unlink className="size-4" /></ToolbarButton>
        <ToolbarButton label="Clear formatting" onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}><RemoveFormatting className="size-4" /></ToolbarButton>
        <span className="mx-1 h-6 w-px bg-[#DED5CC]" aria-hidden="true" />
        <ToolbarButton label="Undo" disabled={!editor?.can().chain().focus().undo().run()} onClick={() => editor?.chain().focus().undo().run()}><Undo2 className="size-4" /></ToolbarButton>
        <ToolbarButton label="Redo" disabled={!editor?.can().chain().focus().redo().run()} onClick={() => editor?.chain().focus().redo().run()}><Redo2 className="size-4" /></ToolbarButton>
      </div>
      <EditorContent editor={editor} />
      <div className="flex items-center justify-between border-t border-[#EEE8E1] bg-[#FFFDF9] px-3 py-2 text-[11px] text-[#667085]">
        <span>Rich text content</span>
        <span>{editor?.storage.characterCount?.characters?.() || editor?.getText().length || 0} characters</span>
      </div>
    </div>
  );
}
