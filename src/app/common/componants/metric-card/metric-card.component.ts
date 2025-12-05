import { Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { TextFormatterPipe } from '../../pipes/text-formatter.pipe';

interface trend {
  trend: string;
  trendUnit: string;
  positive: boolean;
}

@Component({
  selector: 'app-metric-card',
  imports: [MatChipsModule,TextFormatterPipe],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss',
})
export class MetricCardComponent {
  CompanyName = input<string>('State Farm');
  period = input<string>('Q3 2024');
  metric = input<string>('$20.50B');
  logo = input<string>('');
  trend = input<trend>({ trend: '3.8', trendUnit: '%', positive: false });
}
