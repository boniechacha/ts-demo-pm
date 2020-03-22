import {Listener} from "../util/listener.js";

export abstract class State<T> {
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