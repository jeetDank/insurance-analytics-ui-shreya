import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DataService } from '../services/data.service';

interface Metric {
  metric: string;
  value: number;
  metricViewName: string;
  quarter: string;
  company: string;
}

interface CustomFormula {
  id: number;
  name: string;
  formula: string;
  description: string;
  calculatedValue?: number;
  keywords:any[]
}

@Component({
  selector: 'app-custom-formula',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './custom-formula.component.html',
  styleUrl: './custom-formula.component.scss',
})
export class CustomFormulaComponent implements OnInit {
  formulaListView: boolean = true;
  showAddForm: boolean = false;
  formulaForm: FormGroup;

  // Suggestion variables
  showSuggestions: boolean = false;
  filteredSuggestions: Metric[] = [];
  cursorPosition: number = 0;
  currentWord: string = '';

  // Validation
  formulaError: string = '';
  editingFormulaId: number | null = null;

  customFormulaList: CustomFormula[] = [
    // {
    //   id: 1,
    //   name: 'Revenue Growth',
    //   formula: '((revenue - revenue) / revenue) * 100',
    //   description: 'Calculates percentage growth in revenue',
    //   calculatedValue: 0,
    //   keywords:[],
    // },
    // {
    //   id: 2,
    //   name: 'Profit Margin',
    //   formula: '(net_income / revenue) * 100',
    //   description: 'Calculates profit as percentage of revenue',
    //   calculatedValue: 14.12,
    //   keywords:[]
    // },
  ];

  @Input() suggestionsMetrics: any = [
    {
      metric: 'revenue',
      value: 565234,
      metricViewName: 'Revenue',
      quarter: 'Q2 2024',
      company: 'Hartford',
    
    },
    {
      metric: 'net_income',
      value: 85522,
      metricViewName: 'Net Income',
      quarter: 'Q2 2024',
      company: 'Hartford',
    },
  ];

  @Output() formulaListChanged = new EventEmitter<CustomFormula[]>();

  constructor(private snackBar: MatSnackBar, private fb: FormBuilder,private _data:DataService) {
    this.formulaForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      formula: ['', [Validators.required]],
      description: [''],
    });
  }

