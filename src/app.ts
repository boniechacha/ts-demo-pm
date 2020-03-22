import {ProjectForm} from "./component/project-form.js";
import {ProjectList} from "./component/project-list.js";
import {Status} from "./domain/project.js";

let projectForm = new ProjectForm();
projectForm.attach();

let activeProjectsList = new ProjectList(Status.ACTIVE);
activeProjectsList.attach();

let finishedProjectsList = new ProjectList(Status.FINISHED);
finishedProjectsList.attach();
