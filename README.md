# browser-extension-template
Template to create a browser extension to earn on eligible URLs. Powered by [Wildlink](https://www.wildlink.me).

## Index
- [About](#about)
- [Getting Started](#getting-started)
- [Setup](#setup)
- [Deployment](#deployment)

## About

### Features
- Monitor clipboard for changes and create Wildlinks (and replace the clipboard contents with the WIldlink) when an eligible URL is present
- Notify the user when their clipboard has been replaced
- Alert the user when they are on a website that is eligible for earning
- Allow the user to activate earning
- Alert the user that their earning is enabled/activated
- Allow the user to share an affiliated link for the page that they're on to email, Facebook or Twitter
- Loads a blacklist of merchants from a remote source and doesn't match domains for this blacklist

### Notable Dependencies

- [React](https://reactjs.org/): front end framework
- [Typescript](https://www.typescriptlang.org/): superset of Javascript that adds type checking
- [Parcel](https://parceljs.org/): web application bundler

### Browser Extension

![browser extension diagram](https://developer.chrome.com/static/images/overview/messagingarc.png)

The above diagram is a good visualization of how browser extensions work and you can find more information [here](https://developer.chrome.com/extensions/overview).

- **Background Script**: event handler for the extension
- **Content Script**: executes in the context of the page, allowing us to interact with the DOM (inject elements into the page and display to the user)

### Styling and Assets (Content Script)

Injecting your own HTML elements and CSS styling into someone else's page can be tricky without clobbering each other. Because of this, we leverage the [ShadowDOM](https://developers.google.com/web/fundamentals/web-components/shadowdom) in order to encapsulate the elements we inject into the page via the content script.

Since we are using the ShadowDOM, injecting CSS into the page becomes difficult so we apply styling inline directly on the HTML element.

Assets you want to inject into the page via the content script should be served off a CDN and included that way.

Icons that appear next to the address bar and in notifications are not injected into the page and should be added to the [`src/static/img`](src/static/img) folder and then referenced in respect to the `static` folder (EX/ `img/icon.png`).

## Getting Started

### Requirements

- [Docker](https://docs.docker.com/)

### [`src/config.ts`](src/config.ts)
- fill in the configurations specific to your application as provided by Wildlink

### Development

1. ```docker-compose up``` (You will know when the container is running and ready for development when you see "`Watching for changes...`")
1. Go to [chrome://extensions/](chrome://extensions/)
1. Activate __Developer mode__
1. __Load unpacked__ and select the `dist` folder from the root directory
1. The local development version is now installed on Chrome and is watching for changes for automatic reload

![installing a development chrome extension](https://developer.chrome.com/static/images/get_started/load_extension.png)

#### Dependencies

If you are going to install dependencies during development, make sure you add them from **inside** the docker container:
  1. `docker ps`
  1. `docker exec -it [CONTAINER ID] sh`
  1. `yarn add [DEPENDENCY]`

### [Debugging](https://developer.chrome.com/extensions/tut_debugging)

#### [Background Script](#browser-extension)

- You can debug the background script via the background page console

[![debugging a chrome extension](https://developer.chrome.com/static/images/debugging/inspect_views_background.png)](https://developer.chrome.com/extensions/tut_debugging#debug_bg)

#### [Content Script](#browser-extension)

- You can debug the content script via the console of the webpage the extension is injected into

[![debugging a content script](https://developer.chrome.com/static/images/debugging/content_script_error.png)](https://developer.chrome.com/extensions/tut_debugging#debug_cs)

## Setup

### [`src/config.ts`](src/config.ts)
- fill in the configurations specific to your application as provided by Wildlink

### Environment Files
[.env.local](.env.local)

[.env.development](.env.development)

[.env.production](.env.production)
- fill in the variables you would like to vary according to your environment
  - EX/ endpoint where your merchant blacklist would come from
  - EX/ webpage you would like to open on successful install

### Blacklist
- there is a function stubbed out where you should fetch and return your blacklist of merchant domains
- the blacklist should be an array of domains that you do not want to match against that correspond to Wildlink's domain list
- see [`src/helpers/api.ts`](src/helpers/api.ts) **(Do not forget to replace this stub!)**
- blacklist is cached for 24 hours

### Branding
- Logo: [`src/content/components/Logo.tsx`](src/content/components/Logo.tsx)
  - change `LOGO` value to the URL of your choice and adjust the height or width as needed
  - change the destination URL of the logo
- Icons
  - currently there are 2 placeholder icons that can be found in [`src/static/img`](src/static/img)
    - [`icon-128.png`](src/static/img/icon-128.png): appears next to address bar on eligible pages and in notifications
    - [`icon-disabled-128.png`](src/static/img/icon-disabled-128.png): appears next to address bar on ineligible pages
  - replacing these icons is the easiest way to change them with no code change
  - both should be 128 x 128 pixels
  - the disabled version of the icon should be a greyscaled version of it's counterpart
- Share: [`src/content/components/Share/Share.tsx`](src/content/components/Share/Share.tsx)
  - the share icons can be replaced with ones of your choice, just change the source URL

### [`src/static/manifest.json`](src/static/manifest.json) - (more information [here](https://developer.chrome.com/extensions/manifest))
- fill in empty fields specific to your extension
- `key`: for a easier development cycle, you should obtain and add a `key` field to your manifest
  - this will keep your extension ID the same which is used to communicate to your extension from a webpage
  - How to:
    1. build crx and pem: go to [chrome://extensions/](chrome://extensions/) and **Pack extension** with the `/dist` folder (see [Development](#development))
    1. install crx by dragging and dropping into Chrome
    1. obtain the `key` by using [this](https://developer.chrome.com/apps/manifest/key) as a guide
- `externally_connectable`
  - URL patterns that you would like to be able to communicate to your extension
- `icons`
  - as mentioned above: should be added to the [`src/static/img`](src/static/img) folder and then referenced in respect to the `static` folder (EX/ `img/icon-128.png`)
  - `browser_action.default_icon`
    - should be the icon used to denote an inactive state that will be changed if the user is on an eligible domain

### Authentication
- [`src/background.ts`](src/background.ts) - the background script
  - `onInstalled` event listener
    - we recommend opening a webpage confirming the browser extension install
    - call to action to authenticate the user and associate Wildlink device with your user
  - `onMessageExternal` event listener
    - provides a way to communicate to the extension from a webpage
    - messages should be structured as defined in [`src/helpers/browser/message.ts`](src/helpers/browser/message.ts)
    - **important**: make sure the URL you are trying to communicate with is defined in the manifest under `externally_connectable`

### Push Notifications
- will need to be implemented according the the platform of your choice

## Deployment

### [Chrome Web Store](https://chrome.google.com/webstore/category/extensions)

1. Make sure to update the manifest version
1. Run ```./build-prod.sh```
1. Take resulting `build-production.zip` and upload to the Chrome Web Store

First Time?
- See https://developer.chrome.com/webstore/publish
- **Privacy**: the Chrome Web Store will request information regarding privacy and extension permissions
  - `tabs`: Need access to tab's URL to determine if it is in the list of our supported domains.
  - `webRequest`: To create a better experience if the user is coming from one of our redirect links.
  - `Host Permission`: Our product is compatible with a large list of domains that changes.
