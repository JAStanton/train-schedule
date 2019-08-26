import _ from 'lodash';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-navigation';
import { graphql } from 'react-apollo';

import * as colors from '../constants/colors';
import * as queries from '../queries/queries';
import BaseScene from './BaseScene';
import ScheduleInput from '../components/ScheduleInput';
import { DIRECTION } from '../constants/trains';
import { StationType } from '../constants';
import { Header } from '../components';
import { UserPreferences, Stations } from '../lib/database';

const STYLES = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
  },
  content: {
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
    stations?: Stations;
    userPreferences?: UserPreferences;
  };
}

interface State extends UserPreferences {}

class PickUserPreferences extends BaseScene<Props, State> {
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
        <Header title='Choose a schedule' />
        <View style={STYLES.content}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <ScheduleInput
                stationType={StationType.ORIGIN}
                options={stations}
                onSelect={this._onSelectScheduleInput}
                label='From'
                value={_.get(this.props.data, 'user.preferences.origin')}
              />
              <ScheduleInput
                stationType={StationType.DESTINATION}
                style={STYLES.toSelector}
                options={stations}
                onSelect={this._onSelectScheduleInput}
                label='To'
                value={_.get(this.props.data, 'user.preferences.destination')}
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

  _onSelectScheduleInput = stationType => {
    this.props.navigation.push('StationListPicker', { stationType });
  };

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
