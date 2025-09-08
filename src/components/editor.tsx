import type { Editor, JSONContent } from "@tiptap/react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";

const extensions = [
  StarterKit.configure({
    code: false,
    codeBlock: false,
    blockquote: false,
    italic: false,
    link: false,
    orderedList: false,
    strike: false,
    underline: false,
    trailingNode: false,
    bulletList: false,
    listItem: false,
    heading: {
      levels: [3],
      HTMLAttributes: {
        class: "text-xs font-semibold",
      },
    },
  }),
];

const MenuBar = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  return (
    <div>
      <div className="button-group inline-flex gap-2">
        <Button
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={editorState.isHeading3 ? "is-active" : ""}
        >
          Heading
        </Button>
        <Button
          variant="outline"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editorState.isParagraph ? "is-active" : ""}
        >
          Paragraph
        </Button>
        <Button
          variant="outline"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={editorState.isBold ? "is-active" : ""}
        >
          Bold
        </Button>
        <Button
          variant="outline"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
        >
          Undo
        </Button>
        <Button
          variant="outline"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
        >
          Redo
        </Button>
      </div>
    </div>
  );
};

export const InvoiceFooterEditor = () => {
  const editor = useEditor({
    extensions,
  });

  const [content, setContent] = useState<JSONContent>();

  return (
    <div className="p-4 grid gap-4">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <Button
        onClick={() => {
          setContent(editor.getJSON());
        }}
      >
        Save
      </Button>
      {content && <Readonly content={content} />}
    </div>
  );
};

const Readonly = ({ content }: { content?: JSONContent }) => {
  const editor = useEditor({
    editable: false,
    extensions,
    content: content,
  });

  // debug only
  // useEffect(() => {
  //   if (!editor || !content) {
  //     return;
  //   }

  //   const currentEditorContent = JSON.stringify(editor.getJSON());
  //   const newContent = JSON.stringify(content);

  //   if (currentEditorContent !== newContent) {
  //     editor.commands.setContent(content);
  //   }
  // }, [editor, content]);

  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap">
      <EditorContent editor={editor} />
    </div>
  );
};
