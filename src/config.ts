interface WildlinkConfig {
  appId: number;
  appSecret: string;
  vanityBase: string;
  shareHashtag: string;
}

const config: WildlinkConfig = {
  // your application ID provided by Wildfire
  appId: 0,
  // your application secret provided by Wildfire
  appSecret: '',
  // the base for your vanity links; must be configured with Wildfire's backend
  vanityBase: 'wild.link',
  // single hashtag without spaces and leading # to place after vanity
  shareHashtag: 'ad',
};

export default config;
