import { Component, input, output, inject, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { UserPicComponent } from "../../shared/components/user-pic/user-pic.component";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { CameraModalComponent } from "../../shared/components/camera-modal/camera-modal.component";
import { appTitle } from '../../core/consts/app.const';

@Component({
    selector: 'app-header',
    imports: [UserPicComponent, ButtonComponent, CameraModalComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
  @ViewChild(CameraModalComponent, { static: false }) cameraModal!: CameraModalComponent;
  
  private location = inject(Location);
  title = appTitle
  variant = input<'inner' | 'out'>('out');
  onBack = output<void>();
  onCall = output<string>();
  onImageSent = output<void>();
  
  goBack() {
    this.location.back();
    this.onBack.emit();
  }
  
  makeCall() {
    const phoneNumber = '5541988507683';
    window.open(`tel:${phoneNumber}`, '_self');
    this.onCall.emit(phoneNumber);
  }
  
  openCamera() {
    this.cameraModal.openCamera();
  }
  
  onCameraModalClose() {
    // Modal fechado
  }
  
  onCameraImageSent() {
    this.onImageSent.emit();
  }
}
