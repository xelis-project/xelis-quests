import { animate } from "animejs";
import { App } from "../../../app";
import { Component } from "../../../component";

import './background.css';

export interface BackgroundProps {
    img: string;
}

export class Background extends Component<any> {
    background_element: HTMLDivElement;

    constructor(app: App, parent: HTMLElement) {
        super(app, parent, `quest-background`);

        this.background_element = document.createElement(`div`);
        this.background_element.classList.add(`quest-background-img`);
        this.element.appendChild(this.background_element);
    }

    appear(props: BackgroundProps) {
        this.load();
        this.background_element.style.backgroundImage = `url('${props.img}')`;

        animate(this.background_element, {
            opacity: [.5, 1],
            scale: [1.2, 1],
            duration: 500
        });
    }
}