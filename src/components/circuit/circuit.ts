import { animate, eases, stagger, svg, utils } from "animejs";
import { Component } from "../../component";
import { circuit } from '../../assets/circuit';

import './circuit.css';
import type { App } from "../../app";

export class Circuit extends Component {
    constructor(app: App, parent: HTMLElement) {
        super(app, parent, `top-circuit`);
        this.element.innerHTML = circuit();
    }

    show(): void {
        super.show();

        const paths = this.element.children[0].children;
        for (let p of paths) {
            p.setAttribute(`stroke-width`, `.${utils.random(.5, 2)}rem`);
        }

        animate(svg.createDrawable(paths), {
            draw: ['0 0', '0 1'],
            opacity: [1, 0],
            ease: eases.linear(),
            duration: 2000,
            delay: stagger(200),
            loop: true
        });
    }
}