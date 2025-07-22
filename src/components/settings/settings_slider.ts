export class SettingsSlider {
    element: HTMLDivElement;
    title: HTMLDivElement;
    input: HTMLInputElement;

    constructor() {
        this.element = document.createElement(`div`);
        this.element.classList.add(`settings-slider`);

        this.title = document.createElement(`div`);
        this.element.appendChild(this.title);

        this.input = document.createElement(`input`);
        this.input.type = `range`;
        this.input.min = `0`;
        this.input.max = `100`;
        this.input.value = `100`;
        this.element.appendChild(this.input);
    }
}
