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
  imagePreview = signal<string>('');
  selectedFile = signal<File | null>(null);
  
  // ViewChild para acessar o input de arquivo
  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  
  // Outputs para comunicação com o parent
  onSendMessage = output<string>();
  onSendPhoto = output<{ file: File; message: string }>();

  updateMessage(event: Event) {
    const input = event.target as HTMLInputElement;
    this.message.set(input.value);
  }

  sendMessage() {
    const msg = this.message().trim();
    const file = this.selectedFile();
    
    if (file) {
      // Enviar imagem com mensagem (pode ser vazia)
      this.onSendPhoto.emit({ file, message: msg });
      this.clearImagePreview();
    } else if (msg) {
      // Enviar apenas mensagem
      this.onSendMessage.emit(msg);
    }
    
    // Limpar campos
    this.message.set('');
    const input = document.querySelector('.message-input__field') as HTMLInputElement;
    if (input) input.value = '';
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
      this.selectedFile.set(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      input.value = '';
    }
  }

  clearImagePreview() {
    this.imagePreview.set('');
    this.selectedFile.set(null);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage(); 
    }
  }
}
