import {Variation, Gender, Service} from '../enums/types.js'

export interface UserStats {
    gender: Gender;
    ageYears: number;
    bodyMass: number;
    bodyMassUnit: 'kg' | 'lb';
}

export interface StrengthUser extends UserStats {
    exerciseName: string;
    liftMass: number;
    liftMassUnit: 'kg' | 'lb';
    sets: number;
    repetitions: number;
    variation: Variation | null;
    assistanceMass: number | null;
    extraMass: number | null;
}

export interface CardioUser extends UserStats {
    distance: number;
    distanceUnit: 'km' | 'miles';
    timeHours: number;
    timeMinutes: number;
    timeSeconds: number;
}

export interface RequestBody<T> {
    service: Service;
    userInput: T
}

// Cardio calculated results interfaces
export interface CardioResultValues{
    fitness_level: number;
    next_fitness_level: number | null;
    o2_cost:number | null, // ml/kg/min
    max_vo2_util:number | null, // %
    effective_vo2_max: number | null, // ml/kg/min
    vo2_max_km_per_mile:string | null, // km/mile
    relative_fitness_demographic: number | null;
    relative_fitness_gender: number | null;
  
  }
  

  export interface GenderAgeRunningTimesFinishTime {
    age: number;
    beginner: string;
    novice: string;
    intermediate: string;
    advanced: string;
    elite: string;
    WR: string;
  } 
  export interface GenderAgeRunningTimesPace {
    age: number;
    beginner: string;
    novice: string;
    intermediate: string;
    advanced: string;
    elite: string;
    WR: string;
  } 
  
  export interface TrainingPace{
    intensity: string;
    pace_range: string;
  } 
 export  interface RacePredictionFinishTime {
    distance: string;
    finish_time: string;
  } 
  
 export interface RacePredictionPace{
    distance: number;
    pace: string;
  } 
  export interface BodyWeightPredictionFinishTime {
    body_weight: number;
    finish_time: string;
    delta: string;
  } 
  
  export interface BodyWeightPredictionPace{
    body_weight: number;
    pace: string;
    delta: string;
  } 
  
  export interface CardioTables {
    running_times_finish_time:GenderAgeRunningTimesFinishTime[];
    running_times_pace:GenderAgeRunningTimesPace[];
    training_pace_intensity:TrainingPace[];
    race_predictions_finish_time: RacePredictionFinishTime[];
    race_predictions_pace: RacePredictionPace[];
    body_weight_prediction_finish_time:BodyWeightPredictionFinishTime[];
    body_weight_prediction_pace: BodyWeightPredictionPace[];
  }
  
  export interface CardioResults {
    tables: CardioTables;
    results:CardioResultValues;
  }