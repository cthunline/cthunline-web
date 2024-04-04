import CharacterForm from './pages/characters/CharacterForm';
import Characters from './pages/characters/Characters';
import Sessions from './pages/sessions/Sessions';
import Profile from './pages/profile/Profile';
import Assets from './pages/assets/Assets';
import Users from './pages/users/Users';
import Home from './pages/home/Home';
import Play from './pages/play/Play';

export interface RouterPage {
    path: string;
    element: JSX.Element;
    showNav: boolean;
    admin?: boolean;
    regex?: RegExp;
}

export const pages: RouterPage[] = [
    {
        path: '/home',
        element: <Home />,
        showNav: true
    },
    {
        path: '/characters',
        element: <Characters />,
        showNav: true
    },
    {
        path: '/characters/:characterId',
        element: <CharacterForm />,
        showNav: true
    },
    {
        path: '/assets',
        element: <Assets />,
        showNav: true
    },
    {
        path: '/profile',
        element: <Profile />,
        showNav: true
    },
    {
        path: '/users',
        element: <Users />,
        showNav: true,
        admin: true
    },
    {
        path: '/sessions',
        element: <Sessions />,
        showNav: true
    },
    {
        path: '/play/:sessionId/:characterId',
        element: <Play />,
        regex: /^\/play\/\d+\/\d+$/,
        showNav: false
    },
    {
        path: '/play/:sessionId',
        element: <Play />,
        regex: /^\/play\/\d+$/,
        showNav: false
    }
];
