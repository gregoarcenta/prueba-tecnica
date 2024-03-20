import { Injectable, signal } from '@angular/core';

type Type = 'success' | 'error';

interface IMessage {
  title: string;
  detail: string;
  type?: Type;
  confirm?: () => void;
  cancel?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ModalMessageService {
  type = signal<string>('');
  isActive = signal<boolean>(false);
  title = signal<string>('');
  detail = signal<string>('');

  confirmFunction?: () => void;
  cancelFunction?: () => void;

  constructor() {}

  add(options: IMessage) {
    this.title.set(options.title);
    this.detail.set(options.detail);
    this.confirmFunction = options.confirm;
    this.cancelFunction = options.cancel;
    this.type.set('');

    this.isActive.set(true);
  }

  alert(options: IMessage) {
    this.title.set(options.title);
    this.detail.set(options.detail);
    this.type.set(options.type || '');

    this.isActive.set(true);
  }

  confirm() {
    if (this.confirmFunction) {
      this.confirmFunction();
      this.clear();
    }
  }

  cancel() {
    if (this.cancelFunction) {
      this.cancelFunction();
    }
    this.clear();
  }

  clear() {
    this.isActive.set(false);
    this.title.set('');
    this.detail.set('');
    this.confirmFunction = () => {};
    this.cancelFunction = () => {};
  }
}
