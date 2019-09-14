import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import { fadeIn } from 'react-navigation-transitions';

import { CommuterDisplay, Loading, PickUserPreferences, StationListPicker } from './scenes';

const AppStack = createStackNavigator(
  {
    PickUserPreferences,
    StationListPicker,
    CommuterDisplay,
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
    transitionConfig: () => fadeIn(85),
  },
);

const LoadingStack = createStackNavigator({
  Loading: {
    screen: Loading,
    navigationOptions: {
      header: null,
    },
  },
});

const AppNavigator = createSwitchNavigator(
  {
    App: AppStack,
    Loading: LoadingStack,
  },
  {
    initialRouteName: 'Loading',
  },
);

export default createAppContainer(AppNavigator);
