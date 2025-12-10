import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Legend {
  color: string;
  name: string;
  value: number;
  percentage:number
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

  round(value: number): string {
    if (value === 0 || value == null) return '0.0';
    return (value).toFixed(1);
  }

}
