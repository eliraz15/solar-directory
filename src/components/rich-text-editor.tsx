"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useState } from "react";

export function RichTextEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [html, setHtml] = useState(defaultValue ?? "");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content: defaultValue ?? "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[240px] rounded border border-border px-3 py-2 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  return (
    <div>
      {editor && (
        <div className="mb-2 flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="rounded border border-border px-2 py-1 font-bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="rounded border border-border px-2 py-1 italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="rounded border border-border px-2 py-1"
          >
            כותרת
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="rounded border border-border px-2 py-1"
          >
            רשימה
          </button>
          <button
            type="button"
            onClick={() => {
              const url = window.prompt("כתובת הקישור");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            className="rounded border border-border px-2 py-1"
          >
            קישור
          </button>
        </div>
      )}
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} readOnly />
    </div>
  );
}
