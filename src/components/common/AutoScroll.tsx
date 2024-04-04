import { useEffect, useRef } from 'react';
import { Box } from '@mantine/core';

const AutoScroll = () => {
    const scrollElement = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        scrollElement.current?.scrollIntoView();
    });

    return <Box ref={scrollElement} />;
};

export default AutoScroll;
