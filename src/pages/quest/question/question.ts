import { animate } from "animejs";
import { App } from "../../../app";
import { Component } from "../../../component";

import './question.css';
import { AudioTypewriter } from "../../../components/audio_typewriter/audio_typewriter";
import type { GoToProps } from "../go_to/go_to";

interface QuestionChoice {
    text: string;
    go_to: GoToProps;
}

export interface QuestionProps {
    text: string;
    answer: string;
    choices: QuestionChoice[];
}

export class Question extends Component<any> {
    text_element: HTMLDivElement;
    choices_element: HTMLDivElement;
    text_typewriter: AudioTypewriter;

    data?: QuestionProps;

    constructor(app: App, parent: HTMLElement) {
        super(app, parent, `quest-question`);

        this.text_element = document.createElement(`div`);
        this.text_element.classList.add(`quest-question-text`);
        this.element.appendChild(this.text_element);

        this.choices_element = document.createElement(`div`);
        this.choices_element.classList.add(`quest-question-choices`);
        this.element.appendChild(this.choices_element);

        this.text_typewriter = new AudioTypewriter({ app: this.app, element: this.text_element, speed: 15 });
    }

    unload() {
        super.unload();
        this.text_typewriter.removeListener(`finish`, this.on_typewriter_finish);
        this.text_typewriter.stop();
        this.choices_element.replaceChildren();
        this.data = undefined;
    }

    on_typewriter_finish = () => {
        if (!this.data) return;
        this.data.choices.forEach((choice, i) => {
            const question_choice = new QuestionChoiceItem(this.app, this.choices_element, choice);
            question_choice.load();

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
    }

    appear(props: QuestionProps) {
        this.load();

        animate(this.element, {
            translateY: [`200%`, 0],
            duration: 500
        });

        this.data = props;
        this.text_typewriter.start(props.text);
        this.text_typewriter.addListener(`finish`, this.on_typewriter_finish);
    }

    leave(complete: () => void) {
        animate(this.element, {
            translateY: [0, `200%`],
            duration: 500,
            onComplete: () => {
                this.unload();
                complete();
            }
        });
    }
}

class QuestionChoiceItem extends Component<any> {
    constructor(app: App, parent: HTMLDivElement, choice: QuestionChoice) {
        super(app, parent, `quest-question-choice`);
        this.element.innerHTML = choice.text;

        this.element.addEventListener(`click`, () => {
            const audio_click = new Audio(`/audio/sound_effects/btn_click_1.mp3`);
            audio_click.volume = 0.6;
            this.app.audio.play_audio(`sound_effect`, audio_click);

            const question_data = this.app.quest_page.question.data;
            if (question_data) {
                if (choice.text === question_data.answer) {
                    const audio_good_answer = new Audio(`/audio/sound_effects/good_answer_1.mp3`);
                    audio_good_answer.volume = 0.3;
                    this.app.audio.play_audio(`sound_effect`, audio_good_answer);

                    this.element.classList.add(`good`);
                } else {
                    const audio_bad_answer = new Audio(`/audio/sound_effects/bad_answer_1.mp3`);
                    audio_bad_answer.volume = 0.7;
                    this.app.audio.play_audio(`sound_effect`, audio_bad_answer);

                    this.element.classList.add(`bad`);
                }
            }

            setTimeout(() => {
                this.app.quest_page.question.leave(() => {
                    this.app.quest_page.go_to.execute(choice.go_to);
                });
            }, 750);
        });

        this.element.addEventListener(`mouseenter`, () => {
            const audio_hover = new Audio(`/audio/sound_effects/btn_hover_1.mp3`);
            audio_hover.volume = 0.1;
            this.app.audio.play_audio(`sound_effect`, audio_hover);
        });
    }
}