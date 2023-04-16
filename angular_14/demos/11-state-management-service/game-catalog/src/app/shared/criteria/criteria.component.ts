import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output
} from '@angular/core';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.css'],
})
export class CriteriaComponent implements OnInit, AfterViewInit, OnChanges {
  // listFilter!: string;
  @ViewChild('filterElement') filterElementRef!: ElementRef;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hitCount'] && !changes['hitCount'].currentValue) {
      this.hitMessage = 'No matches found';
    } else {
      this.hitMessage = `Hits: ${this.hitCount}`;
    }
  }

  ngAfterViewInit(): void {
    if (this.filterElementRef) {
      this.filterElementRef.nativeElement.focus();
    }
  }

  ngOnInit(): void {}
}
