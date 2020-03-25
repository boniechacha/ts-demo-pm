//project form
import {Component} from "./component";
import {ProjectState} from "../state/project-state";
import {Project} from "../domain/project";
import {validateNumber, validateString} from "../util/validation";

export class ProjectForm extends Component<HTMLFormElement, HTMLDivElement> {

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
