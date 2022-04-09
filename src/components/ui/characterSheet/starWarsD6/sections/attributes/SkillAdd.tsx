import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import { Box, IconButton } from '@mui/material';
import { FiPlusCircle } from 'react-icons/fi';

import AutocompleteInput from '../../../../autocompleteInput/AutocompleteInput';
import {
    SWD6Attribute,
    SWD6Skill
} from '../../../../../../types/games/starWarsD6';
import {
    skillList,
    defaultSkillData
} from './skills.data';

interface SkillProps {
    attribute: SWD6Attribute;
    onSubmit: (attribute: SWD6Attribute, data: SWD6Skill) => void;
}

const SkillAdd: React.FC<SkillProps> = ({
    attribute,
    onSubmit
}) => {
    const [selectorValue, setSelectorValue] = useState<SWD6Skill | null>(null);
    const [skillData, setSkillData] = useState<SWD6Skill>(defaultSkillData);
    const [error, setError] = useState<boolean>(false);

    const controlForm = (): boolean => {
        const { name } = skillData;
        setError(!name);
        return !!name;
    };

    const userChanged = useRef<boolean>(false);
    useEffect(() => {
        if (userChanged.current) {
            setError(!skillData.name);
        }
    }, [skillData]);

    const onSelectorChange = (result: SWD6Skill | null) => {
        userChanged.current = true;
        setSelectorValue(result);
        if (result) {
            setSkillData(result);
        } else {
            setSkillData(defaultSkillData);
        }
    };

    return (
        <Box gridColumn="span 12" display="grid" gridTemplateColumns="repeat(15, 1fr)">
            <Box gridColumn="span 13" alignItems="center">
                <AutocompleteInput<SWD6Skill>
                    options={skillList[attribute].map((name) => ({
                        name,
                        value: ''
                    }))}
                    defaultValue={defaultSkillData}
                    label="Select or create Skill"
                    value={selectorValue}
                    size="small"
                    error={error}
                    onChange={onSelectorChange}
                />
            </Box>
            <Box className="center-text" gridColumn="span 2" alignItems="center">
                <IconButton
                    size="medium"
                    onClick={() => {
                        if (controlForm()) {
                            onSubmit(attribute, {
                                ...defaultSkillData,
                                ...skillData
                            } as SWD6Skill);
                            setSelectorValue(null);
                            setSkillData(defaultSkillData);
                            userChanged.current = false;
                            setError(false);
                        }
                    }}
                >
                    <FiPlusCircle />
                </IconButton>
            </Box>
        </Box>
    );
};

export default SkillAdd;
