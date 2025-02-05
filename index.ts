import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Service, StrengthUser, CardioUser } from './interfaces/types.js';

import strengthCalculator from './services/strengthLevel.js';
import rowCalculator from './services/rowLevel.js';
import runCalculator from './services/runningLevel.js';
import cycleCalculator from './services/cycleLevel.js';
import swimCalculator from './services/swimLevel.js';

const app: Application = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TODO: figure out what format to send the documentation in
app.get('/', (req: Request, res: Response) => {
    // TODO: put documentation here
    res.send('Fitness Level Calculator API');
});

app.post('/', (req: Request, res: Response) => {
    const { service, userInput } = req.body;
    // TODO: set a type for result object
    let result: any;

    if (!service || !userInput) {
        return res.status(400).send({ success: false, error: 'Missing required params' });
    }

    // TODO: Convert gender and variation to enum values



    try {
        switch (service) {
            case Service.Strength:
                result = strengthCalculator(userInput as StrengthUser);
                break;
            case Service.Row:
                result = rowCalculator(userInput as CardioUser);
                break;
            case Service.Swim:
                result = swimCalculator(userInput as CardioUser);
                break;
            case Service.Run:
                result = runCalculator(userInput as CardioUser);
                break;
            case Service.Cycle:
                result = cycleCalculator(userInput as CardioUser);
                break;
            default:
                return res.status(400).send({ success: false, error: 'Unknown service' });
        }

        // If the result doesn't match your expected structure, return an error response
        if (!result) {
            return res.status(500).send({ success: false, error: 'Error processing the service request' });
        }

        // Return a successful response with the result
        res.send({ success: true, result });

    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Hello Node.js v${process.versions.node}!`);
    console.log(`Server is running on http://localhost:${port}`);
});
