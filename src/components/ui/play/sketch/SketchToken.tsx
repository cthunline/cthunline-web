import React, { useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';

import { useApp } from '../../../contexts/App';
import SketchItemContextMenu, { ContextMenuData } from './SketchItemContextMenu';
import { getCssVar, getTextColor } from '../../../../services/tools';
import {
    Color,
    SessionUser,
    SketchTokenAttachedData,
    TooltipPlacement
} from '../../../../types';

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
    isMoving: boolean;
    className?: string;
    onRef?: (el: SVGSVGElement | null) => void;
    onMouseDown?: (e: React.MouseEvent<SVGSVGElement>, isMovable?: boolean) => void;
    onAttach?: (user: SessionUser) => void;
    onUnattach?: () => void;
    onDuplicate?: () => void;
    onColorChange?: (color: Color) => void;
    onDelete?: () => void;
}

const SketchToken: React.FC<SketchTokenProps> = ({
    id,
    isMaster,
    size,
    color,
    attachedData,
    x,
    y,
    tooltipPlacement,
    isMoving,
    className,
    onRef,
    onMouseDown,
    onAttach,
    onUnattach,
    onDuplicate,
    onColorChange,
    onDelete
}) => {
    const { userId } = useApp();

    const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
    const [contextMenu, setContextMenu] = useState<ContextMenuData | null>(null);

    const onTooltipClose = () => {
        setTooltipOpen(false);
    };

    const onTooltipOpen = (e: React.SyntheticEvent) => {
        const target = e.target as Element;
        if (
            !target.classList.contains('context-menu')
            && !target.closest('.context-menu')
        ) {
            setTooltipOpen(true);
        }
    };

    const onContextMenuOpen = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isMaster) {
            setContextMenu(contextMenu ? null : {
                left: e.clientX,
                top: e.clientY
            });
        }
    };

    const onContextMenuClose = () => {
        setContextMenu(null);
        setTooltipOpen(false);
    };

    useEffect(() => {
        onContextMenuClose();
    }, [isMoving]);

    const tokenPadding = size / 15;
    const tokenSize = size + tokenPadding * 2;
    const circleRadius = size / 2;
    const circleStrokeSize = tokenPadding;
    const fontSize = size * 0.75;
    const textX = '50%';
    const textY = fontSize + tokenPadding;

    const isMovable = !!(isMaster || (attachedData && attachedData.userId === userId));

    const hexColor = getCssVar(`--palette-${color}`);
    const textColor = `var(--palette-${getTextColor(hexColor)})`;

    return (
        <Tooltip
            title={attachedData ? (
                `${attachedData.characterName} (${attachedData.userName})`
            ) : ''}
            placement={tooltipPlacement}
            open={tooltipOpen && !isMoving && !contextMenu}
            onOpen={onTooltipOpen}
            onClose={onTooltipClose}
        >
            <svg
                ref={onRef}
                id={`sketch-token-${id}`}
                className={`sketch-token ${isMovable ? 'movable' : ''} ${className}`}
                viewBox={`0 0 ${tokenSize} ${tokenSize}`}
                width={tokenSize}
                height={tokenSize}
                x={x}
                y={y}
                onMouseDown={(e) => onMouseDown?.(e, isMovable)}
                onContextMenu={onContextMenuOpen}
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
                        {attachedData.characterName.charAt(0).toLocaleUpperCase()}
                    </text>
                ) : null}
                {isMaster ? (
                    <SketchItemContextMenu
                        open={!!contextMenu}
                        position={contextMenu ?? undefined}
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
