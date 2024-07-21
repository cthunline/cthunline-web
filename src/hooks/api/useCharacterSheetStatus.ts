import { useCallback, useRef, useState } from 'react';

import type { CharacterSheetStatus } from '../../types/index.js';

const useCharacterSheetStatus = () => {
    const [status, setStatus] = useState<CharacterSheetStatus>('idle');

    const timer = useRef<number | null>(null);

    const updateStatus = useCallback((newStatus: CharacterSheetStatus) => {
        if (timer.current !== null) {
            window.clearTimeout(timer.current);
        }
        if (newStatus !== 'saving') {
            timer.current = window.setTimeout(() => {
                setStatus(newStatus);
            }, 500);
        } else {
            setStatus(newStatus);
        }
    }, []);

    return {
        status,
        updateStatus
    };
};

export default useCharacterSheetStatus;
