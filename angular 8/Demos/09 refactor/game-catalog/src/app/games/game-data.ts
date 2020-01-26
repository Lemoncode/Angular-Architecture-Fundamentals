import { InMemoryDbService } from 'angular-in-memory-web-api';

import { GameModel } from './game.model';

export class GameData implements InMemoryDbService {
  createDb() {
    const games: GameModel[] = [
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

    return { games };
  }
}
