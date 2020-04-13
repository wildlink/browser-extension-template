import { isAffiliateUrl } from '/helpers/affiliate';

test('parses a URL and knows when an affiliate query key or parameter is present', () => {
  expect(isAffiliateUrl('domain.com')).toBe(false);
  expect(isAffiliateUrl('domain.com?q=foobar')).toBe(false);
  expect(isAffiliateUrl('domain.com?ranEAID=123')).toBe(true);
  expect(isAffiliateUrl('domain.com?ranMID=123')).toBe(true);
  expect(isAffiliateUrl('domain.com?ranSiteID=123')).toBe(true);
  expect(isAffiliateUrl('domain.com?LinkshareID=123')).toBe(true);
  expect(isAffiliateUrl('domain.com?PartnerID=123')).toBe(false);
  expect(isAffiliateUrl('domain.com?utm_medium=123')).toBe(false);
  expect(isAffiliateUrl('domain.com?PartnerID=LINKSHARE')).toBe(true);
  expect(isAffiliateUrl('domain.com?utm_medium=affiliate')).toBe(true);
  expect(isAffiliateUrl('domain.com?PartnerID=123&utm_medium=affiliate')).toBe(
    true,
  );
  expect(isAffiliateUrl('domain.com?PartnerID=LINKSHARE&utm_medium=123')).toBe(
    true,
  );
  expect(isAffiliateUrl('domain.com?PartnerID=123&utm_medium=123')).toBe(false);
  expect(isAffiliateUrl('domain.com?undefined=undefined')).toBe(false);
});
