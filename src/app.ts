import { IntroPage } from "./pages/intro/intro";
import { QuestsPage } from "./pages/quests/quests";
import { Settings } from "./components/settings/settings";
import { Header } from "./components/header/header";
import { Audio } from "./components/audio/audio";
import { QuestPage } from "./pages/quest/quest";
import { MouseEffects } from "./components/mouse_effects/mouse_effects";
import { EventEmitter } from "./utils/event_emitter";

import 'reset-css/reset.css';
import './font_types.css';
import './app.css';

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
    audio: Audio;
    mouse_effects: MouseEffects

    constructor(root: HTMLElement) {
        super();

        this.root = root;
        this.audio = new Audio();

        this.mouse_effects = new MouseEffects(this);
        this.mouse_effects.load();
        this.header = new Header(this);
        this.header.load();
        this.settings = new Settings(this);

        this.intro_page = new IntroPage(this);
        this.quests_page = new QuestsPage(this);
        this.quest_page = new QuestPage(this);

        this.register_events();
        this.on_resize();

        this.load_page();
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

    set_font_size() {
        const size = 0.012727 * window.innerWidth + 7.4182;
        document.documentElement.style.fontSize = `${size}px`;
    }

    on_resize = () => {
        this.set_font_size();
    }

    on_pop_state = (_e: PopStateEvent) => {
        this.load_page();
    }

    register_events() {
        window.addEventListener(`resize`, this.on_resize);
        window.addEventListener(`popstate`, this.on_pop_state);
    }
}
