import gql from 'graphql-tag';

export const BASE_RESOURCES = gql`
  query BaseResources {
    stations @client
    schedule @client {
      SOUTH {
        id
        stops {
          id
          prettyTime
          stationName
        }
        trainNumber
      }
      NORTH {
        id
        stops {
          id
          prettyTime
          stationName
        }
        trainNumber
      }
    }
    user @client {
      preferences {
        origin
        destination
        direction
      }
    }
  }
`;
