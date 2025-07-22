export class SettingsNumber {
    element: HTMLDivElement;
    text_element: HTMLDivElement;
    input_element: HTMLInputElement;

    constructor() {
        this.element = document.createElement(`div`);
        this.element.classList.add(`settings-number`);

        this.text_element = document.createElement(`div`);
        this.element.appendChild(this.text_element);

        const container = document.createElement(`div`);

        this.input_element = document.createElement(`input`);
        this.input_element.type = `number`;
        container.appendChild(this.input_element);

        this.element.appendChild(container);
    }
}