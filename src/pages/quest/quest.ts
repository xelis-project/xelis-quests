import type { App } from "../../app";
import { Component } from "../../component";

import quest_1 from '../quests/quest_1.json';
import { Dialogue, type DialogueProps } from "./dialogue/dialogue";
import { Background, type BackgroundProps } from "./background/background";
import { Model, type ModelProps } from "./model/model";
import { Question, type QuestionProps } from "./question/question";

import './quest.css';

interface QuestStep {
    model?: ModelProps;
    background?: BackgroundProps;
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
    background: Background;
    model: Model;
    dialogue: Dialogue;
    question: Question;

    scene_index: number;
    step_index: number;
    data: QuestData;

    constructor(app: App) {
        super(app, app.root, `quest-page`);

        this.scene_index = 0;
        this.step_index = 0;
        this.data = quest_1;

        this.background = new Background(app, this.element);
        this.model = new Model(app, this.element);
        this.dialogue = new Dialogue(app, this.element);
        this.question = new Question(app, this.element);
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

        if (step.background) {
            this.background.anime_show(step.background);
        } else {
           // this.background.anime_hide();
        }

        if (step.model) {
            this.model.anime_show(step.model);
        } else {
            //this.model.anime_hide();
        }

        if (step.dialogue) {
            this.dialogue.anime_show(step.dialogue);
        }

        if (step.question) {
            this.question.anime_show(step.question);
        } else {

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
