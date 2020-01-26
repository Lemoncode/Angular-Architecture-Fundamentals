import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [`
    .nav-full-width {
      width: 100%;
    }

    .nav-end {
      margin-left: auto;
    }
  `]
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
