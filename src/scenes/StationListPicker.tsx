import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { graphql } from 'react-apollo';
import { SafeAreaView } from 'react-navigation';
import { useMutation } from '@apollo/react-hooks';

import * as colors from '../constants/colors';
import * as queries from '../queries/queries';
import * as mutations from '../queries/mutations';
import { StationType } from '../constants';
import { navigation as navigationProps } from '../constants/types';
import BaseScene from './BaseScene';
import { Header } from '../components';

const STYLES = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
  },
  stationName: {
    fontSize: 21,
    color: colors.FOREGROUND,
    fontWeight: '700',
    marginVertical: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 8 * 4,
  },
});

interface Props {
  data: {
    stations?: string[];
  };
  navigation: navigationProps;
}

function StationListPicker({ data, ...props }: Props) {
  const [pickStation] = useMutation(mutations.CHOOSE_STATION);

  const stationType = props.navigation.getParam('stationType');

  return (
    <SafeAreaView style={STYLES.root}>
      <Header title='Pick a station' />
      <View style={STYLES.content}>
        {data.stations.map((stationName, index) => (
          <TouchableOpacity key={index}>
            <Text
              onPress={() => {
                pickStation({ variables: { stationType, stationName } });
                props.navigation.goBack();
              }}
              style={STYLES.stationName}
            >
              {stationName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default graphql(queries.BASE_RESOURCES)(StationListPicker);
