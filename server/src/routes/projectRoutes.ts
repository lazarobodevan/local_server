import ProjectsController from "../controllers/projectsController";
import express from 'express';

const projectController = new ProjectsController();

export default(router:express.Router) =>{
    router.post('/webhook', projectController.webhook);
}