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

type ShowMapSettings = {
  originToDestination: AM_PM;
  destinationToOrigin: AM_PM;
};

export default class Schedule {
  _raw: RawTrainSchedule;
  _transformed: TrainSchedule;

  constructor(raw: RawTrainSchedule) {
    this._raw = raw;
    this._transformed = this._transformRaw();
  }

  static oppositeDirectionOfDirection(direction: DIRECTION): DIRECTION {
    return direction === DIRECTION.NORTH ? DIRECTION.SOUTH : DIRECTION.NORTH;
  }

  static stopsFilteredToTimeOfDay(stops: Stop[], amPm: AM_PM) {
    if (amPm === AM_PM.AM_AND_PM) return stops;
    return _.filter(stops, ({ time }) => time && time.toFormat('a') === amPm);
  }

  static stopsAfterTime(time, stops) {
    return _.filter(stops, stop => stop.time > time);
  }

  commuterStops(origin: string, destination: string, direction: DIRECTION, showMap: ShowMapSettings): Stop[] {
    const originToDestinationTimes = Schedule.stopsFilteredToTimeOfDay(
      this.stopsForStation(origin, direction),
      showMap.originToDestination,
    );

    const destinationToOriginTimes = Schedule.stopsFilteredToTimeOfDay(
      this.stopsForStation(destination, Schedule.oppositeDirectionOfDirection(direction)),
      showMap.destinationToOrigin,
    );

    const now = DateTime.local();
    return Schedule.stopsAfterTime(now, [...originToDestinationTimes, ...destinationToOriginTimes]);
  }

  stopsForStation(stationName: string, direction: DIRECTION): Stop[] {
    const trains = this._transformed[direction];
    const stop = this._findStopByName(trains[0], stationName);
    const stops = [];
    for (const train of trains) {
      stops.push(train.stops[stop.id]);
    }
    return stops;
  }

  stopsBetweenStations(start: string, end: string, direction: DIRECTION): Stop[] {
    const trains = this._transformed[direction];
    const startStop = this._findStopByName(trains[0], start);
    const startStopIndex = startStop.id;
    const endStop = this._findStopByName(trains[0], end);
    const endStopIndex = endStop.id;

    const schedule = [];
    for (const train of trains) {
      for (let stopId = startStop.id; stopId < train.stops.length; stopId++) {
        schedule.push(train.stops[stopId]);
        if (stopId === endStopIndex) {
          return schedule;
        }
      }
    }

    return schedule;
  }

  _findStopByName(train: Train, stationName: string): Stop {
    return _.find(train.stops, stop => stop.stationName === stationName);
  }

  _transformRaw(): TrainSchedule {
    return {
      [DIRECTION.NORTH]: this._convertRawStopsToTrain(this._raw.north, DIRECTION.NORTH),
      [DIRECTION.SOUTH]: this._convertRawStopsToTrain(this._raw.south, DIRECTION.SOUTH),
    };
  }

  _convertRawStopsToTrain(stops: RawTrainScheduleStops[], direction: DIRECTION): Train[] {
    return _.map(stops, (stop, trainId) => ({
      id: trainId,
      trainNumber: stop.Train as number,
      stops: _.map(stationOrder[direction], (station, stopId) => {
        const prettyTime = stop[station] as string;
        return {
          id: stopId,
          stationName: station,
          time: prettyTime ? DateTime.fromFormat(prettyTime, TIME_FORMAT) : null,
          prettyTime: prettyTime || null,
        };
      }),
    }));
  }
}
