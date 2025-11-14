import { Component, input } from '@angular/core';

@Component({
  selector: 'app-step',
  imports: [],
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss'
})
export class StepComponent {

  title = input("step title")
  description = input("step description")

}
