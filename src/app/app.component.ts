import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SpinnerService } from './services/spinner.service';
import { ModalMessageComponent } from './components/modal-message/modal-message.component';
import { ModalMessageService } from "./services/modal-message.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    LoaderComponent,
    ModalMessageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  spinner = inject(SpinnerService);
  modalMessageService = inject(ModalMessageService);
}
