import gql from 'graphql-tag';

export const CHOOSE_STATION = gql`
  mutation chooseStation($stationType: String!, $stationName: String!) {
    chooseStation(stationType: $stationType, stationName: $stationName) @client
  }
`;
