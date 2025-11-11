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
    source: require('@assets/webps/PlainBread.webp'),
    level: 0,
  },
  // 레벨 1
  {
    key: 'Crouton',
    source: require('@assets/webps/Crouton.webp'),
    level: 1,
  },
  {
    key: 'DinnerRoll',
    source: require('@assets/webps/DinnerRoll.webp'),
    level: 1,
  },
  {
    key: 'Scone',
    source: require('@assets/webps/Scone.webp'),
    level: 1,
  },
  // 레벨 2
  {
    key: 'Muffin',
    source: require('@assets/webps/Muffin.webp'),
    level: 2,
  },
  {
    key: 'ChocoChipCookie',
    source: require('@assets/webps/ChocoChipCookie.webp'),
    level: 2,
  },
  {
    key: 'SugarDonut',
    source: require('@assets/webps/SugarDonut.webp'), 
    level: 2,
  },
  // 레벨 3
  {
    key: 'Baguette',
    source: require('@assets/webps/Baguette.webp'),
    level: 3,
  },
  {
    key: 'Bagel',
    source: require('@assets/webps/Bagel.webp'),
    level: 3,
  },
  {
    key: 'Ciabatta',
    source: require('@assets/webps/Ciabatta.webp'), 
    level: 3,
  },
  // 레벨 4
  {
    key: 'Pretzel',
    source: require('@assets/webps/Pretzel.webp'),
    level: 4,
  },
  {
    key: 'Croissant',
    source: require('@assets/webps/Croissant.webp'),
    level: 4,
  },
  {
    key: 'Brioche',
    source: require('@assets/webps/Brioche.webp'),
    level: 4,
  },
  // 레벨 5
  {
    key: 'CreamBread',
    source: require('@assets/webps/CreamBread.webp'),
    level: 5,
  },
  {
    key: 'RedBeanBread',
    source: require('@assets/webps/RedBeanBread.webp'), 
    level: 5,
  },
  {
    key: 'MelonBread',
    source: require('@assets/webps/MelonBread.webp'), 
    level: 5,
  },
  // 레벨 6
  {
    key: 'CinnamonRoll',
    source: require('@assets/webps/CinnamonRoll.webp'), 
    level: 6,
  },
  {
    key: 'Madeleine',
    source: require('@assets/webps/Madeleine.webp'), 
    level: 6,
  },
  {
    key: 'ApplePie',
    source: require('@assets/webps/ApplePie.webp'), 
    level: 6,
  },
  // 레벨 7
  {
    key: 'Danish',
    source: require('@assets/webps/Danish.webp'), 
    level: 7,
  },
  {
    key: 'PainAuChocolat',
    source: require('@assets/webps/PainAuChocolat.webp'), 
    level: 7,
  },
  {
    key: 'BananaBread',
    source: require('@assets/webps/BananaBread.webp'),
    level: 7,
  },
  // 레벨 8
  {
    key: 'Macaron',
    source: require('@assets/webps/Macaron.webp'), 
    level: 8,
  },
  {
    key: 'Eclair',
    source: require('@assets/webps/Eclair.webp'), 
    level: 8,
  },
  {
    key: 'WalnutPie',
    source: require('@assets/webps/WalnutPie.webp'), 
    level: 8,
  },
  // 레벨 9
  {
    key: 'Tiramisu',
    source: require('@assets/webps/Tiramisu.webp'), 
    level: 9,
  },
  {
    key: 'LemonMeringuePie',
    source: require('@assets/webps/LemonMeringuePie.webp'),
    level: 9,
  },
  {
    key: 'PoundCake',
    source: require('@assets/webps/PoundCake.webp'), 
    level: 9,
  },
  // 레벨 10
  {
    key: 'Canelle',
    source: require('@assets/webps/Canele.webp'), 
    level: 10,
  },
  {
    key: 'Stollen',
    source: require('@assets/webps/Stollen.webp'), 
    level: 10,
  },
  {
    key: 'MontBlanc',
    source: require('@assets/webps/MontBlanc.webp'), 
    level: 10,
  },
];


