// @flow
import * as React from 'react';
import classnames from 'classnames';
import PreviewLink from 'component/previewLink';
import EmbedPlayButton from 'component/embedPlayButton';
import Button from 'component/button';
import { INLINE_PLAYER_WRAPPER_CLASS } from 'component/fileRenderFloating/view';

type Props = {
  uri: string,
  claim: StreamClaim,
  children: React.Node,
  description: ?string,
  isResolvingUri: boolean,
  doResolveUri: string => void,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
  playingUri: ?{
    uri: string,
    source?: string,
  },
  isInComment?: boolean,
  isMarkdownPost?: boolean,
  userLink: string,
};

class ClaimLink extends React.Component<Props> {
  static defaultProps = {
    href: null,
    link: false,
    thumbnail: null,
    description: null,
    isResolvingUri: false,
  };

  componentDidMount() {
    this.resolve(this.props);
  }

  componentDidUpdate() {
    this.resolve(this.props);
  }

  isClaimBlackListed() {
    const { claim, blackListedOutpoints } = this.props;
    const signingChannel = claim && claim.signing_channel;
    if (claim && blackListedOutpoints) {
      let blackListed = false;

      blackListed = blackListedOutpoints.some(
        outpoint =>
          (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
          (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
      );
      return blackListed;
    }
  }

  resolve = (props: Props) => {
    const { isResolvingUri, doResolveUri, claim, uri } = props;

    if (!isResolvingUri && claim === undefined && uri) {
      doResolveUri(uri);
    }
  };

  render() {
    const { uri, claim, children, isResolvingUri, playingUri, isInComment, isMarkdownPost, userLink } = this.props;
    const isUnresolved = (!isResolvingUri && !claim) || !claim;
    const isBlacklisted = this.isClaimBlackListed();
    const isPlayingInline =
      playingUri && playingUri.uri === uri && (playingUri.source === 'comment' || playingUri.source === 'markdown');

    if (isBlacklisted || isUnresolved) {
      return <span>{children}</span>;
    }

    const { value_type: valueType } = claim;
    const isChannel = valueType === 'channel';

    return isChannel ? (
      <div>
        <PreviewLink uri={uri} userLink={userLink} />
      </div>
    ) : (
      <div className={classnames('claim-link')}>
        <div
          className={classnames({
            [INLINE_PLAYER_WRAPPER_CLASS]: isPlayingInline,
          })}
        >
          <EmbedPlayButton uri={uri} isInComment={isInComment} isMarkdownPost={isMarkdownPost} />
        </div>
        <Button button="link" className="preview-link__url" label={userLink} navigate={uri} />
      </div>
    );
  }
}

export default ClaimLink;
