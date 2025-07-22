export class SettingsSlider {
    element: HTMLDivElement;
    title_element: HTMLDivElement;
    input_element: HTMLInputElement;
    percentage_element: HTMLDivElement;

    constructor() {
        this.element = document.createElement(`div`);
        this.element.classList.add(`settings-slider`);

        const title_content = document.createElement(`div`);
        this.element.appendChild(title_content);

        this.title_element = document.createElement(`div`);
        title_content.appendChild(this.title_element);

        this.percentage_element = document.createElement(`div`);
        this.percentage_element.classList.add(`settings-slider-percentage`);
        title_content.appendChild(this.percentage_element);

        this.input_element = document.createElement(`input`);
        this.input_element.type = `range`;
        this.input_element.min = `0`;
        this.input_element.max = `100`;
        this.input_element.value = `100`;

        this.input_element.addEventListener(`input`, (e) => {
            this.percentage_element.innerHTML = `${this.input_element.value}%`;
        });

        this.element.appendChild(this.input_element);
    }

    set_value(value: number) {
        this.input_element.value = `${value}`;
        this.percentage_element.innerHTML = `${value}%`;
    }
}
