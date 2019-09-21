import gql from 'graphql-tag';

export default {
  Mutation: {
    swapDirections: (_root, _variables, { cache, getCacheKey }) => {
      const id = getCacheKey({ __typename: 'User', id: 1 });
      const fragment = gql`
        fragment station on User {
          preferences {
            origin
            destination
            direction
          }
        }
      `;

      const preferences = cache.readFragment({ fragment, id });
      const data = {
        ...preferences,
        preferences: {
          ...preferences.preferences,
          destination: preferences.preferences.origin,
          origin: preferences.preferences.destination,
        },
      };

      cache.writeData({ id, data });
    },
    chooseStation: (_root, { stationType, stationName }, { cache, getCacheKey }) => {
      const id = getCacheKey({ __typename: 'User', id: 1 });
      const fragment = gql`
        fragment station on User {
          preferences {
            origin
            destination
            direction
          }
        }
      `;

      const preferences = cache.readFragment({ fragment, id });
      const data = {
        ...preferences,
        preferences: {
          ...preferences.preferences,
          [stationType.toLowerCase()]: stationName,
        },
      };

      cache.writeData({ id, data });
    },
  },
};
