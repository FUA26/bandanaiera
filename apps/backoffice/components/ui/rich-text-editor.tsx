'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Strikethrough, Italic, List, ListOrdered, Heading1, Heading2, Quote, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="border border-input bg-background rounded-t-md p-1 flex gap-1 flex-wrap items-center">
            <Button
                type="button"
                variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className="h-8 w-8 p-0"
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className="h-8 w-8 p-0"
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className="h-8 w-8 p-0"
            >
                <Strikethrough className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="w-[1px] h-6 mx-1 my-auto" />

            <Button
                type="button"
                variant={editor.isActive('heading', { level: 1 }) ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className="h-8 w-8 p-0"
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className="h-8 w-8 p-0"
            >
                <Heading2 className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="w-[1px] h-6 mx-1 my-auto" />

            <Button
                type="button"
                variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className="h-8 w-8 p-0"
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className="h-8 w-8 p-0"
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className="h-8 w-8 p-0"
            >
                <Quote className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="w-[1px] h-6 mx-1 my-auto" />

            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="h-8 w-8 p-0"
            >
                <Undo className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="h-8 w-8 p-0"
            >
                <Redo className="h-4 w-4" />
            </Button>
        </div>
    );
};

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none border-x border-b border-input rounded-b-md p-4 min-h-[200px] focus:outline-none bg-background',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className="flex flex-col w-full">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
