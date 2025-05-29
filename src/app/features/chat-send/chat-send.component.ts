import { Component, signal, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { MessageInputComponent } from "../../shared/components/message-input/message-input.component";
import { MessageBoxComponent, Message, MessageType } from "../../shared/components/message-box/message-box.component";
import { ApiService } from '../../core/services/api.service';
import { HeaderComponent } from "../../layout/header/header.component";

@Component({
    selector: 'app-chat-send',
    imports: [MessageInputComponent, MessageBoxComponent, HeaderComponent],
    templateUrl: './chat-send.component.html',
    styleUrl: './chat-send.component.css'
})
export class ChatSendComponent implements AfterViewChecked {
  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef<HTMLDivElement>;
  
  private apiService = inject(ApiService);
  
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
    
    // Envia mensagem para a API
    this.sendMessageToApi({ text: message });
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
      
      // Envia foto para a API
      this.sendPhotoToApi(photoData);
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
      
      const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 100;
      
      if (isNearBottom || this.messages().length === 1) {
        setTimeout(() => {
          element.scrollTop = element.scrollHeight;
        }, 0);
      }
    }
  }

  /**
   * Envia mensagem de texto para a API
   */
  private sendMessageToApi(payload: { text: string }): void {
    this.apiService.postData('/api/messages', payload)
      .subscribe({
        next: (response) => {
          console.log('Mensagem enviada com sucesso:', response);
        },
        error: (error) => {
          console.error('Erro ao enviar mensagem:', error);
        }
      });
  }

  /**
   * Envia foto com mensagem para a API
   */
  private sendPhotoToApi(photoData: { file: File; message: string }): void {
    const payload = {
      message: photoData.message || ''
    };
    
    this.apiService.postData('/api/messages/photo', payload, [photoData.file])
      .subscribe({
        next: (response) => {
          console.log('Foto enviada com sucesso:', response);
        },
        error: (error) => {
          console.error('Erro ao enviar foto:', error);
        }
      });
  }
  
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
  
  onCameraImageSent() {
    // Atualiza a lista de mensagens quando uma imagem é enviada pela câmera
    // Aqui podemos implementar uma lógica para recarregar as mensagens se necessário
    console.log('Imagem enviada pela câmera');
  }
}
