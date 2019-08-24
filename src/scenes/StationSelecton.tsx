import _ from 'lodash';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import { Ionicons } from '@expo/vector-icons';

import * as colors from '../constants/colors';
import { Stations } from '../lib/database';
import ScheduleInput from '../components/ScheduleInput';

const STYLES = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 8 * 4,
  },
  spacer20: {
    flex: 0.2,
  },
  header: {},
  title: {
    textAlign: 'center',
    fontSize: 21,
    fontWeight: '700',
    color: colors.FOREGROUND,
  },
  station: {
    fontSize: 21,
    fontWeight: '700',
    color: colors.FOREGROUND,
  },
});

interface Props {
  stations: Stations;
}

export default class Main extends Component<Props> {
  render() {
    return (
      <View style={STYLES.root}>
        <View style={STYLES.spacer20}>
          <View style={STYLES.header}>
            <Ionicons name='ios-back-arrow' color={colors.FOREGROUND} size={32} />
            <Text style={STYLES.title}>Back</Text>
          </View>
        </View>
        {this.props.stations.map((station, index) => (
          <Text style={STYLES.station} key={index}>
            {station}
          </Text>
        ))}
        h<View></View>
      </View>
    );
  }
}
