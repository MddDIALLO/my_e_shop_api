import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedScrollService {
  private scrollSubject = new Subject<boolean>();

  getScrollObservable() {
    return this.scrollSubject.asObservable();
  }

  notifyScrollEvent(scrolling: boolean) {
    this.scrollSubject.next(scrolling);
  }
}
