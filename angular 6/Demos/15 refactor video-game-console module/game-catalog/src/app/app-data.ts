import { InMemoryDbService } from 'angular-in-memory-web-api';

import { IGame } from './games/game.model';
import { VideoConsoleModel } from './video-consoles/video-console.model';

export class AppData implements InMemoryDbService {
  createDb() {
    const games: IGame[] = [
      {
        'id': 234,
        'name': 'Super Mario Bros',
        'code': 'PLA-0',
        'release': '13 September 1985',
        'description': 'Platform game for all family',
        'price': 99.99,
        'category': 'platforms',
        'rating': 4.3,
        'imageUrl': 'https://vignette.wikia.nocookie.net/videojuego/images/e/e2/Super_Mario_Bros..jpg/revision/latest?cb=20080402052328'
      },
      {
        'id': 24,
        'name': 'Legend of Zelda',
        'code': 'QU-0',
        'release': '21 February 1986',
        'description': 'Adventure game for all family',
        'price': 89.79,
        'category': 'quest',
        'rating': 4.7,
        'imageUrl': 'http://omegacenter.es/blog/wp-content/uploads/2015/12/zelda12.png'
      },
      {
        'id': 44,
        'name': 'Sonic',
        'code': 'PLA-1',
        'release': '23 June 1991',
        'description': 'Speed and fun',
        'price': 96.67,
        'category': 'platforms',
        'rating': 4.7,
        'imageUrl': 'https://cdn.arstechnica.net/wp-content/uploads/2018/07/sonicmaniaplus-logo.jpg'
      },
    ];

    const videoconsoles: VideoConsoleModel[] = [
      {
        name: 'Nintendo Entertaiment System',
        code: 'NES-0',
        description: 'One of the most retro video console ever',
        id: 1,
        rating: 3,
      },
      {
        name: 'Atari',
        code: 'A-2',
        description: 'Atari forever',
        id: 2,
        rating: 1,
      },
      {
        name: 'Mega Drive',
        code: 'MD',
        description: 'The first 16 bit console?',
        id: 3,
        rating: 4,
      },
    ];
    return {
      games,
      videoconsoles
    };
  }
}
