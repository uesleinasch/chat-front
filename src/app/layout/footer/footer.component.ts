import { Component } from '@angular/core';
import { ButtonComponent } from "../../shared/components/button/button.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  makeCall() {
    const phoneNumber = '+5541988507683'; 
    window.location.href = `tel:${phoneNumber}`;
  }
}
