import { animate, eases } from "animejs";
import { App } from "../../../app";
import { Component } from "../../../component";

import './chapter.css';

export interface ChapterProps {
    text: string;
}

export class Chapter extends Component<any> {
    constructor(app: App, parent: HTMLElement) {
        super(app, parent, `quest-chapter`);
    }

    on_click = () => {
        this.leave();
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

    appear(props: ChapterProps) {
        this.load();
        this.element.innerHTML = props.text;

        const audio = new Audio(`/audio/sound_effects/appear_pop_2.mp3`);
        audio.volume = 1;
        this.app.audio.play_audio(`sound_effect`, audio);

        animate(this.element, {
            opacity: [.5, 1],
            scale: [0.5, 1],
            duration: 500,
            ease: eases.inOutBack(5)
        });
    }

    leave() {
        const leave_anim = animate(this.element, {
            opacity: [1, 0],
            translateY: [0, `-100%`],
            duration: 500,
            onComplete: () => {
                this.unload();
                leave_anim.revert();
                this.app.quest_page.forward();
            }
        });
    }
}