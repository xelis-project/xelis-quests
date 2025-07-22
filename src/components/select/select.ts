import { EventEmitter } from "../../utils/event_emitter";

interface SelectEventMap {
    change: string;
}

import './select.css';

export class Select extends EventEmitter<SelectEventMap> {
    element: HTMLElement;
    btn_element: HTMLElement;
    list_element: HTMLElement;

    constructor() {
        super();

        this.element = document.createElement(`div`);
        this.element.classList.add(`select`);

        this.btn_element = document.createElement(`button`);
        this.btn_element.addEventListener(`click`, () => {
            this.toggle();
        });
        this.element.appendChild(this.btn_element);

        this.list_element = document.createElement(`div`);
        this.list_element.classList.add(`select-list`);
        this.element.appendChild(this.list_element);

        document.addEventListener(`click`, (e) => {
            const target = e.target as HTMLElement;
            if (!this.element.contains(target)) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.list_element.classList.contains(`open`)) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.list_element.classList.add(`open`);
    }

    close() {
        this.list_element.classList.remove(`open`);
    }

    set_value(value: string) {
        this.btn_element.innerHTML = value;
    }

    add_item(key: string, value: string) {
        const item = document.createElement(`div`);
        item.innerHTML = value;
        item.addEventListener(`click`, () => {
            this.set_value(value);
            this.emit(`change`, key);
            this.close();
        });
        this.list_element.appendChild(item);
    }

    clear() {
        this.list_element.replaceChildren();
    }
}