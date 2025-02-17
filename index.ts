import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import indexRouter from './routes/index';
import fitnessRouter from './routes/fitnessLevel';
import strengthExercisesRouter from './routes/strengthExercises';

const app: Application = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/strength-exercises', strengthExercisesRouter);
app.use('/fitness', fitnessRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
