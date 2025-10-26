import { BoardCell } from '../components/Board';

export const sampleBoard: BoardCell[][] = [
  [
    { letter: 'W', ownerId: 'p1' },
    { letter: 'O', ownerId: 'p1' },
    { letter: 'R', ownerId: 'p1' },
    { letter: 'D', ownerId: 'p1' },
  ],
  [
    { letter: 'G', ownerId: 'p2' },
    { letter: 'R', ownerId: 'p1' },
    { letter: 'I', ownerId: 'p1' },
    { letter: 'D', ownerId: 'p2' },
  ],
  [
    { letter: 'P', ownerId: 'p1' },
    { letter: 'L', ownerId: 'p2' },
    { letter: 'A', ownerId: 'p2' },
    { letter: 'Y', ownerId: 'p1' },
  ],
  [
    { letter: 'L', ownerId: 'p2' },
    { letter: 'I', ownerId: 'p1' },
    { letter: 'N', ownerId: 'p2' },
    { letter: 'E', ownerId: 'p1' },
  ],
];
