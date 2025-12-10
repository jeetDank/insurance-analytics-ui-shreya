import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Legend {
  color: string;
  name: string;
  value: number;
}

interface LegendData {
  total: number;
  legends: Legend[];
}

@Component({
  selector: 'app-legend-display',
  imports: [],
  templateUrl: './legend-display.component.html',
  styleUrl: './legend-display.component.scss'
})
export class LegendDisplayComponent {
   @Input() data: LegendData = { total: 0, legends: [] };

  calculatePercentage(value: number): string {
    if (this.data.total === 0) return '0.0';
    return ((value / this.data.total) * 100).toFixed(1);
  }

}
