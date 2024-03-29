import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrl: './criteria.component.css',
})
export class CriteriaComponent implements AfterViewInit, OnChanges {
  // listFilter!: string;
  @ViewChild('filterElement', { static: false }) filterElementRef!: ElementRef;
  @Input() displayDetail!: boolean;
  @Input() hitCount!: number;
  hitMessage!: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  private _listFilter!: string;
  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.valueChange.emit(value);
  }

  constructor() {}

  ngAfterViewInit(): void {
    if (this.filterElementRef) {
      this.filterElementRef.nativeElement.focus();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hitCount'] && !changes['hitCount'].currentValue) {
      this.hitMessage = 'No matches found';
    } else {
      this.hitMessage = `Hits: ${this.hitCount}`;
    }
  }
}
