import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-contextual-menu',
  standalone: true,
  imports: [],
  templateUrl: './contextual-menu.component.html',
  styleUrl: './contextual-menu.component.css',
})
export class ContextualMenuComponent implements AfterViewInit {
  @Output() onUpdateEmit = new EventEmitter<void>();
  @Output() ondeleteEmit = new EventEmitter<void>();
  @ViewChild('menu') menuContextual?: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.colocarMenu();
  }

  showOrHideMenu() {
    const elem = this.colocarMenu();

    elem?.classList.toggle('active');
  }

  colocarMenu() {
    // Obtiene la distancia en px para colocarle al menu para colocarse abajo del boton
    const buttonElement = document.querySelector('.contextual');
    const buttonRect = buttonElement!.getBoundingClientRect();
    const distanceToRight = window.innerWidth - buttonRect.right;

    const elem = this.menuContextual?.nativeElement;

    elem!.style.transform = `translateX(-${distanceToRight}px)`;
    return elem;
  }
}
