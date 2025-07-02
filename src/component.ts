import type { App } from "./app";
import { EventEmitter, type EventEmitterMap } from "./utils/event_emitter";

export class Component<T extends EventEmitterMap> extends EventEmitter<T> {
    app: App;
    parent: HTMLElement;
    element: HTMLElement;
    visible: boolean;

    constructor(app: App, parent: HTMLElement, classname?: string) {
        super();
            
        this.app = app;
        this.parent = parent;
        this.element = document.createElement(`div`);
        if (classname) this.element.classList.add(classname);
        this.visible = false;
    }

    show() {
        if (this.visible) return;
        this.visible = true;
        this.parent.appendChild(this.element);
    }

    hide() {
        if (!this.visible) return;
        this.visible = false;
        this.parent.removeChild(this.element);
    }
}