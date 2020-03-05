import React, { FC, useState } from 'react';
import { Vanity } from 'wildlink-js-client';
import copy from 'copy-to-clipboard';
import CSS from 'csstype';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import config from '/config';
import { openTab } from '/helpers/browser/message';
import { WHITE, GREY, CONFIRM_GREEN } from '/helpers/css';

import ShareOption from '/content/components/Share/ShareOption';

const style: CSS.Properties = {
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const taglineStyle: CSS.Properties = {
  fontWeight: 'bold',
  fontSize: '20px',
};

const subTaglineStyle: CSS.Properties = {
  fontSize: '18px',
};

const shareOptionsStyle: CSS.Properties = {
  backgroundColor: GREY,
  borderRadius: '5px',
  fontSize: 0,
  minWidth: '275px',
  margin: '8px',
};

const copyConfirmStyle: CSS.Properties = {
  fontSize: 'initial',
  color: WHITE,
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: '10px',
  cursor: 'pointer',
};

const copyConfirmIconStyle: CSS.Properties = {
  height: '40px',
  width: '40px',
  margin: '8px',
  padding: '2px',
  color: CONFIRM_GREEN,
  backgroundColor: WHITE,
  borderRadius: '50%',
};

const COPY = 'https://storage.googleapis.com/wildlink/web/chrome/copy.png';
const EMAIL = 'https://storage.googleapis.com/wildlink/web/chrome/email.png';
const FACEBOOK =
  'https://storage.googleapis.com/wildlink/web/chrome/facebook.png';
const TWITTER =
  'https://storage.googleapis.com/wildlink/web/chrome/twitter.png';

interface ShareProps {
  getVanity: () => Promise<Vanity | undefined>;
  showError: () => void;
}

const Share: FC<ShareProps> = ({ getVanity, showError }) => {
  const [copyConfirm, setCopyConfirm] = useState(false);

  const copyVanity = async (): Promise<void> => {
    const vanity = await getVanity();
    if (vanity) {
      const success = copy(
        `${vanity.VanityURL}${config.shareHashtag &&
          ` #${config.shareHashtag}`}`,
      );
      if (success) {
        setCopyConfirm(true);
      } else {
        showError();
      }
    }
  };

  const confirmCopy = (): void => setCopyConfirm(false);

  const openFacebookShare = async (): Promise<void> => {
    const vanity = await getVanity();
    if (vanity) {
      const url = `https://www.facebook.com/sharer.php?u=${
        vanity.VanityURL
      }${config.shareHashtag && `&hashtag=%23${config.shareHashtag}`}`;
      openTab(url);
    }
  };

  const openTwitterShare = async (): Promise<void> => {
    const vanity = await getVanity();
    if (vanity) {
      const url = `https://twitter.com/intent/tweet?url=${
        vanity.VanityURL
      }${config.shareHashtag && `&hashtags=${config.shareHashtag}`}`;
      openTab(url);
    }
  };

  const openEmailShare = async (): Promise<void> => {
    const vanity = await getVanity();
    if (vanity) {
      const subject = "Here's something I thought you might like";
      const url = `mailto:?subject=${subject}&body=${
        vanity.VanityURL
      }${config.shareHashtag && ` #${config.shareHashtag}`}`;
      openTab(url);
    }
  };

  return (
    <div style={style}>
      <div style={taglineStyle}>Share + Earn</div>
      <div style={shareOptionsStyle}>
        {copyConfirm ? (
          <div style={copyConfirmStyle} onClick={confirmCopy}>
            <FontAwesomeIcon
              style={copyConfirmIconStyle}
              icon={faCheckCircle}
            />
            Link copied to clipboard
          </div>
        ) : (
          <div>
            <ShareOption src={FACEBOOK} onClick={openFacebookShare} />
            <ShareOption src={TWITTER} onClick={openTwitterShare} />
            <ShareOption src={EMAIL} onClick={openEmailShare} />
            <ShareOption src={COPY} onClick={copyVanity} />
          </div>
        )}
      </div>
      <div style={subTaglineStyle}>
        Send a link to friends and earn if they buy
      </div>
    </div>
  );
};

export default Share;
