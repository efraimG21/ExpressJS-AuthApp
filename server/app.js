import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
    allowedOrigins: ['*'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
}));
app.use(express.json());
app.use(cookieParser())


app.listen(process.env.SERVER_PORT , () => {
    console.log(`server is running on ${ process.env.SERVER_PORT }`);
});
