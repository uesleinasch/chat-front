import { Component, input, output, signal, HostListener } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'app-image-viewer',
    imports: [ButtonComponent],
    templateUrl: './image-viewer.component.html',
    styleUrl: './image-viewer.component.css'
})
export class ImageViewerComponent {
  imageUrl = input.required<string>();
  isVisible = input.required<boolean>();
  
  onClose = output<void>();
  
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    this.close();
  }
  
  close() {
    this.onClose.emit();
  }
  
  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
