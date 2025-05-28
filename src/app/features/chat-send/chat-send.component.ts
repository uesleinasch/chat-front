import { Component, signal } from '@angular/core';
import { MessageInputComponent } from "../../shared/components/message-input/message-input.component";
import { MessageBoxComponent, Message, MessageType } from "../../shared/components/message-box/message-box.component";

@Component({
  selector: 'app-chat-send',
  standalone: true,
  imports: [MessageInputComponent, MessageBoxComponent],
  templateUrl: './chat-send.component.html',
  styleUrl: './chat-send.component.css'
})
export class ChatSendComponent {
  messages = signal<Message[]>([]);

  onMessageReceived(message: string) {
    const newMessage: Message = {
      id: this.generateId(),
      type: 'text',
      text: message,
      timestamp: new Date(),
      isSent: true,
      isDelivered: true,
      isRead: false
    };
    
    this.messages.update(msgs => [...msgs, newMessage]);
  }

  onPhotoReceived(photo: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const photoUrl = e.target?.result as string;
      
      const newMessage: Message = {
        id: this.generateId(),
        type: 'image',
        imageUrl: photoUrl,
        timestamp: new Date(),
        isSent: true,
        isDelivered: true,
        isRead: false
      };
      
      this.messages.update(msgs => [...msgs, newMessage]);
    };
    reader.readAsDataURL(photo);
  }
  
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
