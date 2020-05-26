import { parseActiveDomainMaxRate } from './activeDomain';

describe('parseActiveDomainMaxRate()', () => {
  it('parses percentage commission rates correctly', () => {
    expect(
      parseActiveDomainMaxRate({
        Kind: 'PERCENTAGE',
        Amount: '()',
        Currency: undefined,
      }),
    ).toBe('');
    expect(
      parseActiveDomainMaxRate({
        Kind: 'PERCENTAGE',
        Amount: 'teehee',
        Currency: undefined,
      }),
    ).toBe('');
    expect(
      parseActiveDomainMaxRate({
        Kind: 'PERCENTAGE',
        Amount: '3',
        Currency: undefined,
      }),
    ).toBe('3%');
    expect(
      parseActiveDomainMaxRate({
        Kind: 'PERCENTAGE',
        Amount: '3.375',
        Currency: undefined,
      }),
    ).toBe('3.4%');
    expect(
      parseActiveDomainMaxRate({
        Kind: 'PERCENTAGE',
        Amount: '2.5',
        Currency: undefined,
      }),
    ).toBe('2.5%');
    expect(
      parseActiveDomainMaxRate({
        Kind: 'PERCENTAGE',
        Amount: '0.5',
        Currency: undefined,
      }),
    ).toBe('0.5%');
    expect(
      parseActiveDomainMaxRate({
        Kind: 'PERCENTAGE',
        Amount: '12.5',
        Currency: undefined,
      }),
    ).toBe('12.5%');
  });

  it('parses flat commission rates correctly', () => {
    expect(
      parseActiveDomainMaxRate({
        Kind: 'FLAT',
        Amount: '3',
        Currency: 'DZD',
      }),
      // that is not a space
    ).toBe('DZD 3.00');
    expect(
      parseActiveDomainMaxRate({
        Kind: 'FLAT',
        Amount: ':)',
        Currency: 'USD',
      }),
    ).toBe('');
    expect(
      parseActiveDomainMaxRate({
        Kind: 'FLAT',
        Amount: '37.5',
        Currency: 'USD',
      }),
    ).toBe('$37.50');
    expect(
      parseActiveDomainMaxRate({
        Kind: 'FLAT',
        Amount: '2',
        Currency: 'EUR',
      }),
    ).toBe('€2.00');
    expect(
      parseActiveDomainMaxRate({
        Kind: 'FLAT',
        Amount: '13.8',
        Currency: 'EUR',
      }),
    ).toBe('€13.80');
    expect(
      parseActiveDomainMaxRate({
        Kind: 'FLAT',
        Amount: '100.5',
        Currency: 'JPY',
      }),
    ).toBe('¥101');
    expect(
      parseActiveDomainMaxRate({
        Kind: 'FLAT',
        Amount: '500',
        Currency: 'JPY',
      }),
    ).toBe('¥500');
    expect(
      parseActiveDomainMaxRate({
        Kind: 'FLAT',
        Amount: '15.1',
        Currency: 'GBP',
      }),
    ).toBe('£15.10');
    expect(
      parseActiveDomainMaxRate({
        Kind: 'FLAT',
        Amount: '5',
        Currency: 'GBP',
      }),
    ).toBe('£5.00');
  });
});
