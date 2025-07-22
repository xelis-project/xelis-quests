import { Select } from "../select/select";

export class SettingsSelect {
    element: HTMLDivElement;
    title_element: HTMLDivElement;
    select: Select;

    constructor() {
        this.element = document.createElement(`div`);
        this.element.classList.add(`settings-select`);

        this.title_element = document.createElement(`div`);
        this.element.appendChild(this.title_element);

        this.select = new Select();
        this.element.appendChild(this.select.element);
    }
}