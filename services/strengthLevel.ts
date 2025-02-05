import axios from 'axios';
import qs from 'qs';
import 'dotenv/config';
import cheerio from 'cheerio';
import {StrengthUser} from '../interfaces/types.js';

interface StrengthResult {
  strengthLevel: string;
  bodyWeight: number;
  next_strength_level: string;
  one_rep_max: number;
  relative_strength_demographic: number;
  relative_strength: number;
  strengthBounds: Record<string, number>;
}

const parseHTML = async (htmlText: string) => {
    try {
      // Load the HTML into cheerio
      const $ = cheerio.load(htmlText);
  
      // one-rep max
      const oneRepMaxMatch: RegExpMatchArray | null = $('.section-box.liftresult div#liftResults .content').text().match(/\b\d+(\.\d+)?\b/g)
      const oneRepMax: string | null = oneRepMaxMatch ? oneRepMaxMatch[0] : null;
  
      // comparison value
      const compareMatch: RegExpMatchArray | null = $('.section-box.liftresult div#liftResults div.columns > :first-child p strong').text().match(/\b\d+(\.\d+)?\b/g)
      const compare: string | null = compareMatch ? compareMatch[0] : null;
  
  
      // lift value
      const liftMatch: RegExpMatchArray | null = $('.section-box.liftresult div#liftResults div.columns > :last-child p strong').text().match(/\b\d+(\.\d+)?\b/g)
      const lift: string | null = liftMatch ? liftMatch[0] : null

  
      // strength bound table headers and rows
      const headers:string[] = $('.section-box.liftresult .liftresult__standards table thead tr th')
      .map((i, el) => $(el).text().replace(/['".]/g, "").trim().toLowerCase())
      .get();

      let strengthLevel = 'beginner';
      let next_strength_level = 'novice';
      const rows: number[] = $('.section-box.liftresult .liftresult__standards table tbody tr td')
      .map((i: number, el) => {
        const $el = $(el);
        const value = $el.text().replace(/['".]/g, "").trim();
        const hasHighlightClass = $el.hasClass('has-background-tablehighlight'); 
        
        console.log('Index:', i, 'Value:', value, 'hasHighlightClass:', hasHighlightClass);
        
        if (hasHighlightClass) {
          switch (i) {
            case 1:
              strengthLevel = 'beginner';
              next_strength_level = 'novice';
              break;
            case 2:
              strengthLevel = 'novice';
              next_strength_level = 'intermediate';
              break;
            case 3:
              strengthLevel = 'intermediate';
              next_strength_level = 'advanced';
              break;
            case 4:
              strengthLevel = 'advanced';
              next_strength_level = 'elite';
              break;
            case 5:
              strengthLevel = 'elite';
              next_strength_level = 'elite';
              break;
            default:
              strengthLevel = 'beginner';
              next_strength_level = 'novice';
              break;
          }
          return parseInt(value) || 0;
        } else {
          return parseInt(value) || 0;
        }
      }).get();

      // combine headers and rows
      const zipped = headers.map((header, index) => [header, rows[index]]);
      const strengthBounds = Object.fromEntries(zipped);
      const bodyWeight = strengthBounds.bw
      delete strengthBounds.bw 


      // rename keys 
      const keysMap: {[key: string]: string} = { 'beg': 'beginner', 'nov': 'novice', 'int': 'intermediate', 'adv': 'advanced' };
      const renamedObj: {[key: string]: any}  = Object.fromEntries(
        Object.entries(strengthBounds).map(([key, value]) => [keysMap[key] || key, value])
      );
  
      console.log('One Rep Max:', oneRepMax);
      console.log('Compare:', compare);
      console.log('Lift:', lift);
      console.log('Strength Bounds:', renamedObj);
      console.log('Body Weight:', bodyWeight);

      // TODO: add interface for output
      const results: StrengthResult = {
        strengthLevel,
        bodyWeight,
        next_strength_level,
        one_rep_max: oneRepMax ? parseFloat(oneRepMax) : -1,
        relative_strength_demographic: compare ? parseFloat(compare) : -1,
        relative_strength: lift ? parseFloat(lift) : -1,
        strengthBounds: renamedObj
    }
    return results
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error('An unknown error occurred')
      }
    }
  };
  
// NOTE: Variation applies to some exercises are can take on values: bodyweight, weighted, assisted
const calculateStrength = async (input : StrengthUser) =>{

    try{
    
      const {
        gender,
        ageYears,
        bodyMass,
        bodyMassUnit,
        exerciseName,
        liftMass,
        liftMassUnit,
        sets,
        repetitions,
        variation,
        assistanceMass,
        extraMass
      } = input


      const exerciseNameValue = exerciseName.toLowerCase().replace(/ /g, "-");
      // NOTE: The API will accept post body as url encoded string, type does not matter here
      const formData = {
          "gender": gender,
          "ageyears": ageYears,
          "bodymass": bodyMass,
          "bodymassunit": bodyMassUnit,
          "exercise": exerciseNameValue,
          "liftmass": liftMass,
          "liftmassunit": liftMassUnit,
          "repetitions": repetitions,
          "timezone": -4,
          "source": "homepage",
          "modalsearch": "",
          "modalbodypart": "",
          "modalcategory": "",
          "variation": variation,
          "assistancemass": assistanceMass,
          "extramass": extraMass
        }
        
        const filteredFormData = Object.entries(formData)
        .filter(([key, value]) => value != null) 
        .reduce((acc: any, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
  
        const urlEncodedString = qs.stringify(filteredFormData);
        console.log(urlEncodedString)
  
  
        // Set up the request config
        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://strengthlevel.com/',
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: urlEncodedString
        };
        
        //request
        const response = await axios.request(config)
        const htmlText = response.data;
        const result = await parseHTML(htmlText)
        return result;
  
      
        
  
  } catch (error: any) {
    console.error('Error:', error.message);
    throw error;  
  }
}
export default calculateStrength;