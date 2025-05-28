import { Component, input } from '@angular/core';

@Component({
  selector: 'app-user-pic',
  standalone: true,
  imports: [],
  templateUrl: './user-pic.component.html',
  styleUrl: './user-pic.component.css'
})
export class UserPicComponent {
  imageUrl = input.required<string>();
  width = input<number>(48);
  height = input<number>(48);
}
