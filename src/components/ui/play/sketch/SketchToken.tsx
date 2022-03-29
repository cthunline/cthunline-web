import React from 'react';

import { SketchTokenColor, SketchTokenUser } from '../../../../types';

import './SketchToken.css';

interface SketchTokenProps {
    size: number;
    color: SketchTokenColor;
    user: SketchTokenUser | null;
    x: number;
    y: number;
    className?: string;
    onRef?: (el: SVGSVGElement | null) => void;
    onMouseDown?: (e: React.MouseEvent<SVGCircleElement>) => void;
}

const SketchToken: React.FC<SketchTokenProps> = ({
    size,
    color,
    user,
    x,
    y,
    className,
    onRef,
    onMouseDown
}) => {
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
        >
            <circle
                className="sketch-token-circle"
                cx={circleRadius + tokenPadding}
                cy={circleRadius + tokenPadding}
                r={circleRadius}
                stroke="red"
                strokeWidth={circleStrokeSize}
                fill={`var(--palette-token-${color})`}
                onMouseDown={onMouseDown}
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
        </svg>
    );
};

export default SketchToken;
