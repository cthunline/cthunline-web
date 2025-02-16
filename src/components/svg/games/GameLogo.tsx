import type { GameId } from '@cthunline/games';
import type { SVGProps } from 'react';

import Alien from './alien/AlienLogo.js';
import ApocalypseWorld from './apocalypseWorld/ApocalypseWorldLogo.js';
import CallOfCthulhu from './callOfCthulhu/CallOfCthulhuLogo.js';
import DnD5 from './dnd5/DnD5Logo.js';
import SeventhSea from './seventhSea/SeventhSeaLogo.js';
import StarWarsD6 from './starWarsD6/StarWarsD6Logo.js';
import WarhammerFantasy from './warhammerFantasy/WarhammerFantasyLogo.js';

type GameLogoProps = SVGProps<SVGSVGElement> & {
    gameId: GameId;
};

const GameLogo = ({ gameId, ...svgProps }: GameLogoProps) => {
    switch (gameId) {
        case 'alien':
            return <Alien {...svgProps} />;
        case 'apocalypseWorld':
            return <ApocalypseWorld {...svgProps} />;
        case 'callOfCthulhu':
            return <CallOfCthulhu {...svgProps} />;
        case 'dnd5':
            return <DnD5 {...svgProps} />;
        case 'seventhSea':
            return <SeventhSea {...svgProps} />;
        case 'starWarsD6':
            return <StarWarsD6 {...svgProps} />;
        case 'warhammerFantasy':
            return <WarhammerFantasy {...svgProps} />;
        default:
            return null;
    }
};

export default GameLogo;
