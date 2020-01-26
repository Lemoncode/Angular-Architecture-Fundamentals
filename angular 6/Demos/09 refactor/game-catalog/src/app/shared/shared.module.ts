import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CriteriaComponent } from './criteria/criteria.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [CriteriaComponent],
  exports: [
    CommonModule,
    FormsModule,
    CriteriaComponent
  ]
})
export class SharedModule { }
