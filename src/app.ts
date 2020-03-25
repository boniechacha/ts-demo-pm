import {ProjectForm} from "./component/project-form";
import {ProjectList} from "./component/project-list";
import {Status} from "./domain/project";

let projectForm = new ProjectForm();
projectForm.attach();

let activeProjectsList = new ProjectList(Status.ACTIVE);
activeProjectsList.attach();

let finishedProjectsList = new ProjectList(Status.FINISHED);
finishedProjectsList.attach();

