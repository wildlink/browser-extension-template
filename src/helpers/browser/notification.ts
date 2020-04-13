export const clipboardReplacedNotification = async (): Promise<void> => {
  const notificationOptions: browser.notifications.CreateNotificationOptions = {
    type: 'basic',
    iconUrl: '/img/icon-128.png',
    title: 'Share & Earn link created',
    message: 'Paste anywhere to share and earn',
    buttons: [
      {
        title: 'Undo',
      },
    ],
  };
  await browser.notifications.create(notificationOptions);
};
