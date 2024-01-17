import { Component, HostListener } from '@angular/core';
import { SharedScrollService } from '../../service/shared-scroll.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  constructor(
    private _sharedScrollService: SharedScrollService,
  ) {}

  @HostListener('window:scroll', [])
  onScroll() {
    this._sharedScrollService.notifyScrollEvent(true);
  }
}
