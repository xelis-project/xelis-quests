import { animate, eases } from "animejs";
import type { App } from "../../app";
import { Component } from "../../component";

import './settings.css';

export class Settings extends Component<any> {
    btn_close: HTMLButtonElement;

    typewriter_audio_enabled: SettingsCheckbox;
    dialogue_speed: SettingsNumber;
    master_volume_slider: SettingsSlider;
    music_volume_slider: SettingsSlider;
    voice_volume_slider: SettingsSlider;
    sound_effect_volume_slider: SettingsSlider;

    constructor(app: App) {
        super(app, app.root, `settings`);

        this.load_settings();

        const header_element = document.createElement(`div`);
        header_element.classList.add(`settings-header`);
        this.element.appendChild(header_element);

        const title_element = document.createElement(`div`);
        title_element.innerHTML = `SETTINGS`;
        title_element.classList.add(`settings-title`);
        header_element.appendChild(title_element);

        this.btn_close = document.createElement(`button`);
        this.btn_close.classList.add(`settings-btn-close`);
        this.btn_close.innerHTML = `GO BACK`;
        this.btn_close.addEventListener(`click`, () => {
            this.leave();
        });
        header_element.appendChild(this.btn_close);

        const content_element = document.createElement(`div`);
        content_element.classList.add(`settings-content`);
        this.element.appendChild(content_element);

        this.dialogue_speed = new SettingsNumber();
        this.dialogue_speed.text.innerHTML = `Dialogue speed`;
        this.dialogue_speed.input.min = `0`;
        this.dialogue_speed.input.max = `100`;
        content_element.appendChild(this.dialogue_speed.element);

        this.typewriter_audio_enabled = new SettingsCheckbox();
        this.typewriter_audio_enabled.text.innerHTML = `Typewriter audio enabled`;
        this.typewriter_audio_enabled.input.checked = this.app.audio.typewriter_audio_enabled;
        this.typewriter_audio_enabled.input.addEventListener(`input`, (e) => {
            const input = e.target as HTMLInputElement;
            this.app.audio.typewriter_audio_enabled = input.checked;
            this.save_settings();
        });
        content_element.appendChild(this.typewriter_audio_enabled.element);

        this.master_volume_slider = new SettingsSlider();
        this.master_volume_slider.title.innerHTML = `Master Volume`;
        this.master_volume_slider.input.value = `${this.app.audio.master_volume * 100}`;
        this.master_volume_slider.input.addEventListener(`input`, (e) => {
            const input = e.target as HTMLInputElement;
            this.app.audio.master_volume = parseInt(input.value) / 100;
            this.save_settings();
        });
        content_element.appendChild(this.master_volume_slider.element);

        this.music_volume_slider = new SettingsSlider();
        this.music_volume_slider.title.innerHTML = `Music Volume`;
        this.music_volume_slider.input.value = `${this.app.audio.music_volume * 100}`;
        this.music_volume_slider.input.addEventListener(`input`, (e) => {
            const input = e.target as HTMLInputElement;
            this.app.audio.music_volume = parseInt(input.value) / 100;
            this.app.audio.apply_background_music_volume();
            this.save_settings();
        });
        content_element.appendChild(this.music_volume_slider.element);

        this.voice_volume_slider = new SettingsSlider();
        this.voice_volume_slider.title.innerHTML = `Voice Volume`;
        this.voice_volume_slider.input.value = `${this.app.audio.voice_volume * 100}`;
        this.voice_volume_slider.input.addEventListener(`input`, (e) => {
            const input = e.target as HTMLInputElement;
            this.app.audio.voice_volume = parseInt(input.value) / 100;
            this.save_settings();
        });
        content_element.appendChild(this.voice_volume_slider.element);

        this.sound_effect_volume_slider = new SettingsSlider();
        this.sound_effect_volume_slider.title.innerHTML = `Sound Effect Volume`;
        this.sound_effect_volume_slider.input.value = `${this.app.audio.sound_effect_volume * 100}`;
        this.sound_effect_volume_slider.input.addEventListener(`input`, (e) => {
            const input = e.target as HTMLInputElement;
            this.app.audio.sound_effect_volume = parseInt(input.value) / 100;
            this.save_settings();
        });
        content_element.appendChild(this.sound_effect_volume_slider.element);
    }

    appear() {
        this.load();

        const audio_click = new Audio(`/audio/sound_effects/page_transition_4.mp3`);
        audio_click.volume = 0.5;
        this.app.audio.play_audio(`sound_effect`, audio_click);

        animate(this.element, {
            opacity: [0, 1],
            duration: 350,
            ease: eases.linear()
        });
    }

    leave() {
        animate(this.element, {
            opacity: [1, 0],
            duration: 350,
            onComplete: () => {
                this.unload();
            }
        });
    }

    parse_volume(value: any, default_value: number) {
        try {
            if (value) {
                const volume = parseFloat(value);
                if (volume >= 0 && volume <= 1) {
                    return volume as number;
                }
            }
        } catch { }

        return default_value;
    }

    parse_bool(value: any, default_value: boolean) {
        if (value === true || value === false) {
            return value as boolean;
        }

        return default_value;
    }

    load_settings() {
        let settings_json = window.localStorage.getItem(`settings`);
        if (settings_json) {
            const settings = JSON.parse(settings_json);
            this.app.audio.master_volume = this.parse_volume(settings.master_volume, 1);
            this.app.audio.music_volume = this.parse_volume(settings.music_volume, 1);
            this.app.audio.voice_volume = this.parse_volume(settings.voice_volume, 1);
            this.app.audio.sound_effect_volume = this.parse_volume(settings.sound_effect_volume, 1);
            this.app.audio.typewriter_audio_enabled = this.parse_bool(settings.typewriter_audio_enabled, true);
        }
    }

    save_settings() {
        const settings = {
            master_volume: this.app.audio.master_volume,
            voice_volume: this.app.audio.voice_volume,
            sound_effect_volume: this.app.audio.sound_effect_volume,
            music_volume: this.app.audio.music_volume,
            typewriter_audio_enabled: this.app.audio.typewriter_audio_enabled
        };

        window.localStorage.setItem(`settings`, JSON.stringify(settings));
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

class SettingsCheckbox {
    element: HTMLDivElement;
    text: HTMLDivElement;
    input: HTMLInputElement;

    constructor() {
        this.element = document.createElement(`div`);
        this.element.classList.add(`settings-checkbox`);

        this.text = document.createElement(`div`);
        this.element.appendChild(this.text);

        const container = document.createElement(`div`);
        container.classList.add(`settings-checkbox-container`);

        this.input = document.createElement(`input`);
        this.input.type = `checkbox`;
        container.appendChild(this.input);

        const checkmark = document.createElement(`div`);
        checkmark.classList.add(`settings-checkbox-checkmark`);
        container.appendChild(checkmark);

        this.element.appendChild(container);
    }
}

class SettingsNumber {
    element: HTMLDivElement;
    text: HTMLDivElement;
    input: HTMLInputElement;

    constructor() {
        this.element = document.createElement(`div`);
        this.element.classList.add(`settings-number`);

        this.text = document.createElement(`div`);
        this.element.appendChild(this.text);

        const container = document.createElement(`div`);
        container.classList.add(`settings-asd`);

        this.input = document.createElement(`input`);
        this.input.type = `number`;
        container.appendChild(this.input);

        this.element.appendChild(container);
    }
}