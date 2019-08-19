import database, { firebase } from '@react-native-firebase/database';

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function App() {
  const db = database();
  const scheduleRef = db.ref(`/schedule`);
  const stationsRef = db.ref(`/stations`);

  scheduleRef.once('value').then(snapshot => {
    console.log(snapshot.val());
    debugger
  });

  stationsRef.once('value').then(snapshot => {
    console.log(snapshot.val());
    debugger
  });

  return (
    <View style={styles.container}>
      <Text> Open up App.tsx to start working on your app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
