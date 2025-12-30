import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextFormatterPipe } from '../../pipes/text-formatter.pipe';

export interface TableColumn {
  header: string;
  field: string;
  align?: 'left' | 'center' | 'right';
  headerColor?: string;
  cellColor?: string;
  cellRenderer?: (value: any, row: any) => TableCellContent;
}

export interface TableCellContent {
  type: 'text' | 'trend';
  value?: string;
  trend?: {
    direction: 'up' | 'down';
    value: string;
    color?: string;
  };
}

@Component({
  selector: 'app-metric-table',
  standalone: true,
  imports: [CommonModule,TextFormatterPipe],
  templateUrl: './metric-table.component.html',
  styleUrls: ['./metric-table.component.scss']
})
export class MetricTableComponent {

  getRowBackground(index: number): string {
  return index % 2 === 0 ? '#1f1f21' : '#131315';
}

quarterRenderer = (value: any): TableCellContent => ({
  type: 'trend',
  value: value?.value,
  trend: {
    direction: value?.change >= 0 ? 'up' : 'down',
    value: value?.change !== null && 
           value?.change !== undefined && 
           !isNaN(value?.change) 
      ? `${Math.abs(value.change).toFixed(1)}%`
      : 'N/A',
    color: value?.change >= 0
      ? 'rgb(34,197,94)'
      : 'rgb(239,68,68)'
  }
});
  getTrendColor(color?: string, direction?: 'up' | 'down'): string {
  if (color) return color;

  return direction === 'up'
    ? 'rgb(34, 197, 94)'   // green
    : 'rgb(239, 68, 68)';  // red
}


  /* ===== Inputs ===== */

  @Input() columns: TableColumn[] = [
    {
      header: 'Company',
      field: 'company',
      align: 'left'
    },
    {
      header: 'Q2 2025',
      field: 'q2_2025',
      align: 'right',
      cellRenderer: this.quarterRenderer
    },
    {
      header: 'Q3 2025',
      field: 'q3_2025',
      align: 'right',
      cellRenderer: this.quarterRenderer
    },
    {
      header: 'Q4 2025',
      field: 'q4_2025',
      align: 'right',
      cellRenderer: this.quarterRenderer
    }
  ];

  @Input() data: any[] = [
    {
      company: 'Allstate',
      q2_2025: { value: '$14.20B', change: 5.2 },
      q3_2025: { value: '$14.80B', change: 4.2 },
      q4_2025: { value: '$15.10B', change: 2.0 }
    },
    {
      company: 'Progressive',
      q2_2025: { value: '$18.60B', change: 6.1 },
      q3_2025: { value: '$19.40B', change: 4.3 },
      q4_2025: { value: '$20.00B', change: 3.1 }
    },
    {
      company: 'State Farm',
      q2_2025: { value: '$21.30B', change: 3.4 },
      q3_2025: { value: '$21.90B', change: 2.8 },
      q4_2025: { value: '$22.40B', change: 2.3 }
    },
    {
      company: 'Liberty Mutual',
      q2_2025: { value: '$11.90B', change: -1.8 },
      q3_2025: { value: '$11.40B', change: -4.2 },
      q4_2025: { value: '$11.60B', change: 1.7 }
    }
  ];

  @Input() hoverable = true;

  /* ===== Helpers ===== */

  

  getColumnAlignment(column: TableColumn): string {
    return `text-${column.align || 'left'}`;
  }

  getHeaderColor(column: TableColumn): string {
    return column.headerColor || 'rgba(255,255,255,0.53)';
  }

  getCellColor(column: TableColumn): string {
    return column.cellColor || 'rgba(255,255,255,0.93)';
  }

  getCellContent(column: TableColumn, row: any): TableCellContent {
    const value = row[column.field];

    if (column.cellRenderer) {
      return column.cellRenderer(value, row);
    }

    return {
      type: 'text',
      value: value
    };
  }

  /* ===== Cell Renderer ===== */


  getTrendIconClass(direction: 'up' | 'down'): string {
    return direction === 'up'
      ? 'lucide-arrow-up'
      : 'lucide-arrow-down';
  }
}
