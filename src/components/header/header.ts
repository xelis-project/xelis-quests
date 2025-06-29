import { animate, eases } from "animejs";
import type { App } from "../../app";
import { xelis_logo } from "../../assets/xelis";
import { Component } from "../../component";
import * as icons from "../../assets/icons";

import './header.css';

export class Header extends Component {
    xelis_logo_element: HTMLDivElement;

    btn_intro_element: HTMLButtonElement;
    btn_quests_element: HTMLButtonElement;

    btn_settings_element: HTMLButtonElement;

    constructor(app: App) {
        super(app, app.root, `header`);

        this.xelis_logo_element = document.createElement(`div`);
        this.xelis_logo_element.classList.add(`header-logo`);
        this.xelis_logo_element.innerHTML = xelis_logo();
        this.element.appendChild(this.xelis_logo_element);

        const menu_element = document.createElement(`div`);
        menu_element.classList.add(`header-menu`);
        this.element.appendChild(menu_element);

        this.btn_intro_element = document.createElement(`button`);
        this.btn_intro_element.innerHTML = `INTRO`;
        this.btn_intro_element.addEventListener(`click`, () => {
            this.app.go_to(`/`);
        });
        this.btn_intro_element.addEventListener(`mouseenter`, () => {
            const audio_hover = new Audio(`/audio/sound_effects/btn_hover_3.mp3`);
            audio_hover.volume = 0.1;
            this.app.audio.play_audio(`sound_effect`, audio_hover);
        });
        menu_element.appendChild(this.btn_intro_element);

        this.btn_quests_element = document.createElement(`button`);
        this.btn_quests_element.innerHTML = `QUESTS`;
        this.btn_quests_element.addEventListener(`click`, () => {
            this.app.go_to(`/quests`);
        });
        this.btn_quests_element.addEventListener(`mouseenter`, () => {
            const audio_hover = new Audio(`/audio/sound_effects/btn_hover_3.mp3`);
            audio_hover.volume = 0.1;
            this.app.audio.play_audio(`sound_effect`, audio_hover);
        });
        menu_element.appendChild(this.btn_quests_element);

        this.btn_settings_element = document.createElement(`button`);
        this.btn_settings_element.innerHTML = icons.settings()
        this.btn_settings_element.classList.add(`header-btn-settings`);
        this.btn_settings_element.addEventListener(`click`, () => {
            this.app.settings.anime_show();
        });
        this.btn_settings_element.addEventListener(`mouseenter`, () => {
            const audio_hover = new Audio(`/audio/sound_effects/btn_hover_1.mp3`);
            audio_hover.volume = 0.1;
            this.app.audio.play_audio(`sound_effect`, audio_hover);
        });
        this.element.appendChild(this.btn_settings_element);
    }

    anime_show() {
        super.show();

        animate(this.element, {
            translateY: [`-100%`, 0],
            duration: 750,
            delay: 750,
            ease: eases.inOutBack(3)
        });
    }
}