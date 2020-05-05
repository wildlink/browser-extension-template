import { ActiveDomain } from 'wildlink-js-client';

import { initWildlink } from '/wildlink/client';
import * as testTabModule from './tab';
import * as testDomainModule from '/wildlink/helpers/domain';
import { NOT_ELIGIBLE, ELIGIBLE, SHOW_CONTENT } from './message';

const mockSendMessage = jest.fn();
const mockSetIcon = jest.fn();

// @ts-ignore
global.browser = {
  tabs: {
    sendMessage: mockSendMessage,
  },
  browserAction: {
    setIcon: mockSetIcon,
  },
};

const tabId = 1;

const exampleActiveDomain = {
  ID: 1,
  Domain: 'eligible.com',
  Merchant: {
    ID: 1,
    Name: 'Eligible',
    DefaultRate: null,
    DerivedRate: null,
    MaxRate: null,
  },
};

jest.mock('/wildlink/client', () => {
  return {
    initWildlink: jest.fn().mockImplementation(() => {
      return {
        getDomains: (): ActiveDomain[] => [exampleActiveDomain],
      };
    }),
  };
});

describe('evaluate whether or not a tab is eligible', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // cleanup tracker
    delete testTabModule.activeDomainLastSeen[exampleActiveDomain.Domain];
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('sends a NOT_ELIGIBLE message', async () => {
    const mockWildlinkClient = await initWildlink();
    await testTabModule.handleTabLoaded(
      tabId,
      'https://not-eligible.com',
      mockWildlinkClient,
    );
    expect(mockSendMessage).toHaveBeenCalledWith(tabId, {
      status: NOT_ELIGIBLE,
    });
  });

  it('sends a ELIGIBLE message and a SHOW_CONTENT message', async () => {
    jest.spyOn(testDomainModule, 'isBlacklistDomain').mockResolvedValue(false);
    const mockWildlinkClient = await initWildlink();
    const tabUrl = 'https://www.eligible.com';
    await testTabModule.handleTabLoaded(tabId, tabUrl, mockWildlinkClient);
    expect(mockSendMessage).toHaveBeenCalledWith(tabId, {
      status: ELIGIBLE,
      payload: {
        activeDomain: exampleActiveDomain,
        originalUrl: tabUrl,
      },
    });
    expect(mockSendMessage).toHaveBeenLastCalledWith(tabId, {
      status: SHOW_CONTENT,
    });
    expect(mockSendMessage).toBeCalledTimes(2);
  });

  it('sends a ELIGIBLE message but stands down if affiliated already', async () => {
    jest.spyOn(testDomainModule, 'isBlacklistDomain').mockResolvedValue(false);
    const mockWildlinkClient = await initWildlink();
    const tabUrl = 'https://www.eligible.com?afsrc=1';
    await testTabModule.handleTabLoaded(tabId, tabUrl, mockWildlinkClient);
    expect(mockSendMessage).toHaveBeenCalledWith(tabId, {
      status: ELIGIBLE,
      payload: {
        activeDomain: exampleActiveDomain,
        originalUrl: tabUrl,
      },
    });
    expect(mockSendMessage).toBeCalledTimes(1);
  });
});
