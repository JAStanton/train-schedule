import React from 'react';
import { AppRegistry } from 'react-native';

import Main from './src/main';
import { name as appName } from './app.json';

global.React = React;

AppRegistry.registerComponent(appName, () => Main);
