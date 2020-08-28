import { WildlinkClient, Device } from 'wildlink-js-client';

import config from '/config';

import { initWildlink } from '/wildlink/client';
import {
  ExtensionMessage,
  BackgroundMessage,
  GENERATE_VANITY,
  OPEN_TAB,
  ACTIVATE_CASHBACK,
  SHOW_CONTENT,
  TOGGLE_CONTENT,
  ERROR,
  RELOAD,
  ExternalMessage,
  CLEAR_STORAGE,
  GET_USER,
  SET_AUTH,
  SUCCESS,
  ExternalResponseMessage,
  BackgroundResponseMessage,
  Auth,
  DOCUMENT_IDLE,
  PING,
  PONG,
  ContentResponseMessages,
} from '/helpers/browser/message';
import { handleTabLoaded, setVanityRedirectTab } from '/helpers/browser/tab';
import { startsWithHttp } from '/wildlink/helpers/domain';
import { CJ_AFF_URLS, handleCJRedirect } from './helpers/affiliate';

if (process.env.NODE_ENV === 'local') {
  // hot reloads content script including the page
  require('crx-hotreload/hot-reload');
}

let wildlinkClient: WildlinkClient;

// used to activate cashback and prevent the extension from evaluating the tab
const isTemporaryTab: { [tabId: number]: boolean } = {};

