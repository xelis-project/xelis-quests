import { animate, eases } from "animejs";
import { App } from "../../../app";
import { Component } from "../../../component";
import * as icons from '../../../assets/svg/icons';

import './video.css';

export interface VideoProps {
    src: string;
}

export class Video extends Component<any> {
    video_element: HTMLVideoElement;
    btn_continue: HTMLButtonElement;

    constructor(app: App, parent: HTMLElement) {
        super(app, parent, `quest-video`);

        this.video_element = document.createElement(`video`);
        this.video_element.classList.add(`quest-video-canvas`);
        this.video_element.controls = true;
        this.element.appendChild(this.video_element);

        this.btn_continue = document.createElement(`button`);
        this.btn_continue.classList.add(`quest-video-btn-continue`);
        this.btn_continue.innerHTML = `${icons.arrow()}CONTINUE`;
        this.btn_continue.addEventListener(`click`, () => {
            this.leave();
        });

        this.element.appendChild(this.btn_continue);
    }

    appear(props: VideoProps) {
        this.load();

        this.video_element.src = props.src;
        this.video_element.muted = false;
        this.video_element.autoplay = true;

        const audio = new Audio(`/audio/sound_effects/page_transition_7.mp3`);
        audio.volume = 1;
        this.app.audio.play_audio(`sound_effect`, audio);

        animate(this.element, {
            opacity: [.5, 1],
            scale: [1.3, 1],
            duration: 500,
            ease: eases.inOutBack(2)
        });
    }

    leave() {
        animate(this.element, {
            opacity: [1, 0],
            translateY: [0, `100%`],
            duration: 500,
            onComplete: () => {
                this.unload();
                this.app.quest_page.forward();
            }
        });
    }
}