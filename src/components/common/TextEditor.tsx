import type { BoxProps } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface TextEditorProps extends BoxProps {
    readonly?: boolean;
    value: string;
    onChange?: (val: string) => void;
}

const TextEditor = ({
    readonly,
    value,
    onChange,
    ...props
}: TextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] })
        ],
        content: value,
        editable: !readonly,
        onUpdate: ({ editor: e }) => onChange?.(e.getHTML())
    });

    useEffect(() => {
        editor?.setEditable(!readonly);
    }, [editor, readonly]);

    useEffect(() => {
        if (readonly) {
            editor?.commands.setContent(value);
        }
    }, [editor, value, readonly]);

    return (
        <RichTextEditor
            {...props}
            editor={editor}
            styles={{
                root: {
                    minHeight: '8rem',
                    display: 'flex',
                    flexDirection: 'column'
                },
                toolbar: {
                    display: readonly ? 'none' : undefined
                },
                typographyStylesProvider: {
                    height: 0,
                    flexGrow: 1,
                    flexBasis: 0
                },
                content: {
                    height: '100%',
                    overflowY: 'auto'
                }
            }}
        >
            <RichTextEditor.Toolbar>
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                </RichTextEditor.ControlsGroup>
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                </RichTextEditor.ControlsGroup>
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Undo />
                    <RichTextEditor.Redo />
                </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content />
        </RichTextEditor>
    );
};

export default TextEditor;
