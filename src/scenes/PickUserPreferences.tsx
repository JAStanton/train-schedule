import { ActivityIndicator, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import React, { Component } from 'react';

import * as colors from '../constants/colors';
import { UserPreferences, Stations } from '../lib/database';

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
  onSelectPreferences(userPreferences: UserPreferences): void;
  stations: Stations;
}

interface State extends UserPreferences {}

export default class Main extends Component<Props, State> {
  state = {
    origin: undefined,
    destination: undefined,
  };

  render() {
    const stations = this._getAvailableStations();
    return (
      <View style={STYLES.root}>
        {stations.map((station, index) => {
          const onPress =
            index < this.props.stations.length - 1 ? this._onPickPref.bind(this, station, index) : null;
          return (
            <Text key={index} style={STYLES.text} onPress={onPress}>
              {station}
            </Text>
          );
        })}
      </View>
    );
  }

  _getAvailableStations() {
    if (!this.state.origin) return this.props.stations;
    const index = this.props.stations.indexOf(this.state.origin);
    return [...this.props.stations.slice(index + 1, this.props.stations.length)];
  }

  _onPickPref = (station, index) => {
    if (!this.state.origin) {
      const selectedSecondToLastElement = index === this.props.stations.length - 2;
      if (selectedSecondToLastElement) {
        this.props.onSelectPreferences({
          origin: station,
          destination: this.props.stations[this.props.stations.length - 1],
        });
        return;
      }

      this.setState({ origin: station });
      return;
    }

    this.props.onSelectPreferences({ origin: this.state.origin, destination: station });
  };
}
