import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { VideoConsoleService } from './video-console.service';
import { VideoConsoleEditComponent } from './video-console-edit/video-console-edit.component';
import { VideoConsoleListComponent } from './video-console-list/video-console-list.component';
import { VideoConsoleBoardComponent } from './video-console-board/video-console-board.component';

/*NgRx*/
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/video-consoles.reducer';

const routes: Routes = [
  { path: '', component: VideoConsoleBoardComponent }
];

@NgModule({
  declarations: [VideoConsoleEditComponent, VideoConsoleListComponent, VideoConsoleBoardComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('videoconsoles', reducer),
  ],
  providers:[
    VideoConsoleService
  ]
})
export class VideoConsolesModule { }