ngOnInit() {
  this._data.FormulaBucket$.subscribe((data) => {
    console.log('FormulaBucket$ data:', data);
    this.customFormulaList = data;
    
   
    
    // Update filtered list
    this.filteredList = [...this.customFormulaList];
  });

  this.formulaForm.get('formula')?.valueChanges.subscribe((value) => {
    this.validateFormula(value);
  });
  this.searchData('')
}

  extractKeywords(formula: string): string[] {
  if (!formula || formula.trim() === '') {
    return [];
  }

  // Extract all text patterns (letters, numbers, underscores)
  const keywordPattern = /[a-zA-Z_][a-zA-Z0-9_]*/g;
  const matches = formula.match(keywordPattern);

  if (!matches) {
    return [];
  }

  // Remove duplicates and return
  return [...new Set(matches)];
}

  onFormulaInput(event: any) {
    const textarea = event.target;
    const value = textarea.value;
    this.cursorPosition = textarea.selectionStart;

    // Get the current word being typed
    const beforeCursor = value.substring(0, this.cursorPosition);
    const words = beforeCursor.split(/[\s\+\-\*\/\(\)]/);
    this.currentWord = words[words.length - 1].toLowerCase();

    if (this.currentWord.length > 0) {
      this.filteredSuggestions = this.suggestionsMetrics.filter(
        (metric: any) =>
          metric.metric.toLowerCase().includes(this.currentWord) ||
          metric.metricViewName.toLowerCase().includes(this.currentWord)
      );
      this.showSuggestions = this.filteredSuggestions.length > 0;
    } else {
      this.showSuggestions = false;
    }

    // Validate formula
    this.validateFormula(value);
  }

  selectSuggestion(metric: Metric, textarea: HTMLTextAreaElement) {
    const value = textarea.value;
    const beforeCursor = value.substring(0, this.cursorPosition);
    const afterCursor = value.substring(this.cursorPosition);

    // Replace the current word with the selected metric
    const words = beforeCursor.split(/[\s\+\-\*\/\(\)]/);
    const lastWordStart = beforeCursor.lastIndexOf(words[words.length - 1]);

    const newValue =
      value.substring(0, lastWordStart) + metric.metric + afterCursor;

    this.formulaForm.patchValue({ formula: newValue });
    this.showSuggestions = false;

    // Set cursor position after the inserted metric
    setTimeout(() => {
      const newPosition = lastWordStart + metric.metric.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  }

  validateFormula(formula: string): boolean {
    if (!formula || formula.trim() === '') {
      this.formulaError = '';
      return true;
    }

    // Extract all potential metric names from the formula
    const metricPattern = /[a-zA-Z_][a-zA-Z0-9_]*/g;
    const matches = formula.match(metricPattern);

    if (!matches) {
      this.formulaError = '';
      return true;
    }

    const availableMetrics = this.suggestionsMetrics.map((m: any) =>
      m.metric.toLowerCase()
    );
    const unavailableMetrics: string[] = [];

    matches.forEach((match) => {
      const matchLower = match.toLowerCase();
      // Skip common mathematical functions and operators
      const mathFunctions = [
        'abs',
        'sqrt',
        'pow',
        'min',
        'max',
        'floor',
        'ceil',
        'round',
      ];
      if (
        !mathFunctions.includes(matchLower) &&
        !availableMetrics.includes(matchLower)
      ) {
        if (!unavailableMetrics.includes(matchLower)) {
          unavailableMetrics.push(matchLower);
        }
      }
    });

    if (unavailableMetrics.length > 0) {
      this.formulaError = `Metric(s) not available: ${unavailableMetrics.join(
        ', '
      )}`;
      return false;
    }

    this.formulaError = '';
    return true;
  }

  calculateFormulaValue(formula: string): number | null {
    try {
      let processedFormula = formula;

      // Replace metric names with their values
      this.suggestionsMetrics.forEach((metric: any) => {
        const regex = new RegExp(metric.metric, 'gi');
        processedFormula = processedFormula.replace(
          regex,
          metric.value.toString()
        );
      });

      // Evaluate the formula safely
      const result = Function(`"use strict"; return (${processedFormula})`)();
      return typeof result === 'number' && !isNaN(result) ? result : null;
    } catch (error) {
      return null;
    }
  }

  recalculateAllFormulas() {
    this.customFormulaList = this.customFormulaList.map((formula) => ({
      ...formula,
      calculatedValue: this.calculateFormulaValue(formula.formula) ?? undefined,
    }));
    this.emitFormulaList();
  }

  deleteFormula(formulaId: number) {
  this.customFormulaList = this.customFormulaList.filter(
    (formula) => formula.id !== formulaId
  );
  this.filteredList = [...this.customFormulaList]; // Update filtered list after delete
  this.emitFormulaList();
  
  this.snackBar.open('Formula deleted successfully', 'Close', {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  });
}

  editFormula(formulaId: number) {
    const formula = this.customFormulaList.find((f) => f.id === formulaId);
    if (!formula) return;

    this.editingFormulaId = formulaId;
    this.formulaListView = false;
    this.formulaForm.patchValue({
      description: formula.description,
      formula: formula.formula,
      name: formula.name,
    });

    this.snackBar.open('Edit mode activated', 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  toggleFormulaView() {
    this.formulaListView = !this.formulaListView;
    if (this.formulaListView) {
      this.cancelAdd();
    }
  }

  addNewFormula() {
  if (!this.formulaForm.valid) {
    this.snackBar.open('Please fill all required fields', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });
    return;
  }

  const formulaValue = this.formulaForm.value.formula;

  // Validate formula before adding
  if (!this.validateFormula(formulaValue)) {
    this.snackBar.open(this.formulaError, 'Close', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });
    return;
  }

  const calculatedValue = this.calculateFormulaValue(formulaValue);

  if (this.editingFormulaId !== null) {
    // Update existing formula
    const index = this.customFormulaList.findIndex(
      (f) => f.id === this.editingFormulaId
    );
    if (index !== -1) {
      this.customFormulaList[index] = {
        id: this.editingFormulaId,
        name: this.formulaForm.value.name,
        formula: formulaValue,
        description: this.formulaForm.value.description,
        calculatedValue: calculatedValue ?? undefined,
        keywords: this.extractKeywords(formulaValue)
      };
    }
    this.filteredList = [...this.customFormulaList]; // Update filtered list
    this.editingFormulaId = null;
    this.snackBar.open('Formula updated successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  } else {
    // Add new formula
    const newFormula: CustomFormula = {
      id: Date.now(),
      name: this.formulaForm.value.name,
      formula: formulaValue,
      description: this.formulaForm.value.description,
      calculatedValue: calculatedValue ?? undefined,
      keywords: this.extractKeywords(formulaValue)
    };

    this.customFormulaList.push(newFormula);
    this.filteredList = [...this.customFormulaList].reverse(); // Create reversed copy
    
    this.snackBar.open('Formula added successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  this.formulaForm.reset();
  this.formulaError = '';
  this.formulaListView = true;
  this.emitFormulaList();
}

  cancelAdd() {
    this.formulaForm.reset();
    this.formulaError = '';
    this.editingFormulaId = null;
    this.showSuggestions = false;
  }

  emitFormulaList() {
    // this.formulaListChanged.emit([...this.customFormulaList]);

    this._data.updateFunctionList([...this.customFormulaList])
    
    
  }

  onFormulaFocus() {
    // Show all suggestions when focused and empty
    if (!this.formulaForm.value.formula) {
      this.filteredSuggestions = [...this.suggestionsMetrics];
      this.showSuggestions = true;
    }
  }

  onFormulaBlur() {
    // Delay hiding suggestions to allow click on suggestion
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }
  filteredList: any = [];
  searchData(searchQuery: string) {
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      this.filteredList = this.customFormulaList.filter((item: any) =>
        item.name.toLowerCase().includes(query)
      );
    } else {
      // if search is empty, show full list
      this.filteredList = [...this.customFormulaList];
    }
  }
}
