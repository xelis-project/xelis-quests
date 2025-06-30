import { animate, eases } from "animejs";
import type { App } from "../../app";
import { Component } from "../../component";

import './settings.css';

export class Settings extends Component<any> {
    btn_close: HTMLButtonElement;

    master_volume_slider: SettingsSlider;
    music_volume_slider: SettingsSlider;
    voice_volume_slider: SettingsSlider;
    sound_effect_volume_slider: SettingsSlider;

    constructor(app: App) {
        super(app, app.root, `settings`);

        this.btn_close = document.createElement(`button`);
        this.btn_close.classList.add(`settings-btn-close`);
        this.btn_close.innerHTML = `GO BACK`;
        this.btn_close.addEventListener(`click`, () => {
            this.anime_hide();
        });
        this.element.appendChild(this.btn_close);

        this.master_volume_slider = new SettingsSlider();
        this.master_volume_slider.title.innerHTML = `Master Volume`;
        this.master_volume_slider.input.value = `${app.audio.master_volume * 100}`;
        this.master_volume_slider.input.addEventListener(`input`, (e) => {
            const input = e.target as HTMLInputElement;
            this.app.audio.master_volume = parseInt(input.value) / 100;
            this.app.audio.save_settings();
        });
        this.element.appendChild(this.master_volume_slider.element);

        this.music_volume_slider = new SettingsSlider();
        this.music_volume_slider.title.innerHTML = `Music Volume`;
        this.music_volume_slider.input.value = `${app.audio.music_volume * 100}`;
        this.music_volume_slider.input.addEventListener(`input`, (e) => {
            const input = e.target as HTMLInputElement;
            app.audio.music_volume = parseInt(input.value) / 100;
            this.app.audio.save_settings();
        });
        this.element.appendChild(this.music_volume_slider.element);

        this.voice_volume_slider = new SettingsSlider();
        this.voice_volume_slider.title.innerHTML = `Voice Volume`;
        this.voice_volume_slider.input.value = `${app.audio.voice_volume * 100}`;
        this.voice_volume_slider.input.addEventListener(`input`, (e) => {
            const input = e.target as HTMLInputElement;
            app.audio.voice_volume = parseInt(input.value) / 100;
            this.app.audio.save_settings();
        });
        this.element.appendChild(this.voice_volume_slider.element);

        this.sound_effect_volume_slider = new SettingsSlider();
        this.sound_effect_volume_slider.title.innerHTML = `Sound Effect Volume`;
        this.sound_effect_volume_slider.input.value = `${app.audio.sound_effect_volume * 100}`;
        this.sound_effect_volume_slider.input.addEventListener(`input`, (e) => {
            const input = e.target as HTMLInputElement;
            app.audio.sound_effect_volume = parseInt(input.value) / 100;
            this.app.audio.save_settings();
        });
        this.element.appendChild(this.sound_effect_volume_slider.element);
    }

    anime_show() {
        super.show();

        const audio_click = new Audio(`/audio/sound_effects/page_transition_4.mp3`);
        audio_click.volume = 0.5;
        this.app.audio.play_audio(`sound_effect`, audio_click);

        animate(this.element, {
            opacity: [0, 1],
            duration: 350,
            ease: eases.linear()
        });
    }

    anime_hide() {
        animate(this.element, {
            opacity: [1, 0],
            duration: 350,
            onComplete: () => {
                super.hide();
            }
        });
    }
}

class SettingsSlider {
    element: HTMLDivElement;
    title: HTMLDivElement;
    input: HTMLInputElement;

    constructor() {
        this.element = document.createElement(`div`);
        this.element.classList.add(`settings-slider`);

        this.title = document.createElement(`div`);
        this.element.appendChild(this.title);

        this.input = document.createElement(`input`);
        this.input.type = `range`;
        this.input.min = `0`;
        this.input.max = `100`;
        this.input.value = `100`;
        this.element.appendChild(this.input);
    }
}