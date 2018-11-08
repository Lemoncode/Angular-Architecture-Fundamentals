import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
// import { CommonModule } from '@angular/common';

import { VideoConsoleService } from './video-console.service';
import { VideoConsoleEditComponent } from './video-console-edit/video-console-edit.component';

@NgModule({
  imports: [
    // CommonModule
    SharedModule
  ],
  declarations: [VideoConsoleEditComponent],
  providers: [
    VideoConsoleService
  ]
})
export class VideoConsolesModule { }
