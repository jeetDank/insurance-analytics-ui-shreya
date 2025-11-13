import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-msg-bubble',
  imports: [CommonModule],
  templateUrl: './msg-bubble.component.html',
  styleUrl: './msg-bubble.component.scss'
})
export class MsgBubbleComponent {


  timestamp = input<string>("12:00 pm");
  isSystemMsg = input<boolean>(false)

}
