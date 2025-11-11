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
    source: require('@assets/PlainBread.webp'),
    level: 0,
  },
  // 레벨 1
  {
    key: 'Crouton',
    source: require('@assets/Crouton.webp'),
    level: 1,
  },
  {
    key: 'DinnerRoll',
    source: require('@assets/DinnerRoll.webp'),
    level: 1,
  },
  {
    key: 'Scone',
    source: require('@assets/Scone.webp'),
    level: 1,
  },
  // 레벨 2
  {
    key: 'Muffin',
    source: require('@assets/Muffin.webp'),
    level: 2,
  },
  {
    key: 'ChocoChipCookie',
    source: require('@assets/ChocoChipCookie.webp'),
    level: 2,
  },
  {
    key: 'SugarDonut',
    source: require('@assets/SugarDonut.webp'), 
    level: 2,
  },
  // 레벨 3
  {
    key: 'Baguette',
    source: require('@assets/Baguette.webp'),
    level: 3,
  },
  {
    key: 'Bagel',
    source: require('@assets/Bagel.webp'),
    level: 3,
  },
  {
    key: 'Ciabatta',
    source: require('@assets/Ciabatta.webp'), 
    level: 3,
  },
  // 레벨 4
  {
    key: 'Pretzel',
    source: require('@assets/Pretzel.webp'),
    level: 4,
  },
  {
    key: 'Croissant',
    source: require('@assets/Croissant.webp'),
    level: 4,
  },
  {
    key: 'Brioche',
    source: require('@assets/Brioche.webp'),
    level: 4,
  },
  // 레벨 5
  {
    key: 'CreamBread',
    source: require('@assets/CreamBread.webp'),
    level: 5,
  },
  {
    key: 'RedBeanBread',
    source: require('@assets/RedBeanBread.webp'), 
    level: 5,
  },
  {
    key: 'MelonBread',
    source: require('@assets/MelonBread.webp'), 
    level: 5,
  },
  // 레벨 6
  {
    key: 'CinnamonRoll',
    source: require('@assets/CinnamonRoll.webp'), 
    level: 6,
  },
  {
    key: 'Madeleine',
    source: require('@assets/Madeleine.webp'), 
    level: 6,
  },
  {
    key: 'ApplePie',
    source: require('@assets/ApplePie.webp'), 
    level: 6,
  },
  // 레벨 7
  {
    key: 'Danish',
    source: require('@assets/Danish.webp'), 
    level: 7,
  },
  {
    key: 'PainAuChocolat',
    source: require('@assets/PainAuChocolat.webp'), 
    level: 7,
  },
  {
    key: 'BananaBread',
    source: require('@assets/BananaBread.webp'),
    level: 7,
  },
  // 레벨 8
  {
    key: 'Macaron',
    source: require('@assets/Macaron.webp'), 
    level: 8,
  },
  {
    key: 'Eclair',
    source: require('@assets/Eclair.webp'), 
    level: 8,
  },
  {
    key: 'WalnutPie',
    source: require('@assets/WalnutPie.webp'), 
    level: 8,
  },
  // 레벨 9
  {
    key: 'Tiramisu',
    source: require('@assets/Tiramisu.webp'), 
    level: 9,
  },
  {
    key: 'LemonMeringuePie',
    source: require('@assets/LemonMeringuePie.webp'),
    level: 9,
  },
  {
    key: 'PoundCake',
    source: require('@assets/PoundCake.webp'), 
    level: 9,
  },
  // 레벨 10
  {
    key: 'Canelle',
    source: require('@assets/Canele.webp'), 
    level: 10,
  },
  {
    key: 'Stollen',
    source: require('@assets/Stollen.webp'), 
    level: 10,
  },
  {
    key: 'MontBlanc',
    source: require('@assets/MontBlanc.webp'), 
    level: 10,
  },
];


