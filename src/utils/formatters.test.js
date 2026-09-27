import { formatarData, calcularIdade, iniciais } from './formatters';

describe('formatarData', () => {
  test('converts ISO date to dd/mm/yyyy', () => {
    expect(formatarData('1990-05-10')).toBe('10/05/1990');
  });
});

describe('calcularIdade', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 8, 27));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('counts full years when the birthday already passed', () => {
    expect(calcularIdade('1990-05-10')).toBe(36);
  });

  test('subtracts one year when the birthday has not happened yet', () => {
    expect(calcularIdade('1990-12-01')).toBe(35);
  });
});

describe('iniciais', () => {
  test('returns uppercase initials', () => {
    expect(iniciais('josé', 'prendin')).toBe('JP');
  });

  test('handles missing values', () => {
    expect(iniciais(undefined, 'Prendin')).toBe('P');
  });
});