const init = async (): Promise<void> => {
  /**
   * ON INSTALL
   */
  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      // TODO: action to take on successful installation
      // EX: open a welcome page and request user to login (see browser.runtime.onMessageExternal)
    }
  });

  wildlinkClient = await initWildlink();

  /**
   * ON MESSAGE EXTERNAL
   * external message listener from externally_connectable URLs as defined in the manifest
   */
  browser.runtime.onMessageExternal.addListener(
    async (
      message: ExternalMessage,
    ): Promise<ExternalResponseMessage<typeof message.status>> => {
      switch (message.status) {
        case CLEAR_STORAGE: {
          await browser.storage.local.clear();
          // reset the client
          wildlinkClient = await initWildlink();
          return Promise.resolve({
            status: SUCCESS,
            payload: undefined,
          });
        }
        case GET_USER: {
          const storage = await browser.storage.local.get(['device', 'auth']);
          const device: Device = storage.device;
          const auth: Auth | undefined = storage.auth;
          return Promise.resolve({
            status: SUCCESS,
            payload: { device, auth },
          });
        }
        case SET_AUTH: {
          const auth = message.payload;
          await browser.storage.local.set({ auth });
          return Promise.resolve({
            status: SUCCESS,
            payload: undefined,
          });
        }
        default:
          return Promise.resolve({
            status: ERROR,
            payload: {
              detail: 'unhandled message',
            },
          });
      }
    },
  );

  /**
   * BROWSER ACTION: ON CLICK
   * browserAction is the icon next to the address bar
   */
  browser.browserAction.onClicked.addListener((tab) => {
    if (tab.id && startsWithHttp(tab.url)) {
      browser.tabs.sendMessage(tab.id, {
        status: TOGGLE_CONTENT,
      } as ExtensionMessage<typeof TOGGLE_CONTENT>);
    }
  });

  /**
   * TABS: ON UPDATED
   * 1/2 ways we check if a URL is eligible or not
   * we check here to handle if host is a SPA (DOCUMENT_IDLE fires only once)
   */
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
      changeInfo.status === 'loading' &&
      tab.url &&
      startsWithHttp(tab.url) &&
      !isTemporaryTab[tabId]
    ) {
      // check if content script has been injected
      browser.tabs
        .sendMessage(tabId, {
          status: PING,
        } as ExtensionMessage<typeof PING>)
        .then((response: ContentResponseMessages<typeof PING>) => {
          if (response.status === PONG) {
            if (tab.url) {
              handleTabLoaded(tabId, tab.url, wildlinkClient);
            }
          }
        })
        // receiving end does not exist: content script has not been injected
        // do nothing and let DOCUMENT_IDLE handle
        .catch((error) => error);
    }
  });

  /**
   * ON MESSAGE
   * comes from the content script embedded in the page
   */
  browser.runtime.onMessage.addListener(
    async (
      message: BackgroundMessage,
      { tab },
    ): Promise<BackgroundResponseMessage<typeof message.status>> => {
      switch (message.status) {
        // 2/2 ways we check if a URL is eligible or not
        // we check here so we can show as soon as possible (when DOM is ready)
        case DOCUMENT_IDLE: {
          if (tab?.id && tab?.url) {
            handleTabLoaded(tab.id, tab.url, wildlinkClient);
          }
          return;
        }
        case GENERATE_VANITY: {
          const vanity = await wildlinkClient.generateVanity(
            message.payload.originalUrl,
            message.payload.activeDomain,
            `extension-template-share_${config.appId}`,
          );
          // return a promise to send a message back
          return Promise.resolve({
            status: SUCCESS,
            payload: vanity,
          });
        }
        case OPEN_TAB: {
          browser.tabs.create({
            url: message.payload.url,
            openerTabId: tab?.id,
          });
          return;
        }
        case ACTIVATE_CASHBACK: {
          // to activate cashback, we open a vanity in the background
          const newTab = await browser.tabs.create({
            url: message.payload.url,
            openerTabId: tab?.id,
            active: false,
          });
          // set temporary tab so it does not get evaluated for eligibility
          if (newTab.id) {
            isTemporaryTab[newTab.id] = true;
          }
          return new Promise((resolve) => {
            browser.tabs.onUpdated.addListener(function listener(
              tabId,
              changeInfo,
            ) {
              // if it takes longer than 10 seconds, return an error
              setTimeout(
                () =>
                  resolve({
                    status: ERROR,
                    payload: {
                      detail: 'timeout',
                    },
                  }),
                10000,
              );
              // cleanup after the background tab is finished
              if (changeInfo.status === 'complete' && tabId === newTab.id) {
                browser.tabs.onUpdated.removeListener(listener);
                browser.tabs.remove(newTab.id);
                delete isTemporaryTab[newTab.id];
                resolve({
                  status: SUCCESS,
                  payload: undefined,
                });
              }
            });
          });
        }
        case RELOAD: {
          if (tab?.id) {
            await browser.tabs.reload(tab.id);
            browser.tabs.onUpdated.addListener(function listener(
              tabId,
              changeInfo,
            ) {
              // show the content when done loading
              if (changeInfo.status === 'complete' && tabId === tab.id) {
                browser.tabs.onUpdated.removeListener(listener);
                browser.tabs.sendMessage(tab.id, {
                  status: SHOW_CONTENT,
                } as ExtensionMessage<typeof SHOW_CONTENT>);
              }
            });
          }
          return;
        }
        default:
          return Promise.resolve({
            status: ERROR,
            payload: {
              detail: 'unhandled message',
            },
          });
      }
    },
  );

  /**
   * WEB REQUEST: ON BEFORE REDIRECT
   * track which tabs are vanity URLs
   */
  browser.webRequest.onBeforeRedirect.addListener(
    ({ tabId }) => {
      setVanityRedirectTab(tabId);
    },
    {
      urls: [
        `http://*.${config.vanityBase}/*`,
        `https://*.${config.vanityBase}/*`,
      ],
    },
  );

  /**
   * watch for affiliate urls and stand down
   */
  browser.webRequest.onBeforeRedirect.addListener(
    (details) => {
      handleCJRedirect(details.redirectUrl, wildlinkClient);
    },
    {
      urls: CJ_AFF_URLS.map((url) => `*://${url}/*`),
    },
  );
};

(async (): Promise<void> => {
  try {
    await init();
  } catch (error) {
    console.log(error);
  }
})();
