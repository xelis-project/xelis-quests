type EventMap = {
    [key: string]: any;
}

type EventListener<T> = (data?: T) => void;

export class EventEmitter<T extends EventMap> {
    events: Map<keyof T, EventListener<T[keyof T]>[]>;

    constructor() {
        this.events = new Map();
    }

    addListener(event: keyof T, listener: EventListener<T[keyof T]>) {
        const listeners = this.events.get(event) || [];
        this.events.set(event, [...listeners, listener]);
    }

    emit(event: keyof T, data?: T[keyof T]) {
        const listeners = this.events.get(event);
        if (!listeners) return;
        listeners.forEach((listener) => listener(data));
    }

    removeListener(event: keyof T, listener: EventListener<T[keyof T]>) {
        const listeners = this.events.get(event);
        if (!listeners) return;
        this.events.set(event, listeners.filter(l => l !== listener));
    }

    removeAllListeners(event?: keyof T) {
        if (event) {
            this.events.set(event, []);
        } else {
            this.events = new Map();
        }
    }
}