import Button from '@erxes/ui/src/components/Button';
import FormControl from '@erxes/ui/src/components/form/Control';
import ConditionsRule from '@erxes/ui/src/components/rule/ConditionsRule';
import Step from '@erxes/ui/src/components/step/Step';
import Steps from '@erxes/ui/src/components/step/Steps';
import {
  StepWrapper,
  TitleContainer
} from '@erxes/ui/src/components/step/styles';
import { Alert, __ } from 'coreui/utils';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { IBrand } from '@erxes/ui/src/brands/types';
import { IUser } from '@erxes/ui/src/auth/types';
import { IBreadCrumbItem, IConditionsRule } from '@erxes/ui/src/types';
import { IConfig } from '@erxes/ui-settings/src/general/types';

import React from 'react';
import { Link } from 'react-router-dom';
import { METHODS } from '@erxes/ui-engage/src/constants';
import {
  IEngageEmail,
  IEngageMessage,
  IEngageMessageDoc,
  IEngageMessenger,
  IEngageScheduleDate,
  IEngageSms,
  IEmailTemplate,
  IIntegrationWithPhone
} from '@erxes/ui-engage/src/types';
// import MessageStep from '../../../plugin-engages-ui/src/campaigns/components/step/MessageStep';
import ChannelStep from '../../../plugin-engages-ui/src/campaigns/components/step/ChannelStep';
import ClientPortalNotificationDetailContainer from '../containers/ClientPortalNotificationDetail';
import SegmentsForm from './SegmentsForm';
import { RadioContainer } from '../styles';
import Targets from './Target';
import Segments from '@erxes/ui-segments/src/components/SidebarFilter';
import SegmentFilter from '../containers/SegmentFilter';
import { isEnabled } from '@erxes/ui/src/utils/core';

type Props = {
  message?: IEngageMessage;
  brands: IBrand[];
  users: IUser[];
  templates: IEmailTemplate[];
  kind: string;
  segmentType?: string;
  isActionLoading: boolean;
  handleSubmit?: (name: string, e: React.MouseEvent) => void;
  save: (doc: IEngageMessageDoc) => Promise<any>;
  validateDoc: (
    type: string,
    doc: IEngageMessageDoc
  ) => { status: string; doc?: IEngageMessageDoc };
  renderTitle: () => string;
  breadcrumbs: IBreadCrumbItem[];
  smsConfig: IConfig;
  integrations: IIntegrationWithPhone[];
  queryParams: any;
  loading?: boolean;
};

type State = {
  method: string;
  title: string;
  segmentIds: string[];
  brandIds: string[];
  tagIds: string[];
  content: string;
  fromUserId: string;
  messenger?: IEngageMessenger;
  email?: IEngageEmail;
  scheduleDate: IEngageScheduleDate;
  shortMessage?: IEngageSms;
  rules: IConditionsRule[];
  isSaved: boolean;
  show: false;
  targetIds: string[];
};

