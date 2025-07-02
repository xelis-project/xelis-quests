import type { App } from "../../app";
import { Component } from "../../component";

import quest_1 from '../quests/quest_1.json';
import { Dialogue, type DialogueProps } from "./dialogue/dialogue";
import { Background, type BackgroundProps } from "./background/background";
import { Model, type ModelProps } from "./model/model";
import { Question, type QuestionProps } from "./question/question";

import './quest.css';
import { CanvasShader } from "../../utils/canvas_shader";
import { GoTo, type GoToProps } from "./go_to/go_to";

interface QuestStep {
    model?: ModelProps;
    background?: BackgroundProps;
    dialogue?: DialogueProps;
    question?: QuestionProps;
    go_to?: GoToProps;
}

interface QuestScene {
    steps: QuestStep[];
}

interface QuestData {
    scenes: QuestScene[];
}

export class QuestPage extends Component<any> {
    //background: Background;
    model: Model;
    dialogue: Dialogue;
    question: Question;
    go_to: GoTo;

    vars: Record<string, any>;
    scene_index: number;
    step_index: number;
    data: QuestData;

    constructor(app: App) {
        super(app, app.root, `quest-page`);

        this.vars = {};
        this.scene_index = 0;
        this.step_index = 0;
        this.data = quest_1;

        // TODO: create space shader with ellipsis, lines, warping, etc...
        const shader = `
            #include <common>
            uniform vec3 iResolution;
            uniform float iTime;
            // By iq: https://www.shadertoy.com/user/iq
            // license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
            void mainImage( out vec4 fragColor, in vec2 fragCoord )
            {
                // Normalized pixel coordinates (from 0 to 1)
                vec2 uv = fragCoord/iResolution.xy;
                // Time varying pixel color
                vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
                // Output to screen
                fragColor = vec4(col,1.0);
            }
            void main() {
                mainImage(gl_FragColor, gl_FragCoord.xy);
            }
        `

        const canvas_shader = new CanvasShader(shader);
        canvas_shader.canvas.classList.add(`quest-canvas`);
        this.element.appendChild(canvas_shader.canvas);

        //this.background = new Background(app, this.element);
        this.model = new Model(app, this.element);
        this.dialogue = new Dialogue(app, this.element);
        this.question = new Question(app, this.element);
        this.go_to = new GoTo(app);
    }

    forward() {
        if (
            this.dialogue.visible ||
            this.question.visible
        ) return;

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

        if (step.go_to) {
            this.go_to.execute(step.go_to);
        }

        if (step.background) {
            //this.background.anime_show(step.background);
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

    unregister_events() {
        this.element.removeEventListener(`click`, this.on_click);
    }
}
