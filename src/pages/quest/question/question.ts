import { animate, stagger } from "animejs";
import { App } from "../../../app";
import { Component } from "../../../component";
import { Typewriter } from "../../../utils/typewriter";

import './question.css';
import { AudioTypewriter } from "../../../components/audio_typewriter/audio_typewriter";

export interface QuestionProps {
    text: string;
    answer: string;
    choices: { text: string }[];
}

export class Question extends Component<any> {
    text_element: HTMLDivElement;
    choices_element: HTMLDivElement;

    question: string;
    choices: string[];

    constructor(app: App, parent: HTMLElement) {
        super(app, parent, `quest-question`);

        this.text_element = document.createElement(`div`);
        this.text_element.classList.add(`quest-question-text`);
        this.element.appendChild(this.text_element);

        this.choices_element = document.createElement(`div`);
        this.choices_element.classList.add(`quest-question-choices`);
        this.element.appendChild(this.choices_element);

        this.question = ``;
        this.choices = [];
    }

    answer(text: string) {

    }

    anime_show(props: QuestionProps) {
        super.show();

        animate(this.element, {
            translateY: [`200%`, 0],
            duration: 500
        });

        const text_typewriter = new AudioTypewriter({ app: this.app, element: this.text_element, speed: 15 });
        //text_typewriter.typing_volume = this.app.audio.get_volume(`sound_effect`);
        text_typewriter.start(props.text);
        text_typewriter.addListener(`finish`, () => {
            props.choices.forEach((choice, i) => {
                const question_choice = new QuestionChoice(choice.text, this, this.choices_element);
                question_choice.show();

                setTimeout(() => {
                    animate(question_choice.element, {
                        translateX: [`10%`, 0],
                        opacity: [0, 1],
                        duration: 500,
                    });

                    const appear_audio = new Audio(`/audio/sound_effects/page_transition_6.mp3`);
                    appear_audio.volume = 0.1;
                    this.app.audio.play_audio(`sound_effect`, appear_audio);
                }, 200 * i);
            });
        });
    }

    anime_hide() {
        animate(this.element, {
            translateY: [0, `200%`],
            duration: 500,
            onComplete: () => {
                super.hide();
            }
        });
    }
}

class QuestionChoice extends Component<any> {
    question: Question;

    constructor(text: string, question: Question, parent: HTMLDivElement) {
        super(question.app, parent, `quest-question-choice`);
        this.question = question;
        this.element.innerHTML = text;

        this.element.addEventListener(`click`, () => {
            question.answer(text);
        });

        this.element.addEventListener(`mouseenter`, () => {
            const audio_hover = new Audio(`/audio/sound_effects/btn_hover_1.mp3`);
            audio_hover.volume = 0.1;
            this.app.audio.play_audio(`sound_effect`, audio_hover);
        });
    }
}