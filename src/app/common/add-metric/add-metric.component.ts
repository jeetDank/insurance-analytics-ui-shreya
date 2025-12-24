import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from '../services/data.service';

interface Metric {
  id: string;
  name: string;
  description: string;
}

interface FormulaData {
  id: number;
  name: string;
  formula: string;
  description: string;
  keywords: string[];
}

@Component({
  selector: 'app-add-metric',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-metric.component.html',
  styleUrl: './add-metric.component.scss',
})
export class AddMetricComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Output() metricSelected = new EventEmitter<Metric>();

  searchQuery = '';
  activeTab: 'sec' | 'custom' = 'sec';

  @Input() secMetrics: Metric[] = [];

  customMetrics: Metric[] = [];

  private destroy$ = new Subject<void>();

  constructor(public _dataService: DataService) {} // Replace 'any' with your actual DataService type

  ngOnInit(): void {
    this.loadCustomFormulas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load custom formulas from FormulaBucket$ and convert to Metric format
   */
  private loadCustomFormulas(): void {
    this._dataService.FormulaBucket$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: FormulaData[]) => {
        if (data && Array.isArray(data)) {
          this.customMetrics = this.convertFormulasToMetrics(data);
        }
      });
  }

  /**
   * Convert formula data to metric format
   */
  private convertFormulasToMetrics(formulas: FormulaData[]): Metric[] {
    return formulas.map(formula => ({
      id: formula.id.toString(),
      name: formula.name,
      description: formula.description || formula.formula
    }));
  }

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