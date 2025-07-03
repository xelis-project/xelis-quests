import type { App } from "../../../app";
import { Component } from "../../../component";

import './quest_item.css';

interface QuestItemProps {
    slug: string;
    img: string;
    name: string;
    description: string;
    time: string;
    reward: string;
}

export class QuestItem extends Component<any> {
    image_element: HTMLImageElement;
    name_element: HTMLDivElement;
    description_element: HTMLDivElement;
    btn_start_element: HTMLButtonElement;
    time_element: HTMLDivElement;
    reward_element: HTMLDivElement;

    constructor(app: App, parent: HTMLElement, props: QuestItemProps) {
        super(app, parent, `quest-item`);

        this.element.addEventListener(`mouseenter`, () => {
            const audio_hover = new Audio(`/audio/sound_effects/btn_hover_2.mp3`);
            audio_hover.volume = 0.1;
            this.app.audio.play_audio(`sound_effect`, audio_hover);
        });

        this.image_element = document.createElement(`img`);
        this.image_element.src = props.img;
        this.image_element.classList.add(`quest-item-img`);
        this.element.appendChild(this.image_element);

        const content = document.createElement(`div`);
        content.classList.add(`quest-item-content`);
        this.element.appendChild(content);

        this.name_element = document.createElement(`div`);
        this.name_element.innerHTML = props.name;
        this.name_element.classList.add(`quest-item-name`);
        content.appendChild(this.name_element);

        this.description_element = document.createElement(`div`);
        this.description_element.innerHTML = props.description;
        this.description_element.classList.add(`quest-item-description`);
        content.appendChild(this.description_element);

        const action_content = document.createElement(`div`);
        action_content.classList.add(`quest-item-action`);
        content.appendChild(action_content);

        this.btn_start_element = document.createElement(`button`);
        this.btn_start_element.classList.add(`quest-item-start-btn`);
        this.btn_start_element.innerHTML = `Start Quest`;
        this.btn_start_element.addEventListener(`mouseenter`, () => {
            const audio_hover = new Audio(`/audio/sound_effects/btn_hover_1.mp3`);
            audio_hover.volume = 0.1;
            this.app.audio.play_audio(`sound_effect`, audio_hover);
        });
        this.btn_start_element.addEventListener(`click`, () => {
            const audio_transition = new Audio('/audio/sound_effects/page_transition_5.mp3');
            audio_transition.playbackRate = 1.4;
            audio_transition.volume = 0.5;
            this.app.audio.play_audio(`sound_effect`, audio_transition);

            this.app.quests_page.leave(() => {
                this.app.go_to(`/quest?slug=${props.slug}`);
            });
        });

        action_content.appendChild(this.btn_start_element);

        const details_content = document.createElement(`div`);
        details_content.classList.add(`quest-item-details`);
        action_content.appendChild(details_content);

        this.time_element = document.createElement(`div`);
        this.time_element.innerHTML = props.time;
        details_content.appendChild(this.time_element);

        this.reward_element = document.createElement(`div`);
        this.reward_element.innerHTML = props.reward;
        details_content.appendChild(this.reward_element);
    }
}