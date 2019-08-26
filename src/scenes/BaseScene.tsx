import { Component } from 'react';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';

type Props = {
  style?: {};
  data: {
    loading: boolean;
  };
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
};

export default class BaseScene<P = {}, S = {}> extends Component<Props & P, S> {}
