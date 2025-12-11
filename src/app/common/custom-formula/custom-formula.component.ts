import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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
    ReactiveFormsModule
  ],
  templateUrl: './custom-formula.component.html',
  styleUrl: './custom-formula.component.scss'
})
export class CustomFormulaComponent {
  formulaListView: boolean = false;
  showAddForm: boolean = false;
  formulaForm: FormGroup;

  customFormulaList = [
    {
      id: 1,
      name: "Revenue Growth",
      formula: "((Current Revenue - Previous Revenue) / Previous Revenue) * 100",
      description: "Calculates percentage growth in revenue"
    },
    {
      id: 2,
      name: "Profit Margin",
      formula: "(Net Profit / Revenue) * 100",
      description: "Calculates profit as percentage of revenue"
    }
  ];

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.formulaForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      formula: ['', [Validators.required]],
      description: ['']
    });
  }

  deleteFormula(formulaId: number) {
    this.customFormulaList = this.customFormulaList.filter(formula => formula.id !== formulaId);
    this.snackBar.open('Formula deleted successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  editFormula(formulaId: number) {
    // Implement edit functionality
    console.log('Edit formula:', formulaId);
    this.snackBar.open('Edit mode activated', 'Close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  toggleFormulaView() {
    this.formulaListView = !this.formulaListView;
  }


  addNewFormula() {
    if (this.formulaForm.valid) {
      const newFormula = {
        id: Date.now(),
        name: this.formulaForm.value.name,
        formula: this.formulaForm.value.formula,
        description: this.formulaForm.value.description
      };
      
      this.customFormulaList.push(newFormula);
      this.formulaForm.reset();
      this.showAddForm = false;
      
      this.snackBar.open('Formula added successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    } else {
      this.snackBar.open('Please fill all required fields', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
  }

  cancelAdd() {
    this.showAddForm = false;
    this.formulaForm.reset();
  }
}