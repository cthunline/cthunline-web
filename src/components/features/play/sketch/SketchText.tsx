import { useCallback, useEffect, useState } from 'react';

import type { Color } from '../../../../types/index.js';
import SketchContextMenu, {
    contextMenuHandler,
    type ContextMenuPosition
} from './SketchContextMenu.js';

import './SketchText.css';

interface SketchTextProps {
    id: string;
    isMaster?: boolean;
    text: string;
    fontSize: number;
    color: Color;
    x: number;
    y: number;
    selected?: boolean;
    isDrawing: boolean;
    moving?: boolean;
    onRef?: (el: SVGSVGElement | null) => void;
    onMouseDown?: (e: React.MouseEvent<SVGTextElement>) => void;
    onLoad?: (element: SVGSVGElement | null) => void;
    onEdit?: (text: string) => void;
    onColorChange?: (color: Color) => void;
    onFontSizeChange?: (fontSize: number) => void;
    onDelete?: () => void;
}

const SketchText = ({
    id,
    isMaster,
    text,
    color,
    fontSize,
    x,
    y,
    selected,
    isDrawing,
    moving,
    onMouseDown,
    onLoad,
    onEdit,
    onColorChange,
    onFontSizeChange,
    onDelete
}: SketchTextProps) => {
    const [contextMenuPosition, setContextMenuPosition] =
        useState<ContextMenuPosition | null>(null);

    const onContextMenu = (pos: ContextMenuPosition) => {
        if (isMaster && !isDrawing) {
            setContextMenuPosition(pos);
        }
    };

    const onContextMenuClose = useCallback(() => {
        setContextMenuPosition(null);
    }, []);

    useEffect(() => {
        if (moving || isDrawing) {
            onContextMenuClose();
        }
    }, [moving, isDrawing, onContextMenuClose]);

    return (
        <>
            {/* text element */}
            <text
                id={`sketch-text-${id}`}
                className={`sketch-text ${isMaster ? 'selectable' : ''} ${selected ? 'selected' : ''} ${moving ? 'moving' : ''}`}
                textAnchor="start"
                stroke={`var(--palette-${color})`}
                strokeWidth="1px"
                fill={`var(--palette-${color})`}
                fontSize={fontSize}
                x={x}
                y={y}
                onLoad={(e) => onLoad?.(e.currentTarget.closest('svg'))}
                onMouseDown={onMouseDown}
                onContextMenu={contextMenuHandler<SVGTextElement>(
                    onContextMenu,
                    onContextMenuClose
                )}
            >
                {text}
            </text>
            {isMaster ? (
                <SketchContextMenu
                    position={contextMenuPosition}
                    editValue={text}
                    onEdit={onEdit}
                    onColorPick={onColorChange}
                    onFontSizePick={onFontSizeChange}
                    onDelete={onDelete}
                    onClose={onContextMenuClose}
                />
            ) : null}
        </>
    );
};

export default SketchText;
