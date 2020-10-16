// @flow
import { KNOWN_APP_DOMAINS } from 'config';
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import { isURIValid, parseURI } from 'lbry-redux';
import Button from 'component/button';
import ClaimLink from 'component/claimLink';
import { generateLbryWebUrl, formatWebUrlIntoLbryUrl } from 'util/url';

type Props = {
  href: string,
  title?: string,
  embed?: boolean,
  children: React.Node,
  openModal: (id: string, { uri: string }) => void,
};

function ExternalLink(props: Props) {
  const { href, title, embed = false, children, openModal, isInComment, isMarkdownPost } = props;

  // Regex for url protocol
  const protocolRegex = new RegExp('^(https?|lbry|mailto)+:', 'i');
  const protocol = href ? protocolRegex.exec(href) : null;
  // Return plain text if no valid url
  let element = <span>{children}</span>;
  // Return external link if protocol is http or https

  const linkUrlObject = new URL(href);
  const linkDomain = linkUrlObject.host;
  const isKnownAppDomainLink = KNOWN_APP_DOMAINS.includes(linkDomain);
  let lbryUrlFromLink;
  if (isKnownAppDomainLink) {
    const linkPathname = decodeURIComponent(
      linkUrlObject.pathname.startsWith('//') ? linkUrlObject.pathname.slice(2) : linkUrlObject.pathname.slice(1)
    );
    const possibleLbryUrl = `lbry://${linkPathname.replace(/:/g, '#')}`;
    const lbryLinkIsValid = isURIValid(possibleLbryUrl);
    if (lbryLinkIsValid) {
      lbryUrlFromLink = possibleLbryUrl;
    }
  }

  // Return local link if protocol is lbry uri
  if ((protocol && protocol[0] === 'lbry:' && isURIValid(href)) || lbryUrlFromLink) {
    element = (
      <ClaimLink
        uri={lbryUrlFromLink || href}
        userLink={href}
        autoEmbed={embed}
        isInComment={isInComment}
        isMarkdownPost={isMarkdownPost}
      >
        {children}
      </ClaimLink>
    );
  } else if (protocol && (protocol[0] === 'http:' || protocol[0] === 'https:' || protocol[0] === 'mailto:')) {
    element = (
      <Button
        button="link"
        iconRight={ICONS.EXTERNAL}
        title={title || href}
        label={children}
        className="button--external-link"
        onClick={() => {
          openModal(MODALS.CONFIRM_EXTERNAL_RESOURCE, { uri: href, isTrusted: false });
        }}
      />
    );
  }

  return <>{element}</>;
}

export default ExternalLink;
