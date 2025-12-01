import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './metric-table.component.html',
  styleUrl: './metric-table.component.scss',
})
export class MetricTableComponent  {
 @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() hoverable: boolean = true;

  getColumnAlignment(column: TableColumn): string {
    return `text-${column.align || 'left'}`;
  }

  getHeaderColor(column: TableColumn): string {
    return column.headerColor || 'rgba(255, 255, 255, 0.53)';
  }

  getCellColor(column: TableColumn): string {
    return column.cellColor || 'rgba(255, 255, 255, 0.93)';
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

  getTrendColor(color?: string): string {
    return color || 'rgb(239, 68, 68)';
  }

  getTrendIconClass(direction: 'up' | 'down'): string {
    return direction === 'up' ? 'lucide-arrow-up' : 'lucide-arrow-down';
  }
}