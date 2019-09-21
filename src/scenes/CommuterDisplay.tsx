import { DateTime } from 'luxon';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { graphql } from 'react-apollo';

import * as colors from '../constants/colors';
import * as queries from '../queries/queries';
import { navigation as navigationProps } from '../constants/types';
import { DIRECTION } from '../constants/trains';
import { Header } from '../components';
import { UserPreferences } from '../lib/database';
import {
  TIME_FORMAT,
  Stop,
  AM_PM,
  ShowMapSettings,
  TrainSchedule,
  computeCommuterStops,
} from '../lib/schedule';

const STYLES = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
  },
  content: {
    paddingHorizontal: 8 * 4,
  },
  pastText: {
    color: colors.FOREGROUND_ACCENT,
  },
  text: {
    color: colors.FOREGROUND,
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
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
  const now = DateTime.local();
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
      <View style={STYLES.content}>{commuterStops.map(displayTime.bind(null, now))}</View>
    </SafeAreaView>
  );
}

let lastStationName;

function displayTime(now: DateTime, stop: Stop) {
  const inPast = now > DateTime.fromFormat(stop.prettyTime, TIME_FORMAT);
  let stationName;
  if (lastStationName != stop.stationName) {
    stationName = `${stop.stationName}\n`;
    if (lastStationName && stationName) {
      stationName = `\n${stationName}`;
    }
    lastStationName = stop.stationName;
  }
  return (
    <Text key={stop.id} style={[STYLES.text, inPast && STYLES.pastText]}>
      {stationName} {stop.prettyTime}
    </Text>
  );
}

export default graphql(queries.BASE_RESOURCES)(CommuterDisplay);
