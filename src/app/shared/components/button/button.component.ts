import { Component, input, output, computed } from '@angular/core';
import { IconsLibrary } from '../icons/model/icons.type';
import { IconsComponent } from "../icons/icon.component";

@Component({
    selector: 'app-button',
    imports: [IconsComponent],
    templateUrl: './button.component.html',
    styleUrl: './button.component.css'
})
export class ButtonComponent {
  label = input<string>('Click Me');
  icon = input<IconsLibrary>();
  disabled = input<boolean>(false);
  variant = input<'primary' | 'secondary' | 'tertiary'>('primary');
  type = input<'round' | 'square' | 'text' | 'circle'>('round');
  size = input<'small' | 'medium' | 'large'>('medium');
  id = input<string>('');
  name = input<string>('');
  ariaLabel = input<string>('');

  // Output para eventos de click
  onClick = output<void>();

  // Mapeamento de tamanhos do botão para ícone
  private iconSizeMap = {
    small: 'sm' as const,
    medium: 'md' as const,
    large: 'lg' as const
  };
  
  iconSize = computed(() => this.iconSizeMap[this.size()]);

  handleClick() {
    if (!this.disabled()) {
      this.onClick.emit();
    }
  }
}
