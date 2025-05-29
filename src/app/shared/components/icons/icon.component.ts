import { Component, input } from '@angular/core';
import { IconsLibrary } from './model/icons.type';

@Component({
    selector: 'app-icon',
    imports: [],
    templateUrl: './icon.component.html',
    styleUrl: './icon.component.css'
})
export class IconsComponent {
  size = input<string>('1rem');
  icon = input<IconsLibrary>();
}
