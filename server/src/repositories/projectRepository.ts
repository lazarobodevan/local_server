import projectsJson from './projects.json';
import fs from 'fs';
import { Project } from '../models/project';

class ProjectRepository{

    public projects: Project[];

    constructor(){
        this.loadProjects();
    }

    loadProjects = () =>{
        projectsJson.forEach(element => {
            this.projects = [];
            this.projects.push({
                name: element.repoName,
                isActive: element.isActive,
                launchCommands: element.launchCommands,
                runnablePath: element.runnablePath,
                secret: element.secret
            });
        });
    }
}

export default ProjectRepository;