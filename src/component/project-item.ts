import {Component} from "./component.js";
import {Draggable, Dragger} from "./drag-drop.js";
import {Project} from "../domain/project.js";

export class ProjectItem extends Component<HTMLLIElement, HTMLUListElement> implements Draggable {
    private project: Project;

    constructor(project: Project, listId: string) {
        super("single-project", listId, "beforeend");
        this.project = project;

        this.configure();
    }

    private configure() {
        this.element.querySelector("h2")!.textContent = this.project.title;
        this.element.querySelector("h3")!.textContent = `${this.project.peopleCount} assigned`;
        this.element.querySelector("p")!.textContent = this.project.description;

        Dragger.configureDraggable(this);
    }

    getDraggableElement(): HTMLElement {
        return this.element;
    }

    onDragEnd(ev: DragEvent): void {
        console.log("Drag end ", ev)
    }

    onDragStart(ev: DragEvent): void {
        ev.dataTransfer!.setData("text/plain", this.project.id);
        ev.dataTransfer!.effectAllowed = "move";
    }
}