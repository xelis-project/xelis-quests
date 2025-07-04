import { animate, eases } from "animejs";
import type { App } from "../../app";
import { Component } from "../../component";

import './mouse_effects.css';

export class MouseEffects extends Component<any> {
    constructor(app: App) {
        super(app, app.root, `mouse-effects`);
    }

    on_click = (e: MouseEvent) => {
        const mouse_click_ellipsis = document.createElement(`div`);
        mouse_click_ellipsis.classList.add(`mouse-effects-click`);
        this.element.appendChild(mouse_click_ellipsis);

        mouse_click_ellipsis.style.translate = `calc(${e.clientX}px - 2.5rem) calc(${e.clientY}px - 2.5rem)`;
        animate(mouse_click_ellipsis, {
            opacity: [0, 0.5, 0],
            scale: [0, 1.5],
            duration: 500,
            ease: eases.linear(),
            onComplete: () => {
                mouse_click_ellipsis.remove();
            }
        });

        const click_audio = new Audio(`/audio/sound_effects/mouse_click_1.mp3`);
        click_audio.volume = 0.3;
        this.app.audio.play_audio(`sound_effect`, click_audio);
    }

    load() {
        super.load();
        this.app.root.addEventListener(`click`, this.on_click);
    }

    unload() {
        super.unload();
        this.app.root.removeEventListener(`click`, this.on_click);
    }
}