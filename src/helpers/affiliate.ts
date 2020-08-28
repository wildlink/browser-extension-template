import { parseUrl } from 'query-string';
import { getActiveDomain } from '/wildlink/helpers/domain';
import { WildlinkClient } from 'wildlink-js-client';
import { activeDomainLastSeen } from './browser/tab';

export const CJ_AFF_URLS = [
  'www.anrdoezrs.net',
  'www.commission-junction.com',
  'www.dpbolvw.net',
  'www.apmebf.com',
  'www.jdoqocy.com',
  'www.kqzyfj.com',
  'www.qksrv.net',
  'www.tkqlhce.com',
  'www.qksz.net',
  'www.emjcd.com',
  'www.afcyhf.com',
  'www.awltovhc.com',
  'www.ftjcfx.com',
  'www.lduhtrp.net',
  'www.tqlkg.com',
  'www.awxibrm.com',
  'www.cualbr.com',
  'www.rnsfpw.net',
  'www.vofzpwh.com',
  'www.yceml.net',
  'www.cj-dotomi.com',
];

export const handleCJRedirect = async (
  redirectUrl: string,
  wildlinkClient: WildlinkClient,
): Promise<void> => {
  const activeDomain = await getActiveDomain(redirectUrl, wildlinkClient);
  if (activeDomain) {
    const now = Date.now();
    activeDomainLastSeen[activeDomain.Domain] = now;
  }
};

// affiliated if any of these query parameter keys are present
const targetQueryKeys = ['foid'];

// affiliated if any of these query parameters are present where key=value
// value must be a string - parseUrl returns strings
const targetQueryParams: { [queryKey: string]: string } = {
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
