import { Component, output, signal, ElementRef, viewChild } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'app-message-input',
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
      // Limpa qualquer estado anterior
      this.clearImagePreview();
      
      // Pequeno delay para garantir que o input foi limpo
      setTimeout(() => {
        input.click();
      }, 100);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file && file.type.startsWith('image/')) {
      this.selectedFile.set(file);
      
      // Criar preview da imagem - versão mais robusta para PWA
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          // Force update do signal para garantir que a mudança seja detectada
          this.imagePreview.set('');
          setTimeout(() => {
            this.imagePreview.set(result);
          }, 10);
        }
      };
      
      reader.onerror = (error) => {
        console.error('Erro ao ler arquivo:', error);
        this.clearImagePreview();
      };
      
      reader.readAsDataURL(file);
      input.value = '';
    }
  }

  clearImagePreview() {
    this.imagePreview.set('');
    this.selectedFile.set(null);
    
    // Força limpeza do input file
    const input = this.fileInput()?.nativeElement;
    if (input) {
      input.value = '';
    }
  }

  onImageLoad() {
    console.log('Preview carregado com sucesso');
  }
  
  onImageError() {
    console.error('Erro ao carregar preview');
    this.clearImagePreview();
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage(); 
    }
  }
}
