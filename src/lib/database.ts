import { DateTime } from 'luxon';
import AsyncStorage from '@react-native-community/async-storage';
import database from '@react-native-firebase/database';

import * as storage from '../constants/storage';
import Schedule, { RawTrainSchedule } from './schedule';
import { DIRECTION } from '../constants/trains';

const db = database();
const DEFAULT_TTL = { day: 1 };

export type Stations = string[];

export type UserPreferences = {
  origin: string;
  destination: string;
  direction: DIRECTION;
};

export type SessionData = {
  schedule: Schedule;
  stations: Stations;
  userPreferences: UserPreferences | undefined;
} | null;

export function clearUserPreferences() {
  return AsyncStorage.clear();
}

export async function getUserPreferences() {
  try {
    return JSON.parse(await AsyncStorage.getItem(storage.USER_PREFERENCES));
  } catch (error) {
    console.error('Failed to get session data out of storage', error);
  }
}

export async function setUserPreferences(userPreferences: UserPreferences) {
  try {
    await AsyncStorage.setItem(storage.USER_PREFERENCES, JSON.stringify(userPreferences));
  } catch (error) {
    console.error('Failed to write user preferences');
  }
}

export async function getRef(ref: string) {
  const dbRef = db.ref(`/${ref}`);
  const valueSnapshot = await dbRef.once('value');
  if (!valueSnapshot) return;
  return valueSnapshot.val();
}
