import { WildlinkClient, ActiveDomain } from 'wildlink-js-client';
import pd from 'parse-domain';

import api from '/helpers/api';

export interface EligibleDomain {
  activeDomain: ActiveDomain;
  originalUrl: string;
}

export const parseDomain = (url: string): string[] => {
  const domains = [];
  const parsedUrl = pd(url);
  if (parsedUrl !== null) {
    const { subdomain, domain, tld } = parsedUrl;
    if (domain !== '') {
      const tldPlusOne = `${domain}.${tld}`;
      domains.push(tldPlusOne);
      if (subdomain !== '') {
        // create an entry for each level of subdomain
        const subdomainLevels = subdomain.split('.');
        for (let i = subdomainLevels.length - 1; i >= 0; i--) {
          // add last domain pushed plus next subdomain
          const lastDomain: string = domains[domains.length - 1];
          const nextSubdomain: string = subdomainLevels[i];
          domains.push(`${nextSubdomain}.${lastDomain}`);
        }
      }
    }
  }
  return domains.reverse();
};

const getDomainBlacklist = async (): Promise<string[]> => {
  const {
    blacklistLastFetched = 0,
    domainBlacklist = [],
  } = await browser.storage.local.get([
    'blacklistLastFetched',
    'domainBlacklist',
  ]);
  const msSinceLastFetch = Date.now() - blacklistLastFetched;
  // cache blacklist for 24 hours
  if (msSinceLastFetch > 1000 * 60 * 60 * 24) {
    const blacklist = await api.getDomainBlacklist();
    browser.storage.local.set({
      domainBlacklist: blacklist,
      blacklistLastFetched: Date.now(),
    });
    return blacklist;
  } else {
    return domainBlacklist;
  }
};

export const isBlacklistDomain = async (
  testDomain: string,
): Promise<boolean> => {
  const domainBlacklist = await getDomainBlacklist();
  return domainBlacklist.some((domain) => domain === testDomain);
};

export const getActiveDomain = async (
  url: string,
  client: WildlinkClient,
): Promise<ActiveDomain | undefined> => {
  const domains = parseDomain(url);
  const activeDomains = await client.getDomains();
  for (let i = 0; i < activeDomains.length; i++) {
    if (domains.includes(activeDomains[i].Domain)) {
      const activeDomain = activeDomains[i];
      // check blacklist
      const blacklisted = await isBlacklistDomain(activeDomain.Domain);
      if (blacklisted) {
        return undefined;
      }
      return activeDomain;
    }
  }
};

export const startsWithHttp = (testString = ''): boolean => {
  const protocol = testString.trim().slice(0, 4);
  return protocol === 'http';
};
