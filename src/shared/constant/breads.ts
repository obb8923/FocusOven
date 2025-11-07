export type Bread = {
  key: string;
  enName: string;
  koName: string;
  // React Native ImageSource (require)
  source: any;
};

export const BREADS: Bread[] = [
  {
    key: 'PlainBread',
    enName: 'Plain Bread',
    koName: '식빵',
    source: require('@assets/pngs/PlainBread.png'),
  },
  {
    key: 'Baguette',
    enName: 'Baguette',
    koName: '바게트',
    source: require('@assets/pngs/Baguette.png'),
  },
  {
    key: 'Crouton',
    enName: 'Crouton',
    koName: '크루통',
    source: require('@assets/pngs/Crouton.png'),
  },
  {
    key: 'DinnerRoll',
    enName: 'Dinner Roll',
    koName: '모닝빵',
    source: require('@assets/pngs/DinnerRoll.png'),
  },
  {
    key: 'Croissant',
    enName: 'Croissant',
    koName: '크루아상',
    source: require('@assets/pngs/Croissant.png'),
  },
  {
    key: 'Bagel',
    enName: 'Bagel',
    koName: '베이글',
    source: require('@assets/pngs/Bagel.png'),
  },
  {
    key: 'Muffin',
    enName: 'Muffin',
    koName: '머핀',
    source: require('@assets/pngs/Muffin.png'),
  },
  {
    key: 'Brioche',
    enName: 'Brioche',
    koName: '브리오슈',
    source: require('@assets/pngs/Brioche.png'),
  },
  {
    key: 'Pretzel',
    enName: 'Pretzel',
    koName: '프레첼',
    source: require('@assets/pngs/Pretzel.png'),
  },
  {
    key: 'CreamBread',
    enName: 'Cream Bread',
    koName: '크림빵',
    source: require('@assets/pngs/CreamBread.png'),
  },
  {
    key: 'Scone',
    enName: 'Scone',
    koName: '스콘',
    source: require('@assets/pngs/Scone.png'),
  },
  {
    key: 'ChocoChipCookie',
    enName: 'Choco Chip Cookie',
    koName: '초콜릿 칩 쿠키',
    source: require('@assets/pngs/ChocoChipCookie.png'),
  }
];


