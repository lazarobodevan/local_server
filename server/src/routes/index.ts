import express from "express";
import projectRoutes from "./projectRoutes";
const router = express.Router();

export default():express.Router =>{
    projectRoutes(router);
    
    return router;
}