import React from 'react';
import {
    Home,
    Characters,
    CharacterForm,
    Assets,
    Profile,
    Users,
    UserForm,
    Sessions,
    SessionForm,
    Play
} from './pages';

export interface RouterPage {
    path: string;
    element: JSX.Element;
    showNav: boolean;
    admin?: boolean;
    regex?: RegExp;
}

export const pages: RouterPage[] = [{
    path: '/home',
    element: <Home />,
    showNav: true
}, {
    path: '/characters',
    element: <Characters />,
    showNav: true
}, {
    path: '/characters/create/:gameId',
    element: <CharacterForm create />,
    showNav: true
}, {
    path: '/characters/:characterId',
    element: <CharacterForm />,
    showNav: true
}, {
    path: '/assets',
    element: <Assets />,
    showNav: true
}, {
    path: '/profile',
    element: <Profile />,
    showNav: true
}, {
    path: '/users',
    element: <Users />,
    showNav: true,
    admin: true
}, {
    path: '/users/create',
    element: <UserForm />,
    showNav: true,
    admin: true
}, {
    path: '/sessions',
    element: <Sessions />,
    showNav: true
}, {
    path: '/sessions/create',
    element: <SessionForm />,
    showNav: true
}, {
    path: '/play/:sessionId/:characterId',
    element: <Play />,
    regex: /^\/play\/[0-9a-f]{24}\/[0-9a-f]{24}$/,
    showNav: false
}, {
    path: '/play/:sessionId',
    element: <Play />,
    regex: /^\/play\/[0-9a-f]{24}$/,
    showNav: false
}];