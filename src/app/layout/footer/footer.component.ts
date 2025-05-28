import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from "../../shared/components/button/button.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  private router = inject(Router);

  navigateToSend() {
    this.router.navigate(['/chat-send']);
  }

  navigateToConversations() {
    this.router.navigate(['/chat-list']);
  }

  makeCall() {
    const phoneNumber = '+5541988507683'; 
    window.location.href = `tel:${phoneNumber}`;
  }
}
