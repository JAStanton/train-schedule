import _ from 'lodash';
import { DateTime } from 'luxon';
import { ActivityIndicator, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import React, { Component } from 'react';

import * as colors from '../constants/colors';
import { DIRECTION } from '../constants/trains';
import { Stations, UserPreferences } from '../lib/database';
import TrainSchedule, { Stop, AM_PM } from '../lib/schedule';

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
    const { origin, destination, direction } = this.props.userPreferences;
    return (
      <View style={STYLES.root}>
        <Text style={STYLES.text}>
          {this.props.userPreferences.origin} to {this.props.userPreferences.destination} going {direction}
          {'\n\n'}
        </Text>
        {this._displayCommuterTimes()}
      </View>
    );
  }

  _displayCommuterTimes() {
    const { origin, destination, direction } = this.props.userPreferences;
    const stops = this.props.schedule.commuterStops(origin, destination, direction, {
      originToDestination: AM_PM.AM,
      destinationToOrigin: AM_PM.PM,
    });

    return (
      <View>
        {_.map(stops, ({ time }, index) => {
          if (!time) return null;
          return <Text key={index}>{time.toFormat('h:mm a')}</Text>;
        })}
      </View>
    );
  }
}
