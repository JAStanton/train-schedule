import _ from 'lodash';
import luxon, { DateTime } from 'luxon';

import { DIRECTION } from '../constants/trains';

const stationNames = [
  'Lakewood Station',
  'S Tacoma Station',
  'Tacoma Dome',
  'Puyallup Station',
  'Sumner Station',
  'Auburn Station',
  'Kent Station',
  'Tukwila Station',
  'Seattle',
];

const stationOrder: {
  [key in DIRECTION]: string[];
} = {
  [DIRECTION.NORTH]: stationNames,
  [DIRECTION.SOUTH]: stationNames.slice().reverse(),
};

// example: 5:18:00 pm
const TIME_FORMAT = 'h:mm:ss a';

export type RawTrainScheduleStops = {
  [key: string]: string | number;
};

// schedule: {
//   north: [{
//     StationName1: 'h:mm:ss a',
//     StationName2: 'h:mm:ss a',
//     ...
//     StationNameN: 'h:mm:ss a',
//     Train: Id,
//   }]
// }
export type RawTrainSchedule = {
  north: RawTrainScheduleStops[];
  south: RawTrainScheduleStops[];
};

// schedule: {
//   north: [{ // order is one train after the other
//     trainIndex: number;
//     Train: ID;
//     Stops: [{ // order is going to be direction train is going
//      stopIndex: number;
//      stationName: string;
//      time: Time;
//    }]
//   ]
// }
//
export type TrainSchedule = {
  __typename: string;
  [DIRECTION.NORTH]: Train[];
  [DIRECTION.SOUTH]: Train[];
};

export type Stop = {
  id: number;
  stationName: string;
  time?: luxon;
  prettyTime?: string;
};

type Train = {
  id: number;
  trainNumber: number;
  stops: Stop[];
};

export enum AM_PM {
  AM = 'AM',
  PM = 'PM',
  AM_AND_PM = 'AM_AND_PM',
}

export type ShowMapSettings = {
  originToDestination: AM_PM;
  destinationToOrigin: AM_PM;
};

export function rawToGQL(raw) {
  return {
    __typename: 'Thing',
    [DIRECTION.NORTH]: convertRawStopsToTrain(raw.north, DIRECTION.NORTH),
    [DIRECTION.SOUTH]: convertRawStopsToTrain(raw.south, DIRECTION.SOUTH),
  };
}

function convertRawStopsToTrain(stops: RawTrainScheduleStops[], direction: DIRECTION): Train[] {
  return _.map(stops, (stop, trainId) => ({
    __typename: 'Train',
    id: trainId,
    trainNumber: stop.Train as number,
    stops: _.map(stationOrder[direction], (station, stopId) => {
      const prettyTime = stop[station] as string;

      return {
        __typename: 'Stop',
        id: stopId,
        stationName: station,
        // time: prettyTime ? DateTime.fromFormat(prettyTime, TIME_FORMAT) : null,
        prettyTime: prettyTime || null,
      };
    }),
  }));
}

export function oppositeDirectionOfDirection(direction: DIRECTION): DIRECTION {
  return direction === DIRECTION.NORTH ? DIRECTION.SOUTH : DIRECTION.NORTH;
}

export function stopsFilteredToTimeOfDay(stops: Stop[], amPm: AM_PM) {
  if (amPm === AM_PM.AM_AND_PM) return stops;
  return _.filter(stops, ({ prettyTime }) => _.includes(prettyTime, amPm));
}

export function stopsAfterTime(time, stops) {
  // TODO: convert gql to entities to I can implment `time` once
  return _.filter(stops, stop => DateTime.fromFormat(stop.prettyTime, TIME_FORMAT) > time);
}

export function computeCommuterStops(
  schedule: TrainSchedule,
  origin: string,
  destination: string,
  direction: DIRECTION,
  showMap: ShowMapSettings,
): Stop[] {
  const originToDestinationTimes = stopsFilteredToTimeOfDay(
    stopsForStation(schedule, origin, direction),
    showMap.originToDestination,
  );

  const destinationToOriginTimes = stopsFilteredToTimeOfDay(
    stopsForStation(schedule, destination, oppositeDirectionOfDirection(direction)),
    showMap.destinationToOrigin,
  );
  const now = DateTime.local().minus({ hours: 20 });
  return stopsAfterTime(now, [...originToDestinationTimes, ...destinationToOriginTimes]);
}

function stopsForStation(schedule: TrainSchedule, stationName: string, direction: DIRECTION): Stop[] {
  const trains = schedule[direction];
  const stop = findStopByName(trains[0], stationName);
  const stops = [];
  for (const train of trains) {
    stops.push(train.stops[stop.id]);
  }
  return stops;
}

function stopsBetweenStations(
  schedule: TrainSchedule,
  start: string,
  end: string,
  direction: DIRECTION,
): Stop[] {
  const trains = schedule[direction];
  const startStop = findStopByName(trains[0], start);
  const startStopIndex = startStop.id;
  const endStop = findStopByName(trains[0], end);
  const endStopIndex = endStop.id;

  const stops = [];
  for (const train of trains) {
    for (let stopId = startStop.id; stopId < train.stops.length; stopId++) {
      stops.push(train.stops[stopId]);
      if (stopId === endStopIndex) {
        return stops;
      }
    }
  }

  return stops;
}

function findStopByName(train: Train, stationName: string): Stop {
  return _.find(train.stops, stop => stop.stationName === stationName);
}
