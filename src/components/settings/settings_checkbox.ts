export class SettingsCheckbox {
    element: HTMLDivElement;
    text_element: HTMLDivElement;
    input_element: HTMLInputElement;

    constructor() {
        this.element = document.createElement(`div`);
        this.element.classList.add(`settings-checkbox`);

        this.text_element = document.createElement(`div`);
        this.element.appendChild(this.text_element);

        const container = document.createElement(`div`);
        container.classList.add(`settings-checkbox-container`);

        this.input_element = document.createElement(`input`);
        this.input_element.type = `checkbox`;
        container.appendChild(this.input_element);

        const checkmark = document.createElement(`div`);
        checkmark.classList.add(`settings-checkbox-checkmark`);
        container.appendChild(checkmark);

        this.element.appendChild(container);
    }
}
