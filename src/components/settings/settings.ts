import { animate, eases } from "animejs";
import type { App } from "../../app";
import { AppComponent } from "../../component/app_component";
import './settings.css';


export class Settings extends AppComponent {
    title_element: HTMLDivElement;
    btn_close: HTMLButtonElement;

    constructor(app: App) {
        super(app, `settings`);

        this.title_element = document.createElement(`div`);
        this.title_element.classList.add(`settings-title`);
        this.title_element.innerHTML = `SETTINGS`;
        this.element.appendChild(this.title_element);

        this.btn_close = document.createElement(`button`);
        this.btn_close.classList.add(`settings-btn-close`);
        this.btn_close.innerHTML = `CLOSE`;
        this.btn_close.addEventListener(`click`, () => {
            this.anime_hide();
        });
        this.element.appendChild(this.btn_close);
    }

    anime_show() {
        super.show();

        animate(this.element, {
            opacity: [0, 1],
            duration: 350,
            ease: eases.linear()
        });
    }

    anime_hide() {
        animate(this.element, {
            opacity: [1, 0],
            duration: 350,
            onComplete: () => {
                super.hide();
            }
        })
    }
}