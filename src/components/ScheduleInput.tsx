import { ActivityIndicator, View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';

import * as colors from '../constants/colors';
import { StationType } from '../constants';
import { Stations } from '../lib/database';

const STYLES = StyleSheet.create({
  root: {},
  label: {
    color: colors.FOREGROUND_ACCENT,
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  value: {
    color: colors.FOREGROUND,
    fontSize: 30,
    fontWeight: '700',
  },
  button: {
    borderBottomColor: colors.FOREGROUND_ACCENT_DIM,
    borderBottomWidth: 2,
    paddingBottom: 6,
    paddingTop: 2,
  },
  placeholder: {
    color: colors.FOREGROUND_ACCENT_DIM,
    fontSize: 30,
    fontWeight: '700',
  },
});

type Props = {
  stationType: StationType;
  style?: {};
  options: Stations;
  onSelect: (stationType: StationType) => void;
  label: string;
  value: string;
};

export default class ScheduleInput extends Component<Props> {
  render() {
    return (
      <View style={[STYLES.root, this.props.style]}>
        <Text style={STYLES.label}>{this.props.label}</Text>
        <View style={STYLES.button}>
          <TouchableOpacity onPress={this._onSelectValue}>{this._renderValue()}</TouchableOpacity>
        </View>
      </View>
    );
  }

  _renderValue() {
    if (this.props.value) {
      return <Text style={STYLES.value}>{this.props.value}</Text>;
    }
    return <Text style={STYLES.placeholder}>Tap to select</Text>;
  }

  _onSelectValue = () => {
    this.props.onSelect(this.props.stationType);
  };
}
