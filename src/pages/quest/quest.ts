import type { App } from "../../app";
import { Component } from "../../component";
import './quest.css';

export class QuestPage extends Component {
    constructor(app: App) {
        super(app, app.root, `quest`);
    }

    anime_show() {
        super.show();
    }

    anime_hide() {
        super.hide();
    }
}
