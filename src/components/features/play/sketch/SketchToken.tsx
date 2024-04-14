import { useEffect, useState } from 'react';
import { Tooltip } from '@mantine/core';

import { getCssVar, getTextColor } from '../../../../services/tools.js';
import { useApp } from '../../../contexts/App.js';
import SketchContextMenu, {
    type ContextMenuPosition,
    contextMenuHandler
} from './SketchContextMenu.js';
import {
    type Color,
    type SessionUser,
    type SketchTokenAttachedData,
    type TooltipPlacement
} from '../../../../types/index.js';

import './SketchToken.css';

interface SketchTokenProps {
    id: string;
    isMaster?: boolean;
    size: number;
    color: Color;
    attachedData: SketchTokenAttachedData | null;
    x: number;
    y: number;
    tooltipPlacement: TooltipPlacement;
    isDrawing: boolean;
    isMoving: boolean;
    className?: string;
    onRef?: (el: SVGSVGElement | null) => void;
    onMouseDown?: (
        e: React.MouseEvent<SVGSVGElement>,
        isMovable?: boolean
    ) => void;
    onAttach?: (user: SessionUser) => void;
    onUnattach?: () => void;
    onDuplicate?: () => void;
    onColorChange?: (color: Color) => void;
    onDelete?: () => void;
}

const SketchToken = ({
    id,
    isMaster,
    size,
    color,
    attachedData,
    x,
    y,
    tooltipPlacement,
    isDrawing,
    isMoving,
    className,
    onRef,
    onMouseDown,
    onAttach,
    onUnattach,
    onDuplicate,
    onColorChange,
    onDelete
}: SketchTokenProps) => {
    const { userId } = useApp();

    const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
    const [contextMenuPosition, setContextMenuPosition] =
        useState<ContextMenuPosition | null>(null);

    const onTooltipClose = () => {
        setTooltipOpen(false);
    };

    const onTooltipOpen = (e: React.SyntheticEvent) => {
        const target = e.target as Element;
        if (
            !target.classList.contains('context-menu') &&
            !target.closest('.context-menu')
        ) {
            setTooltipOpen(true);
        }
    };

    const onContextMenu = (pos: ContextMenuPosition) => {
        if (isMaster && !isDrawing) {
            setContextMenuPosition(pos);
        }
    };

    const onContextMenuClose = () => {
        setContextMenuPosition(null);
        setTooltipOpen(false);
    };

    useEffect(() => {
        if (isMoving || isDrawing) {
            onContextMenuClose();
        }
    }, [isMoving, isDrawing]);

    const tokenPadding = size / 15;
    const tokenSize = size + tokenPadding * 2;
    const circleRadius = size / 2;
    const circleStrokeSize = tokenPadding;
    const fontSize = size * 0.75;
    const textX = '50%';
    const textY = fontSize + tokenPadding;

    const isMovable = !!(
        isMaster ||
        (attachedData && attachedData.userId === userId)
    );

    const hexColor = getCssVar(`--palette-${color}`);
    const textColor = `var(--palette-${getTextColor(hexColor)})`;

    const tooltipLabel = attachedData
        ? `${attachedData.characterName} (${attachedData.userName})`
        : '';

    return (
        <Tooltip
            label={tooltipLabel}
            position={tooltipPlacement}
            opened={
                !!tooltipLabel &&
                tooltipOpen &&
                !isMoving &&
                !contextMenuPosition
            }
        >
            <svg
                ref={onRef}
                id={`sketch-token-${id}`}
                className={`sketch-token ${
                    isMovable ? 'movable' : ''
                } ${className}`}
                viewBox={`0 0 ${tokenSize} ${tokenSize}`}
                width={tokenSize}
                height={tokenSize}
                x={x}
                y={y}
                onMouseEnter={onTooltipOpen}
                onMouseLeave={onTooltipClose}
                onMouseDown={(e) => onMouseDown?.(e, isMovable)}
                onContextMenu={contextMenuHandler<SVGSVGElement>(
                    onContextMenu,
                    onContextMenuClose
                )}
            >
                <circle
                    className="sketch-token-circle"
                    cx={circleRadius + tokenPadding}
                    cy={circleRadius + tokenPadding}
                    r={circleRadius}
                    stroke="var(--palette-background-tertiary)"
                    strokeWidth={circleStrokeSize}
                    fill={`var(--palette-${color})`} // eslint-disable-line react/no-unknown-property
                />
                {attachedData ? (
                    <text
                        className="sketch-token-text"
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        alignmentBaseline="central"
                        stroke={textColor}
                        strokeWidth="2px"
                        fill={textColor} // eslint-disable-line react/no-unknown-property
                        fontSize={fontSize}
                    >
                        {attachedData.characterName
                            .charAt(0)
                            .toLocaleUpperCase()}
                    </text>
                ) : null}
                {isMaster ? (
                    <SketchContextMenu
                        position={contextMenuPosition}
                        onAttach={onAttach}
                        onUnattach={onUnattach}
                        onDuplicate={onDuplicate}
                        onColorChange={onColorChange}
                        onDelete={onDelete}
                        onClose={onContextMenuClose}
                    />
                ) : null}
            </svg>
        </Tooltip>
    );
};

export default SketchToken;
