import type { App } from '../../app';
import { Component } from '../../component';
import './notification.css';

interface NotificationProps {
  content: string;
  type: | "success" | "error";
  duration?: number;
}

export class Notification extends Component<any> {
  timeout_id: number | undefined;

  constructor(app: App) {
    super(app, app.root, `notification`);
  }

  show(props: NotificationProps) {
    this.element.className = `notification`;
    clearTimeout(this.timeout_id);

    this.timeout_id = setTimeout(() => {
      this.element.innerHTML = props.content;
      this.element.classList.add(props.type);

      if (props.duration) {
        this.timeout_id = setTimeout(() => {
          this.element.classList.remove(props.type);
        }, props.duration);
      }
    }, 500);
  }
}