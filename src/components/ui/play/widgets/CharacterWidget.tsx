import React from 'react';

import Widget from '../Widget';
import { WidgetType } from '../../../../types';

interface CharacterWidgetProps {
    onClose: (widget: WidgetType) => void;
}

const CharacterWidget: React.FC<CharacterWidgetProps> = ({
    onClose
}) => (
    <Widget
        title="Character"
        onClose={() => onClose(WidgetType.character)}
    >
        {/*  */}
    </Widget>
);

export default CharacterWidget;
