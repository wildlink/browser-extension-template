import { hasAffiliateParams, hasAffiliateDomain } from '/helpers/affiliate';

const context = describe;

describe('Standing Down Logic', () => {
  context('hasAffiliateParams()', () => {
    it('parses a URL and knows when an affiliate query key or parameter is present', () => {
      expect(hasAffiliateParams('domain.com')).toBe(false);
      expect(hasAffiliateParams('domain.com?q=foobar')).toBe(false);
      expect(
        hasAffiliateParams('domain.com?PartnerID=123&utm_medium=123'),
      ).toBe(false);
      expect(hasAffiliateParams('domain.com?undefined=undefined')).toBe(false);
      expect(
        hasAffiliateParams(
          'domain.com?foid=177.142931376&foc=1&fot=9999&fos=1',
        ),
      ).toBe(true);
      expect(hasAffiliateParams('domain.com?foc=1&fot=9999&fos=1')).toBe(false);
      expect(hasAffiliateParams('domain.com?afsrc=1')).toBe(true);
      expect(hasAffiliateParams('domain.com?afsrc=2')).toBe(false);
      expect(hasAffiliateParams('domain.com?affsource=1')).toBe(true);
      expect(hasAffiliateParams('domain.com?affsource=2')).toBe(false);
    });
  });

  context('hasAffiliateDomain()', () => {
    it('resolves to true on an affiliated CJ domain name', () => {
      expect(
        hasAffiliateDomain(
          'https://www.tkqlhce.com/click-2210202-14457066-1614354343000?SID=uuu55B8F428-A80B-4060-8597-B3304790A828',
        ),
      ).toBe(true);
      expect(
        hasAffiliateDomain(
          'https://cj-dotomi.com/cd100efon5/fmr/4778A399/5543535/3/3/3?n=tUKF%3Dwww77DAH64A-CA2D-6282-A7B9-D55269B2CA4A%3c%3cjvvru%3A%2F%2Fyyy.vmsnjeg.eqo%3AA2%2Fenkem-4432424-36679288-3836576565222%3c%3cI%3cjvvru%3A%2F%2Fyyy.tgvcknogpqv.eqo%2Fxkgy%2Fdnwgcrtqp.eqo%3F%3c%3c3%3c3%3c2%3c2%3c',
        ),
      ).toBe(true);
      expect(
        hasAffiliateDomain(
          'https://www.emjcd.com/m6101cy65Q/y49/NQQRTMSS/OONMOMO/M/NRRRMRUUTTRNQSOPSV:RwR6C4pEWR.3/OxxRNRMVTzP0NN-xUOwxMMN0MwNyM-NP?i=pqgb%3DIIITTZWdSQW-YWOZ-SOUO-WTXV-ZRROSVXOYWQW%3c07C!L49N-1A7OyUE-KF1B-KCDXII6%3c5HHDG%3A%2F%2FKKK.H8E9502.0CA%3AWO%2F09608-QQPOQOQ-PSSTVOUU-PUPSRTSRSROOO%3c%3ce%3c5HHDG%3A%2F%2FKKK.F2Hy69A2BCH.0CA%2FJ62K%2Fz9I2yDFCB.0CA%3F%3cOQQVySWW-0S0R-S03X-WySU-PTyVOyXQTVWy%3cP%3cP%3cO%3cO%3c',
        ),
      ).toBe(true);
    });

    it('resolves to true on an affiliated Rakuten domain name', () => {
      expect(
        hasAffiliateDomain(
          'https://click.linksynergy.com/deeplink?murl=https%3A%2F%2Fwww.macys.com%2Fshop%2Fkitchen%2Fsmall-kitchen-appliances%3Fid%3D7554%26cm_sp%3Dus_hdr-_-home-_-7554_small-appliances_COL2%26lid%3Dshop_now&mid=3184&id=OOTtr9mlaCk&u1=uuu21FE1A68-613B-42CE-80ED-A4890800B4B8',
        ),
      ).toBe(true);
      expect(
        hasAffiliateDomain(
          'https://affiliate.rakuten.com?aff_id=123&offer_id=23&subid=xU4VVnJyCbFWIloIPdYap1',
        ),
      ).toBe(true);
    });

    it('resolve to false on an unaffiliated domain name', () => {
      expect(
        hasAffiliateDomain(
          'https://www.awin1.com/cread.php?awinaffid=81392&awinmid=11018&ued=https%3A%2F%2Fwww.viator.com%2FUSA%2Fd77-ttd%3Faid%3DAWINUsa_%21%21%21linkid%21%21%21_%21%21%21id%21%21%21&clickref=uuu77B1EC33-BE74-48F6-B14F-4B5C7D0DF9B0',
        ),
      ).toBe(false);
      expect(
        hasAffiliateDomain(
          'https://www.ojrq.net/p/?return=https%3A%2F%2Flinkto.hrblock.com%2Fc%2F10621%2F965646%2F5683%3Fsubid1%3DuuuC9C32501-AF49-4ABB-BFD0-5B3ED552A3D1%26level%3D1&cid=5683&tpsync=yes',
        ),
      ).toBe(false);
      expect(
        hasAffiliateDomain(
          'https://shareasale.com/r.cfm?b=1118137&u=193744&m=76328&urllink=&afftrack=&afftrack=uuu1311BC7F-9127-4418-996B-978F19CC498C',
        ),
      ).toBe(false);
    });
  });
});
