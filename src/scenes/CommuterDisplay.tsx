import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { graphql } from 'react-apollo';

import * as colors from '../constants/colors';
import * as queries from '../queries/queries';
import { navigation as navigationProps } from '../constants/types';
import { Header } from '../components';
import { UserPreferences } from '../lib/database';

const STYLES = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
  },
  content: {
    paddingHorizontal: 8 * 4,
  },
});

interface Props {
  onSelectPreferences(userPreferences: UserPreferences): void;
  data: {
    user: {
      preferences: UserPreferences;
    };
  };
  navigation: navigationProps;
}

function CommuterDisplay({ data, navigation }: Props) {
  return (
    <SafeAreaView style={STYLES.root}>
      <Header title='Commuter View' />
      <View style={STYLES.content}></View>
    </SafeAreaView>
  );
}

export default graphql(queries.BASE_RESOURCES)(CommuterDisplay);
