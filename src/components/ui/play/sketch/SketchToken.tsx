import React, { useState } from 'react';

import { SessionUser, SketchTokenColor, SketchTokenUser } from '../../../../types';
import SketchItemContextMenu, { ContextMenuData } from './SketchItemContextMenu';

import './SketchToken.css';

interface SketchTokenProps {
    isMaster?: boolean;
    size: number;
    color: SketchTokenColor;
    user: SketchTokenUser | null;
    x: number;
    y: number;
    className?: string;
    onRef?: (el: SVGSVGElement | null) => void;
    onMouseDown?: (e: React.MouseEvent<SVGSVGElement>) => void;
    onAssign?: (user: SessionUser) => void;
    onUnassign?: () => void;
    onDelete?: () => void;
}

const SketchToken: React.FC<SketchTokenProps> = ({
    isMaster,
    size,
    color,
    user,
    x,
    y,
    className,
    onRef,
    onMouseDown,
    onAssign,
    onUnassign,
    onDelete
}) => {
    const [contextMenu, setContextMenu] = useState<ContextMenuData | null>(null);

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
    };

    const tokenPadding = size / 15;
    const tokenSize = size + tokenPadding * 2;
    const circleRadius = size / 2;
    const circleStrokeSize = tokenPadding;
    const fontSize = size * 0.75;
    const textX = '50%';
    const textY = fontSize + tokenPadding;

    const userLetter = user ? (
        user.name.charAt(0).toLocaleUpperCase()
    ) : null;

    return (
        <svg
            ref={onRef}
            className={`sketch-token ${className}`}
            viewBox={`0 0 ${tokenSize} ${tokenSize}`}
            width={tokenSize}
            height={tokenSize}
            x={x}
            y={y}
            onMouseDown={onMouseDown}
            onContextMenu={onContextMenuOpen}
        >
            <circle
                className="sketch-token-circle"
                cx={circleRadius + tokenPadding}
                cy={circleRadius + tokenPadding}
                r={circleRadius}
                stroke="red"
                strokeWidth={circleStrokeSize}
                fill={`var(--palette-token-${color})`}
            />
            <text
                className="sketch-token-text"
                x={textX}
                y={textY}
                textAnchor="middle"
                alignmentBaseline="central"
                stroke="red"
                strokeWidth="2px"
                fill="red"
                fontSize={fontSize}
            >
                {userLetter}
            </text>
            <SketchItemContextMenu
                open={!!contextMenu}
                position={contextMenu ?? undefined}
                onAssign={user ? undefined : onAssign}
                onUnassign={user ? onUnassign : undefined}
                onDelete={onDelete}
                onClose={onContextMenuClose}
            />
        </svg>
    );
};

export default SketchToken;
