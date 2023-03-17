export default {
  contentTypes: [
    {
      type: 'user',
      description: 'Clienportal',
      esIndex: 'clientPortalUsers'
    }
  ],

  dependentServices: [{ name: 'contacts', twoWay: true, associated: true }],

  esTypesMap: async () => {
    return { data: { typesMap: {} }, status: 'success' };
  },

  initialSelector: async ({ data: { segment } }) => {
    // const negative = {
    //   term: {
    //     status: 'deleted'
    //   }
    // };

    // const { contentType } = segment;

    // let positive;

    // if (contentType.includes('clientportal')) {
    //   positive = {
    //     term: {
    //       state: segment.contentType.replace('clientportal:', '')
    //     }
    //   };
    // }

    return { data: {}, status: 'success' };
  }
};
