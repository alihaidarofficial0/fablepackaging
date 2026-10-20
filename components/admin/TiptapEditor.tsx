"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import { TableKit } from "@tiptap/extension-table";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  Image as ImageIcon,
  Table as TableIcon,
  Undo2,
  Redo2,
  Code2,
  Minus,
  RemoveFormatting,
  MousePointerClick,
  X,
  Heading2,
  Heading3,
  Heading4,
  Quote,
} from "lucide-react";
import { uploadClientImage } from "@/lib/uploadClientImage";
import { toast } from "@/components/Toast";

export interface TiptapEditorHandle {
  insertHTML: (html: string) => void;
  focus: () => void;
}

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  onCreateButton?: () => void;
}

type ImageAltModalState =
  | { mode: "insert"; src: string }
  | { mode: "edit"; src: string; alt: string }
  | null;

const ToolbarButton = ({
  onClick,
  active,
  title,
  disabled,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`size-8 inline-flex items-center justify-center rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed ${
      active
        ? "bg-[#D96B2B] text-white"
        : "text-[#667085] hover:bg-[#FFF4E9] hover:text-[#D96B2B]"
    }`}
  >
    {children}
  </button>
);

const Divider = () => <span className="w-px h-5 bg-[#E7DDD2] mx-1 shrink-0" />;

