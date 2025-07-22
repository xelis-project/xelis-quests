import { animate, eases, stagger, waapi } from "animejs";
import type { App } from "../../app";
import './quests.css';

import quests from './quests.json';
import { QuestItem } from "./quest_item/quest_item";
import { Circuit } from "../../components/circuit/circuit";
import { Component } from "../../component";

export class QuestsPage extends Component<any> {
    title_element: HTMLDivElement;
    description_element: HTMLDivElement;
    quests_content: HTMLDivElement;

    circuit: Circuit;

    constructor(app: App) {
        super(app, app.root, "quests-page", "scrollbar-1");

        this.circuit = new Circuit(app, this.element);
        this.circuit.load();

        this.title_element = document.createElement(`div`);
        this.title_element.innerHTML = `QUESTS`;
        this.title_element.classList.add(`quests-page-title`);
        this.element.appendChild(this.title_element);

        this.description_element = document.createElement(`div`);
        this.description_element.innerHTML = `${quests.length} available - 0% completed`;
        this.description_element.classList.add(`quests-page-description`);
        this.element.appendChild(this.description_element);

        this.quests_content = document.createElement(`div`);
        this.quests_content.classList.add(`quests-page-content`);
        this.element.appendChild(this.quests_content);


    }

    load() {
        super.load();
        this.register_events();

        this.quests_content.replaceChildren();
        quests.forEach((q) => {
            const quest_item = new QuestItem(this.app, this.quests_content, q);
            quest_item.load();
        });
    }

    unload() {
        super.unload();
        this.unregister_events();
    }

    on_wheel = (e: WheelEvent) => {
        this.element.scrollLeft += e.deltaY;
    }

    register_events() {
        this.element.addEventListener(`wheel`, this.on_wheel);
    }

    unregister_events() {
        this.element.removeEventListener(`wheel`, this.on_wheel);
    }

    appear() {
        this.load();

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

        animate(this.quests_content.children, {
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

    leave(complete: () => void) {
        // disable vertical scroll when leaving page - otherwise the leave animation is zooming in and scrolling
        this.element.style.overflow = `hidden`;

        const hide_animation = waapi.animate(this.element, {
            scale: [1, 2],
            rotate: [0, 50],
            opacity: [1, 0],
            duration: 500,
            ease: eases.inCubic,
            onComplete: () => {
                this.unload();
                hide_animation.revert();
                this.element.style.removeProperty(`overflow`);
                complete();
            }
        });
    }

    set_quest_completed(slug: string) {
        window.localStorage.setItem(`${slug}-completed`, `true`);
    }

    is_quest_completed(slug: string) {
        const data =  window.localStorage.getItem(`${slug}-completed`);
        if (data === `true`) return true;
        return false;
    }
}
