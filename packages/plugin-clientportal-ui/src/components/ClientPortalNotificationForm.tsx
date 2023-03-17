import Button from '@erxes/ui/src/components/Button';
import {
  ControlLabel,
  FormControl,
  FormGroup
} from '@erxes/ui/src/components/form';
import { FlexContent } from '@erxes/ui/src/layout/styles';
import { FlexItem, FlexPad } from '@erxes/ui/src/components/step/styles';
import { Alert } from '@erxes/ui/src/utils';
import { isEnabled, removeTypename, __ } from '@erxes/ui/src/utils/core';
import React from 'react';

import { CONFIG_TYPES } from '../constants';
import General from '../containers/General';
import { Block, BlockRow, ButtonWrap, Content } from '../styles';
import {
  ClientPortalConfig,
  ClientPortalNotification,
  MailConfig
} from '../types';
import Appearance from './forms/Appearance';
import Config from './forms/Config';

type Props = {
  configType: string;
  defaultConfigValues?: ClientPortalConfig;
  handleUpdate: (doc: ClientPortalNotification) => void;
};
type ControlItem = {
  required?: boolean;
  label: string;
  subtitle?: string;
  formValueName: string;
  formValue?: string;
  boardType?: string;
  placeholder?: string;
  formProps?: any;
  stageId?: string;
  pipelineId?: string;
  boardId?: string;
  url?: string;
  className?: string;
};

type State = {
  formValues: ClientPortalNotification;
};

class FromNotification extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      formValues: {
        receivers: ['6rBJ2ifpp2prqdEme', 'fake', '5FKz2gb983XMXobGK']
      } as ClientPortalNotification
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.defaultConfigValues &&
      nextProps.defaultConfigValues !== this.props.defaultConfigValues
    ) {
      this.setState({ formValues: nextProps.defaultConfigValues });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { formValues } = this.state;

    if (!formValues.title) {
      return Alert.error('Please enter a client portal title');
    }
    this.props.handleUpdate(formValues);
    // Clear the form fields after submission
    // this.setState({
    //   title: '',
    //   content: '',
    //   receivers: [],
    //   link: ''
    // });
  };

  handleFormChange = (name: string, value: string | object | boolean) => {
    this.setState({
      formValues: {
        ...this.state.formValues,
        [name]: value
      }
    });
  };

  renderControl = ({
    required,
    label,
    subtitle,
    formValueName,
    formValue,
    boardType,
    placeholder,
    formProps,
    stageId,
    pipelineId,
    boardId,
    className
  }: ControlItem) => {
    const handleChange = (e: React.FormEvent) => {
      const value = (e.target as HTMLInputElement).value;
      this.handleFormChange(formValueName, value);
    };

    return (
      <div className={className && className}>
        <FormGroup>
          <ControlLabel required={required}>{label}</ControlLabel>
          {subtitle && <p>{__(subtitle)}</p>}
          <FlexContent>
            <FormControl
              {...formProps}
              name={formValueName}
              value={formValue}
              placeholder={placeholder}
              onChange={handleChange}
            />
          </FlexContent>
        </FormGroup>
      </div>
    );
  };

  renderContent = () => {
    // const commonProps = {
    //   ...this.state.formValues,
    //   handleFormChange: this.handleFormChange
    // };
    const { title, link, content } = this.state.formValues;
    return (
      <FlexItem>
        <FlexPad direction="column" overflow="auto">
          <h4>{__('Client portal notificaion')}</h4>

          <FormGroup>
            {this.renderControl({
              required: true,
              label: 'Client Portal title',
              subtitle: 'Displayed in the header area',
              formValueName: 'title',
              formValue: title,
              formProps: {
                autoFocus: true
              }
            })}
          </FormGroup>
          <FormGroup>
            {this.renderControl({
              required: true,
              label: 'Link',
              formValueName: 'link',
              formValue: link,
              formProps: {
                autoFocus: true
              }
            })}
          </FormGroup>

          <FormGroup>
            {this.renderControl({
              required: true,
              label: 'Content',
              formValueName: 'content',
              formValue: content,
              formProps: {
                autoFocus: true
              }
            })}
          </FormGroup>
          {/* <FormGroup>
            {this.renderControl({
              required: true,
              label: 'Receivers',
              formValueName: 'receivers',
              formValue: 'Clientportal receivers',
              formProps: {
                autoFocus: true
              }
            })}
          </FormGroup> */}
        </FlexPad>
      </FlexItem>
    );
  };

  renderSubmit = () => {
    return (
      <ButtonWrap>
        <Button btnStyle="success" icon="check-circle" type="submit">
          Submit
        </Button>
      </ButtonWrap>
    );
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Content>
          {this.renderContent()}
          {this.renderSubmit()}
        </Content>
      </form>
    );
  }
}

export default FromNotification;
