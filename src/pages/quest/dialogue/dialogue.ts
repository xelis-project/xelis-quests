import { animate } from "animejs";
import { App } from "../../../app";
import { Component } from "../../../component";

import './dialogue.css';
import { AudioTypewriter } from "../../../components/audio_typewriter/audio_typewriter";

export interface DialogueProps {
    dialogues: { text: string }[];
}

export class Dialogue extends Component<any> {
    text_element: HTMLDivElement;
    text_typewriter: AudioTypewriter;
    dialogues: string[];
    dialogue_index: number;

    constructor(app: App, parent: HTMLElement) {
        super(app, parent, `quest-dialogue`);

        this.text_element = document.createElement(`div`);
        this.text_element.classList.add(`quest-dialogue-text`);
        this.element.appendChild(this.text_element);

        this.dialogue_index = 0;
        this.dialogues = [];

        this.text_typewriter = new AudioTypewriter({
            app,
            speed: 15,
            element: this.text_element,
        });
    }

    next_dialogue() {
        if (this.text_typewriter.active) {
            this.text_typewriter.finish();
            return;
        }

        if (this.dialogue_index < this.dialogues.length - 1) {
            this.dialogue_index++;
            this.run_dialogue();
        } else {
            this.leave();
        }
    }

    run_dialogue() {
        const dialogue = this.dialogues[this.dialogue_index];
        this.text_typewriter.start(dialogue);
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
    }

    appear(props: DialogueProps) {
        this.load();
        animate(this.element, {
            translateY: [`200%`, 0],
            duration: 500
        });

        this.dialogue_index = 0;
        this.dialogues = props.dialogues.map(x => x.text);
        this.run_dialogue();
        this.register_events();
    }

    leave() {
        animate(this.element, {
            translateY: [0, `200%`],
            duration: 500,
            onComplete: () => {
                this.unload();
                this.app.quest_page.forward();
            }
        });
    }
}
