import { ActiveDomain } from 'wildlink-js-client';

import { initWildlink } from '/wildlink/client';
import * as domain from '/wildlink/helpers/domain';

const exampleActiveDomains: ActiveDomain[] = [
  {
    ID: 1,
    Domain: 'eligible.com',
    Merchant: {
      ID: 1,
      Name: 'Eligible',
      DefaultRate: null,
      DerivedRate: null,
      MaxRate: null,
    },
  },
  {
    ID: 2,
    Domain: 'longest.eligible.com',
    Merchant: {
      ID: 2,
      Name: 'Longest Eligible',
      DefaultRate: null,
      DerivedRate: null,
      MaxRate: null,
    },
  },
];

jest.mock('/wildlink/client', () => {
  return {
    initWildlink: jest.fn().mockImplementation(() => {
      return {
        getDomains: (): ActiveDomain[] => exampleActiveDomains,
      };
    }),
  };
});

describe('getActiveDomain()', () => {
  jest.spyOn(domain, 'isBlacklistDomain').mockResolvedValue(false);
  it('looks for the longest domain', async () => {
    const mockWildlinkClient = await initWildlink();
    const longestEligible = await domain.getActiveDomain(
      'http://www.longest.eligible.com',
      mockWildlinkClient,
    );
    expect(longestEligible?.ID).toEqual(2);

    const eligible = await domain.getActiveDomain(
      'http://www.foo.bar.eligible.com',
      mockWildlinkClient,
    );
    expect(eligible?.ID).toEqual(1);
  });
});

describe('parseDomain()', () => {
  it('parses a URL and all its subdomains', () => {
    expect(domain.parseDomain('')).toStrictEqual([]);
    expect(domain.parseDomain('lego')).toStrictEqual([]);
    expect(domain.parseDomain('lego.com')).toStrictEqual(['lego.com']);
    expect(domain.parseDomain('shop.lego.com')).toStrictEqual([
      'shop.lego.com',
      'lego.com',
    ]);
    expect(domain.parseDomain('go.shop.lego.com')).toStrictEqual([
      'go.shop.lego.com',
      'shop.lego.com',
      'lego.com',
    ]);
    expect(domain.parseDomain('lego.co.uk')).toStrictEqual(['lego.co.uk']);
    expect(domain.parseDomain('shop.lego.co.uk')).toStrictEqual([
      'shop.lego.co.uk',
      'lego.co.uk',
    ]);
    expect(domain.parseDomain('go.shop.lego.co.uk')).toStrictEqual([
      'go.shop.lego.co.uk',
      'shop.lego.co.uk',
      'lego.co.uk',
    ]);

    expect(domain.parseDomain('http://www.ezdoctor.com/')).toStrictEqual([
      'www.ezdoctor.com',
      'ezdoctor.com',
    ]);
    expect(domain.parseDomain('http://shop.foo.ezdoctor.com/')).toStrictEqual([
      'shop.foo.ezdoctor.com',
      'foo.ezdoctor.com',
      'ezdoctor.com',
    ]);
    expect(domain.parseDomain('http://www.books.amazon.co.uk/')).toStrictEqual([
      'www.books.amazon.co.uk',
      'books.amazon.co.uk',
      'amazon.co.uk',
    ]);
    expect(domain.parseDomain('http://https://ezdoctor.com/')).toStrictEqual(
      [],
    );
  });
});
