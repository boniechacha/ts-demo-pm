//validation
interface Validatable<T> {
    name: string;
    value: T;
    required?: boolean;
}

interface ValidatableString extends Validatable<string> {
    minLength?: number;
    maxLength?: number;
}

interface ValidatableNumber extends Validatable<number> {
    min?: number;
    max?: number;
}

function validateNumber(validatable: ValidatableNumber) {

    if (validatable.max && !(validatable.value <= validatable.max))
        throw new Error(validatable.name + " must be less than or equal: " + validatable.max);

    if (validatable.min && !(validatable.value >= validatable.min))
        throw new Error(validatable.name + " must be greater than or equal: " + validatable.min);

    validate(validatable);
}

function validateString(validatable: ValidatableString) {
    if (validatable.maxLength && !(validatable.value.length <= validatable.maxLength))
        throw new Error(validatable.name + " length must be less than or equal: " + validatable.maxLength);


    if (validatable.minLength && !(validatable.value.length >= validatable.minLength))
        throw new Error(validatable.name + " length must be greater than or equal: " + validatable.minLength);

    validate(validatable);
}

function validate<T>(validatable: Validatable<T>) {
    if (validatable.required && validatable.value == null)
        throw new Error(validatable.name + " must have a value");
}

//base component

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    protected template: HTMLTemplateElement;
    protected hostElement: U;
    protected element: T;

    private hostPosition: InsertPosition;

    constructor(templateId: string, hostId: string, hostPosition: InsertPosition) {
        this.template = document.getElementById(templateId) as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostId) as U;
        this.element = document.importNode(this.template, true).content.firstElementChild as T;

        this.hostPosition = hostPosition;
    }

    public attach() {
        this.hostElement.insertAdjacentElement(this.hostPosition, this.element);
    }
}

//project form
class ProjectForm extends Component<HTMLFormElement, HTMLDivElement> {

    private titleElement: HTMLInputElement;
    private descriptionElement: HTMLInputElement;
    private peopleCountElement: HTMLInputElement;

    constructor() {
        super("project-form", "app", "afterbegin")

        this.titleElement = this.element.querySelector("#title") as HTMLInputElement;
        this.descriptionElement = this.element.querySelector("#description") as HTMLInputElement;
        this.peopleCountElement = this.element.querySelector("#people") as HTMLInputElement;

        this.configure();
    }

    private configure() {
        this.element.addEventListener("submit", ev => {
            ev.preventDefault();

            try {
                let [title, description, peopleCount] = this.collectProjectData();
                ProjectState.getInstance().addProject(new Project(title, description, peopleCount));

                this.clearFields();
            } catch (e) {
                alert(e.message)
            }
        });
    }

    private clearFields() {
        this.titleElement.value = '';
        this.descriptionElement.value = '';
        this.peopleCountElement.value = '';
    }

    private collectProjectData(): [string, string, number] {
        let title = this.titleElement.value;
        let description = this.descriptionElement.value;
        let peopleCount = +this.peopleCountElement.value;

        validateString({name: "title", value: title, required: true, minLength: 1});
        validateString({name: "description", value: description, required: true, minLength: 1});
        validateNumber({name: "people count", value: peopleCount, required: true, min: 1});

        return [title, description, peopleCount];
    }

}

class ProjectItem extends Component<HTMLLIElement, HTMLUListElement> implements Draggable {
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

class ProjectList extends Component<HTMLElement, HTMLDivElement> implements DragTarget {
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


//drag and drop
interface Draggable {
    getDraggableElement(): HTMLElement;

    onDragStart(ev: DragEvent): void;

    onDragEnd(ev: DragEvent): void;
}

interface DragTarget {
    getDragTargetElement(): HTMLElement;

    onDragOver(ev: DragEvent): void;

    onDragLeave(ev: DragEvent): void;

    onDrop(ev: DragEvent): void;
}

abstract class Dragger {
    private constructor() {
    }

    public static configureDraggable(draggable: Draggable) {
        let element = draggable.getDraggableElement();
        element.draggable = true;

        element.addEventListener("dragstart", ev => draggable.onDragStart(ev));
        element.addEventListener("dragend", ev => draggable.onDragEnd(ev));
    }

    public static configureTarget(target: DragTarget) {
        let element = target.getDragTargetElement();

        element.addEventListener("dragover", ev => {
            element.classList.add("droppable");
            target.onDragOver(ev)
        });

        element.addEventListener("dragleave", ev => {
            element.classList.remove("droppable");
            target.onDragLeave(ev)
        });
        element.addEventListener("drop", ev => target.onDrop(ev));
    }
}

enum Status {
    ACTIVE = 'active',
    FINISHED = 'finished'
}

class Project {
    id: string;
    title: string;
    description: string;
    peopleCount: number;
    status: Status;


    constructor(title: string, description: string, peopleCount: number) {
        this.id = Math.random().toString();
        this.status = Status.ACTIVE;

        this.title = title;
        this.description = description;
        this.peopleCount = peopleCount;
    }
}

type Listener<T> = (context: T) => void;

abstract class State<T> {
    private listeners: Listener<T>[];

    protected constructor() {
        this.listeners = []
    }

    protected notifyStateChange(context: T) {
        console.log(context);
        this.listeners.forEach(l => l(context));
    }

    public addListener(listener: Listener<T>) {
        this.listeners.push(listener);
    }
}

class ProjectState extends State<Project[]> {
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

let projectForm = new ProjectForm();
projectForm.attach();

let activeProjectsList = new ProjectList(Status.ACTIVE);
activeProjectsList.attach();

let finishedProjectsList = new ProjectList(Status.FINISHED);
finishedProjectsList.attach();



