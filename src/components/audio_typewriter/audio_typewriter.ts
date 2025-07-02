import type { App } from "../../app";
import { Typewriter } from "../../utils/typewriter";

interface AudioTypewriterProps {
    app: App;
    element: HTMLElement;
    speed: number;
}

export class AudioTypewriter extends Typewriter {
    app: App;
    audio_typings: string[];

    constructor(props: AudioTypewriterProps) {
        super(props);

        this.app = props.app;
        this.audio_typings = [
            `/audio/sound_effects/typewriter_1.mp3`,
            `/audio/sound_effects/typewriter_2.mp3`,
            `/audio/sound_effects/typewriter_3.mp3`
        ];

        let sound_delta = 0;
        const timeout = 1000 / this.speed;
        this.addListener(`char`, () => {
            sound_delta += timeout;

            if (sound_delta / timeout >= 1.5) {
                sound_delta = 0;

                let audio_typing: HTMLAudioElement;
                const audio_index = Math.floor(Math.random() * this.audio_typings.length);
                audio_typing = new Audio(this.audio_typings[audio_index]);
                audio_typing.volume = this.app.audio.get_volume(`sound_effect`);
                
                const playback_rate = Math.random() * (1.25 - 0.75) + 0.75;
                audio_typing.playbackRate = playback_rate;
                audio_typing.play();
            }
        })
    }
}