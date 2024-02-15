import dotenv from 'dotenv';
import path from 'path';
import simpleGit from 'simple-git/promise'; // Import the promise version of simple-git

class GitPullUseCase {
  execute = async (repoName: string): Promise<void> => {
    dotenv.config();
    const localRepoPath = path.join(process.env.PROJ_BASE_PATH, repoName);
    const git = simpleGit(localRepoPath);
    console.log(`Fazendo pull do repositorio ${repoName}...`);

    try {
        const pullResult = await git.pull();  
        console.log('Projeto atualizado com sucesso!');
    } catch (e) {
      console.error('Erro ao executar git pull:', e);
      throw new Error('Erro interno.');
    }
  }
}

export default GitPullUseCase;
