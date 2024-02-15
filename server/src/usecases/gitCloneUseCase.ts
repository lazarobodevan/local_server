// Importing required modules
const simpleGit = require('simple-git');
import dotenv from 'dotenv';
import path from 'path';
require('dotenv').config();

// Defining the GitCloneUseCase class
class GitCloneUseCase {
    // Defining the execute method for cloning a repository
    execute = (repoName: string) => {
        // Loading environment variables from a .env file
        dotenv.config();

        

        // Creating a simpleGit instance with the base project path from environment variables
        const git = simpleGit(process.env.PROJ_BASE_PATH);

        // Constructing the local repository path
        const localRepoPath = path.join(process.env.PROJ_BASE_PATH, repoName);

        try{
            // Cloning the GitHub repository using simpleGit
            git.clone(`https://github.com/lazarobodevan/${repoName}.git`, localRepoPath, (cloneErr) => {
                if (cloneErr) {
                    // Handling cloning errors
                    console.error(`Erro ao clonar o repositório ${repoName}:`, cloneErr);
                    throw `Erro ao clonar o repositório: ${cloneErr}`
                }
                // Logging success message if cloning is successful
                console.log(`Repositório ${repoName} clonado com sucesso.`);
            });
        }catch(e){
            
        }
    }
}

// Exporting the GitCloneUseCase class
export default GitCloneUseCase;
