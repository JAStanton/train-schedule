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
};

export async function getSessionData(): Promise<SessionData> {
  const [userPreferences, rawTrainSchedule, stations] = await Promise.all([
    getUserPreferences(),
    getWithTTL('schedule'),
    getWithTTL('stations'),
  ]);

  return {
    schedule: new Schedule(rawTrainSchedule),
    stations,
    userPreferences,
  };
}

async function getUserPreferences() {
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

async function getWithTTL(ref: string) {
  let value, updatedAt;
  try {
    ({ value, updatedAt } = JSON.parse(await AsyncStorage.getItem(ref)));
  } catch (error) {
    console.error('Failed to get user preferences out of storage', error);
  }

  if (value && !isExpiredCache(updatedAt)) {
    return value;
  }

  const dbRef = db.ref(`/${ref}`);
  const valueSnapshot = await dbRef.once('value');
  if (!valueSnapshot) return;
  value = valueSnapshot.val();
  if (value) {
    AsyncStorage.setItem(ref, JSON.stringify({ value, updatedAt: DateTime.local().toISO() }));
  }

  return value;
}

function isExpiredCache(updatedAt) {
  if (!updatedAt) return true;
  return DateTime.fromISO(updatedAt) < DateTime.local().minus(DEFAULT_TTL);
}
