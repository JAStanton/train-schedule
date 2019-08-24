import _ from 'lodash';
import { ActivityIndicator, View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import * as colors from '../constants/colors';
import { DIRECTION } from '../constants/trains';
import { UserPreferences, Stations } from '../lib/database';
import ScheduleInput from '../components/ScheduleInput';

const STYLES = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 8 * 4,
  },
  text: {
    color: colors.FOREGROUND,
    fontSize: 21,
    fontWeight: '700',
  },
  action: {
    color: colors.BACKGROUND_ACCENT,
  },
  toSelector: {
    marginTop: 8 * 3,
  },
  spacer20: {
    flex: 0.2,
  },
  title: {
    textAlign: 'center',
    fontSize: 21,
    fontWeight: '700',
    color: colors.FOREGROUND,
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
    direction: _.get(this.props.userPreferences, 'direction', DIRECTION.NORTH),
    origin: undefined,
    destination: undefined,
  };

  render() {
    const direction = this.state.direction;
    const stations = this._getAvailableStations();
    return (
      <View style={STYLES.root}>
        <View style={STYLES.spacer20}>
          <Text style={STYLES.title}>Choose Schedule</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <ScheduleInput
              options={stations}
              onSelect={this._onPickPref}
              label='From'
              value={this.state.origin}
            />
            <ScheduleInput
              style={STYLES.toSelector}
              options={stations}
              onSelect={this._onPickPref}
              label='To'
              value={this.state.destination}
            />
          </View>
          <TouchableOpacity
            style={{
              paddingLeft: 8,
              paddingBottom: 8,
              flexDirection: 'row',
              alignItems: 'flex-end',
              alignContent: 'flex-end',
            }}
          >
            <MaterialIcons name='swap-vert' size={32} color={colors.FOREGROUND} />
          </TouchableOpacity>
        </View>
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
