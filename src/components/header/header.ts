import { animate, eases } from "animejs";
import type { App } from "../../app";
import { xelis_logo } from "../../assets/xelis";
import { Component } from "../../component";
import * as icons from "../../assets/icons";

import './header.css';

export class Header extends Component<any> {
    xelis_logo_element: HTMLDivElement;

    btn_intro_element: HTMLButtonElement;
    btn_quests_element: HTMLButtonElement;

    btn_settings_element: HTMLButtonElement;

    constructor(app: App) {
        super(app, app.root, `header`);

        const content_element = document.createElement(`div`);
        content_element.classList.add(`header-content`);
        this.element.appendChild(content_element);

        this.xelis_logo_element = document.createElement(`div`);
        this.xelis_logo_element.classList.add(`header-logo`);
        this.xelis_logo_element.innerHTML = xelis_logo();
        content_element.appendChild(this.xelis_logo_element);

        const menu_element = document.createElement(`div`);
        menu_element.classList.add(`header-menu`);
        content_element.appendChild(menu_element);

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
            this.app.settings.appear();
        });
        this.btn_settings_element.addEventListener(`mouseenter`, () => {
            const audio_hover = new Audio(`/audio/sound_effects/btn_hover_1.mp3`);
            audio_hover.volume = 0.1;
            this.app.audio.play_audio(`sound_effect`, audio_hover);
        });
        content_element.appendChild(this.btn_settings_element);
    }

    highlight_menu_btn() {
        const url = new URL(window.location.href);

        this.btn_intro_element.classList.remove(`active`);
        this.btn_quests_element.classList.remove(`active`);

        switch (url.pathname) {
            case "/quests":
                this.btn_quests_element.classList.add(`active`);
                break;
            case "/quest":
                break;
            case "/":
            default:
                this.btn_intro_element.classList.add(`active`);
                break;
        }
    }

    on_app_page_load = () => {
        this.highlight_menu_btn();
    }

    load() {
        super.load();
        this.app.addListener("page_load", this.on_app_page_load);
    }

    unload() {
        super.unload();
        this.app.removeListener("page_load", this.on_app_page_load);
    }

    appear() {
        this.load();
        animate(this.element, {
            translateY: [`-100%`, 0],
            duration: 750,
            delay: 750,
            ease: eases.inOutBack(3)
        });
    }

    leave() {
        animate(this.element, {
            translateY: [0, `-100%`],
            duration: 500,
            onComplete: () => {
                this.unload();
            }
        });
    }
}