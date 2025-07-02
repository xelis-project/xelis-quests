import jsonLogic from 'json-logic-js';
import type { App } from '../../../app';

export interface GoToProps {
    scene_index?: number;
    step_index?: number;
    logic?: any;
}

export class GoTo {
    app: App;
    constructor(app: App) {
        this.app = app;
    }

    execute(props: GoToProps) {
        let jumped = this.maybe_jump(props.scene_index, props.step_index);
        if (jumped) return;

        if (props.logic) {
            const logic = props.logic;
            const data = jsonLogic.apply(logic, this.app.quest_page.vars);
            if (data) {
                this.maybe_jump(data.scene_index, data.step_index);
                return;
            }
        }
    }

    maybe_jump(scene_index?: number, step_index?: number) {
        let jump = false;
        if (scene_index !== undefined) {
            this.app.quest_page.scene_index = scene_index;
            jump = true;
        }

        if (step_index !== undefined) {
            this.app.quest_page.step_index = step_index;
            jump = true;
        }

        if (jump) {
            this.app.quest_page.run_scene();
        }

        return jump;
    }
}