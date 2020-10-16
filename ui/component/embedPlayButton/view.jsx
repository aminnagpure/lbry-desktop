// @flow
import React, { useEffect } from 'react';
import Button from 'component/button';
import FileViewerEmbeddedTitle from 'component/fileViewerEmbeddedTitle';
import { useIsMobile } from 'effects/use-screensize';
import { formatLbryUrlForWeb } from 'util/url';

type Props = {
  uri: string,
  thumbnail: string,
  claim: ?Claim,
  doResolveUri: string => void,
  doFetchCostInfoForUri: string => void,
  costInfo: ?{ cost: number },
  floatingPlayerEnabled: boolean,
  doPlayUri: (string, ?boolean, ?boolean, (GetResponse) => void) => void,
  doAnaltyicsPurchaseEvent: GetResponse => void,
  isInComment: boolean,
  isMarkdownPost: boolean,
  doSetPlayingUri: ({}) => void,
};

export default function EmbedPlayButton(props: Props) {
  const {
    uri,
    thumbnail = '',
    claim,
    doResolveUri,
    doFetchCostInfoForUri,
    floatingPlayerEnabled,
    doPlayUri,
    doSetPlayingUri,
    doAnaltyicsPurchaseEvent,
    costInfo,
    isInComment,
    isMarkdownPost,
  } = props;
  const isMobile = useIsMobile();
  const hasResolvedUri = claim !== undefined;
  const hasCostInfo = costInfo !== undefined;
  const disabled = !hasResolvedUri || !costInfo;

  useEffect(() => {
    if (!hasResolvedUri) {
      doResolveUri(uri);
    }

    if (!hasCostInfo) {
      doFetchCostInfoForUri(uri);
    }
  }, [uri, doResolveUri, doFetchCostInfoForUri, hasCostInfo, hasResolvedUri]);

  function handleClick() {
    if (disabled) {
      return;
    }

    if (isMobile || !floatingPlayerEnabled) {
      const formattedUrl = formatLbryUrlForWeb(uri);
      push(formattedUrl);
    } else {
      doPlayUri(uri, undefined, undefined, fileInfo => {
        let playingOptions = { uri };
        if (isInComment) {
          playingOptions.source = 'comment';
        } else if (isMarkdownPost) {
          playingOptions.source = 'markdown';
        }
        doSetPlayingUri(playingOptions);
        doAnaltyicsPurchaseEvent(fileInfo);
      });
    }
  }

  return (
    <div
      disabled={disabled}
      role="button"
      className="embed__inline-button"
      onClick={handleClick}
      style={{ backgroundImage: `url('${thumbnail.replace(/'/g, "\\'")}')` }}
    >
      <FileViewerEmbeddedTitle uri={uri} isInApp />
      <Button
        onClick={handleClick}
        iconSize={30}
        title={__('Play')}
        className={'button--icon button--play'}
        disabled={disabled}
      />
    </div>
  );
}
