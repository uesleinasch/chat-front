import { Component } from '@angular/core';
import { BodyComponent } from './layout/body/body.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { PwaInstallPromptComponent } from './shared/components/pwa-install-prompt/pwa-install-prompt.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BodyComponent, FooterComponent, HeaderComponent, PwaInstallPromptComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'chat-front';
}

