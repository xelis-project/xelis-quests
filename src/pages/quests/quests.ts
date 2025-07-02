import { animate, eases, stagger } from "animejs";
import type { App } from "../../app";
import './quests.css';

import quests from './quests.json';
import { QuestItem } from "./quest_item/quest_item";
import { Circuit } from "../../components/circuit/circuit";
import { Component } from "../../component";

export class QuestsPage extends Component<any> {
    title_element: HTMLDivElement;
    description_element: HTMLDivElement;
    quest_items: QuestItem[];

    circuit: Circuit;

    constructor(app: App) {
        super(app, app.root, "quests-page");

        this.quest_items = [];

        this.circuit = new Circuit(app, this.element);
        this.circuit.show();

        this.title_element = document.createElement(`div`);
        this.title_element.innerHTML = `QUESTS`;
        this.title_element.classList.add(`quests-page-title`);
        this.element.appendChild(this.title_element);

        this.description_element = document.createElement(`div`);
        this.description_element.innerHTML = `${quests.length} available - 0% completed`;
        this.description_element.classList.add(`quests-page-description`);
        this.element.appendChild(this.description_element);

        const content = document.createElement(`div`);
        content.classList.add(`quests-page-content`);
        this.element.appendChild(content);

        quests.forEach((q) => {
            const quest_item = new QuestItem(app, content, q);
            quest_item.show();
            this.quest_items.push(quest_item);
        });
    }

    anime_show() {
        this.show();
        this.register_events();

        const audio_transition = new Audio('/audio/sound_effects/page_transition_1.mp3');
        audio_transition.playbackRate = 1.4;
        audio_transition.volume = 0.5;
        this.app.audio.play_audio(`sound_effect`, audio_transition);

        animate(this.element, {
            opacity: [0, 1],
            duration: 2000
        });

        animate(this.title_element, {
            opacity: [0, 1],
            translateX: [`-50%`, 0],
            duration: 500,
        });

        animate(this.description_element, {
            opacity: [0, 1],
            translateY: [`-50%`, 0],
            duration: 500,
            delay: 250
        });

        const quest_item_elements = this.quest_items.map(x => x.element);
        animate(quest_item_elements, {
            scale: [0.9, 1],
            opacity: [0, 1],
            duration: 1000,
            delay: stagger(100, { start: 100 }),
            ease: eases.inOutBack(3),
            onComplete: () => {
                //this.element.scrollIntoView(quest_item_elements[4])
            }
        });
    }

    anime_hide(complete: () => void) {
        const hide_animation = animate(this.element, {
            scale: [1, 2],
            rotate: [`0`, `50deg`],
            opacity: [1, 0],
            duration: 500,
            ease: eases.inCubic,
            onComplete: () => {
                super.hide();
                hide_animation.revert();
                complete();
            }
        });
    }

    on_wheel = (e: WheelEvent) => {
        document.documentElement.scrollLeft += e.deltaY;
    }

    register_events() {
        this.element.addEventListener(`wheel`, this.on_wheel);
    }

    unregister_events() {
        this.element.removeEventListener(`wheel`, this.on_wheel);
    }
}
