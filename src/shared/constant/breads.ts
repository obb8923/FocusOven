export type Bread = {
  key: string;
  // React Native ImageSource (require)
  source: any;
  level: 0 | 1 | 2 | 3;
};

export const BREADS: Bread[] = [
  {
    key: 'PlainBread',
    source: require('@assets/pngs/PlainBread.png'),
    level: 0,
  },
  {
    key: 'Crouton',
    source: require('@assets/pngs/Crouton.png'),
    level: 1,
  },
  {
    key: 'DinnerRoll',
    source: require('@assets/pngs/DinnerRoll.png'),
    level: 1,
  },
  {
    key: 'Muffin',
    source: require('@assets/pngs/Muffin.png'),
    level: 2,
  },
  {
    key: 'Scone',
    source: require('@assets/pngs/Scone.png'),
    level: 1,
  },
  {
    key: 'ChocoChipCookie',
    source: require('@assets/pngs/ChocoChipCookie.png'),
    level: 2,
  },
  {
    key: 'Baguette',
    source: require('@assets/pngs/Baguette.png'),
    level: 2,
  },
  {
    key: 'Bagel',
    source: require('@assets/pngs/Bagel.png'),
    level: 2,
  },
  {
    key: 'Pretzel',
    source: require('@assets/pngs/Pretzel.png'),
    level: 2,
  },
  {
    key: 'CreamBread',
    source: require('@assets/pngs/CreamBread.png'),
    level: 2,
  },
  {
    key: 'Croissant',
    source: require('@assets/pngs/Croissant.png'),
    level: 3,
  },
  {
    key: 'Brioche',
    source: require('@assets/pngs/Brioche.png'),
    level: 3,
  }
];


