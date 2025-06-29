import { animate, eases } from 'animejs';
import type { App } from '../../app';

import './intro.css';
import * as icons from '../../assets/icons';
import { Circuit } from '../../components/circuit/circuit';
import { Component } from '../../component';

export class IntroPage extends Component {

    title_element: HTMLDivElement;
    description_element: HTMLDivElement;
    btn_start_element: HTMLButtonElement;

    circuit: Circuit;
    shape_3_element: HTMLDivElement;
    music: HTMLAudioElement;

    constructor(app: App) {
        super(app, app.root, `intro-page`);

        this.circuit = new Circuit(app, this.element);
        this.circuit.show();

        const shape_1_element = document.createElement(`div`);
        shape_1_element.classList.add(`intro-page-shape-1`);
        this.element.appendChild(shape_1_element);

        const shape_2_element = document.createElement(`div`);
        shape_2_element.classList.add(`intro-page-shape-2`);
        this.element.appendChild(shape_2_element);

        this.shape_3_element = document.createElement(`div`);
        this.shape_3_element.classList.add(`intro-page-shape-3`);
        this.element.appendChild(this.shape_3_element);

        const content = document.createElement(`div`);
        content.classList.add(`intro-page-content`);
        this.element.appendChild(content);

        this.title_element = document.createElement(`div`);
        this.title_element.innerHTML = `XELIS QUESTS`;
        this.title_element.classList.add(`intro-page-title`);
        content.appendChild(this.title_element);

        this.description_element = document.createElement(`div`);
        this.description_element.classList.add(`intro-page-description`);
        this.description_element.innerHTML = `Explore the XELIS Blockchain and its ecosystem. Earn rewards by completing educational quests.`;
        content.appendChild(this.description_element);

        this.btn_start_element = document.createElement(`button`);
        this.btn_start_element.innerHTML = `${icons.play()} Start`;
        this.btn_start_element.classList.add(`intro-page-start-btn`);
        this.btn_start_element.addEventListener(`click`, () => {
            this.anime_hide(() => {
                this.app.go_to(`/quests`);
                //this.app.quests_page.anime_show();
            });

            //window.history.pushState(null, `Quests`, `/quests`);

            const audio_click = new Audio(`/audio/sound_effects/btn_click_1.mp3`);
            audio_click.volume = 0.1;
            this.app.audio.play_audio(`sound_effect`, audio_click);
        });
        this.btn_start_element.addEventListener(`mouseenter`, () => {
            const audio_hover = new Audio(`/audio/sound_effects/btn_hover_1.mp3`);
            audio_hover.volume = 0.1;
            this.app.audio.play_audio(`sound_effect`, audio_hover);
        });

        content.appendChild(this.btn_start_element);

        this.music = new Audio(`/audio/music/music_electric_synth_1.mp3`);
        this.music.volume = 0.05;

        this.element.addEventListener(`click`, () => {
            //this.music.currentTime = 0;
            this.music.play();
            //this.app.audio.play_audio(`music`, this.music);
        });
    }

    anime_show() {
        super.show();

        const audio_transition = new Audio('/audio/sound_effects/page_transition_3.mp3');
        audio_transition.playbackRate = 1;
        audio_transition.volume = 0.5;
        this.app.audio.play_audio(`sound_effect`, audio_transition);

        animate(this.element, {
            opacity: [0, 1],
            duration: 1000
        });

        animate(this.title_element, {
            opacity: [0, 1],
            translateX: [`-20%`, 0],
            duration: 750,
            delay: 250,
            ease: eases.inOutBack(5)
        });

        animate(this.description_element, {
            opacity: [0, 1],
            translateY: [`100%`, 0],
            duration: 750,
            delay: 500,
            ease: eases.inOutBack(2)
        });

        animate(this.btn_start_element, {
            translateX: [`50%`, 0],
            opacity: [0, 1],
            duration: 450,
            delay: 1000,
            ease: eases.outBack(2)
        });

        animate(this.shape_3_element, {
            translateX: [`-100%`, `100%`],
            opacity: [1, 0],
            duration: 1000,
            delay: 0,
            ease: eases.inOutBack(2)
        });
    }

    anime_hide(complete: () => void) {
        animate(this.element, {
            opacity: [1, 0],
            duration: 500,
            onComplete: () => {
                this.hide();
                complete();
            }
        });

        this.music.pause();
    }
}