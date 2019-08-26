import _ from 'lodash';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-navigation';
import { graphql, useMutation } from 'react-apollo';

import * as colors from '../constants/colors';
import * as queries from '../queries/queries';
import * as mutations from '../queries/mutations';
import { navigation as navigationProps } from '../constants/types';
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
  innerContent: {
    flexDirection: 'row',
  },
  inputSelectors: {
    flex: 1,
  },
  swapDirections: {
    paddingLeft: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
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

function PickUserPreferences({ data, navigation }: Props) {
  const [swapDirections] = useMutation(mutations.SWAP_DIRECTIONS);
  const goToPicker = stationType => () => navigation.push('StationListPicker', { stationType });
  const doSwapDirections = () => swapDirections();

  return (
    <SafeAreaView style={STYLES.root}>
      <Header title='Choose a schedule' />
      <View style={STYLES.content}>
        <View style={STYLES.innerContent}>
          <View style={STYLES.inputSelectors}>
            <ScheduleInput
              stationType={StationType.ORIGIN}
              onSelect={goToPicker(StationType.DESTINATION)}
              label='From'
              value={data.user.preferences.origin}
            />
            <ScheduleInput
              stationType={StationType.DESTINATION}
              style={STYLES.toSelector}
              onSelect={goToPicker(StationType.DESTINATION)}
              label='To'
              value={data.user.preferences.destination}
            />
          </View>
          <TouchableOpacity onPress={doSwapDirections} style={STYLES.swapDirections}>
            <MaterialIcons name='swap-vert' size={32} color={colors.FOREGROUND} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default graphql(queries.BASE_RESOURCES)(PickUserPreferences);
