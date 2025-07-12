type AudioType = `voice` | `sound_effect` | `music`;

export class AppAudio {
    master_volume: number;
    voice_volume: number;
    sound_effect_volume: number;
    music_volume: number;

    background_music_init_volume: number;
    background_music_audio?: HTMLAudioElement;

    typewriter_audio_enabled: boolean;

    constructor() {
        this.master_volume = 1;
        this.voice_volume = 1;
        this.sound_effect_volume = 1;
        this.music_volume = 1;
        this.background_music_init_volume = 0;
        this.typewriter_audio_enabled = true;

        this.load_settings();
    }

    play_background_music(audio?: HTMLAudioElement) {
        if (this.background_music_audio) this.background_music_audio.pause();

        if (audio) {
            this.background_music_audio = audio;
            this.background_music_init_volume = audio.volume;
            audio.volume = audio.volume * this.get_volume(`music`);
            audio.loop = true;
            audio.play();
        } else {
            this.background_music_audio = undefined;
        }
    }

    apply_background_music_volume() {
        if (this.background_music_audio) {
            this.background_music_audio.volume = this.background_music_init_volume * this.get_volume(`music`);
        }
    }

    play_audio(type: AudioType, audio: HTMLAudioElement) {
        audio.volume = audio.volume * this.get_volume(type);
        audio.play();
    }

    get_volume(type: AudioType) {
        let type_volume = 1;
        switch (type) {
            case "music":
                type_volume = this.music_volume;
                break;
            case 'sound_effect':
                type_volume = this.sound_effect_volume;
                break;
            case 'voice':
                type_volume = this.voice_volume;
                break;
        }

        return this.master_volume * type_volume;
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
            return value;
        }

        return default_value;
    }

    load_settings() {
        let audio_settings_json = window.localStorage.getItem(`audio_settings`);
        if (audio_settings_json) {
            const audio_settings = JSON.parse(audio_settings_json);
            this.master_volume = this.parse_volume(audio_settings.master_volume, 1);
            this.music_volume = this.parse_volume(audio_settings.music_volume, 1);
            this.voice_volume = this.parse_volume(audio_settings.voice_volume, 1);
            this.sound_effect_volume = this.parse_volume(audio_settings.sound_effect_volume, 1);
            this.typewriter_audio_enabled = this.parse_bool(audio_settings.typewriter_audio_enabled, true);
        }
    }

    save_settings() {
        const audio_settings = {
            master_volume: this.master_volume,
            voice_volume: this.voice_volume,
            sound_effect_volume: this.sound_effect_volume,
            music_volume: this.music_volume,
            typewriter_audio_enabled: this.typewriter_audio_enabled
        };

        window.localStorage.setItem(`audio_settings`, JSON.stringify(audio_settings));
    }
}