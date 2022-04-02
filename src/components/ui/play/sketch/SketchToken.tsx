import React, { useState } from 'react';

import { useAuth } from '../../../contexts/Auth';
import { SessionUser, SketchTokenColor, SketchTokenUser } from '../../../../types';
import SketchItemContextMenu, { ContextMenuData } from './SketchItemContextMenu';
import { getCssVar, getTextColor } from '../../../../services/tools';

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
    onMouseDown?: (e: React.MouseEvent<SVGSVGElement>, isMovable?: boolean) => void;
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
    const { userId } = useAuth();

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

    const isMovable = !!(isMaster || (user && user.id === userId));

    const hexColor = getCssVar(`--palette-token-${color}`);
    const textColor = `var(--palette-${getTextColor(hexColor)})`;

    return (
        <svg
            ref={onRef}
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
                stroke="var(--palette-gray)"
                strokeWidth={circleStrokeSize}
                fill={color}
            />
            {user ? (
                <text
                    className="sketch-token-text"
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    alignmentBaseline="central"
                    stroke={textColor}
                    strokeWidth="2px"
                    fill={textColor}
                    fontSize={fontSize}
                >
                    {userLetter}
                </text>
            ) : null}
            {isMaster ? (
                <SketchItemContextMenu
                    open={!!contextMenu}
                    position={contextMenu ?? undefined}
                    onAssign={onAssign}
                    onUnassign={onUnassign}
                    onDelete={onDelete}
                    onClose={onContextMenuClose}
                />
            ) : null}
        </svg>
    );
};

export default SketchToken;
