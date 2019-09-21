import gql from 'graphql-tag';

export const BASE_RESOURCES = gql`
  query BaseResources {
    stations @client
    schedule @client {
      SOUTH {
        id
        stops {
          id
          stopId
          prettyTime
          stationName
        }
        trainNumber
      }
      NORTH {
        id
        stops {
          id
          stopId
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
