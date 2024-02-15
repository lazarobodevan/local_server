import {exec} from 'child_process';
import { Project } from '../models/project';
class RunProjectUseCase{

    execute = (project: Project) =>{
        try{
            project.launchCommands.forEach(command => {
                console.log(`Executando: ${command}`)
                exec(project.runnablePath + " " + command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Erro ao iniciar ${project.name}:`, error);
                        throw `Erro ao executar o comando ${command}: Erro: ${error}`
                    }
                });
            });
        }catch(e){
            console.log("-------------------------");
            console.log("Não foi possível iniciar o projeto");
            console.log(e);
            console.log("-------------------------")
        }
    }
}

export default RunProjectUseCase;