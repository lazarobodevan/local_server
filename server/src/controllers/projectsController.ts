
import ProjectRepository from '../repositories/projectRepository'
import { Request, Response } from "express"
import crypto from 'crypto';
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import RunProjectUseCase from '../usecases/runProjectUseCase';
import GitCloneUseCase from '../usecases/gitCloneUseCase';
import GitPullUseCase from '../usecases/gitPullUseCase';
import ValidateWebhookRequestUseCase from '../usecases/validateWebhookRequestUseCase';

class ProjectsController{
    private repository: ProjectRepository;
    private validadeWebhookRequestUseCase: ValidateWebhookRequestUseCase;
    private runProjectUseCase: RunProjectUseCase;
    private gitCloneUseCase: GitCloneUseCase;
    private gitPullUseCase: GitPullUseCase;

    constructor(){
      dotenv.config();  
      this.repository = new ProjectRepository();
      this.runProjectUseCase = new RunProjectUseCase();
      this.gitCloneUseCase = new GitCloneUseCase();
      this.gitPullUseCase = new GitPullUseCase();
      this.validadeWebhookRequestUseCase = new ValidateWebhookRequestUseCase(this.repository);
    }

    webhook = async(req: Request, res:Response) =>{
        try{
            console.log(`[${new Date()}]---------------`);
            const project = this.validadeWebhookRequestUseCase.execute(req, res);
            console.log(project?.name);
            if (project) {
                console.log(`Assinatura válida para ${project.name}. Executando git pull e iniciando o projeto...`);

                const localRepoPath = path.join(process.env.PROJ_BASE_PATH, project.name);

                // Verificar se o diretório existe
                
                const pathExists = fs.existsSync(localRepoPath);

                if (!pathExists) {
                    fs.mkdirSync(localRepoPath,{recursive: true});
                    console.log(`Diretório .git não encontrado em ${localRepoPath}. Clonando o repositório...`);
                    try{
                        this.gitCloneUseCase.execute(project.name);
                        res.status(200).send("Repoitório clonado com sucesso");
                    }catch(e){
                        console.log(e);
                        return res.status(500).send(e);
                    }
                }else{
                    try{
                        const hasChanges = await this.gitPullUseCase.execute(project.name);
                        res.status(200).send("Git pull realizado com sucesso!");
                        
                        this.runProjectUseCase.execute(project);
                        
                    }catch(e){
                        console.log(e);
                        return res.status(500).send(e);
                    }
                }
                console.log("--------------------------");
            }else {
                console.error('Assinatura inválida. Ignorando solicitação.');
                res.status(403).send('Assinatura inválida.');
            }
                        
        }catch(e){
            console.log("---------------------");
            console.log(`Erro interno: ${e}`);
            console.log("---------------------");
            return res.status(500).send(e);
        }
    }
}

export default ProjectsController;