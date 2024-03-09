import { useEffect, useRef } from 'react';

const AutoScroll = () => {
    const scrollElement = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        scrollElement.current?.scrollIntoView();
    });

    return <div ref={scrollElement} />;
};

export default AutoScroll;
