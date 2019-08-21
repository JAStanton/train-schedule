import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import React, { Component } from 'react';

import { Loading, PickUserPreferences, Schedule } from './scenes';
import * as colors from './constants/colors';
import { getSessionData, setUserPreferences, Stations, UserPreferences } from './lib/database';
import TrainSchedule from './lib/schedule';

const STYLES = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
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
    getSessionData().then(({ schedule, stations, userPreferences }) => {
      this.setState({ schedule, stations, userPreferences });
    });
  }

  render() {
    const { schedule, stations, userPreferences } = this.state;
    const hasData = schedule && stations;
    return (
      <SafeAreaView style={STYLES.root}>
        {!hasData && <Loading />}
        {hasData && !userPreferences && (
          <PickUserPreferences stations={stations} onSelectPreferences={this._onSelectPreferences} />
        )}
        {hasData && userPreferences && (
          <Schedule schedule={schedule} stations={stations} userPreferences={userPreferences} />
        )}
        {hasData && userPreferences && <Text onPress={this._onChangeStations}>Change Stations</Text>}
      </SafeAreaView>
    );
  }

  _onChangeStations = () => {
    this.setState({ userPreferences: null });
  };

  _onSelectPreferences = (userPreferences: UserPreferences) => {
    this.setState({ userPreferences });
    setUserPreferences(userPreferences);
  };
}
