import { Tabs, TabTitle } from '@erxes/ui/src/components/tabs';
import { __ } from '@erxes/ui/src/utils/core';
import React from 'react';

import { CONFIG_TYPES } from '../constants';
import { ClientPortalConfig, ClientPortalNotification } from '../types';
import FormNotification from './ClientPortalNotificationForm';

type Props = {
  config: ClientPortalConfig;
  handleUpdate: (doc: ClientPortalNotification) => void;
};

class ClientPortalNotificationDetail extends React.Component<
  Props,
  { currentTab: string }
> {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 'general'
    };
  }

  tabOnClick = (currentTab: string) => {
    this.setState({ currentTab });
  };

  renderContent() {
    const { config, handleUpdate } = this.props;
    const { currentTab } = this.state;

    const commonProps = {
      defaultConfigValues: config,
      handleUpdate
    };

    const TYPE = CONFIG_TYPES[currentTab.toLocaleUpperCase()];

    return <FormNotification {...commonProps} configType={TYPE.VALUE} />;
  }

  render() {
    const { currentTab } = this.state;

    return <>{this.renderContent()}</>;
  }
}

export default ClientPortalNotificationDetail;
