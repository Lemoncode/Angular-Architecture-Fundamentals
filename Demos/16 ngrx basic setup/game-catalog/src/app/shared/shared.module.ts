import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CriteriaComponent } from './criteria/criteria.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [CriteriaComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CriteriaComponent
  ]
})
export class SharedModule { }
