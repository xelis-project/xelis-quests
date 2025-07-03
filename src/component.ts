import type { App } from "./app";
import { EventEmitter, type EventEmitterMap } from "./utils/event_emitter";

export class Component<T extends EventEmitterMap> extends EventEmitter<T> {
    app: App;
    parent: HTMLElement;
    element: HTMLElement;
    loaded: boolean;

    constructor(app: App, parent: HTMLElement, classname?: string) {
        super();

        this.app = app;
        this.parent = parent;
        this.element = document.createElement(`div`);
        if (classname) this.element.classList.add(classname);
        this.loaded = false;
    }

    load() {
        if (this.loaded) return;
        this.loaded = true;
        this.parent.appendChild(this.element);
    }

    unload() {
        if (!this.loaded) return;
        this.loaded = false;
        this.parent.removeChild(this.element);
    }
}