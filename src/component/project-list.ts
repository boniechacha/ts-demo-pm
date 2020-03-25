import {Component} from "./component";
import {Dragger, DragTarget} from "./drag-drop";
import {Status} from "../domain/project";
import {ProjectState} from "../state/project-state";
import {ProjectItem} from "./project-item";

export class ProjectList extends Component<HTMLElement, HTMLDivElement> implements DragTarget {
    private listElement: HTMLUListElement;

    private status: Status;

    constructor(type: Status) {
        super("project-list", "app", "beforeend");

        this.status = type;
        this.listElement = this.element.querySelector("ul") as HTMLUListElement;

        this.configure();
    }

    private configure() {
        this.element.id = `${this.status.toLowerCase()}-projects`;
        this.listElement.id = `${this.status.toLowerCase()}-projects-list`;
        this.element.querySelector("h2")!.textContent = `${this.status.toUpperCase()} PROJECTS`;

        Dragger.configureTarget(this);

        ProjectState.getInstance().addListener(projects => {
            this.listElement.innerHTML = '';

            projects.filter(value => value.status === this.status).forEach(value => {
                new ProjectItem(value, this.listElement.id).attach();
            })

        })
    }

    getDragTargetElement(): HTMLElement {
        return this.element;
    }

    onDragLeave(ev: DragEvent): void {
    }

    onDragOver(ev: DragEvent): void {
        if (ev.dataTransfer && ev.dataTransfer.items[0].type === 'text/plain') {
            ev.preventDefault();
        }
    }

    onDrop(ev: DragEvent): void {
        let projectId = ev.dataTransfer!.getData("text/plain");
        ProjectState.getInstance().changeStatus(projectId, this.status);
    }

}