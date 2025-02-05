import {Variation, Gender, Service} from '../enums/types'

export interface UserStats {
    gender: Gender;
    ageYears: number;
    bodyMass: number;
    bodyMassUnit: number;
}

export interface StrengthUser extends UserStats {
    exerciseName: string;
    liftMass: number;
    liftMassUnit: string;
    sets: number;
    repetitions: number;
    variation: Variation | null;
    assistanceMass: number | null;
    extraMass: number | null;
}

export interface CardioUser extends UserStats {
    distance: number;
    distanceUnit: string;
    timeHours: number;
    timeMinutes: number;
    timeSeconds: number;
}

export interface RequestBody<T> {
    service: Service;
    userInput: T
}

//User Stats
// gender: male | female
// age: 30 change to ageYears
// bodyweight: 170 // bodyMass,
// bodyweightUnit: lb // bodyMassUnit,
