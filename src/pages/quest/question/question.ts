import { App } from "../../../app";
import { Component } from "../../../component";

export interface QuestionProps {
    text: string;
    choices: { text: string }[];
}

export class Question extends Component<any> {
    constructor(app: App, parent: HTMLElement) {
        super(app, parent, `quest-question`);
    }

    anime_show(props: QuestionProps) {
        
    }
}