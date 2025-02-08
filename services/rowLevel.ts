import axios from 'axios';
import qs from 'qs';
import 'dotenv/config';
import cheerio, { load } from 'cheerio';
import {CardioUser} from '../interfaces/types.js';
import https from 'https'


// Beginner	Faster than 5% of rowers. A beginner rower has started rowing and has rowed for at least a month.
// Novice	Faster than 20% of rowers. A novice rower has rowed regularly for at least six months.
// Intermediate	Faster than 50% of rowers. An intermediate rower has rowed regularly for at least two years.
// Advanced	Faster than 80% of rowers. An advanced rower has rowed for over five years.
// Elite	Faster than 95% of rowers. An elite rower has dedicated over five years to become competitive at rowing.


// TODO: move to a Interface folder
interface RowResult {
  rowing_Level: string;
  body_weight: number;
  next_rowing_level: string;
  one_rep_max: number;
  relative_fitness_demographic: number;
  relative_fitness: number;
  fitness_bounds: Record<string, number>;
}

// const parseHTML = async (htmlText: string): Promise<StrengthResult | undefined> => {
//     try {
//       // Load the HTML into cheerio
//       const $ = load(htmlText);
  
    
//     const results
//     return results

//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.error(error.message)
//       } else {
//         console.error('An unknown error occurred')
//       }
//     }
//   };
  
// NOTE: Variation applies to some exercises are can take on values: bodyweight, weighted, assisted
const calculateRow = async (input : CardioUser) : Promise< RowResult|undefined> => {

    try{
    
      const {
        gender,
        ageYears,
        bodyMass,
        bodyMassUnit,
        timeHours,
        timeMinutes,
        timeSeconds,
        distance,
        distanceUnit,
      } = input

        // distance: 10
        // distanceUnit: meter
        // timeHours: 
        // timeMinutes: 
        // timeSeconds: 30
        // gender: male
        // age: 30
        // bodyweight: 170
        // bodyweightUnit: lb

      // NOTE: The API will accept post body as url encoded string, type does not matter here
      const formData = {
          "gender": gender,
          "age": ageYears,
          "bodyweight": bodyMass,
          "bodyweightunit": bodyMassUnit,
          "timeHours": timeHours,
          "timeMinutes": timeMinutes,
          "timeSeconds": timeSeconds,
          "distance": distance,
          "distanceUnit": distanceUnit,
        }
        
        const filteredFormData = Object.entries(formData)
        .filter(([key, value]) => value != null) 
        .reduce((acc: any, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
  
        const urlEncodedString = qs.stringify(filteredFormData);
        console.log(urlEncodedString)

        const axiosInstance = axios.create({
          httpsAgent: new https.Agent({ keepAlive: true }),
      })

  
        // Set up the request config
        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://rowinglevel.com/',
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: urlEncodedString
        };
        
        //FIXME: works for 
        const response = await axiosInstance.request(config)
        const htmlText = response.data;
        const result = await parseHTML(htmlText)
        return result;
  
      
        
  
  } catch (error: any) {
    console.error('Error:', error.message);
    throw error;  
  }
}
export default calculateRow;