class ClientPortalNotification extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const message = props.message || {};
    const messenger = message.messenger || ({} as IEngageMessenger);
    const email = message.email || {};

    let content = email.content || '';

    const rules = messenger.rules
      ? messenger.rules.map(rule => ({ ...rule }))
      : [];

    if (messenger.content && messenger.content !== '') {
      content = messenger.content;
    }

    this.state = {
      method: message.method || METHODS.EMAIL,
      title: message.title || '',
      segmentIds: message.segmentIds || [],
      brandIds: message.brandIds || [],
      tagIds: message.customerTagIds || [],
      content,
      fromUserId: message.fromUserId,
      messenger: message.messenger,
      email: message.email,
      scheduleDate: message.scheduleDate,
      shortMessage: message.shortMessage,
      rules,
      isSaved: false,
      show: false,
      targetIds: []
    };
  }
  onChange = (name, targetIds) => {
    console.log('onchange called');
  };
  changeState = <T extends keyof State>(key: T, value: State[T]) => {
    this.setState(({ [key]: value } as unknown) as Pick<State, keyof State>);
  };
  onChangeStep = (name: string, targetIds: string[]) => {
    this.setState({ targetIds }, () => {
      this.onChange(name, targetIds);
    });
  };

  clearState = () => {
    this.setState({
      segmentIds: [],
      brandIds: [],
      tagIds: [],
      rules: [],
      show: false
    });
  };

  handleSubmit = (type: string): Promise<any> | void => {
    const doc = {
      segmentIds: this.state.segmentIds,
      customerTagIds: this.state.tagIds,
      brandIds: this.state.brandIds,
      title: this.state.title,
      fromUserId: this.state.fromUserId,
      method: this.state.method,
      scheduleDate: this.state.scheduleDate,
      shortMessage: this.state.shortMessage
    } as IEngageMessageDoc;

    if (this.state.method === METHODS.EMAIL) {
      const email = this.state.email || ({} as IEngageEmail);

      doc.email = {
        subject: email.subject || '',
        sender: email.sender || '',
        replyTo: (email.replyTo || '').split(' ').toString(),
        content: this.state.content,
        attachments: email.attachments,
        templateId: email.templateId || ''
      };

      if (doc.messenger) {
        delete doc.messenger;
      }
      if (doc.shortMessage) {
        delete doc.shortMessage;
      }
    }
    if (this.state.method === METHODS.MESSENGER) {
      const messenger = this.state.messenger || ({} as IEngageMessenger);

      doc.messenger = {
        brandId: messenger.brandId || '',
        kind: messenger.kind || '',
        sentAs: messenger.sentAs || '',
        content: this.state.content,
        rules: this.state.rules
      };

      if (doc.email) {
        delete doc.email;
      }
      if (doc.shortMessage) {
        delete doc.shortMessage;
      }
    }
    if (this.state.method === METHODS.SMS) {
      const shortMessage = this.state.shortMessage || {
        from: '',
        content: '',
        fromIntegrationId: ''
      };

      doc.shortMessage = {
        from: shortMessage.from,
        content: shortMessage.content,
        fromIntegrationId: shortMessage.fromIntegrationId
      };

      if (doc.email) {
        delete doc.email;
      }
      if (doc.messenger) {
        delete doc.messenger;
      }
    }

    const response = this.props.validateDoc(type, doc);

    if (this.state.method === METHODS.SMS && !this.props.smsConfig) {
      return Alert.warning(
        'SMS integration is not configured. Go to Settings > System config > Integrations config and set Telnyx SMS API key.'
      );
    }

    if (response.status === 'ok' && response.doc) {
      this.setState({ isSaved: true });

      return this.props.save(response.doc);
    }
  };

  renderSaveButton = () => {
    const { isActionLoading } = this.props;

    const cancelButton = (
      <Link
        to="/campaigns"
        onClick={() => {
          this.setState({ isSaved: true });
        }}
      >
        <Button btnStyle="simple" icon="times-circle">
          Cancel
        </Button>
      </Link>
    );

    return (
      <Button.Group>
        {cancelButton}
        <>
          <Button
            disabled={isActionLoading}
            btnStyle="warning"
            icon={isActionLoading ? undefined : 'file-alt'}
            onClick={this.handleSubmit.bind(this, 'draft')}
          >
            Save & Draft
          </Button>
          <Button
            disabled={isActionLoading}
            btnStyle="success"
            icon={isActionLoading ? undefined : 'check-circle'}
            onClick={this.handleSubmit.bind(this, 'live')}
          >
            Send & Live
          </Button>
        </>
      </Button.Group>
    );
  };

  renderMessageContent() {
    const {
      message,
      brands,
      users,
      kind,
      templates,
      smsConfig,
      integrations,
      queryParams
    } = this.props;

    const {
      messenger,
      email,
      fromUserId,
      content,
      scheduleDate,
      method,
      shortMessage,
      isSaved
    } = this.state;

    const imagePath = '/images/icons/erxes-08.svg';

    return (
      <Step
        img={imagePath}
        title="Send your notification"
        message={message}
        noButton={method !== METHODS.EMAIL && true}
      >
        <ClientPortalNotificationDetailContainer
          queryParams={queryParams}
          history={history}
        />
      </Step>
    );
  }

  // renderPreviewContent() {
  //   const { content, email, method } = this.state;

  //   if (method !== METHODS.EMAIL) {
  //     return null;
  //   }

  //   return (
  //     <Step
  //       img='/images/icons/erxes-19.svg'
  //       title='Full Preview'
  //       noButton={true}
  //     >
  //       <FullPreviewStep
  //         content={content}
  //         templateId={email && email.templateId}
  //       />
  //     </Step>
  //   );
  // }
  toggleForm = () => {
    // const { formProps } = this.props;

    // if (formProps && formProps.afterSave) {
    //   formProps.afterSave();
    // }

    this.setState(s => ({ show: !s.show }));
  };
  renderRadioControl = ({
    title,
    checked
  }: {
    title: string;
    checked: boolean;
  }) => {
    return (
      <FormControl
        checked={checked}
        name={'CP'}
        onChange={this.toggleForm}
        value={this.state.show}
        componentClass="radio"
      >
        {title}
      </FormControl>
    );
  };

  renderActionSelector() {
    const { show } = this.state;

    return (
      <RadioContainer>
        {this.renderRadioControl({
          checked: show === false,
          title: __(`Choose a segments:segment`)
        })}

        {this.renderRadioControl({
          checked: show === true,
          title: __(`Create a segments:segment`)
        })}
      </RadioContainer>
    );
  }

  render() {
    const {
      renderTitle,
      breadcrumbs,
      segmentType,
      loading = false,
      queryParams
    } = this.props;

    const { segmentIds, brandIds, title, tagIds } = this.state;

    const onChange = e =>
      this.changeState('title', (e.target as HTMLInputElement).value);
    return (
      <StepWrapper>
        <Wrapper.Header
          title={'Client Portal Notification'}
          breadcrumb={[{ title: 'Client Portal Notification' }]}
        />
        <TitleContainer>
          <div>{__('Title')}</div>
          <FormControl
            required={true}
            onChange={onChange}
            defaultValue={title}
            autoFocus={true}
          />
          {this.renderSaveButton()}
        </TitleContainer>
        <Steps maxStep={4} active={1}>
          <Step
            img="/images/icons/erxes-06.svg"
            title="Who is this notification for?"
          >
            <SegmentFilter loadingMainQuery={true} type="user" />
          </Step>

          {this.renderMessageContent()}
          {/* {this.renderPreviewContent()} */}
        </Steps>
      </StepWrapper>
    );
  }
}

export default ClientPortalNotification;
