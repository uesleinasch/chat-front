import { Component, output, signal, ElementRef, viewChild } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css'
})
export class MessageInputComponent {
  message = signal<string>('');
  isRecording = signal<boolean>(false);
  
  // ViewChild para acessar o input de arquivo
  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  
  // Outputs para comunicação com o parent
  onSendMessage = output<string>();
  onSendPhoto = output<File>();

  updateMessage(event: Event) {
    const input = event.target as HTMLInputElement;
    this.message.set(input.value);
  }

  sendMessage() {
    const msg = this.message().trim();
    if (msg) {
      this.onSendMessage.emit(msg);
      this.message.set('');
      // Limpar o input visualmente
      const input = document.querySelector('.message-input__field') as HTMLInputElement;
      if (input) input.value = '';
    }
  }

  openCamera() {
    const input = this.fileInput()?.nativeElement;
    if (input) {
      input.click();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file && file.type.startsWith('image/')) {
      this.onSendPhoto.emit(file);
      input.value = '';
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
