import _ from 'lodash';
import { ActivityIndicator, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import React, { Component } from 'react';

import * as colors from '../constants/colors';
import { DIRECTION } from '../constants/trains';
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
  userPreferences: UserPreferences;
}

interface State extends UserPreferences {}

export default class Main extends Component<Props, State> {
  state = {
    direction: this.props.userPreferences.direction,
    origin: undefined,
    destination: undefined,
  };

  render() {
    const direction = this.state.direction;
    const stations = this._getAvailableStations();
    return (
      <View style={STYLES.root}>
        <Text onPress={this._onChangeDirection}>{!this.state.origin ? direction : 'Back'}</Text>
        {stations.map((station, index) => {
          let onPress = this._onPickPref.bind(this, station, index);
          if (index == stations.length - 1 && !this.state.origin) {
            onPress = null;
          }

          return (
            <Text key={index} style={STYLES.text} onPress={onPress}>
              {station}
            </Text>
          );
        })}
      </View>
    );
  }

  _onChangeDirection = () => {
    if (this.state.origin) {
      this.setState({ origin: null });
      return;
    }

    this.setState({
      direction: this.state.direction === DIRECTION.NORTH ? DIRECTION.SOUTH : DIRECTION.NORTH,
    });
  };

  _getAvailableStations() {
    const direction = this.state.direction;
    const stations = direction === DIRECTION.SOUTH ? this.props.stations : [...this.props.stations].reverse();

    if (!this.state.origin) return stations;
    const index = stations.indexOf(this.state.origin);
    return [...stations.slice(index + 1, stations.length)];
  }

  _onPickPref = (station, index) => {
    const direction = this.state.direction;
    const stations = this._getAvailableStations();

    if (!this.state.origin) {
      const selectedSecondToLastElement = index === stations.length - 2;
      if (selectedSecondToLastElement) {
        this.props.onSelectPreferences({
          origin: station,
          destination: stations[stations.length - 1],
          direction,
        });
        return;
      }

      this.setState({ origin: station });
      return;
    }

    this.props.onSelectPreferences({
      origin: this.state.origin,
      destination: station,
      direction,
    });
  };
}
