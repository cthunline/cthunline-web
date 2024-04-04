import { Anchor } from '@mantine/core';
import {
    Link as ReactRouterLink,
    type LinkProps as ReactRouterLinkProps
} from 'react-router-dom';

const Link = (props: ReactRouterLinkProps) => (
    <Anchor {...props} component={ReactRouterLink} />
);

export default Link;
