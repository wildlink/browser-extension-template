import { parseDomain } from '/wildlink/helpers/domain';

describe('parseDomain()', () => {
  it('parses a URL and all its subdomains', () => {
    expect(parseDomain('')).toStrictEqual([]);
    expect(parseDomain('lego')).toStrictEqual([]);
    expect(parseDomain('lego.com')).toStrictEqual(['lego.com']);
    expect(parseDomain('shop.lego.com')).toStrictEqual([
      'shop.lego.com',
      'lego.com',
    ]);
    expect(parseDomain('go.shop.lego.com')).toStrictEqual([
      'go.shop.lego.com',
      'shop.lego.com',
      'lego.com',
    ]);
    expect(parseDomain('lego.co.uk')).toStrictEqual(['lego.co.uk']);
    expect(parseDomain('shop.lego.co.uk')).toStrictEqual([
      'shop.lego.co.uk',
      'lego.co.uk',
    ]);
    expect(parseDomain('go.shop.lego.co.uk')).toStrictEqual([
      'go.shop.lego.co.uk',
      'shop.lego.co.uk',
      'lego.co.uk',
    ]);

    expect(parseDomain('http://www.ezdoctor.com/')).toStrictEqual([
      'www.ezdoctor.com',
      'ezdoctor.com',
    ]);
    expect(parseDomain('http://shop.foo.ezdoctor.com/')).toStrictEqual([
      'shop.foo.ezdoctor.com',
      'foo.ezdoctor.com',
      'ezdoctor.com',
    ]);
    expect(parseDomain('http://www.books.amazon.co.uk/')).toStrictEqual([
      'www.books.amazon.co.uk',
      'books.amazon.co.uk',
      'amazon.co.uk',
    ]);
    expect(parseDomain('http://https://ezdoctor.com/')).toStrictEqual([]);
  });
});
