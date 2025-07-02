import { animate, eases } from "animejs";
import type { App } from "../../app";
import { Component } from "../../component";

import './mouse_effects.css';

export class MouseEffects extends Component<any> {
    mouse_click_ellipsis: HTMLDivElement;

    constructor(app: App) {
        super(app, app.root, `mouse-effects`);

        this.mouse_click_ellipsis = document.createElement(`div`);
        this.mouse_click_ellipsis.classList.add(`mouse-effects-click`);
        this.element.appendChild(this.mouse_click_ellipsis);
    }

    show(): void {
        super.show();

        this.app.root.addEventListener(`click`, (e: MouseEvent) => {
            this.mouse_click_ellipsis.style.translate = `calc(${e.clientX}px - 2.5rem) calc(${e.clientY}px - 2.5rem)`;
            animate(this.mouse_click_ellipsis, {
                opacity: [0, 0.5, 0],
                scale: [0, 1.5],
                duration: 500,
                ease: eases.linear(),
            });

            const click_audio = new Audio(`/audio/sound_effects/mouse_click_1.mp3`);
            click_audio.volume = 1;
            this.app.audio.play_audio(`sound_effect`, click_audio);
        });
    }
}