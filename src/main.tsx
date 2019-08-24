import _ from 'lodash';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import React, { Component } from 'react';

import { Loading, PickUserPreferences, Schedule } from './scenes';
import * as colors from './constants/colors';
import {
  getSessionData,
  setUserPreferences,
  Stations,
  UserPreferences,
  clearUserPreferences,
} from './lib/database';
import TrainSchedule from './lib/schedule';

const STYLES = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
  },
  action: {
    color: colors.BACKGROUND_ACCENT,
  },
});

interface State {
  schedule: TrainSchedule;
  stations: Stations;
  userPreferences: UserPreferences;
}

export default class Main extends Component<{}, State> {
  state = {
    schedule: undefined,
    stations: undefined,
    userPreferences: undefined,
  };

  componentDidMount() {
    this.getOrResetData();
  }

  getOrResetData() {
    getSessionData().then(({ schedule, stations, userPreferences }) => {
      this.setState({ schedule, stations, userPreferences });
    });
  }

  render() {
    const { schedule, stations, userPreferences } = this.state;
    const hasData = schedule && stations;
    const hasOriginDestination = this._hasOriginDestination(this.state.userPreferences);

    return (
      <SafeAreaView style={STYLES.root}>
        {!hasData && <Loading />}
        {hasData && !hasOriginDestination && (
          <PickUserPreferences
            stations={stations}
            userPreferences={this.state.userPreferences}
            onSelectPreferences={this._onSelectPreferences}
          />
        )}
        {hasData && hasOriginDestination && userPreferences && (
          <Schedule schedule={schedule} stations={stations} userPreferences={userPreferences} />
        )}
        {hasData && hasOriginDestination && userPreferences && (
          <Text style={STYLES.action} onPress={this._onChangeStations}>
            Change Stations
          </Text>
        )}
        {hasData && hasOriginDestination && userPreferences && (
          <Text style={STYLES.action} onPress={this._onClearUserPreferences}>
            Clear User Preferences
          </Text>
        )}
      </SafeAreaView>
    );
  }

  _hasOriginDestination(userPreferences: UserPreferences) {
    return !!(userPreferences && userPreferences.origin && userPreferences.destination);
  }

  _onClearUserPreferences = async () => {
    await clearUserPreferences();
    this.getOrResetData();
  };

  _onChangeStations = () => {
    this.setState({
      userPreferences: {
        origin: null,
        destination: null,
        direction: _.get(this.state.userPreferences, 'direction'),
      },
    });
  };

  _onSelectPreferences = (userPreferences: UserPreferences) => {
    this.setState({ userPreferences });
    setUserPreferences(userPreferences);
  };
}
