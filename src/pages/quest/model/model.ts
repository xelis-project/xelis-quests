import { animate, eases } from "animejs";
import type { App } from "../../../app";
import { Component } from "../../../component";

import './model.css';

export interface ModelProps {
    img: string;
}

export class Model extends Component<any> {
    model_element: HTMLImageElement;

    constructor(app: App, parent: HTMLElement) {
        super(app, parent, `quest-model`);

        this.model_element = document.createElement(`img`);
        this.model_element.classList.add(`quest-model-img`);
        this.element.appendChild(this.model_element);
    }

    appear(props: ModelProps) {
        this.load();
        this.model_element.src = props.img;

        const appear_audio = new Audio(`/audio/sound_effects/appear_pop_1.mp3`);
        appear_audio.volume = 0.5;
        this.app.audio.play_audio(`sound_effect`, appear_audio);

        animate(this.model_element, {
            translateY: [`100%`, 0],
            duration: 500,
            ease: eases.inOutBack(2),
            onComplete: () => {
                animate(this.model_element, {
                    translateY: [0, `1%`],
                    duration: 2000,
                    ease: eases.linear(),
                    loop: true,
                    alternate: true
                });
            }
        });
    }
}