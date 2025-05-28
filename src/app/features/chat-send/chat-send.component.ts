import { Component, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { MessageInputComponent } from "../../shared/components/message-input/message-input.component";
import { MessageBoxComponent, Message, MessageType } from "../../shared/components/message-box/message-box.component";

@Component({
  selector: 'app-chat-send',
  standalone: true,
  imports: [MessageInputComponent, MessageBoxComponent],
  templateUrl: './chat-send.component.html',
  styleUrl: './chat-send.component.css'
})
export class ChatSendComponent implements AfterViewChecked {
  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef<HTMLDivElement>;
  
  messages = signal<Message[]>([]);
  private shouldScrollToBottom = false;
  private lastMessageCount = 0;
 
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
    this.shouldScrollToBottom = true;
  }

  onPhotoReceived(photoData: { file: File; message: string }) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const photoUrl = e.target?.result as string;
      
      const newMessage: Message = {
        id: this.generateId(),
        type: 'image',
        imageUrl: photoUrl,
        text: photoData.message || undefined,
        timestamp: new Date(),
        isSent: true,
        isDelivered: true,
        isRead: false
      };
      
      this.messages.update(msgs => [...msgs, newMessage]);
      this.shouldScrollToBottom = true;
    };
    reader.readAsDataURL(photoData.file);
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom && this.messages().length > this.lastMessageCount) {
      this.scrollToBottom();
      this.lastMessageCount = this.messages().length;
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      
      // Verifica se o usuário está próximo ao final (dentro de 100px)
      const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 100;
      
      // Só rola se estiver próximo ao final ou se for a primeira mensagem
      if (isNearBottom || this.messages().length === 1) {
        setTimeout(() => {
          element.scrollTop = element.scrollHeight;
        }, 0);
      }
    }
  }
  
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
