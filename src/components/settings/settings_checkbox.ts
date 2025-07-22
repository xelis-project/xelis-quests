export class SettingsCheckbox {
    element: HTMLDivElement;
    text: HTMLDivElement;
    input: HTMLInputElement;

    constructor() {
        this.element = document.createElement(`div`);
        this.element.classList.add(`settings-checkbox`);

        this.text = document.createElement(`div`);
        this.element.appendChild(this.text);

        const container = document.createElement(`div`);
        container.classList.add(`settings-checkbox-container`);

        this.input = document.createElement(`input`);
        this.input.type = `checkbox`;
        container.appendChild(this.input);

        const checkmark = document.createElement(`div`);
        checkmark.classList.add(`settings-checkbox-checkmark`);
        container.appendChild(checkmark);

        this.element.appendChild(container);
    }
}
