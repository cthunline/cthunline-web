import { Box } from '@mantine/core';
import { useEffect, useRef } from 'react';

const AutoScroll = () => {
    const scrollElement = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        scrollElement.current?.scrollIntoView();
    });

    return <Box ref={scrollElement} />;
};

export default AutoScroll;
