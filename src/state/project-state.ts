import {State} from "./state.js";
import {Project, Status} from "../domain/project.js";

export class ProjectState extends State<Project[]> {
    private projects: Map<string, Project>;

    private static instance: ProjectState;

    private constructor() {
        super();

        this.projects = new Map<string, Project>();
    }

    public addProject(project: Project) {
        this.projects.set(project.id, project);
        this.notifyProjectStateChange();
    }

    public removeProject(project: Project) {
        this.projects.delete(project.id);
        this.notifyProjectStateChange();
    }

    public changeStatus(projectId: string, status: Status) {
        let project = this.projects.get(projectId);
        if (project && project.status !== status) {
            project.status = status;
            this.notifyProjectStateChange();
        }
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new ProjectState();
        }

        return this.instance;
    }

    public notifyProjectStateChange() {
        this.notifyStateChange(Array.from(this.projects.values()));
    }
}
