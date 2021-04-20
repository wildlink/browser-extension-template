import { ActiveDomain, Device, Vanity } from 'wildlink-js-client';

import { EligibleDomain } from '/wildlink/helpers/domain';

export const SHOW_CONTENT = 'SHOW_CONTENT';
export const TOGGLE_CONTENT = 'TOGGLE_CONTENT';
export const ELIGIBLE = 'ELIGIBLE';
export const NOT_ELIGIBLE = 'NOT_ELIGIBLE';
export const GENERATE_VANITY = 'GENERATE_VANITY';
export const ACTIVATE_CASHBACK = 'ACTIVATE_CASHBACK';
export const OPEN_TAB = 'OPEN_TAB';
export const ERROR = 'ERROR';
export const RELOAD = 'RELOAD';
export const CLEAR_STORAGE = 'CLEAR_STORAGE';
export const GET_USER = 'GET_USER';
export const SET_AUTH = 'SET_AUTH';
export const SUCCESS = 'SUCCESS';
export const DOCUMENT_IDLE = 'DOCUMENT_IDLE';
export const PING = 'PING';
export const PONG = 'PONG';
export const IS_CASHBACK_ACTIVATED = 'IS_CASHBACK_ACTIVATED';

interface NewTab {
  url: string;
  domain: string;
}

type PayloadMap = {
  [SHOW_CONTENT]: undefined;
  [TOGGLE_CONTENT]: undefined;
  [ELIGIBLE]: EligibleDomain;
  [NOT_ELIGIBLE]: undefined;
  [GENERATE_VANITY]: EligibleDomain;
  [IS_CASHBACK_ACTIVATED]: ActiveDomain;
  [ACTIVATE_CASHBACK]: NewTab;
  [OPEN_TAB]: NewTab;
  [ERROR]: undefined;
  [RELOAD]: undefined;
  [CLEAR_STORAGE]: undefined;
  [GET_USER]: undefined;
  [SET_AUTH]: Auth;
  [SUCCESS]: undefined;
  [DOCUMENT_IDLE]: undefined;
  [PING]: undefined;
  [PONG]: undefined;
};

interface Message<S, P> {
  status: S;
  payload: P;
}

export type ExtensionMessage<S extends keyof PayloadMap> = Message<
  S,
  PayloadMap[S]
>;

export type ContentDisplayMessage =
  | ExtensionMessage<typeof SHOW_CONTENT>
  | ExtensionMessage<typeof TOGGLE_CONTENT>;

export type BackgroundMessage =
  | ExtensionMessage<typeof GENERATE_VANITY>
  | ExtensionMessage<typeof ACTIVATE_CASHBACK>
  | ExtensionMessage<typeof IS_CASHBACK_ACTIVATED>
  | ExtensionMessage<typeof OPEN_TAB>
  | ExtensionMessage<typeof RELOAD>
  | ExtensionMessage<typeof DOCUMENT_IDLE>;

export type ContentMessage =
  | ExtensionMessage<typeof ELIGIBLE>
  | ExtensionMessage<typeof NOT_ELIGIBLE>
  | ExtensionMessage<typeof PING>;

export type ExternalMessage =
  | ExtensionMessage<typeof CLEAR_STORAGE>
  | ExtensionMessage<typeof GET_USER>
  | ExtensionMessage<typeof SET_AUTH>;

export interface Auth {
  token: string;
  // add any additional auth information
}

export interface User {
  device: Device;
  auth: Auth | undefined;
}

export interface ErrorDetail {
  detail: string;
}

type SuccessMessage = Message<typeof SUCCESS, undefined>;
type ErrorMessage = Message<typeof ERROR, ErrorDetail>;

type ExternalResponseMap = {
  [CLEAR_STORAGE]: SuccessMessage;
  [GET_USER]: Message<typeof SUCCESS, User>;
  [SET_AUTH]: SuccessMessage;
  [ERROR]: Message<typeof ERROR, ErrorDetail>;
  [GENERATE_VANITY]: Message<typeof SUCCESS, Vanity>;
  [OPEN_TAB]: SuccessMessage;
  [ACTIVATE_CASHBACK]: SuccessMessage | ErrorMessage;
};

export type ExternalResponseMessage<S extends keyof ExternalResponseMap> =
  | ExternalResponseMap[S]
  | ErrorMessage;

type BackgroundResponseMap = {
  [GENERATE_VANITY]: Message<typeof SUCCESS, Vanity>;
  [OPEN_TAB]: undefined;
  [RELOAD]: undefined;
  [IS_CASHBACK_ACTIVATED]: boolean;
  [ACTIVATE_CASHBACK]: SuccessMessage | ErrorMessage;
  [DOCUMENT_IDLE]: undefined;
};

export type BackgroundResponseMessage<S extends keyof BackgroundResponseMap> =
  | BackgroundResponseMap[S]
  | ErrorMessage;

export const openTab = async (url: string): Promise<void> => {
  await browser.runtime.sendMessage({
    status: OPEN_TAB,
    payload: {
      url,
    },
  } as ExtensionMessage<typeof OPEN_TAB>);
};

type ContentResponseMap = {
  [ELIGIBLE]: undefined;
  [NOT_ELIGIBLE]: undefined;
  [PING]: ExtensionMessage<typeof PONG>;
};

export type ContentResponseMessages<
  S extends keyof ContentResponseMap
> = ContentResponseMap[S];
