import _ from 'lodash';
import React, { Component } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { graphql } from 'react-apollo';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-navigation';

import * as colors from '../constants/colors';
import * as queries from '../queries/queries';
import { DIRECTION } from '../constants/trains';
import { UserPreferences, Stations } from '../lib/database';
import ScheduleInput from '../components/ScheduleInput';

const STYLES = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 8 * 4,
    backgroundColor: colors.BACKGROUND,
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
  spacer10: {
    flex: 0.1,
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
  data: {
    loading: boolean;
    stations?: Stations;
    userPreferences?: UserPreferences;
  };
}

interface State extends UserPreferences {}

class PickUserPreferences extends Component<Props, State> {
  static navigationOptions = {
    header: null,
  };
  state = {
    // direction: _.get(this.props.userPreferences, 'direction', DIRECTION.NORTH),
    direction: undefined,
    origin: undefined,
    destination: undefined,
  };

  render() {
    if (this.props.data.loading) return <View />;

    const direction = this.state.direction;
    const stations = this._getAvailableStations();
    return (
      <SafeAreaView style={STYLES.root}>
        <View style={STYLES.spacer10}>
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
      </SafeAreaView>
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
    const { stations } = this.props.data;
    const direction = this.state.direction;
    const stationsWithDirection = direction === DIRECTION.SOUTH ? stations : [...stations].reverse();

    if (!this.state.origin) return stationsWithDirection;
    const index = stationsWithDirection.indexOf(this.state.origin);
    return [...stationsWithDirection.slice(index + 1, stationsWithDirection.length)];
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

export default graphql(queries.BASE_RESOURCES)(PickUserPreferences);
