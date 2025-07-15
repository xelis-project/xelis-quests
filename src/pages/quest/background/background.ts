import { animate } from "animejs";
import { App } from "../../../app";
import { Component } from "../../../component";
import { CanvasShader } from "../../../utils/canvas_shader";
import shaders from '../shaders';

import './background.css';

export interface BackgroundProps {
    img?: string;
    shader?: string;
}

export class Background extends Component<any> {
    background_element: HTMLDivElement;
    canvas_shader: CanvasShader;

    constructor(app: App, parent: HTMLElement) {
        super(app, parent, `quest-background`);

        this.background_element = document.createElement(`div`);
        this.background_element.classList.add(`quest-background-img`);
        this.element.appendChild(this.background_element);

        this.canvas_shader = new CanvasShader();
        this.canvas_shader.canvas.classList.add(`quest-canvas`);
        this.element.appendChild(this.canvas_shader.canvas);
    }

    appear(props: BackgroundProps) {
        this.load();

        if (props.img) {
            this.background_element.style.backgroundImage = `url('${props.img}')`;

            animate(this.background_element, {
                opacity: [.5, 1],
                scale: [1.2, 1],
                duration: 500
            });
        } else if (props.shader) {
            const fragment_shader = shaders[props.shader];
            this.canvas_shader.set_shader(fragment_shader);
        }
    }
}