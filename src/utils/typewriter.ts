import { EventEmitter } from "./event_emitter";

interface TypewriterProps {
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

    constructor(props: TypewriterProps) {
        super();

        this.element = props.element;

        this.text = this.element.innerHTML;
        this.element.innerHTML = '';

        this.index = 0;
        this.speed = props.speed;
        this.active = false;
    }

    write_character() {
        const timeout = 1000 / this.speed;

        this.char_timeout_id = window.setTimeout(() => {
            if (this.index > this.text.length - 1) {
                this.finish();
                return;
            }

            const char = this.text[this.index++];
            this.element.innerHTML += char;
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
