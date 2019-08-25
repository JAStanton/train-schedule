import _ from 'lodash';
import { ActivityIndicator, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import * as colors from '../constants/colors';
import * as queries from '../queries/queries';

const STYLES = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.BACKGROUND,
  },
});

class Loading extends Component {
  componentDidMount() {
    this._shouldNavigateAway(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._shouldNavigateAway(nextProps);
  }

  _shouldNavigateAway(props) {
    const isLoading = props.data.loading;
    if (isLoading) return;

    const hasSchedule = props.data.schedule;
    const hasPreferences =
      !!_.get(props.data, 'user.preferences.origin') && !!_.get(props.data, 'user.preferences.destination');

    if (!hasPreferences) {
      props.navigation.navigate('App');
      return;
    }

    if (hasSchedule && hasPreferences) {
      props.navigation.navigate('App');
      return;
    }
  }

  render() {
    return (
      <View style={STYLES.root}>
        <ActivityIndicator size='large' color={colors.FOREGROUND} />
      </View>
    );
  }
}

export default graphql(queries.BASE_RESOURCES)(Loading);
