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
} from '/helpers/browser/message';
import { handleTabLoaded, setVanityRedirectTab } from '/helpers/browser/tab';

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
          return Promise.resolve({ status: SUCCESS, payload: undefined });
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
          return Promise.resolve({ status: SUCCESS, payload: undefined });
        }
        default:
          return Promise.resolve({
            status: ERROR,
            payload: { detail: 'unhandled message' },
          });
      }
    },
  );

  /**
   * BROWSER ACTION: ON CLICK
   * browserAction is the icon next to the address bar
   */
  browser.browserAction.onClicked.addListener((tab) => {
    if (tab.id) {
      browser.tabs.sendMessage(tab.id, {
        status: TOGGLE_CONTENT,
      } as ExtensionMessage<typeof TOGGLE_CONTENT>);
    }
  });

  /**
   * TABS: ON UPDATED
   * how we check if a URL is eligible or not
   */
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // tab has finished loading and we can start doing things
    if (changeInfo.status === 'complete' && tab.url && !isTemporaryTab[tabId]) {
      handleTabLoaded(tabId, tab.url, wildlinkClient);
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
        case GENERATE_VANITY: {
          const vanity = await wildlinkClient.generateVanity(
            message.payload.originalUrl,
            message.payload.activeDomain,
            `extension-template-share_${config.appId}`,
          );
          // return a promise to send a message back
          return Promise.resolve({ status: SUCCESS, payload: vanity });
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
                  resolve({ status: ERROR, payload: { detail: 'timeout' } }),
                10000,
              );
              // cleanup after the background tab is finished
              if (changeInfo.status === 'complete' && tabId === newTab.id) {
                browser.tabs.onUpdated.removeListener(listener);
                browser.tabs.remove(newTab.id);
                delete isTemporaryTab[newTab.id];
                resolve({ status: SUCCESS, payload: undefined });
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
            payload: { detail: 'unhandled message' },
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
};

(async (): Promise<void> => {
  try {
    await init();
  } catch (error) {
    console.log(error);
  }
})();
