import { IntroPage } from "./pages/intro/intro";
import { QuestsPage } from "./pages/quests/quests";

import 'reset-css/reset.css';
import './font_types.css';
import './app.css';
import { Settings } from "./components/settings/settings";
import { Header } from "./components/header/header";
import { Audio } from "./components/audio/audio";

export class App {
    root: HTMLElement;

    intro_page: IntroPage;
    quests_page: QuestsPage;

    settings: Settings;
    audio: Audio;

    constructor(root: HTMLElement) {
        this.root = root;
        this.audio = new Audio();

        const header = new Header(this);
        header.anime_show();

        this.intro_page = new IntroPage(this);
        this.quests_page = new QuestsPage(this);

        this.settings = new Settings(this);

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

        this.intro_page.hide();
        this.quests_page.hide();

        switch (url.pathname) {
            case "/":
                this.intro_page.anime_show();
                break;
            case "/quests":
                this.quests_page.anime_show();
                break;
        }
    }

    set_font_size() {
        const size = 0.012727 * window.innerWidth + 7.4182;
        document.documentElement.style.fontSize = `${size}px`;
    }

    on_resize = () => {
        this.set_font_size();
    }

    register_events() {
        window.addEventListener(`resize`, this.on_resize);
    }
}
