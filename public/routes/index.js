import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => {
    //TODO: add html and API documentation
    res.send('Fitness Level Calculator API');
});
export default router;
