import { animate, eases, stagger, svg, utils } from "animejs";
import { Component } from "../../component/component";
import { circuit } from '../../assets/circuit';

import './circuit.css';

export class Circuit extends Component {
    constructor(parent: HTMLElement) {
        super(parent, `top-circuit`);
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