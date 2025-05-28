import { Component, signal } from '@angular/core';
import { MessageInputComponent } from "../../shared/components/message-input/message-input.component";

@Component({
  selector: 'app-chat-send',
  standalone: true,
  imports: [MessageInputComponent],
  templateUrl: './chat-send.component.html',
  styleUrl: './chat-send.component.css'
})
export class ChatSendComponent {
  messages = signal<string[]>([]);
  photos = signal<string[]>([]);

  onMessageReceived(message: string) {
    this.messages.update(msgs => [...msgs, message]);
  }

  onPhotoReceived(photo: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const photoUrl = e.target?.result as string;
      this.photos.update(photos => [...photos, photoUrl]);
    };
    reader.readAsDataURL(photo);
  }
}
