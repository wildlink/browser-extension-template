import { getActiveDomain } from '/wildlink/helpers/domain';
import { WildlinkClient } from 'wildlink-js-client';
import { activeDomainLastSeen } from './browser/tab';

const affiliatedRequests: Set<string> = new Set();

/*
  List of domain names that we are required to stand down on
*/

const AFFILIATE_DOMAINS: RegExp[] = [
  /* CJ */
  /anrdoezrs.net/,
  /commission-junction.com/,
  /dpbolvw.net/,
  /apmebf.com/,
  /jdoqocy.com/,
  /kqzyfj.com/,
  /qksrv.net/,
  /tkqlhce.com/,
  /qksz.net/,
  /emjcd.com/,
  /afcyhf.com/,
  /awltovhc.com/,
  /ftjcfx.com/,
  /lduhtrp.net/,
  /tqlkg.com/,
  /awxibrm.com/,
  /cualbr.com/,
  /rnsfpw.net/,
  /vofzpwh.com/,
  /yceml.net/,
  /cj-dotomi.com/,

  /* RAKUTEN */
  /click.linksynergy.com/,
  /affiliate.rakuten.com/,
];

/*
  List of query parameters that we are required to stand down on
*/
const AFFILIATE_PARAMS: RegExp[] = [
  /[?&]afsrc=1/,
  /[?&]affsource=1/,
  /[?&]foid=/,
  /[?&]u1=/,
  /[?&]sid=/,
  /[?&]subId1=/,
  /[?&]SID=/,
  /[?&]afftrack=/,
  /[?&]clickref=/,
  /[?&]sscid=/,
];

export const hasAffiliateDomain = (url: string): boolean => {
  return AFFILIATE_DOMAINS.some((domain) => domain.test(url));
};

export const hasAffiliateParams = (url: string): boolean => {
  return AFFILIATE_PARAMS.some((param) => param.test(url));
};

/*
  This function will fire off before every request the user makes. Whether it is
  a redirected request or a request the user's browser makes.
*/
export const handleAffiliateRequest = ({
  requestId,
  url,
}: browser.webRequest._OnBeforeRequestDetails): void => {
  // If we are already tracking this request id, we don't need to check again
  if (affiliatedRequests.has(requestId)) return;
  if (hasAffiliateParams(url) || hasAffiliateDomain(url)) {
    // If the url has an affiliated parameter or domain, then we will stand down
    // In the onBeforeRedirect handler.
    affiliatedRequests.add(requestId);
  }
};

/*
  This function will fire off before every redirect the browser makes, but keep in mind
  in order for this function to do anything the onBeforeRequest handler has to
  decide whether or not we follow the request to check for a stand down
*/

export const handleAffiliateStandDown = async (
  { requestId, redirectUrl }: browser.webRequest._OnBeforeRedirectDetails,
  wildlinkClient: WildlinkClient,
): Promise<void> => {
  // The only time this if statement will be true is when the onBeforeRequest
  // handler picks up a request that has a an affiliated url in the route
  if (!affiliatedRequests.has(requestId)) return;
  const activeDomain = await getActiveDomain(redirectUrl, wildlinkClient);
  if (activeDomain) {
    const now = Date.now();
    activeDomainLastSeen[activeDomain.Domain] = now;
    // Once we have found the active domain to stand down on, then we can stop
    // tracking the request, this is just for the sake of preserving memory
    affiliatedRequests.delete(requestId);
  }
};
