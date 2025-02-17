import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  //TODO: add html and API documentation
  res.send('Fitness Level Calculator API');
});

export default router;
