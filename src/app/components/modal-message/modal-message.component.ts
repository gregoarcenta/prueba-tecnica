import { Component, OnDestroy, inject } from '@angular/core';
import { ModalMessageService } from '../../services/modal-message.service';

@Component({
  selector: 'app-modal-message',
  standalone: true,
  imports: [],
  templateUrl: './modal-message.component.html',
  styleUrl: './modal-message.component.css',
})
export class ModalMessageComponent implements OnDestroy {
  public modalMessageService = inject(ModalMessageService);

  ngOnDestroy(): void {
    this.modalMessageService.clear();
  }
}
