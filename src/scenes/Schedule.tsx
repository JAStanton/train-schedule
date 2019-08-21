import _ from 'lodash';
import { DateTime } from 'luxon';
import { ActivityIndicator, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import React, { Component } from 'react';

import * as colors from '../constants/colors';
import { Stations, UserPreferences } from '../lib/database';
import TrainSchedule, { DIRECTION } from '../lib/schedule';

const STYLES = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.FOREGROUND,
    fontSize: 21,
    fontWeight: '700',
  },
});

interface Props {
  schedule: TrainSchedule;
  stations: Stations;
  userPreferences: UserPreferences;
}

export default class Schedule extends Component<Props> {
  render() {
    const { origin, destination } = this.props.userPreferences;
    const stopsBetween = this.props.schedule.timesBetweenStations(origin, destination, DIRECTION.NORTH);
    return (
      <View style={STYLES.root}>
        <Text style={STYLES.text}>{this.props.userPreferences.origin}</Text>
        <Text style={STYLES.text}>
          {this.props.userPreferences.destination}
          {'\n\n'}
        </Text>
        {stopsBetween.map(stop => (
          <Text key={stop.id}>
            {stop.stationName}: {stop.prettyTime}
          </Text>
        ))}
      </View>
    );
  }
}
