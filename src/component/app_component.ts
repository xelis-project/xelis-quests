import { Component } from "./component";
import type { App } from "../app";

export class AppComponent extends Component {
    app: App;

    constructor(app: App, classname: string) {
        super(app.root, classname);
        this.app = app;
    }
}