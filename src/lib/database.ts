import luxon from 'luxon';
import AsyncStorage from '@react-native-community/async-storage';
import database from '@react-native-firebase/database';
import * as storage from '../constants/storage';

import Schedule, { RawTrainSchedule } from './schedule';

const db = database();
const scheduleRef = db.ref(`/schedule`);
const stationsRef = db.ref(`/stations`);

export type Stations = string[];

export type UserPreferences = {
  origin: string;
  destination: string;
};

export type SessionData = {
  schedule: Schedule;
  stations: Stations;
  userPreferences: UserPreferences | undefined;
};

export async function setUserPreferences(userPreferences: UserPreferences) {
  try {
    await AsyncStorage.setItem(storage.USER_PREFERENCES, JSON.stringify(userPreferences));
  } catch (error) {
    console.error('Failed to write user preferences');
  }
}

export async function getSessionData(): Promise<SessionData> {
  let localSessionData;
  try {
    localSessionData = JSON.parse(await AsyncStorage.getItem(storage.SESSION));
  } catch (error) {
    console.error('Failed to get session data out of storage', error);
  }

  let userPreferences;
  try {
    userPreferences = JSON.parse(await AsyncStorage.getItem(storage.USER_PREFERENCES));
  } catch (error) {
    console.error('Failed to get user preferences out of storage', error);
  }

  let rawTrainSchedule: RawTrainSchedule, stations;
  if (localSessionData && !isExpiredCache(localSessionData.updatedAt)) {
    ({ rawTrainSchedule, stations } = localSessionData);
  } else {
    const [scheduleSnapshot, stationsSnapshot] = await Promise.all([
      scheduleRef.once('value'),
      stationsRef.once('value'),
    ]);
    rawTrainSchedule = scheduleSnapshot.val();
    stations = stationsSnapshot.val().reverse();
  }

  return {
    schedule: new Schedule(rawTrainSchedule),
    stations,
    userPreferences,
  };
}

function isExpiredCache(updatedAt) {
  return true;
  const updatedAtDateTime = luxon(updatedAt);
  return updatedAtDateTime.isBefore(luxon().subtract(1, 'hour'));
}
