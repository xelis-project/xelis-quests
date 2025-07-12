import { animate, eases } from "animejs";
import type { App } from "../../../app";
import { Component } from "../../../component";
import * as icons from '../../../assets/icons';

import './alert.css';

export interface AlertProps {
    text: string;
}

export class Alert extends Component<any> {
    constructor(app: App, parent: HTMLElement) {
        super(app, parent, `quest-alert`);
    }

    appear(props: AlertProps) {
        this.load();

        this.element.innerHTML = `${icons.alert()}${props.text}`;
        animate(this.element, {
            translateX: [`100%`, 0],
            duration: 250,
            ease: eases.inOut()
        });
    }

    leave() {
        animate(this.element, {
            translateX: [0, `100%`],
            duration: 250,
            ease: eases.inOutBack(5),
            onComplete: () => {
                this.unload();
            }
        });
    }

    on_click = () => {
        this.leave();
    }

    register_events() {
        this.parent.addEventListener(`click`, this.on_click);
    }

    unregister_events() {
        this.parent.removeEventListener(`click`, this.on_click);
    }

    load() {
        super.load();
        this.register_events();
    }

    unload() {
        super.unload();
        this.unregister_events();
    }
}