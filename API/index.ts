require('dotenv').config();
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import routes from './routes/route';

const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*',
    methods: 'GET,POST,OPTIONS,DELETE,PUT',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin',
    optionsSuccessStatus: 204,
  }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
app.use('/api', routes);
app.use('/static', express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})