// @flow
import type { RowDataItem } from 'homepage';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import { SITE_NAME } from 'config';
import React from 'react';
import Page from 'component/page';
import Button from 'component/button';
import ClaimTilesDiscover from 'component/claimTilesDiscover';
import getHomepage from 'homepage';
import Icon from 'component/common/icon';

type Props = {
  authenticated: boolean,
  followedTags: Array<Tag>,
  subscribedChannels: Array<Subscription>,
  showNsfw: boolean,
};

function HomePage(props: Props) {
  const { followedTags, subscribedChannels, authenticated, showNsfw } = props;
  const showPersonalizedChannels = (authenticated || !IS_WEB) && subscribedChannels && subscribedChannels.length > 0;
  const showPersonalizedTags = (authenticated || !IS_WEB) && followedTags && followedTags.length > 0;
  const showIndividualTags = showPersonalizedTags && followedTags.length < 5;

  const rowData: Array<RowDataItem> = getHomepage(
    authenticated,
    showPersonalizedChannels,
    showPersonalizedTags,
    subscribedChannels,
    followedTags,
    showIndividualTags,
    showNsfw
  );

  return (
    <Page fullWidthPage>
      {(authenticated || !IS_WEB) && !subscribedChannels.length && (
        <div className="notice-message">
          <h1 className="section__title">
            {__("%SITE_NAME% is more fun if you're following channels", { SITE_NAME })}
          </h1>
          <p className="section__actions">
            <Button
              button="primary"
              navigate={`/$/${PAGES.CHANNELS_FOLLOWING_DISCOVER}`}
              label={__('Find new channels to follow')}
            />
          </p>
        </div>
      )}
      {rowData.map(({ title, link, icon, help, options = {} }) => (
        <div key={title} className="claim-grid__wrapper">
          <h1 className="claim-grid__header">
            <Button navigate={link} button="link">
              {icon && <Icon className="claim-grid__header-icon" sectionIcon icon={icon} size={20} />}
              <span className="claim-grid__title">{title}</span>
              {help}
            </Button>
          </h1>

          <ClaimTilesDiscover {...options} />
          {link && (
            <Button
              className="claim-grid__title--secondary"
              button="link"
              navigate={link}
              iconRight={ICONS.ARROW_RIGHT}
              label={title}
            />
          )}
        </div>
      ))}
    </Page>
  );
}

export default HomePage;
