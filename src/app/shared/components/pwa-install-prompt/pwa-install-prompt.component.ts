import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pwa-install-prompt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pwa-install-prompt.component.html',
  styleUrl: './pwa-install-prompt.component.css'
})
export class PwaInstallPromptComponent {
  isVisible = signal(true);
  deferredPrompt = signal<any>(null);

  ngOnInit() {
    this.setupPWAInstall();
  }

  private setupPWAInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt.set(e);
    });

    // Verifica se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isVisible.set(false);
    }
  }

  async install() {
    const promptEvent = this.deferredPrompt();
    if (!promptEvent) return;

    promptEvent.prompt();
    const result = await promptEvent.userChoice;
    
    if (result.outcome === 'accepted') {
      this.isVisible.set(false);
    }
    
    this.deferredPrompt.set(null);
  }

  dismiss() {
    this.isVisible.set(false);
  }
}
