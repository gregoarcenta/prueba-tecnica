import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  active = signal<boolean>(false)
}
