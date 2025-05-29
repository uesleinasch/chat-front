import { Component, output, signal, OnDestroy, ElementRef, ViewChild, inject } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-camera-modal',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './camera-modal.component.html',
  styleUrl: './camera-modal.component.css'
})
export class CameraModalComponent implements OnDestroy {
  @ViewChild('video', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;

  private apiService = inject(ApiService);
  
  isOpen = signal(false);
  cameraStream = signal<MediaStream | null>(null);
  capturedImage = signal<string | null>(null);
  isCapturing = signal(false);
  
  onClose = output<void>();
  onImageSent = output<void>();

  async openCamera() {
    this.isOpen.set(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Câmera traseira por padrão
        }, 
        audio: false 
      });
      
      this.cameraStream.set(stream);
      
      // Aguarda um pouco para o elemento estar disponível
      setTimeout(() => {
        if (this.videoElement?.nativeElement) {
          this.videoElement.nativeElement.srcObject = stream;
        }
      }, 100);
      
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      this.handleCameraError(error);
    }
  }

  captureImage() {
    if (!this.videoElement?.nativeElement || !this.canvasElement?.nativeElement) return;
    
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Define o tamanho do canvas igual ao vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Desenha o frame atual do vídeo no canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Converte para base64
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    this.capturedImage.set(imageDataUrl);
    
    // Para o stream da câmera
    this.stopCamera();
  }

  async sendImage() {
    const imageDataUrl = this.capturedImage();
    if (!imageDataUrl) return;
    
    this.isCapturing.set(true);
    
    try {
      // Converte base64 para File
      const file = await this.dataURLtoFile(imageDataUrl, 'camera-capture.jpg');
      
      // Envia para a API
      const payload = { message: '' };
      
      this.apiService.postData('/api/messages/photo', payload, [file])
        .subscribe({
          next: (response) => {
            console.log('Foto enviada com sucesso:', response);
            this.onImageSent.emit();
            this.closeModal();
          },
          error: (error) => {
            console.error('Erro ao enviar foto:', error);
            alert('Erro ao enviar a imagem. Tente novamente.');
          },
          complete: () => {
            this.isCapturing.set(false);
          }
        });
        
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      this.isCapturing.set(false);
    }
  }

  retakePhoto() {
    this.capturedImage.set(null);
    this.openCamera();
  }

  closeModal() {
    this.stopCamera();
    this.capturedImage.set(null);
    this.isOpen.set(false);
    this.onClose.emit();
  }

  private stopCamera() {
    const stream = this.cameraStream();
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      this.cameraStream.set(null);
    }
  }

  private handleCameraError(error: any) {
    let message = 'Erro ao acessar a câmera.';
    
    if (error.name === 'NotAllowedError') {
      message = 'Permissão de câmera negada. Verifique as configurações do navegador.';
    } else if (error.name === 'NotFoundError') {
      message = 'Nenhuma câmera encontrada no dispositivo.';
    } else if (error.name === 'NotSupportedError') {
      message = 'Câmera não suportada neste navegador.';
    }
    
    alert(message);
    this.closeModal();
  }

  private async dataURLtoFile(dataurl: string, filename: string): Promise<File> {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}
