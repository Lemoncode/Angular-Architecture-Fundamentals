import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameParameterService {
  showImage: boolean;
  filterBy: string;

  constructor() { }
}
