import { Component, input, output, inject } from '@angular/core';
import { Location } from '@angular/common';
import { UserPicComponent } from "../../shared/components/user-pic/user-pic.component";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { appTitle } from '../../core/consts/app.const';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [UserPicComponent, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private location = inject(Location);
    title = appTitle
  variant = input<'inner' | 'out'>('out');
  onBack = output<void>();
  onCall = output<string>();
  
  goBack() {
    this.location.back();
    this.onBack.emit();
  }
  
  makeCall() {
    const phoneNumber = '5541988507683';
    window.open(`tel:${phoneNumber}`, '_self');
    this.onCall.emit(phoneNumber);
  }
  
  async openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      console.log('Câmera aberta com sucesso', stream);
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      
      if ((error as any).name === 'NotAllowedError') {
        alert('Permissão de câmera negada. Verifique as configurações do navegador.');
      } else if ((error as any).name === 'NotFoundError') {
        alert('Nenhuma câmera encontrada no dispositivo.');
      } else {
        alert('Erro ao acessar a câmera.');
      }
    }
  }
}
