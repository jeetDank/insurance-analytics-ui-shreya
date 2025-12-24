import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Ambiguity {
  query?: string;
  selected_ambiguity: string;
  suggestions: string[];
}

@Component({
  selector: 'app-ambiguity-resolver',
  imports: [CommonModule],
  templateUrl: './ambiguity-resolver.component.html',
  styleUrl: './ambiguity-resolver.component.scss'
})
export class AmbiguityResolverComponent {
  @Input() ambiguities: Ambiguity[] = [];
  @Input() timestamp: string = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  @Output() ambiguitiesUpdate = new EventEmitter<Ambiguity[]>();
  @Output() ambiguityResolved = new EventEmitter<boolean>();
  
  currentIndex: number = 0;

  get currentAmbiguity(): Ambiguity | null {
    return this.ambiguities[this.currentIndex] || null;
  }

  get totalAmbiguities(): number {
    return this.ambiguities.length;
  }

  get canGoPrevious(): boolean {
    return this.currentIndex > 0;
  }

  get canGoNext(): boolean {
    return this.currentIndex < this.totalAmbiguities - 1;
  }

  // Convert to getter - checks if ANY ambiguity is still unresolved
  get pendingResolution(): boolean {
    return this.ambiguities.some(amb => !amb.selected_ambiguity || amb.selected_ambiguity.trim() === "");
  }

  handlePrevious(): void {
    if (this.canGoPrevious) {
      this.currentIndex--;
    }
  }

  handleNext(): void {
    if (this.canGoNext) {
      this.currentIndex++;
    }
  }

  handleSuggestionClick(suggestion: string): void {
    const updatedAmbiguities = [...this.ambiguities];
    updatedAmbiguities[this.currentIndex] = {
      ...updatedAmbiguities[this.currentIndex],
      selected_ambiguity: suggestion
    };
   
    this.ambiguitiesUpdate.emit(updatedAmbiguities);
  }

  notifyAmbiguityResolution(): void {
    // Only emit true - button is only clickable when all are resolved
    this.ambiguityResolved.emit(true);
  }

  isSelected(suggestion: string): boolean {
    return this.currentAmbiguity?.selected_ambiguity === suggestion;
  }
}