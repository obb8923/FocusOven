module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@component/(.*)$': '<rootDir>/src/shared/component/$1',
    '^@constant/(.*)$': '<rootDir>/src/shared/constant/$1',
    '^@lib/(.*)$': '<rootDir>/src/shared/lib/$1',
    '^@nav/(.*)$': '<rootDir>/src/shared/nav/$1',
    '^@store/(.*)$': '<rootDir>/src/shared/store/$1',
    '^@type/(.*)$': '<rootDir>/src/shared/type/$1',
    '^@service/(.*)$': '<rootDir>/src/shared/service/$1',
  },
};
