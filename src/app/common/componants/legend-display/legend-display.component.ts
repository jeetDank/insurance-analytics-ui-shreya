import { Component, Input } from '@angular/core';
export interface LegendItem {
  name: string;
  color: string;
  value: number;
  percentage: number;
  children?: LegendItem[];
}

export interface LegendData {
  total: number;
  legends: LegendItem[];
}

@Component({
  selector: 'app-legend-display',
  templateUrl: './legend-display.component.html',
  styleUrls: ['./legend-display.component.scss'],
})
export class LegendDisplayComponent {
  @Input() data: LegendData = {
    total: 54.2,
    legends: [
      {
        name: 'Property-Liability',
        color: 'rgb(59, 130, 246)',
        value: 42.8,
        percentage: 79.0,
        children: [
          {
            name: 'Allstate Brand',
            color: 'rgb(47, 104, 197)',
            value: 34.2,
            percentage: 63.1,
          },
          {
            name: 'National General',
            color: 'rgb(47, 104, 197)',
            value: 5.4,
            percentage: 10.0,
          },
          {
            name: 'Encompass',
            color: 'rgb(47, 104, 197)',
            value: 2.1,
            percentage: 3.9,
          },
          {
            name: 'Esurance',
            color: 'rgb(47, 104, 197)',
            value: 1.1,
            percentage: 2.0,
          },
        ],
      },
    ],
  };

  round(value?: number): string {
    return value == null ? '0.0' : value.toFixed(1);
  }
}
