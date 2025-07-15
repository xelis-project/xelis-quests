type AudioType = `voice` | `sound_effect` | `music`;

export class AppAudio {
    master_volume: number;
    voice_volume: number;
    sound_effect_volume: number;
    music_volume: number;

    background_music_init_volume: number;
    background_music_audio?: HTMLAudioElement;

    dialogue_audio_enabled: boolean;

    constructor() {
        this.master_volume = 1;
        this.voice_volume = 1;
        this.sound_effect_volume = 1;
        this.music_volume = 1;
        this.background_music_init_volume = 0;
        this.dialogue_audio_enabled = true;
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
}