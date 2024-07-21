import React from 'react';

import './SvgIconButton.css';

interface SvgIconButtonProps {
    icon: JSX.Element;
    size: number;
    className?: string;
    onClick?: (e: React.MouseEvent<SVGCircleElement>) => void;
}

const SvgIconButton = ({
    icon,
    size,
    className,
    onClick
}: SvgIconButtonProps) => {
    const buttonPadding = size / 10;
    const buttonSize = size + buttonPadding * 2;
    const circleRadius = buttonSize / 2;

    const iconWithProps = React.cloneElement(icon, {
        className: 'sketch-image-delete-button-circle-icon',
        size,
        x: buttonPadding.toString(),
        y: buttonPadding.toString()
    });

    return (
        <svg
            className={`svg-icon-button ${className}`}
            width={buttonSize}
            height={buttonSize}
            viewBox={`0 0 ${buttonSize} ${buttonSize}`}
        >
            {iconWithProps}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: */}
            <circle
                cx={circleRadius}
                cy={circleRadius}
                r={circleRadius}
                onClick={onClick}
            />
        </svg>
    );
};

export default SvgIconButton;
