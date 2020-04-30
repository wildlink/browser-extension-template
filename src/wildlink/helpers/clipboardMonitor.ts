import { WildlinkClient } from 'wildlink-js-client';
import {
  setIntervalAsync,
  clearIntervalAsync,
  SetIntervalAsyncTimer,
} from 'set-interval-async/dynamic';

import config from '/config';
import { startsWithHttp, getActiveDomain } from '/wildlink/helpers/domain';
import { clipboardReplacedNotification } from '/helpers/browser/notification';

export default class ClipboardMonitor {
  client: WildlinkClient;
  timer: SetIntervalAsyncTimer;
  undone: string;
  pasteArea: HTMLTextAreaElement;
  copyArea: HTMLTextAreaElement;
  testArea: HTMLTextAreaElement;

  constructor(client: WildlinkClient) {
    this.client = client;
    this.timer = { id: 0 };
    this.undone = '';
    this.pasteArea = document.createElement('textarea');
    this.copyArea = document.createElement('textarea');
    this.testArea = document.createElement('textarea');
    // we only care about testing the beginning of the copy
    // watching a large body of text is expensive
    this.testArea.maxLength = 100;
  }

  watch(): void {
    // append the textarea elements so we can interact with them
    document.body.appendChild(this.testArea);
    document.body.appendChild(this.pasteArea);
    document.body.appendChild(this.copyArea);

    // save the interval timer so we can cancel if needed
    this.timer = setIntervalAsync(async () => {
      // watch the clipboard by:
      // 1. storing the old value
      // 2. pasting the new value
      // 3. compare the old and new values
      this.testArea.focus();
      const oldTestClipboard = this.testArea.value;
      this.testArea.value = '';
      document.execCommand('paste');
      const newTestClipboard = this.testArea.value;
      // clipboard has changed and starts with http
      if (
        startsWithHttp(newTestClipboard) &&
        oldTestClipboard !== newTestClipboard
      ) {
        const activeDomain = await getActiveDomain(
          newTestClipboard,
          this.client,
        );
        if (activeDomain) {
          this.pasteArea.focus();
          this.pasteArea.value = '';
          document.execCommand('paste');
          const fullClipboard = this.pasteArea.value;

          if (this.undone !== fullClipboard) {
            const { VanityURL } = await this.client.generateVanity(
              fullClipboard,
              activeDomain,
              `extension-template-clipboard_${config.appId}`,
            );
            this.copyArea.value = `${VanityURL}${config.shareHashtag &&
              ` #${config.shareHashtag}`}`;
            this.copyArea.select();
            document.execCommand('copy');
            this.copyArea.value = '';
            clipboardReplacedNotification();
          }
        }
      }
    }, 600);

    // undo
    browser.notifications.onButtonClicked.addListener(() => {
      const oldFullClipboard = this.pasteArea.value;
      this.copyArea.value = oldFullClipboard;
      this.copyArea.select();
      document.execCommand('copy');
      this.copyArea.value = '';
      this.undone = oldFullClipboard;
      // reset the last undone URL
      setTimeout(() => (this.undone = ''), 3000);
    });
  }

  async stop(): Promise<void> {
    await clearIntervalAsync(this.timer);
    document.body.removeChild(this.testArea);
    document.body.removeChild(this.pasteArea);
    document.body.removeChild(this.copyArea);
  }
}
