import { Component } from "../../component/component";

import './quest_item.css';

interface QuestItemProps {
    img: string;
    name: string;
    description: string;
    time: string;
    reward: string;
}

export class QuestItem extends Component {
    image_element: HTMLImageElement;
    name_element: HTMLDivElement;
    description_element: HTMLDivElement;
    btn_start_element: HTMLButtonElement;
    time_element: HTMLDivElement;
    reward_element: HTMLDivElement;

    constructor(parent: HTMLElement, props: QuestItemProps) {
        super(parent, `quest-item`);

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