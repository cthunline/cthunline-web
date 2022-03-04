import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import Api from '../../services/api';
import { Game } from '../../types';

const useGame = () => {
    const [gameList, setGameList] = useState<Game[]>([]);

    const getGame = (gameId: string) => (
        gameList.find(({ id }) => gameId === id)
    );

    useEffect(() => {
        (async () => {
            try {
                const { games } = await Api.call({
                    method: 'GET',
                    route: '/games'
                });
                setGameList(games);
            } catch (err: any) {
                toast.error(err.message);
            }
        })();
    }, []);

    return {
        gameList,
        getGame
    };
};

export default useGame;
