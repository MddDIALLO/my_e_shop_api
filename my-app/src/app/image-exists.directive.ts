import { Directive, Input, ElementRef, Renderer2, OnChanges } from '@angular/core';

@Directive({
  selector: '[appImageExists]'
})
export class ImageExistsDirective {
  @Input() appImageExists: string | undefined;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnChanges(): void {
    if (this.appImageExists) {
      this.checkImageExists(this.appImageExists);
    }
  }

  checkImageExists(url: string): void {
    const img = new Image();
    img.onload = () => {
      this.renderer.setAttribute(this.el.nativeElement, 'src', url);
    };
    img.onerror = () => {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    };
    img.src = url;
  }
}
