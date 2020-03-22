export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
