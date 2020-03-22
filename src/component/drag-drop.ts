//drag and drop
export interface Draggable {
    getDraggableElement(): HTMLElement;

    onDragStart(ev: DragEvent): void;

    onDragEnd(ev: DragEvent): void;
}

export interface DragTarget {
    getDragTargetElement(): HTMLElement;

    onDragOver(ev: DragEvent): void;

    onDragLeave(ev: DragEvent): void;

    onDrop(ev: DragEvent): void;
}

export abstract class Dragger {
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