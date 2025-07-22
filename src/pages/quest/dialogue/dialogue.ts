import { animate, JSAnimation } from "animejs";
import { App } from "../../../app";
import { Component } from "../../../component";
import { AudioTypewriter } from "../../../components/audio_typewriter/audio_typewriter";
import * as icons from '../../../assets/svg/icons';

import './dialogue.css';
interface DialogueData {
    text: string;
    voice?: { src: string, volume: number };
}

export interface DialogueProps {
    dialogues: DialogueData[];
}

export class Dialogue extends Component<any> {
    text_element: HTMLDivElement;
    text_typewriter: AudioTypewriter;
    dialogues: DialogueData[];
    dialogue_index: number;
    voice_audio?: HTMLAudioElement;
    next_arrow_element: HTMLDivElement;

    leave_animation?: JSAnimation;

    constructor(app: App, parent: HTMLElement) {
        super(app, parent, `quest-dialogue`);

        this.text_element = document.createElement(`div`);
        this.text_element.classList.add(`quest-dialogue-text`);
        this.element.appendChild(this.text_element);

        this.next_arrow_element = document.createElement(`div`);
        this.next_arrow_element.classList.add(`quest-dialogue-next-arrow`);
        this.next_arrow_element.innerHTML = icons.triangle();
        this.element.appendChild(this.next_arrow_element);

        this.dialogue_index = 0;
        this.dialogues = [];

        this.text_typewriter = new AudioTypewriter({
            app,
            speed: 25,
            element: this.text_element,
        });

        this.text_typewriter.addListener('start', () => {
            this.next_arrow_element.classList.remove(`show`);
        });

        this.text_typewriter.addListener('finish', () => {
            this.next_arrow_element.classList.add(`show`);
        });
    }

    next_dialogue() {
        if (this.text_typewriter.active) {
            if (this.voice_audio) {
                this.voice_audio?.pause();
            }

            this.text_typewriter.finish();
            return;
        }

        if (this.dialogue_index < this.dialogues.length - 1) {
            this.dialogue_index++;
            this.run_dialogue();
        } else {
            if (this.leave_animation && !this.leave_animation.paused) return;
            this.leave();
        }
    }

    run_dialogue() {
        const dialogue = this.dialogues[this.dialogue_index];
        const text = this.app.localization.get_text(dialogue.text);
        this.text_typewriter.start(text);

        if (dialogue.voice) {
            this.voice_audio = new Audio(dialogue.voice.src);
            this.voice_audio.volume = dialogue.voice.volume;
            this.app.audio.play_audio(`voice`, this.voice_audio)
        }
    }

    on_click = () => {
        this.next_dialogue();
    }

    register_events() {
        this.parent.addEventListener(`click`, this.on_click);
    }

    unregister_events() {
        this.parent.removeEventListener(`click`, this.on_click);
    }

    load() {
        super.load();
        this.register_events();
    }

    unload() {
        super.unload();
        this.unregister_events();

        this.text_typewriter.stop();
        if (this.voice_audio) this.voice_audio.pause();
    }

    appear(props: DialogueProps) {
        this.load();
        animate(this.element, {
            translateY: [`200%`, 0],
            duration: 500
        });

        this.dialogue_index = 0;
        this.dialogues = props.dialogues;
        this.run_dialogue();
        this.register_events();
    }

    leave() {
        this.leave_animation = animate(this.element, {
            translateY: [0, `200%`],
            duration: 500,
            onComplete: () => {
                this.unload();
                this.app.quest_page.forward();
            }
        });
    }
}
