import type { App } from "../../app";
import { Component } from "../../component";
import { Typewriter } from "../../utils/typewriter";
import './quest.css';

export class QuestPage extends Component<any> {
    typewriter: Typewriter;

    text_element: HTMLDivElement;

    constructor(app: App) {
        super(app, app.root, `quest`);

        this.text_element = document.createElement(`div`);
        this.text_element.classList.add(`test`);
        this.element.appendChild(this.text_element);

        this.typewriter = new Typewriter({
            speed: 15,
            element: this.text_element,
        });
    }

    anime_show() {
        super.show();

        setTimeout(() => {
  this.typewriter.start(`This is a longer test! I don't know if it really make sense.`);
        }, 1000);
      
    }

    anime_hide() {
        super.hide();
    }
}
