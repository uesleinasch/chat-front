import { Component, Input, signal } from '@angular/core';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';

export type MessageType = 'text' | 'image';

export interface Message {
  id: string;
  type: MessageType;
  text?: string;
  imageUrl?: string;
  timestamp: Date;
  isSent: boolean;
  isDelivered?: boolean;
  isRead?: boolean;
}

@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [ImageViewerComponent],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.css'
})
export class MessageBoxComponent {
  @Input() message!: Message;
  
  showImageViewer = signal<boolean>(false);
  
  formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  openImageViewer() {
    if (this.message.type === 'image' && this.message.imageUrl) {
      this.showImageViewer.set(true);
    }
  }
  
  closeImageViewer() {
    this.showImageViewer.set(false);
  }
}
