import { TextStyleKit } from "@tiptap/extension-text-style";
import type { Content, Editor, JSONContent } from "@tiptap/react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

const extensions = [TextStyleKit, StarterKit];

const MenuBar = ({ editor }: { editor: Editor }) => {
  // Read the current editor's state, and re-render the component when it changes
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        // isItalic: ctx.editor.isActive("italic") ?? false,
        // canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        // isStrike: ctx.editor.isActive("strike") ?? false,
        // canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        // isCode: ctx.editor.isActive("code") ?? false,
        // canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        // canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        // isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        // isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        // isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
        // isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
        // isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        // isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        // isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        // isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={editorState.isHeading3 ? "is-active" : ""}
        >
          Heading
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editorState.isParagraph ? "is-active" : ""}
        >
          Paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={editorState.isBold ? "is-active" : ""}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editorState.isBulletList ? "is-active" : ""}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
        >
          Redo
        </button>
      </div>
    </div>
  );
};

export const InvoiceFooterEditor = () => {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions,
  });

  const [content, setContent] = useState<JSONContent>();

  return (
    <div className="tiptap">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <button
        onClick={() => {
          setContent(editor.getJSON());
        }}
      >
        Save
      </button>
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
