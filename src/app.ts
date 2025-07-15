import { IntroPage } from "./pages/intro/intro";
import { QuestsPage } from "./pages/quests/quests";
import { Settings } from "./components/settings/settings";
import { Header } from "./components/header/header";
import { AppAudio } from "./components/app_audio/app_audio";
import { QuestPage } from "./pages/quest/quest";
import { MouseEffects } from "./components/mouse_effects/mouse_effects";
import { EventEmitter } from "./utils/event_emitter";
import { Notification } from "./components/notification/notification";

import 'reset-css/reset.css';
import './font_types.css';
import './app.css';
import './scrollbar.css';

interface AppEventMap {
    page_load: any;
}

export class App extends EventEmitter<AppEventMap> {
    root: HTMLElement;

    intro_page: IntroPage;
    quests_page: QuestsPage;
    quest_page: QuestPage;

    header: Header;
    settings: Settings;
    audio: AppAudio;
    mouse_effects: MouseEffects;
    notification: Notification;

    constructor(root: HTMLElement) {
        super();

        this.root = root;
        this.root.classList.add(`app`);
        this.audio = new AppAudio();

        this.mouse_effects = new MouseEffects(this);
        this.mouse_effects.load();
        this.header = new Header(this);
        this.header.load();
        this.settings = new Settings(this);
        this.notification = new Notification(this);
        this.notification.load();

        this.intro_page = new IntroPage(this);
        this.quests_page = new QuestsPage(this);
        this.quest_page = new QuestPage(this);

        this.settings.load_settings();
        this.register_events();
        this.on_resize();
        this.load_page();

        // cannot start audio on page load - browser prevents it until user interacts
        const first_click = () => {
            const bg_music = new Audio(`/audio/music/music_electric_synth_1.mp3`);
            bg_music.volume = 0.05;
            this.audio.play_background_music(bg_music);
            document.removeEventListener(`click`, first_click);
        }

        document.addEventListener(`click`, first_click);
    }

    toggle_fullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            return true;
        } else {
            document.exitFullscreen();
            return false;
        }
    }

    go_to(link: string) {
        window.history.pushState(null, ``, link);
        this.load_page();
    }

    load_page() {
        const url = new URL(window.location.href);

        this.intro_page.unload();
        this.quests_page.unload();
        this.quest_page.unload();

        switch (url.pathname) {
            case "/quests":
                this.quests_page.appear();
                break;
            case "/quest":
                this.quest_page.appear();
                break;
            // we don't need 404 not found - simply display the intro page
            case "/":
            default:
                this.intro_page.appear();
                break;
        }

        this.emit("page_load");
    }

    update_size() {
        const s1 = window.innerWidth / 1920;
        const s2 = window.innerHeight / 1080;
        const s = Math.min(s1, s2);

        this.root.style.width = `1920px`;
        this.root.style.height = `1080px`;
        this.root.style.transform = `scale3d(${s}, ${s}, 1)  translate3d(-50%, -50%, 0px)`;
    }

    on_resize = () => {
        this.update_size();
    }

    on_pop_state = (_e: PopStateEvent) => {
        this.load_page();
    }

    register_events() {
        window.addEventListener(`popstate`, this.on_pop_state);
        window.addEventListener(`resize`, this.on_resize);
    }
}
