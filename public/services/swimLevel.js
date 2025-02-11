"use strict";
// // How fast/far did you swim?
// // We will adapt your rating based on your age/gender/bodyweight
// // Distance
// // 10
// // meter
// // Time (h:m:s)
// // hours
// // 10
// // seconds
// // Gender
// // Male
// // Age
// // 30
// // Bodyweight
// // 170
// // lb
// // distance: 10
// // distanceUnit: meter
// // timeHours: 
// // timeMinutes: 10
// // timeSeconds: 
// // gender: male
// // age: 30
// // bodyweight: 170
// // bodyweightUnit: lb
// import axios from 'axios';
// import qs from 'qs';
// import 'dotenv/config';
// import cheerio, { load } from 'cheerio';
// import {CardioUser} from '../interfaces/types.js';
// import https from 'https'
// // TODO: move to a Interface folder
// interface CardioResult {
//   strengthLevel: string;
//   bodyWeight: number;
//   next_strength_level: string;
//   one_rep_max: number;
//   relative_strength_demographic: number;
//   relative_strength: number;
//   strengthBounds: Record<string, number>;
// }
// const parseHTML = async (htmlText: string): Promise<StrengthResult | undefined> => {
//     try {
//       // Load the HTML into cheerio
//       const $ = load(htmlText);
//       const results: StrengthResult = {
//         strengthLevel,
//         bodyWeight,
//         next_strength_level,
//         one_rep_max: oneRepMax ? parseFloat(oneRepMax) : -1,
//         relative_strength_demographic: compare ? parseFloat(compare) : -1,
//         relative_strength: lift ? parseFloat(lift) : -1,
//         strengthBounds: renamedObj
//     }
//     return results
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.error(error.message)
//       } else {
//         console.error('An unknown error occurred')
//       }
//     }
//   };
// // NOTE: Variation applies to some exercises are can take on values: bodyweight, weighted, assisted
// const calculateRun = async (input : CardioUser) : Promise< CardioResult|undefined> => {
//     try{
//         const {
//             gender,
//             ageYears,
//             bodyMass,
//             bodyMassUnit,
//             timeHours,
//             timeMinutes,
//             timeSeconds,
//             distance,
//             distanceUnit,
//           } = input
//             // distance: 10
//             // distanceUnit: meter
//             // timeHours: 
//             // timeMinutes: 
//             // timeSeconds: 30
//             // gender: male
//             // age: 30
//             // bodyweight: 170
//             // bodyweightUnit: lb
//           // NOTE: The API will accept post body as url encoded string, type does not matter here
//           const formData = {
//               "gender": gender,
//               "age": ageYears,
//               "bodyweight": bodyMass,
//               "bodyweightunit": bodyMassUnit,
//               "timeHours": timeHours,
//               "timeMinutes": timeMinutes,
//               "timeSeconds": timeSeconds,
//               "distance": distance,
//               "distanceUnit": distanceUnit,
//             }
//         const filteredFormData = Object.entries(formData)
//         .filter(([key, value]) => value != null) 
//         .reduce((acc: any, [key, value]) => {
//             acc[key] = value;
//             return acc;
//         }, {});
//         const urlEncodedString = qs.stringify(filteredFormData);
//         console.log(urlEncodedString)
//         const axiosInstance = axios.create({
//           httpsAgent: new https.Agent({ keepAlive: true }),
//       })
//         // Set up the request config
//         const config = {
//           method: 'post',
//           maxBodyLength: Infinity,
//           url: 'https://swimminglevel.com/',
//           headers: { 
//             'Content-Type': 'application/x-www-form-urlencoded'
//           },
//           data: urlEncodedString
//         };
//         //FIXME: works for 
//         const response = await axiosInstance.request(config)
//         const htmlText = response.data;
//         const result = await parseHTML(htmlText)
//         return result;
//   } catch (error: any) {
//     console.error('Error:', error.message);
//     throw error;  
//   }
// }
// export default calculateRun;
