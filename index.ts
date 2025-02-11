import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import {StrengthUser, CardioUser, RequestBody} from './interfaces/types.js';
import {Variation, Gender, Service} from './enums/types.js'
import {getEnumFromString} from './utils/conversions.js'
import cors from 'cors'
import { FileSystemTree, WebContainer } from '@webcontainer/api'

import strengthCalculator from './services/strengthLevel.js';
// import rowCalculator from './services/rowLevel.js';
import runCalculator from './services/runLevel.js';
// import cycleCalculator from './services/cycleLevel.js';
// import swimCalculator from './services/swimLevel.js';

const app: Application= express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});



// NOTE: Serve index.js only for webcontainers
// let webcontainer: WebContainer;
const files: FileSystemTree = {
    'index.js': {
        file: {
            contents: 'console.log("Hello!")',
        },
    },
};




function isStrengthUser(userInput: StrengthUser | CardioUser): userInput is StrengthUser {
    return (userInput as StrengthUser).variation !== undefined;
  }


// TODO: figure out what format to send the documentation in
app.get('/', (req: Request, res: Response) => {
    // TODO: put documentation here
    res.send('Fitness Level Calculator API');
});

app.get('/strength-exercises', (req: Request, res: Response) => {
    res.send('Return list of strength exercises');
});

// app.get('/strength', (req: Request, res: Response) => {
//     res.send('Determine Strength Level given an exercise to get Calculation Results');
// });

// app.get('/cardio', (req: Request, res: Response) => {
//     res.send('Select Cardio Activity to get Calculation Results');
// });

// Test endpoint
// app.post('/', (req: Request, res: Response) => {
//     console.log('Received POST request at /'); // Log request receipt
//     console.log('Request Body:', JSON.stringify(req.body, null, 2)); // Log the request body
//     res.send(JSON.stringify({msg:'got it!'}));
// });

// TODO: separate services into routes
app.post('/', async (req: Request<unknown, unknown, RequestBody<StrengthUser | CardioUser>>, res: Response): Promise<any> => {
    console.log('Request Body:', JSON.stringify(req.body, null, 2))
    const { service, userInput } = req.body
    // TODO: set a type for result object
    let result: any;

    if (!service || !userInput) {
        return res.status(400).send({ success: false, error: 'Missing required params' });
    }
    if (!userInput.gender || (userInput.gender.toLowerCase() !== 'male' && userInput.gender.toLowerCase() !== 'female')) {
        return res.status(400).send({ success: false, error: 'Invalid gender' });
    } 

    const gender = getEnumFromString(userInput.gender.toLowerCase(), Gender)
    if (gender){
        userInput.gender = gender
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
                result = await strengthCalculator(userInput as StrengthUser);
                break;
            // case Service.Row:
            //     result = rowCalculator(userInput as CardioUser);
            //     break;
            // case Service.Swim:
            //     result = swimCalculator(userInput as CardioUser);
            //     break;
            case Service.Run:
                result = await runCalculator(userInput as CardioUser);
                break;
            // case Service.Cycle:
            //     result = cycleCalculator(userInput as CardioUser);
            //     break;
            default:
                // return res.status(400).send({ success: false, error: 'Unknown service' });
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
