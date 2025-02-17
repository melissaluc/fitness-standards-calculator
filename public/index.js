import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import indexRouter from './routes/index.js';
import fitnessRouter from './routes/fitnessLevel.js';
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', indexRouter);
app.use('/fitness', fitnessRouter);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
