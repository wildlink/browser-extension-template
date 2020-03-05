import { WildlinkClient } from 'wildlink-js-client';

import config from '/config';
import ClipboardMonitor from '/wildlink/helpers/clipboardMonitor';

let clipboardMonitor: ClipboardMonitor;

export const initWildlink = async (): Promise<WildlinkClient> => {
  const wildlinkClient = new WildlinkClient(config.appSecret, config.appId);
  const { device } = await browser.storage.local.get('device');

  if (device) {
    await wildlinkClient.init(device);
  } else {
    await wildlinkClient.init();
    const device = wildlinkClient.getDevice();
    // store device information if there was none before
    await browser.storage.local.set({ device });
    // TODO: setup push notification platform of your choice
  }

  // stop the monitor if it has been running
  if (clipboardMonitor) {
    await clipboardMonitor.stop();
  }
  clipboardMonitor = new ClipboardMonitor(wildlinkClient);
  clipboardMonitor.watch();

  return wildlinkClient;
};
