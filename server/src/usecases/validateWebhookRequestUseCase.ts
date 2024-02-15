import ProjectRepository from "../repositories/projectRepository";
import {Request, Response} from 'express';
import crypto from 'crypto'

class ValidateWebhookRequestUseCase{
    private _projectRepository: ProjectRepository;

    constructor(projectRepository: ProjectRepository){
        this._projectRepository = projectRepository;
    }

    execute = (req: Request, res: Response) =>{
        const signature = req.get('x-hub-signature-256') || '';
        const payload = JSON.stringify(req.body);
        const project = this._projectRepository.projects.find((p) => {
            const hmac = crypto.createHmac('sha256', p.secret);
            const hash = 'sha256=' + hmac.update(payload).digest('hex');
            return hash === signature;
        });

        return project;
    }
}

export default ValidateWebhookRequestUseCase;