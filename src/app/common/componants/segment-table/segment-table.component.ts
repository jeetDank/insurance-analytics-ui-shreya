

import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule,TitleCasePipe } from '@angular/common';

export interface SegmentData {
  metric_name: string;
  value: string;
  unit?: string;
  percentage: string;
  children?: SegmentData[];
}



@Component({
  selector: 'app-segment-table',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './segment-table.component.html',
  styleUrl: './segment-table.component.scss',
})
export class SegmentTableComponent implements OnInit, OnChanges {
  @Input() data: SegmentData[] = [];
  @Input() showTotal: boolean = true;
  @Input() segment_name: string = "Value";

  // Color palette for top-level segments
  colors = [
    'rgb(59, 130, 246)',   // blue
    'rgb(16, 185, 129)',   // green
    'rgb(245, 158, 11)',   // amber
    'rgb(239, 68, 68)',    // red
    'rgb(168, 85, 247)',   // purple
    'rgb(236, 72, 153)',   // pink
    'rgb(14, 165, 233)',   // sky
    'rgb(34, 197, 94)',    // lime
  ];

  flattenedData: Array<{
    item: SegmentData;
    level: number;
    color: string;
    isTopLevel: boolean;
    isLastChild: boolean;
  }> = [];

  ngOnInit() {
    console.log('SegmentTable ngOnInit - data:', this.data);
    this.flattenData();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('SegmentTable ngOnChanges - changes:', changes);
    if (changes['data']) {
      console.log('Data changed:', changes['data'].currentValue);
      this.flattenData();
    }
  }

  flattenData() {
    console.log('Flattening data:', this.data);
    this.flattenedData = [];
    
    if (!this.data || this.data.length === 0) {
      console.log('No data to flatten');
      return;
    }

    let colorIndex = 0;

    const flatten = (
      items: SegmentData[],
      level: number = 0,
      parentColor: string = '',
      isLastInParent: boolean = false
    ) => {
      items.forEach((item, index) => {
        const isTopLevel = level === 0;
        const currentColor = isTopLevel 
          ? this.colors[colorIndex % this.colors.length] 
          : parentColor;
        const isLastChild = index === items.length - 1;

        this.flattenedData.push({
          item,
          level,
          color: currentColor,
          isTopLevel,
          isLastChild: isLastChild && isLastInParent
        });

        if (isTopLevel) {
          colorIndex++;
        }

        if (item.children && item.children.length > 0) {
          flatten(item.children, level + 1, currentColor, isLastChild);
        }
      });
    };

    flatten(this.data);
    console.log('Flattened data:', this.flattenedData);
  }

  getPaddingLeft(level: number): string {
    const basePadding = 12;
    const increment = 16;
    return `${basePadding + (level * increment)}px`;
  }

  getBackgroundColor(isTopLevel: boolean, color: string): string {
    if (isTopLevel) {
      return `${color.replace('rgb', 'rgba').replace(')', ', 0.03)')}`;
    }
    return 'transparent';
  }

  calculateTotal(): { totalValue: string; totalPercentage: string } {
    if (!this.data || this.data.length === 0) {
      return { totalValue: '$0.00', totalPercentage: '0.0%' };
    }

    // Sum up only top-level items
    let total = 0;
    this.data.forEach(item => {
      const value = parseFloat(item.value.replace(/[$,BMK]/g, ''));
      const unit = item.value.match(/[BMK]/)?.[0] || '';

      let multiplier = 1;
      if (unit === 'B') multiplier = 1000000000;
      else if (unit === 'M') multiplier = 1000000;
      else if (unit === 'K') multiplier = 1000;

      total += value * multiplier;
    });

    // Format the total
    let formattedTotal = '';
    if (total >= 1000000000) {
      formattedTotal = `$${(total / 1000000000).toFixed(2)}B`;
    } else if (total >= 1000000) {
      formattedTotal = `$${(total / 1000000).toFixed(2)}M`;
    } else if (total >= 1000) {
      formattedTotal = `$${(total / 1000).toFixed(2)}K`;
    } else {
      formattedTotal = `$${total.toFixed(2)}`;
    }

    return { totalValue: formattedTotal, totalPercentage: '100.0%' };
  }
}