import { Router } from 'express';
import strengthCalculator from '../services/strengthLevel.js';
import { Variation, Gender, Service } from '../enums/types.js';
import { getEnumFromString } from '../utils/conversions.js';
const router = Router();
function isStrengthUser(userInput) {
    return userInput.variation !== undefined;
}
router.post('/', async (req, res) => {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    const { service, userInput } = req.body;
    let result;
    if (!service || !userInput) {
        return res.status(400).send({ success: false, error: 'Missing required params' });
    }
    if (!userInput.gender || (userInput.gender.toLowerCase() !== 'male' && userInput.gender.toLowerCase() !== 'female')) {
        return res.status(400).send({ success: false, error: 'Invalid gender' });
    }
    const gender = getEnumFromString(userInput.gender.toLowerCase(), Gender);
    if (gender) {
        userInput.gender = gender;
    }
    if (isStrengthUser(userInput)) {
        if (userInput.variation) {
            const variation = getEnumFromString(userInput.variation.toLowerCase(), Variation, userInput.variation === null);
            console.log('variation:', variation);
            userInput.variation = variation;
        }
    }
    try {
        switch (service) {
            case Service.Strength:
                result = await strengthCalculator(userInput);
                break;
            // other cases...
            default:
                return res.status(400).send({ success: false, error: 'Unknown service' });
        }
        if (!result) {
            return res.status(500).send({ success: false, error: 'Error processing the service request' });
        }
        res.send({ success: true, result });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: 'Internal server error' });
    }
});
export default router;
