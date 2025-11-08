export type Bread = {
  key: string;
  enName: string;
  koName: string;
  // React Native ImageSource (require)
  source: any;
  description: string;
  level: 1 | 2 | 3;
};

export const BREADS: Bread[] = [
  {
    key: 'PlainBread',
    enName: 'Plain Bread',
    koName: '식빵',
    source: require('@assets/pngs/PlainBread.png'),
    description: '기본 반죽으로 만드는 부드러운 식빵.',
    level: 1,
  },
  {
    key: 'Crouton',
    enName: 'Crouton',
    koName: '크루통',
    source: require('@assets/pngs/Crouton.png'),
    description: '수프와 샐러드에 올리는 고소한 바삭 큐브빵.',
    level: 1,
  },
  {
    key: 'DinnerRoll',
    enName: 'Dinner Roll',
    koName: '모닝빵',
    source: require('@assets/pngs/DinnerRoll.png'),
    description: '한입 크기로 구워낸 폭신한 모닝빵.',
    level: 1,
  },
  {
    key: 'Muffin',
    enName: 'Muffin',
    koName: '머핀',
    source: require('@assets/pngs/Muffin.png'),
    description: '간단히 구워내는 촉촉한 머핀.',
    level: 1,
  },
  {
    key: 'Scone',
    enName: 'Scone',
    koName: '스콘',
    source: require('@assets/pngs/Scone.png'),
    description: '겉은 바삭 속은 촉촉한 차와 어울리는 스콘.',
    level: 1,
  },
  {
    key: 'ChocoChipCookie',
    enName: 'Choco Chip Cookie',
    koName: '초콜릿 칩 쿠키',
    source: require('@assets/pngs/ChocoChipCookie.png'),
    description: '초콜릿 칩이 가득한 클래식 쿠키.',
    level: 1,
  },
  {
    key: 'Baguette',
    enName: 'Baguette',
    koName: '바게트',
    source: require('@assets/pngs/Baguette.png'),
    description: '길고 바삭한 껍질이 매력적인 프랑스식 빵.',
    level: 2,
  },
  {
    key: 'Bagel',
    enName: 'Bagel',
    koName: '베이글',
    source: require('@assets/pngs/Bagel.png'),
    description: '쫀득한 식감과 매끈한 표면이 특징인 베이글.',
    level: 2,
  },
  {
    key: 'Pretzel',
    enName: 'Pretzel',
    koName: '프레첼',
    source: require('@assets/pngs/Pretzel.png'),
    description: '매듭 모양의 짭짤한 독일식 프레첼.',
    level: 2,
  },
  {
    key: 'CreamBread',
    enName: 'Cream Bread',
    koName: '크림빵',
    source: require('@assets/pngs/CreamBread.png'),
    description: '달콤한 크림을 가득 채운 부드러운 빵.',
    level: 2,
  },
  {
    key: 'Croissant',
    enName: 'Croissant',
    koName: '크루아상',
    source: require('@assets/pngs/Croissant.png'),
    description: '겹겹이 버터 향이 살아있는 크루아상.',
    level: 3,
  },
  {
    key: 'Brioche',
    enName: 'Brioche',
    koName: '브리오슈',
    source: require('@assets/pngs/Brioche.png'),
    description: '버터와 달걀을 듬뿍 넣은 부드러운 브리오슈.',
    level: 3,
  }
];


