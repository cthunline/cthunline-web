import React, { useRef } from 'react';
import DOMPurify from 'dompurify';
import {
    Box,
    ButtonGroup,
    Button
} from '@mui/material';
import {
    MdFormatBold,
    MdFormatItalic,
    MdFormatUnderlined
} from 'react-icons/md';

import './TextEditor.css';

interface TextEditorProps {
    className?: string;
    value?: string;
    onChange?: (html: string) => void;
}

const actionElements = {
    bold: 'b',
    italic: 'i',
    underline: 'u'
};

type Action = keyof typeof actionElements;

const TextEditor: React.FC<TextEditorProps> = ({
    className,
    value = '',
    onChange
}) => {
    const defaultValue = useRef<string>(value);

    const editorRef = useRef<HTMLDivElement | null>(null);

    const onInput = (e: React.FormEvent<HTMLDivElement>) => {
        onChange?.(e.currentTarget.innerHTML);
    };

    const onAction = (action: Action) => {
        const range = window.getSelection()?.getRangeAt(0);
        if (range) {
            const isInEditor = (
                range.commonAncestorContainer?.parentElement?.closest('.text-editor')
            );
            if (isInEditor) {
                const actionElement = document.createElement(actionElements[action]);
                range.surroundContents(actionElement);
            }
        }
    };

    return (
        <Box className={`text-editor flex column ${className ?? ''}`}>
            <Box className="text-editor-bar">
                <ButtonGroup>
                    <Button onClick={() => onAction('bold')}>
                        <MdFormatBold size={20} />
                    </Button>
                    <Button onClick={() => onAction('italic')}>
                        <MdFormatItalic size={20} />
                    </Button>
                    <Button onClick={() => onAction('underline')}>
                        <MdFormatUnderlined size={20} />
                    </Button>
                </ButtonGroup>
            </Box>
            <div
                ref={editorRef}
                className="text-editor-content grow scroll-always"
                contentEditable
                onInput={onInput}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(defaultValue.current)
                }}
            />
        </Box>
    );
};

export default TextEditor;
