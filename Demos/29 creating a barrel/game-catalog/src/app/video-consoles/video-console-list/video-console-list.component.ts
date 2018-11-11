import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VideoConsoleModel } from '../video-console.model';


@Component({
  selector: 'app-video-console-list',
  templateUrl: './video-console-list.component.html',
  styleUrls: ['./video-console-list.component.css']
})
export class VideoConsoleListComponent {
  @Input() errorMessage: string;
  @Input() displayCode: boolean;
  @Input() videoConsoles: VideoConsoleModel[];
  @Input() selectedVideoConsole: VideoConsoleModel;
  @Output() checked = new EventEmitter<boolean>();
  @Output() initializeNewVideoConsole = new EventEmitter<void>();
  @Output() selected = new EventEmitter<VideoConsoleModel>();

  /*diff*/
  checkChanged(value: boolean): void {
    this.checked.emit(value);
  }

  newVideoConsole(): void {
    this.initializeNewVideoConsole.emit();
  }

  videoConsoleSelected(videoconsole: VideoConsoleModel): void {
    this.selected.emit(videoconsole);
  }
  /*diff*/
}
