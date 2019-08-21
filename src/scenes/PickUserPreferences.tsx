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
    direction: undefined,
    origin: undefined,
    destination: undefined,
  };

  render() {
    const direction = this._getDirection();
    const stations = this._getAvailableStations();
    return (
      <View style={STYLES.root}>
        <Text onPress={this._onChangeDirection}>{direction}</Text>
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

  _getDirection() {
    if (this.state.direction) return this.state.direction;
    return _.get(this.props.userPreferences, 'direction', DIRECTION.SOUTH);
  }

  _onChangeDirection = () => {
    this.setState({
      direction: this.state.direction === DIRECTION.NORTH ? DIRECTION.SOUTH : DIRECTION.NORTH,
    });
  };

  _getAvailableStations() {
    const direction = this._getDirection();
    const stations = direction === DIRECTION.SOUTH ? this.props.stations : [...this.props.stations].reverse();

    if (!this.state.origin) return stations;
    const index = stations.indexOf(this.state.origin);
    return [...stations.slice(index + 1, stations.length)];
  }

  _onPickPref = (station, index) => {
    const direction = this._getDirection();
    if (!this.state.origin) {
      const selectedSecondToLastElement = index === this.props.stations.length - 2;
      if (selectedSecondToLastElement) {
        this.props.onSelectPreferences({
          origin: station,
          destination: this.props.stations[this.props.stations.length - 1],
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
