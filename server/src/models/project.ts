export type Project = {
    name: string;
    secret: string;
    runnablePath: string;
    launchCommands: string[];
    isActive: boolean;
}