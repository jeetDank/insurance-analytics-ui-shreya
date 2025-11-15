import { Component, input } from '@angular/core';

@Component({
  selector: 'app-insights-card',
  imports: [],
  templateUrl: './insights-card.component.html',
  styleUrl: './insights-card.component.scss'
})
export class InsightsCardComponent {
 icon = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
  source = input.required<string>();
}
