import express from 'express';
import router from './routes'
import bodyParser from 'body-parser';
import cors from 'cors';

class App{
    public express: express.Application;

    constructor(){
        this.express = express();
        this.express.use(cors());
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(bodyParser.json());
        this.routes();
    }

    private routes(){
        this.express.get('/health', (req, res)=>{
            return res.status(200).json({message: 'Server is running on port 8080'});
        });

        this.express.use(router())
    }
}

export default new App().express