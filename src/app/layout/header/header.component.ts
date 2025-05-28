import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { UserPicComponent } from "../../shared/components/user-pic/user-pic.component";
import { NgIcon } from '@ng-icons/core';
import { IconsComponent } from "../../shared/components/icons/icon.component";
import { ButtonComponent } from "../../shared/components/button/button.component";
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, UserPicComponent, NgIcon, IconsComponent, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
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
