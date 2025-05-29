import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from "../../layout/footer/footer.component";
import { HeaderComponent } from "../../layout/header/header.component";

interface ChatMessage {
  id: string;
  date: Date;
  preview: string;
  fullMessage: string;
  sender: string;
}

@Component({
    selector: 'app-chat-list',
    imports: [CommonModule, FormsModule, FooterComponent, HeaderComponent],
    templateUrl: './chat-list.component.html',
    styleUrl: './chat-list.component.css'
})
export class ChatListComponent {
  searchText = signal('');
  
  mockChats = signal<ChatMessage[]>([
    {
      id: '1',
      date: new Date('2025-05-28T10:30:00'),
      preview: 'Olá! Como você está hoje?',
      fullMessage: 'Olá! Como você está hoje? Espero que esteja tudo bem com você.',
      sender: 'João Silva'
    },
    {
      id: '2',
      date: new Date('2025-05-28T09:15:00'),
      preview: 'Reunião marcada para amanhã',
      fullMessage: 'Reunião marcada para amanhã às 14h na sala de conferências. Não esqueça dos documentos.',
      sender: 'Maria Santos'
    },
    {
      id: '3',
      date: new Date('2025-05-27T16:45:00'),
      preview: 'Projeto finalizado com sucesso!',
      fullMessage: 'Projeto finalizado com sucesso! Todos os testes passaram e está pronto para produção.',
      sender: 'Pedro Costa'
    },
    {
      id: '4',
      date: new Date('2025-05-27T14:20:00'),
      preview: 'Você viu o relatório mensal?',
      fullMessage: 'Você viu o relatório mensal? Preciso da sua revisão até sexta-feira.',
      sender: 'Ana Oliveira'
    },
    {
      id: '5',
      date: new Date('2025-05-26T11:10:00'),
      preview: 'Parabéns pelo excelente trabalho',
      fullMessage: 'Parabéns pelo excelente trabalho na apresentação de ontem. O cliente ficou muito satisfeito.',
      sender: 'Carlos Lima'
    }
  ]);

  filteredChats = computed(() => {
    const search = this.searchText().toLowerCase().trim();
    
    if (!search) {
      return this.mockChats();
    }

    return this.mockChats().filter(chat => 
      chat.fullMessage.toLowerCase().includes(search) ||
      chat.sender.toLowerCase().includes(search) ||
      this.formatDate(chat.date).includes(search)
    );
  });

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchText.set(input.value);
  }

  onSearchClick() {
    // Trigger search - could add analytics or other logic here
    console.log('Searching for:', this.searchText());
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  getPreviewText(message: string, maxWords: number = 8): string {
    const words = message.split(' ');
    if (words.length <= maxWords) {
      return message;
    }
    return words.slice(0, maxWords).join(' ') + '...';
  }
} 
