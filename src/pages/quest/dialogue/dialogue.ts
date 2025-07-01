import { animate, eases } from "animejs";
import { App } from "../../../app";
import { Component } from "../../../component";
import { Typewriter } from "../../../utils/typewriter";

import './dialogue.css';

export interface DialogueProps {
    dialogues: { text: string }[];
}

export class Dialogue extends Component<any> {
    text_element: HTMLDivElement;
    typewriter: Typewriter;
    dialogues: string[];
    dialogue_index: number;

    constructor(app: App, parent: HTMLElement) {
        super(app, parent, `quest-dialogue`);

        this.text_element = document.createElement(`div`);
        this.text_element.classList.add(`quest-dialogue-text`);
        this.element.appendChild(this.text_element);

        this.dialogue_index = 0;
        this.dialogues = [];

        this.typewriter = new Typewriter({
            speed: 15,
            element: this.text_element,
        });
    }

    forward() {
        if (this.typewriter.active) {
            this.typewriter.finish();
            return;
        }

        if (this.dialogue_index < this.dialogues.length - 1) {
            this.dialogue_index++;
            this.run_dialogue();
        } else {
            this.anime_hide();
        }
    }

    run_dialogue() {
        const dialogue = this.dialogues[this.dialogue_index];
        this.typewriter.start(dialogue);
    }

    anime_show(props: DialogueProps) {
        super.show();

        animate(this.element, {
            translateY: [`200%`, 0],
            duration: 500
        });

        this.dialogue_index = 0;
        this.dialogues = props.dialogues.map(x => x.text);
        this.run_dialogue();
        this.register_events();
    }

    anime_hide() {
        this.unregister_events();

        animate(this.element, {
            translateY: [0, `200%`],
            duration: 500,
            onComplete: () => {
                super.hide();
            }
        });
    }

    on_click = (e: MouseEvent) => {
        e.stopImmediatePropagation();
        this.forward();
    }

    register_events() {
        this.parent.addEventListener(`click`, this.on_click);
    }

    unregister_events() {
        this.parent.removeEventListener(`click`, this.on_click);
    }
}
