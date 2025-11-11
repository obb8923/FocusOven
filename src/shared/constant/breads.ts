export type Bread = {
  key: string;
  // React Native ImageSource (require)
  source: any;
  level: number; // 레벨 0~10까지 확장 가능
};

export const BREADS: Bread[] = [
  // 레벨 0
  {
    key: 'PlainBread',
    source: require('@assets/pngs/PlainBread.png'),
    level: 0,
  },
  // 레벨 1
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
    key: 'Scone',
    source: require('@assets/pngs/Scone.png'),
    level: 1,
  },
  // 레벨 2
  {
    key: 'Muffin',
    source: require('@assets/pngs/Muffin.png'),
    level: 2,
  },
  {
    key: 'ChocoChipCookie',
    source: require('@assets/pngs/ChocoChipCookie.png'),
    level: 2,
  },
  {
    key: 'SugarDonut',
    source: require('@assets/pngs/SugarDonut.png'), 
    level: 2,
  },
  // 레벨 3
  {
    key: 'Baguette',
    source: require('@assets/pngs/Baguette.png'),
    level: 3,
  },
  {
    key: 'Bagel',
    source: require('@assets/pngs/Bagel.png'),
    level: 3,
  },
  {
    key: 'Ciabatta',
    source: require('@assets/pngs/Ciabatta.png'), 
    level: 3,
  },
  // 레벨 4
  {
    key: 'Pretzel',
    source: require('@assets/pngs/Pretzel.png'),
    level: 4,
  },
  {
    key: 'Croissant',
    source: require('@assets/pngs/Croissant.png'),
    level: 4,
  },
  {
    key: 'Brioche',
    source: require('@assets/pngs/Brioche.png'),
    level: 4,
  },
  // 레벨 5
  {
    key: 'CreamBread',
    source: require('@assets/pngs/CreamBread.png'),
    level: 5,
  },
  {
    key: 'RedBeanBread',
    source: require('@assets/pngs/RedBeanBread.png'), 
    level: 5,
  },
  {
    key: 'MelonBread',
    source: require('@assets/pngs/MelonBread.png'), 
    level: 5,
  },
  // 레벨 6
  {
    key: 'CinnamonRoll',
    source: require('@assets/pngs/CinnamonRoll.png'), 
    level: 6,
  },
  {
    key: 'Madeleine',
    source: require('@assets/pngs/Madeleine.png'), 
    level: 6,
  },
  {
    key: 'ApplePie',
    source: require('@assets/pngs/ApplePie.png'), 
    level: 6,
  },
  // 레벨 7
  {
    key: 'Danish',
    source: require('@assets/pngs/Danish.png'), 
    level: 7,
  },
  {
    key: 'PainAuChocolat',
    source: require('@assets/pngs/PainAuChocolat.png'), 
    level: 7,
  },
  {
    key: 'BananaBread',
    source: require('@assets/pngs/BananaBread.png'),
    level: 7,
  },
  // 레벨 8
  {
    key: 'Macaron',
    source: require('@assets/pngs/Macaron.png'), 
    level: 8,
  },
  {
    key: 'Eclair',
    source: require('@assets/pngs/Eclair.png'), 
    level: 8,
  },
  {
    key: 'WalnutPie',
    source: require('@assets/pngs/WalnutPie.png'), 
    level: 8,
  },
  // 레벨 9
  {
    key: 'Tiramisu',
    source: require('@assets/pngs/Tiramisu.png'), 
    level: 9,
  },
  {
    key: 'LemonMeringuePie',
    source: require('@assets/pngs/LemonMeringuePie.png'),
    level: 9,
  },
  {
    key: 'PoundCake',
    source: require('@assets/pngs/PoundCake.png'), 
    level: 9,
  },
  // 레벨 10
  {
    key: 'Canelle',
    source: require('@assets/pngs/Canele.png'), 
    level: 10,
  },
  {
    key: 'Stollen',
    source: require('@assets/pngs/Stollen.png'), 
    level: 10,
  },
  {
    key: 'MontBlanc',
    source: require('@assets/pngs/MontBlanc.png'), 
    level: 10,
  },
];


