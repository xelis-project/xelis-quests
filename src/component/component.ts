export class Component {
    parent: HTMLElement;
    element: HTMLElement;
    visible: boolean;

    constructor(parent: HTMLElement, classname: string) {
        this.parent = parent;
        this.element = document.createElement(`div`);
        this.element.classList.add(classname);
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