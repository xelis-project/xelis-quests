export class SettingsSlider {
    element: HTMLDivElement;
    title_element: HTMLDivElement;
    input_element: HTMLInputElement;

    constructor() {
        this.element = document.createElement(`div`);
        this.element.classList.add(`settings-slider`);

        this.title_element = document.createElement(`div`);
        this.element.appendChild(this.title_element);

        this.input_element = document.createElement(`input`);
        this.input_element.type = `range`;
        this.input_element.min = `0`;
        this.input_element.max = `100`;
        this.input_element.value = `100`;
        this.element.appendChild(this.input_element);
    }
}
