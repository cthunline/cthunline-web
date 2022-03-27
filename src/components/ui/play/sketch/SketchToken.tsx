import React from 'react';

import { SessionUser } from '../../../../types';

import './SketchToken.css';

interface SketchTokenProps {
    size: number;
    user: SessionUser;
    className?: string;
    onMouseDown?: (e: React.MouseEvent<SVGCircleElement>) => void;
}

const SketchToken: React.FC<SketchTokenProps> = ({
    size,
    user,
    className,
    onMouseDown
}) => {
    const tokenPadding = size / 15;
    const tokenSize = size + tokenPadding * 2;
    const circleRadius = size / 2;
    const circleStrokeSize = tokenPadding;
    const fontSize = size * 0.75;
    const textX = '50%';
    const textY = fontSize + tokenPadding;

    const userLetter = user.name.charAt(0).toLocaleUpperCase();

    return (
        <svg
            className={`sketch-token ${className}`}
            width={tokenSize}
            height={tokenSize}
            viewBox={`0 0 ${tokenSize} ${tokenSize}`}
        >
            <circle
                className="sketch-token-circle"
                cx={circleRadius + tokenPadding}
                cy={circleRadius + tokenPadding}
                r={circleRadius}
                stroke="red"
                strokeWidth={circleStrokeSize}
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
