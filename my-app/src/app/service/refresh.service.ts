import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  refresh: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  triggerRefresh() {
    this.refresh.emit();
  }
}
