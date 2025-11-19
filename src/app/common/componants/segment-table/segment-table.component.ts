import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

interface SegmentData {
  segment_name: string;
  value: string;
  children?: SegmentData[] | null;
}

interface FlatSegmentData {
  segment_name: string;
  value: string;
  level: number;
  expandable: boolean;
  originalData: SegmentData;
}

@Component({
  selector: 'app-segment-table',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './segment-table.component.html',
  styleUrl: './segment-table.component.scss',
})
export class SegmentTableComponent implements OnInit {
  displayedColumns: string[] = ['segment_name', 'value'];
  dataSource: FlatSegmentData[] = [];

  // ✅ Dummy Data Structure
  segmentData: SegmentData[] = [
    {
      segment_name: 'Corporate',
      value: '$12.5M',
      children: [
        {
          segment_name: 'Marketing',
          value: '$5.2M',
          children: [
            {
              segment_name: 'Digital Ads',
              value: '$2.1M',
              children: null
            },
            {
              segment_name: 'Brand Management',
              value: '$3.1M',
              children: null
            }
          ]
        },
        {
          segment_name: 'Finance',
          value: '$4.8M',
          children: [
            {
              segment_name: 'Accounting',
              value: '$2.4M',
              children: null
            },
            {
              segment_name: 'Audit',
              value: '$2.4M',
              children: null
            }
          ]
        },
        {
          segment_name: 'Human Resources',
          value: '$2.5M',
          children: null
        }
      ]
    },
    {
      segment_name: 'Technology',
      value: '$20.3M',
      children: [
        {
          segment_name: 'Engineering',
          value: '$12.0M',
          children: [
            {
              segment_name: 'Frontend',
              value: '$4.7M',
              children: null
            },
            {
              segment_name: 'Backend',
              value: '$7.3M',
              children: null
            }
          ]
        },
        {
          segment_name: 'IT Support',
          value: '$3.2M',
          children: null
        },
        {
          segment_name: 'Security',
          value: '$5.1M',
          children: null
        }
      ]
    }
  ];

  ngOnInit() {
    this.dataSource = this.flattenAll(this.segmentData, 0);
  }

  private flattenAll(
    data: SegmentData[],
    level: number,
    result: FlatSegmentData[] = []
  ): FlatSegmentData[] {
    data.forEach((item) => {
      const flatItem: FlatSegmentData = {
        segment_name: item.segment_name,
        value: item.value,
        level: level,
        expandable: !!item.children,
        originalData: item,
      };
      result.push(flatItem);

      // Always flatten children (no toggle)
      if (item.children && item.children.length > 0) {
        this.flattenAll(item.children, level + 1, result);
      }
    });

    return result;
  }

  getIndentation(level: number): string {
    return `${level * 24}px`;
  }
}
