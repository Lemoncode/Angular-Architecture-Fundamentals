import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CriteriaComponent } from './criteria/criteria.component';

@NgModule({
  declarations: [
    CriteriaComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    FormsModule, 
    CriteriaComponent
  ]
})
export class SharedModule { }
