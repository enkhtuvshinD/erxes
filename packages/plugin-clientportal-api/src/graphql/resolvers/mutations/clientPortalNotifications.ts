import { INotifcationSettings } from './../../../models/definitions/clientPortalUser';
import { graphqlPubsub } from '../../../configs';
import { IContext } from '../../../connectionResolver';

const notificationMutations = {
  async clientPortalNotificationsMarkAsRead(
    _root,
    { _ids }: { _ids: string[] },
    { models, cpUser }: IContext
  ) {
    if (!cpUser) {
      throw new Error('You are not logged in');
    }

    graphqlPubsub.publish('clientPortalNotificationRead', {
      clientPortalNotificationRead: { userId: cpUser._id }
    });

    await models.ClientPortalNotifications.markAsRead(_ids, cpUser._id);

    return 'marked';
  },

  async clientPortalNotificationsRemove(
    _root,
    { _ids }: { _ids: string[] },
    { models, cpUser }: IContext
  ) {
    if (!cpUser) {
      throw new Error('You are not logged in');
    }

    for (const _id of _ids) {
      await models.ClientPortalNotifications.removeNotification(
        _id,
        cpUser._id
      );
    }

    return 'removed';
  },

  async clientPortalUserUpdateNotificationSettings(
    _root,
    doc: INotifcationSettings,
    { models, cpUser }: IContext
  ) {
    if (!cpUser) {
      throw new Error('You are not logged in');
    }

    await models.ClientPortalUsers.updateNotificationSettings(cpUser._id, doc);

    return models.ClientPortalUsers.findOne({ _id: cpUser._id });
  },

  async clientPortalNotificationsCreate(
    _root,
    {
      title,
      content,
      link,
      receivers
    }: { title: string; content: string; link: string; receivers: string[] },
    { models, cpUser }: IContext
  ) {
    if (!cpUser) {
      throw new Error('You are not logged in');
    }

    if (!receivers) {
      throw new Error('User not found');
    }

    for (const _id of receivers) {
      await models.ClientPortalNotifications.createNotification(
        {
          title,
          content,
          link,
          receiver: _id,
          notifType: 'system',
          clientPortalId: cpUser._id
        },
        cpUser._id
      );
    }

    return 'success';
  }
};

export default notificationMutations;
