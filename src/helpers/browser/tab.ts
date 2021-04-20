import { WildlinkClient } from 'wildlink-js-client';

import { getActiveDomain } from '/wildlink/helpers/domain';
import { hasAffiliateParams } from '/helpers/affiliate';
import {
  ELIGIBLE,
  ExtensionMessage,
  NOT_ELIGIBLE,
  SHOW_CONTENT,
} from '/helpers/browser/message';

// used to determine when to proactively show the content
export const activeDomainLastSeen: { [domain: string]: number } = {};
// used to determine which tabs are the result of a vanity
const isVanityRedirectTab: { [tabId: number]: boolean } = {};

export const handleTabLoaded = async (
  tabId: number,
  tabUrl: string,
  wildlinkClient: WildlinkClient,
): Promise<void> => {
  // do nothing if we are redirecting
  if (isVanityRedirectTab[tabId]) {
    delete isVanityRedirectTab[tabId];
    return;
  }

  const activeDomain = await getActiveDomain(tabUrl, wildlinkClient);

  if (activeDomain) {
    await browser.tabs.sendMessage(tabId, {
      status: ELIGIBLE,
      payload: {
        activeDomain,
        originalUrl: tabUrl,
      },
    } as ExtensionMessage<typeof ELIGIBLE>);

    // show active icon
    browser.browserAction.setIcon({
      tabId,
      path: 'img/icon-128.png',
    });

    const now = Date.now();

    /*
      If the url contains a query parameter that belongs to one of our affiliates
      we are required to stand down. So we will stand down and not do anything.
    */
    if (hasAffiliateParams(tabUrl)) {
      activeDomainLastSeen[activeDomain.Domain] = now;
      return;
    }

    const lastSeen = activeDomainLastSeen[activeDomain.Domain] || 0;
    const msSinceLastSeen = now - lastSeen;

    // show the extension if it has not been shown in the last hour
    if (msSinceLastSeen > 1000 * 60 * 60) {
      browser.tabs.sendMessage(tabId, {
        status: SHOW_CONTENT,
      } as ExtensionMessage<typeof SHOW_CONTENT>);

      activeDomainLastSeen[activeDomain.Domain] = now;
    }
  } else {
    browser.tabs.sendMessage(tabId, {
      status: NOT_ELIGIBLE,
    } as ExtensionMessage<typeof NOT_ELIGIBLE>);
  }
};

export const setVanityRedirectTab = (tabId: number): void => {
  isVanityRedirectTab[tabId] = true;
};
