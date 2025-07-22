export class SettingsNumber {
    element: HTMLDivElement;
    text: HTMLDivElement;
    input: HTMLInputElement;

    constructor() {
        this.element = document.createElement(`div`);
        this.element.classList.add(`settings-number`);

        this.text = document.createElement(`div`);
        this.element.appendChild(this.text);

        const container = document.createElement(`div`);

        this.input = document.createElement(`input`);
        this.input.type = `number`;
        container.appendChild(this.input);

        this.element.appendChild(container);
    }
}