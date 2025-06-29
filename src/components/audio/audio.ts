type AudioType = `voice` | `sound_effect` | `music`;

export class Audio {
    master_volume: number;
    voice_volume: number;
    sound_effect_volume: number;
    music_volume: number;

    constructor() {
        this.master_volume = 1;
        this.voice_volume = 1;
        this.sound_effect_volume = 1;
        this.music_volume = 1;

        this.load_settings();
    }

    play_audio(type: AudioType, audio: HTMLAudioElement) {
        let volume = 1;
        switch (type) {
            case "music":
                volume = this.music_volume;
                break;
            case 'sound_effect':
                volume = this.music_volume;
                break;
            case 'voice':
                volume = this.music_volume;
                break;
        }

        audio.volume = audio.volume * volume;
        audio.play();
    }

    parse_volume(value: string | null, default_value: number) {
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

    load_settings() {
        let audio_settings_json = window.localStorage.getItem(`audio_settings`);
        if (audio_settings_json) {
            const audio_settings = JSON.parse(audio_settings_json);
            this.master_volume = this.parse_volume(audio_settings.master_volume, 1);
            this.music_volume = this.parse_volume(audio_settings.music_volume, 1);
            this.voice_volume = this.parse_volume(audio_settings.voice_volume, 1);
            this.sound_effect_volume = this.parse_volume(audio_settings.sound_effect_volume, 1);
        }
    }

    save_settings() {
        const audio_settings = {
            master_volume: this.master_volume,
            voice_volume: this.voice_volume,
            sound_effect_volume: this.sound_effect_volume,
            music_volume: this.music_volume
        };

        window.localStorage.setItem(`audio_settings`, JSON.stringify(audio_settings));
    }
}