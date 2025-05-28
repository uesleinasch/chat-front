import { Component, signal } from '@angular/core';
import { MessageInputComponent } from '../../shared/components/message-input/message-input.component';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [MessageInputComponent],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {

}
