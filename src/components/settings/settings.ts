import { animate, eases } from "animejs";
import type { App } from "../../app";
import { Component } from "../../component";
import { supported_languages, type Lang } from "../../localization";
import { SettingsCheckbox } from "./settings_checkbox";
import { SettingsSlider } from "./settings_slider";
import { SettingsNumber } from "./settings_number";

import './settings.css';
import { SettingsSelect } from "./settings_select";

export class Settings extends Component<any> {
    btn_close: HTMLButtonElement;

    dialogue_typing_sound_effect_enabled: SettingsCheckbox;
    dialogue_speed: SettingsNumber;
    master_volume_slider: SettingsSlider;
    music_volume_slider: SettingsSlider;
    voice_volume_slider: SettingsSlider;
    sound_effect_volume_slider: SettingsSlider;

    constructor(app: App) {
        super(app, app.root, `settings`);

        const header_element = document.createElement(`div`);
        header_element.classList.add(`settings-header`);
        this.element.appendChild(header_element);

        const title_element = document.createElement(`div`);
        this.app.localization.set_element_text(title_element, "SETTINGS");
        title_element.classList.add(`settings-title`);
        header_element.appendChild(title_element);

        this.btn_close = document.createElement(`button`);
        this.btn_close.classList.add(`settings-btn-close`);
        this.app.localization.set_element_text(this.btn_close, "GO BACK");
        this.btn_close.addEventListener(`click`, () => {
            this.leave();
        });
        header_element.appendChild(this.btn_close);

        const content_element = document.createElement(`div`);
        content_element.classList.add(`settings-content`, `scrollbar-1`);
        this.element.appendChild(content_element);

        const settings_select = new SettingsSelect();
        this.app.localization.set_element_text(settings_select.title_element, `Language`);
        supported_languages.forEach((lang) => {
            settings_select.select.add_item(lang.key, lang.title);
            if (this.app.localization.lang === lang.key) {
                settings_select.select.set_value(lang.title);
            }
        });
        settings_select.select.addListener(`change`, (key) => {
            this.app.localization.set_lang(key as Lang);
            this.app.localization.save_lang();
            this.app.localization.update_elements();
        });
        content_element.appendChild(settings_select.element);

        this.dialogue_speed = new SettingsNumber();
        this.app.localization.set_element_text(this.dialogue_speed.text_element, `Dialogue speed`);
        this.dialogue_speed.input_element.min = `10`;
        this.dialogue_speed.input_element.max = `50`;
        this.dialogue_speed.input_element.addEventListener(`input`, (e) => {
            const input = e.target as HTMLInputElement;
            this.app.quest_page.dialogue.text_typewriter.speed = input.valueAsNumber;
            this.app.quest_page.question.text_typewriter.speed = input.valueAsNumber;;
            this.save_settings();
        });

        content_element.appendChild(this.dialogue_speed.element);

        this.dialogue_typing_sound_effect_enabled = new SettingsCheckbox();
        this.app.localization.set_element_text(this.dialogue_typing_sound_effect_enabled.text_element, `Dialogue Typing Sound Effect`);

        this.dialogue_typing_sound_effect_enabled.input_element.addEventListener(`input`, (e) => {
            const input = e.target as HTMLInputElement;
            this.app.audio.dialogue_typing_sound_effect_enabled = input.checked;
            this.save_settings();
        });
        content_element.appendChild(this.dialogue_typing_sound_effect_enabled.element);

        this.master_volume_slider = new SettingsSlider();
        this.app.localization.set_element_text(this.master_volume_slider.title_element, `Master Volume`);

        this.master_volume_slider.input_element.addEventListener(`input`, (e) => {
            const input = e.target as HTMLInputElement;
            this.app.audio.master_volume = parseInt(input.value) / 100;
            this.save_settings();
        });
        content_element.appendChild(this.master_volume_slider.element);

        this.music_volume_slider = new SettingsSlider();
        this.app.localization.set_element_text(this.music_volume_slider.title_element, `Music Volume`);

        this.music_volume_slider.input_element.addEventListener(`input`, (e) => {
            const input = e.target as HTMLInputElement;
            this.app.audio.music_volume = parseInt(input.value) / 100;
            this.app.audio.apply_background_music_volume();
            this.save_settings();
        });
        content_element.appendChild(this.music_volume_slider.element);

        this.voice_volume_slider = new SettingsSlider();
        this.app.localization.set_element_text(this.voice_volume_slider.title_element, `Voice Volume`);

        this.voice_volume_slider.input_element.addEventListener(`input`, (e) => {
            const input = e.target as HTMLInputElement;
            this.app.audio.voice_volume = parseInt(input.value) / 100;
            this.save_settings();
        });
        content_element.appendChild(this.voice_volume_slider.element);

        this.sound_effect_volume_slider = new SettingsSlider();
        this.app.localization.set_element_text(this.sound_effect_volume_slider.title_element, `Sound Effect Volume`);

        this.sound_effect_volume_slider.input_element.addEventListener(`input`, (e) => {
            const input = e.target as HTMLInputElement;
            this.app.audio.sound_effect_volume = parseInt(input.value) / 100;
            this.save_settings();
        });
        content_element.appendChild(this.sound_effect_volume_slider.element);
    }

    set_values() {
        this.dialogue_speed.input_element.value = `${this.app.quest_page.dialogue.text_typewriter.speed}`;
        this.dialogue_typing_sound_effect_enabled.input_element.checked = this.app.audio.dialogue_typing_sound_effect_enabled;
        this.master_volume_slider.set_value(this.app.audio.master_volume * 100);
        this.music_volume_slider.set_value(this.app.audio.music_volume * 100);
        this.voice_volume_slider.set_value(this.app.audio.voice_volume * 100);
        this.sound_effect_volume_slider.set_value(this.app.audio.sound_effect_volume * 100);
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

    parse_number(value: any, default_value: number) {
        try {
            if (value) {
                const nbr = parseFloat(value);
                return nbr;
            }
        } catch { }

        return default_value;
    }

    parse_volume(value: any, default_value: number) {
        try {
            if (value) {
                const volume = parseFloat(value);
                if (volume >= 0 && volume <= 1) {
                    return volume;
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
            this.app.audio.dialogue_typing_sound_effect_enabled = this.parse_bool(settings.dialogue_typing_sound_effect_enabled, true);

            this.app.quest_page.dialogue.text_typewriter.speed = this.parse_number(settings.dialogue_speed, 25);
            this.app.quest_page.question.text_typewriter.speed = this.parse_number(settings.dialogue_speed, 25);
        }

        this.set_values();
    }

    save_settings() {
        const settings = {
            master_volume: this.app.audio.master_volume,
            voice_volume: this.app.audio.voice_volume,
            sound_effect_volume: this.app.audio.sound_effect_volume,
            music_volume: this.app.audio.music_volume,
            dialogue_typing_sound_effect_enabled: this.app.audio.dialogue_typing_sound_effect_enabled,
            dialogue_speed: this.app.quest_page.dialogue.text_typewriter.speed
        };

        window.localStorage.setItem(`settings`, JSON.stringify(settings));
    }
}
