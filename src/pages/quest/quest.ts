import type { App } from "../../app";
import { Component } from "../../component";
import { Typewriter } from "../../utils/typewriter";
import './quest.css';

import quest_1 from '../quests/quest_1.json';
import { animate, eases } from "animejs";

interface DialogueProps {
    dialogues: { text: string }[];
}

interface QuestionProps {
    text: string;
    choices: { text: string }[];
}

interface AlertProps {
    text: string;
}

interface ModelProps {
    img: string;
}

interface QuestStep {
    alert?: AlertProps;
    model?: ModelProps;
    dialogue?: DialogueProps;
    question?: QuestionProps;
}

interface QuestScene {
    steps: QuestStep[];
}

interface QuestData {
    scenes: QuestScene[];
}

export class QuestPage extends Component<any> {
    model_element: HTMLImageElement;
    dialogue: Dialogue;
    scene_index: number;
    step_index: number;
    data: QuestData;

    constructor(app: App) {
        super(app, app.root, `quest-page`);

        this.scene_index = 0;
        this.step_index = 0;
        this.data = quest_1;

        this.model_element = document.createElement(`img`);
        this.model_element.classList.add(`quest-model`);
        this.element.appendChild(this.model_element);
        this.dialogue = new Dialogue(app, this.element);
    }

    forward() {
        const scene = this.data.scenes[this.scene_index];
        if (scene) {
            const next_step = scene.steps[this.step_index + 1];
            if (next_step) {
                this.step_index++;
                this.run_scene();
            } else {
                this.scene_index++;
                this.step_index = 0;
                this.run_scene();
            }
        }
    }

    run_scene() {
        const scene = this.data.scenes[this.scene_index];
        if (!scene) return;

        const step = scene.steps[this.step_index];
        if (!step) return;

        if (step.model) {
            this.model_element.src = step.model.img;

            const appear_audio = new Audio(`/audio/sound_effects/appear_pop_1.mp3`);
            appear_audio.volume = 0.5;
            this.app.audio.play_audio(`sound_effect`, appear_audio);

            animate(this.model_element, {
                translateY: [`100%`, 0],
                duration: 500,
                ease: eases.inOutBack(2),
                onComplete: () => {
                    animate(this.model_element, {
                        translateY: [0, `1%`],
                        duration: 2000,
                        ease: eases.linear(),
                        loop: true,
                        alternate: true
                    });
                }
            });
        }

        if (step.dialogue) {
            this.dialogue.anime_show(step.dialogue);
        } else {
            this.dialogue.anime_hide();
        }
    }

    anime_show() {
        super.show();
        this.run_scene();
        this.register_events();
    }

    anime_hide() {
        super.hide();
    }

    on_click = () => {
        this.forward();
    }

    register_events() {
        this.element.addEventListener(`click`, this.on_click);
    }
}

class Dialogue extends Component<any> {
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

        if (this.dialogue_index < this.dialogues.length) {
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

        this.dialogue_index = 0;
        this.dialogues = props.dialogues.map(x => x.text);
        this.run_dialogue();
        this.register_events();
    }

    anime_hide() {
        super.hide();
        this.unregister_events();
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
