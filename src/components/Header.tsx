import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'react-navigation-hooks';

import * as colors from '../constants/colors';

const STYLES = StyleSheet.create({
  header: {
    flex: 0.1,
    flexDirection: 'row',
    minHeight: 40,
    maxHeight: 40,
    height: 40,
    marginBottom: 8 * 2,
  },
  backButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    left: 8,
  },
  left: {
    flex: 0.2,
  },
  center: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.2,
  },
  title: {
    textAlign: 'center',
    fontSize: 21,
    fontWeight: '700',
    color: colors.FOREGROUND,
  },
});

export default function Header({ title }) {
  const navigation = useNavigation();
  const shouldShowBackButton = !navigation.isFirstRouteInParent();

  return (
    <View style={STYLES.header}>
      <View style={STYLES.left}>
        {shouldShowBackButton && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={STYLES.backButton}>
            <Ionicons name='ios-arrow-back' size={32} color={colors.BACKGROUND_ACCENT} />
          </TouchableOpacity>
        )}
      </View>
      <View style={STYLES.center}>
        <Text style={STYLES.title}>{title}</Text>
      </View>
      <View style={STYLES.right}></View>
    </View>
  );
}
