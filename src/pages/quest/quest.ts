import type { App } from "../../app";
import { Component } from "../../component";

import { Dialogue, type DialogueProps } from "./dialogue/dialogue";
import { Background, type BackgroundProps } from "./background/background";
import { Model, type ModelProps } from "./model/model";
import { Question, type QuestionProps } from "./question/question";
import { GoTo, type GoToProps } from "./go_to/go_to";
import queryString from "query-string";
import { animate } from "animejs";
import { Chapter, type ChapterProps } from "./chapter/chapter";
import { Video, type VideoProps } from "./video/video";
import { Alert, type AlertProps } from "./alert/alert";

import quest_1 from './data/quest_1.json';

import './quest.css';

interface QuestStep {
    model?: ModelProps;
    background?: BackgroundProps;
    dialogue?: DialogueProps;
    question?: QuestionProps;
    go_to?: GoToProps;
    chapter?: ChapterProps;
    video?: VideoProps;
    alert?: AlertProps;
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
    go_to: GoTo;
    chapter: Chapter;
    video: Video;
    alert: Alert;

    vars: Record<string, any>;
    scene_index: number;
    step_index: number;
    data?: QuestData;

    constructor(app: App) {
        super(app, app.root, `quest-page`);

        this.vars = {};
        this.scene_index = 0;
        this.step_index = 0;

        this.background = new Background(app, this.element);
        this.model = new Model(app, this.element);
        this.dialogue = new Dialogue(app, this.element);
        this.question = new Question(app, this.element);
        this.video = new Video(app, this.element);
        this.chapter = new Chapter(app, this.element);
        this.alert = new Alert(app, app.root);
        this.go_to = new GoTo(app);
    }

    forward() {
        if (!this.data) return;

        // the module is finished
        if (this.scene_index >= this.data.scenes.length - 1) {
            this.app.go_to(`/quests`);
            return;
        }

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
        if (!this.data) return;

        const scene = this.data.scenes[this.scene_index];
        if (!scene) return;

        const step = scene.steps[this.step_index];
        if (!step) return;

        if (step.go_to) {
            this.go_to.execute(step.go_to);
        }

        if (step.background) {
            this.background.appear(step.background);
        }

        if (step.model) {
            this.model.appear(step.model);
        }

        if (step.dialogue) {
            this.dialogue.appear(step.dialogue);
        }

        if (step.question) {
            this.question.appear(step.question);
        }

        if (step.video) {
            this.video.appear(step.video);
        }

        if (step.chapter) {
            this.chapter.appear(step.chapter);
        }

        if (step.alert) {
            this.alert.appear(step.alert);
        }
    }

    set_data_from_querystring() {
        const parsed = queryString.parse(window.location.search);
        switch (parsed.slug) {
            case "quest-1":
                this.data = quest_1;
                break;
        }
    }

    load() {
        super.load();

        this.set_data_from_querystring();

        if (!this.data) {
            this.app.go_to(`/`);
            return;
        }

        this.run_scene();
    }

    appear() {
        this.load();

        animate(this.element, {
            opacity: [0, 1],
            duration: 1000
        });
    }

    leave() {
        animate(this.element, {
            scale: [1, 2],
            duration: 1000,
            onComplete: () => {
                this.unload();
            }
        });
    }

    unload() {
        super.unload();
        this.data = undefined;
        this.dialogue.unload();
        this.question.unload();
    }
}
