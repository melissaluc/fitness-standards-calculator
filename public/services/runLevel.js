import axios from 'axios';
import qs from 'qs';
import 'dotenv/config';
import { load } from 'cheerio';
import https from 'https';
const tableKeys = {
    running_times_finish_time: [
        "age",
        "beginner",
        "novice",
        "intermediate",
        "advanced",
        "elite",
        "WR",
    ],
    running_times_pace: [
        "age",
        "beginner",
        "novice",
        "intermediate",
        "advanced",
        "elite",
        "WR",
    ],
    training_pace_intensity: [
        "intensity",
        "pace_range",
    ],
    race_predictions_finish_time: [
        "distance",
        "finish_time",
    ],
    race_predictions_pace: [
        "distance",
        "pace",
    ],
    body_weight_prediction_finish_time: [
        "body_weight",
        "finish_time",
        "delta",
    ],
    body_weight_prediction_pace: [
        "body_weight",
        "pace",
        "delta",
    ],
};
const parseHTMLTable = async (htmlText, selector, tableKeys = null) => {
    if (!tableKeys) {
        throw new Error('Table keys are not defined');
    }
    // Extract data from tabular results
    const $ = load(htmlText);
    const tableRows = $(selector).find('tbody').first().find('tr');
    const tableData = [];
    console.log('selector:', selector);
    // console.log('tableRows:', tableRows.length)
    tableRows.each((index, row) => {
        const cells = $(row).find('td');
        const rowData = {};
        // Define the keys explicitly if known
        const keys = tableKeys;
        keys.forEach((key, i) => {
            if (cells[i]) {
                rowData[key] = $(cells[i]).text().trim();
            }
        });
        tableData.push(rowData);
    });
    return tableData;
};
const parseHTMLHeroBanner = async (htmlText) => {
    // Extract data from the Hero Banner
    const $ = load(htmlText);
    const fitnessLevel = $('.hero-body .stars:first-child').text().length;
    const nextFitnessLvl = fitnessLevel < 5 ? fitnessLevel + 1 : null;
    const extractMatch = (selector) => {
        const innerTextHTML = $(selector).text().trim();
        if (innerTextHTML.includes("/")) {
            return innerTextHTML;
        }
        const match = innerTextHTML.match(/\d+\.?\d*/);
        return match ? match[0] : null;
    };
    const relFitnessDemographic = extractMatch('.hero-body .level:nth-of-type(2) .level-item:nth-of-type(1) p.title');
    const relFitnessGender = extractMatch('.hero-body .level:nth-of-type(2) .level-item:nth-of-type(2) p.title');
    const o2Cost = extractMatch('.hero-body .level:nth-of-type(3) .level-item:nth-of-type(1) p.title');
    const maxVO2Util = extractMatch('.hero-body .level:nth-of-type(3) .level-item:nth-of-type(2) p.title');
    const effVO2Max = extractMatch('.hero-body .level:nth-of-type(3) .level-item:nth-of-type(3) p.title');
    const maxVO2KmpMile = extractMatch('.hero-body .level:nth-of-type(3) .level-item:nth-of-type(4) p.title');
    const results = {
        fitness_level: fitnessLevel,
        next_fitness_level: nextFitnessLvl,
        o2_cost: o2Cost ? parseFloat(o2Cost) : null,
        max_vo2_util: maxVO2Util ? parseFloat(maxVO2Util) : null,
        effective_vo2_max: effVO2Max ? parseFloat(effVO2Max) : null,
        vo2_max_km_per_mile: maxVO2KmpMile,
        relative_fitness_demographic: relFitnessDemographic ? parseFloat(relFitnessDemographic) : null,
        relative_fitness_gender: relFitnessGender ? parseFloat(relFitnessGender) : null,
    };
    return results;
};
// NOTE: Variation applies to some exercises are can take on values: bodyweight, weighted, assisted
const calculateRun = async (input) => {
    try {
        const { gender, ageYears, bodyMass, bodyMassUnit, timeHours, timeMinutes, timeSeconds, distance, distanceUnit, } = input;
        const isMetric = bodyMassUnit === 'kg' ? true : false;
        // NOTE: The API will accept post body as url encoded string, type does not matter here
        const formData = {
            "distance": distance,
            "distanceUnit": distanceUnit,
            "timeHours": timeHours,
            "timeMinutes": timeMinutes,
            "timeSeconds": timeSeconds,
            "gender": gender,
            "age": ageYears,
            "bodyweight": bodyMass,
            "bodyweightUnit": bodyMassUnit,
        };
        const filteredFormData = Object.entries(formData)
            .filter(([key, value]) => value != null)
            .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
        const urlEncodedString = qs.stringify(filteredFormData);
        console.log(urlEncodedString);
        const axiosInstance = axios.create({
            httpsAgent: new https.Agent({ keepAlive: true }),
        });
        // Set up the request config
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://runninglevel.com/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: urlEncodedString
        };
        //FIXME: works for 
        const response = await axiosInstance.request(config);
        const htmlText = response.data;
        // console.log(htmlText)
        // Parse the hero banner and tables concurrently, min/km, min/mile
        const [heroBanner, runningTimesFinishTime, runningTimesPace, trainingPace, racePredictionsFinishTime, racePredictionsPace, bodyWeightPredictionFinishTime, bodyWeightPredictionPace,] = await Promise.all([
            parseHTMLHeroBanner(htmlText),
            parseHTMLTable(htmlText, `body > section:nth-of-type(4) .tabs-container .tab:not(.is-hidden) table`, tableKeys.running_times_finish_time), //
            parseHTMLTable(htmlText, `body > section:nth-of-type(4) .tabs-container .tab:not(.is-hidden) + .tab ${isMetric ? " table" : " + .tab table"}`, tableKeys.running_times_pace),
            parseHTMLTable(htmlText, `body > section:nth-of-type(5) .tabs-container .tab:not(.is-hidden) ${isMetric ? " table" : " + .tab table"}`, tableKeys.training_pace_intensity),
            parseHTMLTable(htmlText, `body > section:nth-of-type(6) .tabs-container .tab:not(.is-hidden) table`, tableKeys.race_predictions_finish_time), //
            parseHTMLTable(htmlText, `body > section:nth-of-type(6) .tabs-container .tab:not(.is-hidden) + .tab ${isMetric ? " table " : " + .tab table"}`, tableKeys.race_predictions_pace),
            parseHTMLTable(htmlText, `body > section:nth-of-type(7) .tabs-container .tab:not(.is-hidden) table`, tableKeys.body_weight_prediction_finish_time), //
            parseHTMLTable(htmlText, `body > section:nth-of-type(7) .tabs-container .tab:not(.is-hidden) + .tab ${isMetric ? " table" : " + .tab table"}`, tableKeys.body_weight_prediction_pace),
        ]);
        const results = {
            tables: {
                running_times_finish_time: runningTimesFinishTime,
                running_times_pace: runningTimesPace,
                training_pace_intensity: trainingPace,
                race_predictions_finish_time: racePredictionsFinishTime,
                race_predictions_pace: racePredictionsPace,
                body_weight_prediction_finish_time: bodyWeightPredictionFinishTime,
                body_weight_prediction_pace: bodyWeightPredictionPace,
            },
            results: heroBanner,
        };
        console.log(results);
        return results;
    }
    catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};
export default calculateRun;
