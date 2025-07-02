import { EventEmitter } from "./event_emitter";

interface TypeWriterProps {
    element: HTMLElement;
    speed: number;
}

type TypewriterEventMap = {
    start: undefined;
    finish: undefined;
    stop: undefined;
    char: string;
}

export class Typewriter extends EventEmitter<TypewriterEventMap> {
    element: HTMLElement;
    char_timeout_id?: number;
    index: number;
    speed: number;
    text: string;
    active: boolean;
    audio_typing: string[];

    constructor(props: TypeWriterProps) {
        super();

        this.element = props.element;

        this.text = this.element.innerHTML;
        this.element.innerHTML = '';

        this.index = 0;
        this.speed = props.speed;
        this.active = false;
        this.audio_typing = [
            `/audio/sound_effects/typewriter_1.mp3`,
            `/audio/sound_effects/typewriter_2.mp3`,
            `/audio/sound_effects/typewriter_3.mp3`
        ];
    }

    private sound_delta = 0;
    write_character() {
        const timeout = 1000 / this.speed;

        this.char_timeout_id = window.setTimeout(() => {
            if (this.index > this.text.length - 1) {
                this.finish();
                return;
            }

            const char = this.text[this.index++];
            this.element.innerHTML += char;
            this.sound_delta += timeout;

            if (this.sound_delta / timeout >= 1.5) {
                this.sound_delta = 0;

                let audio_typing: HTMLAudioElement;
                const audio_index = Math.floor(Math.random() * this.audio_typing.length);
                audio_typing = new Audio(this.audio_typing[audio_index]);
                
                const playback_rate = Math.random() * (1.25 - 0.75) + 0.75;
                audio_typing.playbackRate = playback_rate;
                audio_typing.play();
            }

            this.emit(`char`, char);
            this.write_character();
        }, timeout);
    }

    reset() {
        this.stop();
        this.index = 0;
        this.element.innerHTML = ``;
    }

    start(text?: string) {
        this.reset();
        this.text = text ? text : ``;
        this.active = true;
        this.write_character();
        this.emit(`start`);
    }

    stop() {

        if (this.active) this.emit('stop');
        this.active = false;
        clearTimeout(this.char_timeout_id);
    }

    finish() {
        this.stop();
        this.element.innerText = this.text;
        this.emit("finish");
    }
}
