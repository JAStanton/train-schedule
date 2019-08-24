import { ActivityIndicator, View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';

import * as colors from '../constants/colors';
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
});

type Props = {
  style?: {};
  options: Stations;
  onSelect: Function;
  label: string;
  value: string;
};

export default class Main extends Component<Props> {
  render() {
    return (
      <View style={[STYLES.root, this.props.style]}>
        <Text style={STYLES.label}>{this.props.label}</Text>
        <View style={STYLES.button}>
          <TouchableOpacity onPress={this._onShowOptions}>
            <Text style={STYLES.value}>{this.props.value || 'Tukwilla Station'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _onShowOptions = () => {};
}
