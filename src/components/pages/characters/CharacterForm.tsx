import React, {
    // useRef,
    useCallback,
    useEffect,
    useState
} from 'react';
import { useParams } from 'react-router-dom';

import useCharacter from '../../hooks/useCharacter';
// import { Character, CharacterData } from '../../../types';
import { Character } from '../../../types';
import { CharacterSheet } from '../../ui';

const CharacterForm = () => {
    // const { gameId, characterId } = useParams();
    // const { getCharacter, editCharacter } = useCharacter();
    const { characterId } = useParams();
    const { getCharacter } = useCharacter();

    const [character, setCharacter] = useState<Character>();

    const onChange = useCallback((/* data: CharacterData */) => {
        // console.log('changed');
        // console.log(data);
        // setCharacter((previous) => (
        //     previous ? {
        //         ...previous,
        //         data
        //     } : previous
        // ));
    }, []);

    useEffect(() => {
        (async () => {
            if (characterId) {
                const char = await getCharacter(characterId);
                setCharacter(char);
            }
        })();
    }, [
        characterId,
        getCharacter
    ]);

    // const changeTime = 1000;
    // const changeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    // const onChange = (data: CharacterData, instantRefresh?: boolean) => {
    //     console.log('changed');
    //     console.log(data);
    //     if (characterId) {
    //         const { name, occupation } = data.biography;
    //         const editData = {
    //             characterId,
    //             data: {
    //                 name: `${name} (${occupation})`,
    //                 data
    //             },
    //             isToast: false
    //         };
    //         if (instantRefresh) {
    //             editCharacter({
    //                 ...editData,
    //                 isRefresh: true
    //             });
    //         } else {
    //             if (changeTimer.current) {
    //                 clearTimeout(changeTimer.current);
    //             }
    //             changeTimer.current = setTimeout(() => {
    //                 editCharacter({
    //                     ...editData,
    //                     isRefresh: false
    //                 });
    //             }, changeTime);
    //         }
    //     }
    // };

    return character ? (
        <CharacterSheet
            readonly={false}
            gameId={character.gameId}
            data={character.data}
            onChange={onChange}
        />
    ) : null;
};

export default CharacterForm;
