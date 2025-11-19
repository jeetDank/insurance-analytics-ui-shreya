import { Component, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

interface tableData {
  "Company Name": string;
  "Quarter": string;
  "Value": string;
  "Change": string;
  isPositive: boolean;
}

@Component({
  selector: 'app-metric-table',
  imports: [MatTableModule],
  templateUrl: './metric-table.component.html',
  styleUrl: './metric-table.component.scss',
})
export class MetricTableComponent implements OnInit {
  tableHeader = signal<string>('Table Header');
  displayedColumns: string[] = ['Company Name','Quarter','Value','Change'];
  tableData = signal<tableData[]>([
    {
      "Company Name": 'Allstate',
      "Quarter": 'Q1 2025',
      "Value": '$20.50B',
      "Change": '+3.8%',
      isPositive: false,
    },
  ]);

  dataSource: tableData[] = [];

  ngOnInit(): void {
    this.dataSource = this.tableData(); // Access signal value with ()
  }
}