import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { graphql } from 'react-apollo';

import * as colors from '../constants/colors';
import * as queries from '../queries/queries';
import { navigation as navigationProps } from '../constants/types';
import { DIRECTION } from '../constants/trains';
import { Header } from '../components';
import { UserPreferences } from '../lib/database';
import { AM_PM, ShowMapSettings, TrainSchedule, computeCommuterStops } from '../lib/schedule';

const STYLES = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
  },
  content: {
    paddingHorizontal: 8 * 4,
  },
});

interface Props {
  onSelectPreferences(userPreferences: UserPreferences): void;
  data: {
    schedule: TrainSchedule;
    user: {
      preferences: UserPreferences;
    };
  };
  navigation: navigationProps;
}

function CommuterDisplay({ data, navigation }: Props) {
  debugger;
  const commuterStops = computeCommuterStops(
    data.schedule,
    data.user.preferences.origin,
    data.user.preferences.destination,
    DIRECTION.NORTH,
    {
      originToDestination: AM_PM.AM,
      destinationToOrigin: AM_PM.PM,
    },
  );

  return (
    <SafeAreaView style={STYLES.root}>
      <Header title='Commuter View' />
      <View style={STYLES.content}></View>
    </SafeAreaView>
  );
}

export default graphql(queries.BASE_RESOURCES)(CommuterDisplay);
