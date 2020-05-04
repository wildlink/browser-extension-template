import { parseUrl } from 'query-string';

// affiliated if any of these query parameter keys are present
const targetQueryKeys = [
  'ranEAID',
  'ranMID',
  'ranSiteID',
  'LinkshareID',
  'foid',
];

// affiliated if any of these query parameters (key and value) are present together
// value must be a string - parseUrl returns strings
const targetQueryParams: { [queryKey: string]: string } = {
  PartnerID: 'LINKSHARE',
  utm_medium: 'affiliate',
  afsrc: '1',
  affsource: '1',
};

export const isAffiliateUrl = (url: string): boolean => {
  const { query } = parseUrl(url);

  return Object.keys(query).some((queryKey) => {
    if (targetQueryKeys.includes(queryKey)) {
      return true;
    }
    if (targetQueryParams[queryKey] === query[queryKey]) {
      return true;
    }
  });
};
