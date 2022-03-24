import React from 'react';

import './SvgIconButton.css';

interface SvgIconButtonProps {
    icon: JSX.Element;
    size: number;
    className?: string;
    onClick?: () => void;
}

const SvgIconButton: React.FC<SvgIconButtonProps> = ({
    icon,
    size,
    className,
    onClick
}) => {
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
            width={buttonSize.toString()}
            height={buttonSize.toString()}
            viewBox={`0 0 ${buttonSize.toString()}$ ${buttonSize.toString()}`}
        >
            {iconWithProps}
            <circle
                className="sketch-image-delete-button-circle"
                cx={circleRadius.toString()}
                cy={circleRadius.toString()}
                r={circleRadius.toString()}
                onClick={onClick}
            />
        </svg>
    );
};

export default SvgIconButton;
