import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import { Box, TextField, Checkbox } from '@mui/material';

import { CoCSkill } from '../../../../../../types/games/callOfCthulhu';
import { skillKeys } from './skills.data';
import { controlSkill } from './skills.helper';

interface SkillProps {
    data: CoCSkill;
    readonly: boolean;
    handleChange: (data: CoCSkill) => void;
}

const Skill: React.FC<SkillProps> = ({
    data,
    readonly,
    handleChange
}) => {
    const [skill, setSkill] = useState<CoCSkill>(data);

    const initialRender = useRef(true);
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            handleChange(skill);
        }
    }, [
        handleChange,
        skill
    ]);

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
        >
            <Box gridColumn="span 1" display="grid" alignItems="center">
                {skill.development ? (
                    <Checkbox
                        checked={skill.developed}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setSkill((previous) => (
                                controlSkill({
                                    ...previous,
                                    developed: e.target.checked
                                })
                            ));
                        }}
                    />
                ) : null}
            </Box>
            <Box gridColumn="span 6" display="grid" alignItems="center">
                <TextField
                    fullWidth
                    InputProps={{
                        readOnly: readonly
                    }}
                    type="text"
                    size="small"
                    value={skill.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSkill((previous) => (
                            controlSkill({
                                ...previous,
                                name: e.target.value
                            })
                        ));
                    }}
                />
            </Box>
            <Box gridColumn="span 2" display="grid" alignItems="center">
                <TextField
                    fullWidth
                    InputProps={{
                        readOnly: readonly
                    }}
                    type="text"
                    size="small"
                    label="Base"
                    value={skill.base}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSkill((previous) => (
                            controlSkill({
                                ...previous,
                                base: e.target.value
                            })
                        ));
                    }}
                />
            </Box>
            {skillKeys.map(({ key, label, editable }) => (
                <Box
                    key={key.toString()}
                    gridColumn="span 1"
                    alignItems="center"
                >
                    <TextField
                        fullWidth
                        disabled={!editable}
                        InputProps={{
                            readOnly: readonly
                        }}
                        type="text"
                        size="small"
                        label={label}
                        value={skill[key]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setSkill((previous) => (
                                controlSkill({
                                    ...previous,
                                    [key]: Number(e.target.value)
                                })
                            ));
                        }}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default Skill;
