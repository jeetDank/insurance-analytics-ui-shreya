import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Metric {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-add-metric',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-metric.component.html',
  styleUrl: './add-metric.component.scss',
})
export class AddMetricComponent {
  @Output() close = new EventEmitter<void>();
  @Output() metricSelected = new EventEmitter<Metric>();

  searchQuery = '';
  activeTab: 'sec' | 'custom' = 'sec';

  @Input() secMetrics: Metric[] = [
    // {
    //   id: 'revenue',
    //   name: 'Revenue',
    //   description: 'Total revenue for the period',
    // },
    // {
    //   id: 'net-income',
    //   name: 'Net Income',
    //   description: 'Net income after all expenses',
    // },
    // {
    //   id: 'operating-income',
    //   name: 'Operating Income',
    //   description: 'Income from operations',
    // },
    // {
    //   id: 'gross-profit',
    //   name: 'Gross Profit',
    //   description: 'Revenue minus cost of goods sold',
    // },
  ];

  @Input() customMetrics: Metric[] = [];

  get filteredMetrics(): Metric[] {
    const metrics = this.activeTab === 'sec' ? this.secMetrics : this.customMetrics;

    if (!this.searchQuery.trim()) {
      return metrics;
    }

    const query = this.searchQuery.toLowerCase();
    return metrics.filter(
      (metric) =>
        metric.name.toLowerCase().includes(query) ||
        metric.description.toLowerCase().includes(query)
    );
  }

  get secMetricsCount(): number {
    return this.secMetrics.length;
  }

  get customMetricsCount(): number {
    return this.customMetrics.length;
  }

  onClose(): void {
    this.close.emit();
  }

  onMetricClick(metric: Metric): void {
    this.metricSelected.emit(metric);
  }

  setActiveTab(tab: 'sec' | 'custom'): void {
    this.activeTab = tab;
  }
}