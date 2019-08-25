import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

import { Loading, PickUserPreferences } from './scenes';

const AppStack = createStackNavigator({
  PickUserPreferences,
});

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
