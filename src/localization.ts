export type Lang = "en" | "fr";

export const supported_languages = [
    { title: "English", key: "en" },
    { title: "French", key: "fr" }
];

import lang_map from './assets/lang/map';

export class Localization {
    lang: Lang;
    vars: Record<string, string[]>;

    constructor() {
        this.lang = this.load_lang();
        this.vars = {};
    }

    load_lang(): Lang {
        const lang = window.localStorage.getItem("lang");
        if (lang && supported_languages.map(x => x.key).indexOf(lang) !== -1) return lang as Lang;
        return "en";
    }

    save_lang() {
        window.localStorage.setItem("lang", this.lang);
    }

    set_lang(lang: Lang) {
        this.lang = lang;
    }

    get_text(en_text: string) {
        if (this.lang === `en`) return en_text;

        const localized_text = lang_map[this.lang][en_text];
        if (localized_text) return localized_text;

        console.warn(`Localized text not found: ${en_text}`);
        return en_text;
    }

    set_element_text(element: Element, en_text: string, vars?: string[]) {
        let localized_text = this.get_text(en_text);
        if (vars) {
            this.vars[en_text] = vars;
            vars.forEach((v) => {
                localized_text = localized_text.replace("{}", v);
            });
        }

        element.innerHTML = localized_text;
        element.setAttribute("lang-key", en_text);
    }

    update_elements() {
        const traverse = (element: Element) => {
            const en_text = element.getAttribute("lang-key");
            if (en_text) {
                this.set_element_text(element, en_text, this.vars[en_text]);
            } else {
                for (let i = 0; i < element.children.length; i++) {
                    traverse(element.children[i]);
                }
            }
        }

        traverse(document.body);
    }
}