export const TiptapEditor = forwardRef<TiptapEditorHandle, TiptapEditorProps>(
  function TiptapEditor({ value, onChange, onCreateButton }, ref) {
    const [showSource, setShowSource] = useState(false);
    const [sourceValue, setSourceValue] = useState(value);
    const [uploading, setUploading] = useState(false);
    const [imageAltModal, setImageAltModal] = useState<ImageAltModalState>(null);
    const [altDraft, setAltDraft] = useState("");
    const [modalMounted, setModalMounted] = useState(false);
    const [, setSelectionTick] = useState(0);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const altInputRef = useRef<HTMLInputElement>(null);
    const openAltModalRef = useRef<(state: Exclude<ImageAltModalState, null>) => void>(() => {});

    useEffect(() => setModalMounted(true), []);

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3, 4] },
          link: false,
        }),
        Link.configure({
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer nofollow", class: "text-[#D96B2B] underline" },
        }),
        Image.configure({ inline: false, allowBase64: false }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Underline,
        TableKit.configure({ table: { resizable: true } }),
      ],
      content: value || "<p></p>",
      editorProps: {
        attributes: {
          class: "blog-article-body tiptap-content focus:outline-none min-h-[460px] p-6 text-[#0B1F33] leading-relaxed text-base",
        },
        handleDoubleClickOn: (_view, _pos, node) => {
          if (node.type.name !== "image") return false;
          openAltModalRef.current({
            mode: "edit",
            src: (node.attrs.src as string) || "",
            alt: (node.attrs.alt as string) || "",
          });
          return true;
        },
      },
      onUpdate: ({ editor: currentEditor }) => {
        onChange(currentEditor.getHTML());
      },
    });

    useImperativeHandle(ref, () => ({
      insertHTML: (html: string) => {
        editor?.chain().focus().insertContent(html).run();
      },
      focus: () => editor?.chain().focus().run(),
    }));

    useEffect(() => {
      if (!editor) return;
      const current = editor.getHTML();
      if (value && value !== current) {
        editor.commands.setContent(value, { emitUpdate: false });
      }
    }, [editor, value]);

    useEffect(() => {
      if (!editor) return;
      const syncToolbar = () => setSelectionTick((n) => n + 1);
      editor.on("selectionUpdate", syncToolbar);
      editor.on("transaction", syncToolbar);
      return () => {
        editor.off("selectionUpdate", syncToolbar);
        editor.off("transaction", syncToolbar);
      };
    }, [editor]);

    useEffect(() => {
      if (!imageAltModal) return;
      const timer = window.setTimeout(() => altInputRef.current?.focus(), 50);
      return () => window.clearTimeout(timer);
    }, [imageAltModal]);

    if (!editor) {
      return (
        <div className="h-[460px] bg-[#FFF9F2] rounded-xl border border-[#E7DDD2] flex items-center justify-center text-sm font-semibold text-[#667085]">
          Loading luxury editor…
        </div>
      );
    }

    const openAltModal = (state: Exclude<ImageAltModalState, null>) => {
      setAltDraft(state.mode === "edit" ? state.alt : "");
      setImageAltModal(state);
    };
    openAltModalRef.current = openAltModal;

    const closeAltModal = () => {
      setImageAltModal(null);
      setAltDraft("");
    };

    const applyImageAlt = () => {
      if (!imageAltModal) return;
      const alt = altDraft.trim();
      if (imageAltModal.mode === "insert") {
        editor
          .chain()
          .focus()
          .setImage({ src: imageAltModal.src, alt: alt || undefined })
          .run();
        toast.success("Image inserted into post.");
      } else {
        editor
          .chain()
          .focus()
          .updateAttributes("image", { alt: alt || null })
          .run();
        toast.success("Image alt text updated.");
      }
      closeAltModal();
    };

    const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const result = await uploadClientImage(file);
        if (result.success && result.imageUrl) {
          openAltModal({ mode: "insert", src: result.imageUrl });
        } else {
          toast.error(result.error || "Failed to upload image");
        }
      } catch {
        toast.error("Failed to upload image");
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    };

    const setLink = () => {
      const previous = editor.getAttributes("link").href as string | undefined;
      const url = window.prompt("Enter link URL", previous || "https://");
      if (url === null) return;
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }
      editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
    };

    const toggleSource = () => {
      if (!showSource) {
        setSourceValue(editor.getHTML());
      } else {
        editor.commands.setContent(sourceValue);
        onChange(sourceValue);
      }
      setShowSource(!showSource);
    };

    return (
      <div className="rounded-2xl border border-[#E7DDD2] bg-white overflow-hidden shadow-sm transition-all focus-within:border-[#D96B2B]/60 focus-within:ring-4 focus-within:ring-[#D96B2B]/10">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-[#E7DDD2] bg-[#FFF9F2] p-2.5">
          {/* Headings */}
          <ToolbarButton
            title="Heading 2"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Heading 3"
            active={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Heading 4"
            active={editor.isActive("heading", { level: 4 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          >
            <Heading4 className="size-4" />
          </ToolbarButton>

          <Divider />

          {/* Inline Styles */}
          <ToolbarButton
            title="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Underline"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Strikethrough"
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="size-4" />
          </ToolbarButton>

          <Divider />

          {/* Alignment */}
          <ToolbarButton
            title="Align Left"
            active={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Align Center"
            active={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Align Right"
            active={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Justify"
            active={editor.isActive({ textAlign: "justify" })}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <AlignJustify className="size-4" />
          </ToolbarButton>

          <Divider />

          {/* Lists & Quotes */}
          <ToolbarButton
            title="Bullet List"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Numbered List"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Blockquote"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Horizontal Divider"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus className="size-4" />
          </ToolbarButton>

          <Divider />

          {/* Link */}
          <ToolbarButton
            title="Insert Link"
            active={editor.isActive("link")}
            onClick={setLink}
          >
            <Link2 className="size-4" />
          </ToolbarButton>

          {/* Image */}
          <ToolbarButton
            title="Upload Image"
            disabled={uploading}
            onClick={() => imageInputRef.current?.click()}
          >
            <ImageIcon className="size-4" />
          </ToolbarButton>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImagePick}
          />

          {/* Table */}
          <ToolbarButton
            title="Insert Table"
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
          >
            <TableIcon className="size-4" />
          </ToolbarButton>

          {/* Insert Button CTA Trigger */}
          {onCreateButton && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={onCreateButton}
              title="Insert Action Button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D96B2B]/10 hover:bg-[#D96B2B] text-[#D96B2B] hover:text-white transition-all text-xs font-bold uppercase tracking-wider cursor-pointer ml-1"
            >
              <MousePointerClick className="size-3.5" />
              <span>Add Button</span>
            </button>
          )}

          <div className="ml-auto flex items-center gap-1">
            <ToolbarButton
              title="Toggle HTML Source"
              active={showSource}
              onClick={toggleSource}
            >
              <Code2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Clear Formatting"
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            >
              <RemoveFormatting className="size-4" />
            </ToolbarButton>
            <Divider />
            <ToolbarButton
              title="Undo"
              disabled={!editor.can().undo()}
              onClick={() => editor.chain().focus().undo().run()}
            >
              <Undo2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Redo"
              disabled={!editor.can().redo()}
              onClick={() => editor.chain().focus().redo().run()}
            >
              <Redo2 className="size-4" />
            </ToolbarButton>
          </div>
        </div>

        {/* Content Area */}
        {showSource ? (
          <textarea
            value={sourceValue}
            onChange={(e) => {
              setSourceValue(e.target.value);
              onChange(e.target.value);
            }}
            rows={18}
            className="w-full p-6 font-mono text-xs text-[#0B1F33] bg-[#FFFDF9] outline-none resize-y min-h-[460px]"
            placeholder="Edit raw HTML..."
          />
        ) : (
          <EditorContent editor={editor} />
        )}

        {/* Image Alt Modal */}
        {imageAltModal && modalMounted && createPortal(
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white border border-[#E7DDD2] shadow-2xl rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-xl font-bold text-[#0B1F33]">
                  {imageAltModal.mode === "insert" ? "Image Alt Text (SEO)" : "Edit Alt Text"}
                </h4>
                <button
                  type="button"
                  onClick={closeAltModal}
                  className="p-1 rounded-full text-[#667085] hover:text-[#0B1F33] transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
              <p className="text-xs text-[#667085]">
                Describe this image for screen readers and search engines.
              </p>
              <input
                ref={altInputRef}
                type="text"
                value={altDraft}
                onChange={(e) => setAltDraft(e.target.value)}
                placeholder="e.g. Handmade linen journal with gold foil lettering"
                className="w-full px-4 py-3 bg-[#FFF9F2] border border-[#E7DDD2] rounded-xl text-sm font-medium text-[#0B1F33] outline-none focus:border-[#D96B2B]"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeAltModal}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#667085] hover:bg-[#FFF9F2] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyImageAlt}
                  className="px-6 py-2 bg-[#D96B2B] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#BC5420] transition-colors cursor-pointer shadow-sm"
                >
                  {imageAltModal.mode === "insert" ? "Insert Image" : "Save Alt"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }
);

export default TiptapEditor;
