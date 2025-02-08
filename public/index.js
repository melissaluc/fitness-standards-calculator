var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import bodyParser from 'body-parser';
import { Variation, Gender, Service } from './enums/types.js';
import { getEnumFromString } from './utils/conversions.js';
import strengthCalculator from './services/strengthLevel.js';
// import rowCalculator from './services/rowLevel.js';
// import runCalculator from './services/runningLevel.js';
// import cycleCalculator from './services/cycleLevel.js';
// import swimCalculator from './services/swimLevel.js';
const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
function isStrengthUser(userInput) {
    return userInput.variation !== undefined;
}
// TODO: figure out what format to send the documentation in
app.get('/', (req, res) => {
    // TODO: put documentation here
    res.send('Fitness Level Calculator API');
});
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { service, userInput } = req.body;
    // TODO: set a type for result object
    let result;
    if (!service || !userInput) {
        return res.status(400).send({ success: false, error: 'Missing required params' });
    }
    if (!userInput.gender || (userInput.gender !== 'male' && userInput.gender !== 'female')) {
        return res.status(400).send({ success: false, error: 'Invalid gender' });
    }
    const gender = getEnumFromString(userInput.gender, Gender);
    if (gender) {
        userInput.gender = gender;
    }
    if (isStrengthUser(userInput)) {
        if (userInput.variation) {
            const variation = getEnumFromString(userInput.variation, Variation, true);
            userInput.variation = variation;
        }
    }
    try {
        switch (service) {
            case Service.Strength:
                result = yield strengthCalculator(userInput);
                break;
            // case Service.Row:
            //     result = rowCalculator(userInput as CardioUser);
            //     break;
            // case Service.Swim:
            //     result = swimCalculator(userInput as CardioUser);
            //     break;
            // case Service.Run:
            //     result = runCalculator(userInput as CardioUser);
            //     break;
            // case Service.Cycle:
            //     result = cycleCalculator(userInput as CardioUser);
            //     break;
            default:
            // return res.status(400).send({ success: false, error: 'Unknown service' });
        }
        // If the result doesn't match your expected structure, return an error response
        if (!result) {
            // return res.status(500).send({ success: false, error: 'Error processing the service request' });
        }
        // Return a successful response with the result
        res.send({ success: true, result });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: 'Internal server error' });
    }
}));
app.listen(port, () => {
    console.log(`Hello Node.js v${process.versions.node}!`);
    console.log(`Server is running on http://localhost:${port}`);
});
