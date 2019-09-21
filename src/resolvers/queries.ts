import _ from 'lodash';

import * as database from '../lib/database';
import { rawToGQL } from '../lib/schedule';

export default {
  Query: {
    async stations(root) {
      return database.getRef('/stations');
    },
    async schedule(root) {
      const data = await database.getRef('/schedule');
      return rawToGQL(data);
    },
    async user(root) {
      const data = await database.getUserPreferences();
      const origin = _.get(data, 'origin', '');
      const destination = _.get(data, 'destination', '');
      const direction = _.get(data, 'direction', '');

      return {
        __typename: 'User',
        id: 1,
        preferences: {
          __typename: 'UserPreferences',
          origin,
          destination,
          direction,
        },
      };
    },
  },
};
