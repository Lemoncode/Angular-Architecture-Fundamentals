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
import { VideoConsoleEffects } from './state/video-consoles.effects';
import { EffectsModule } from '@ngrx/effects';

const routes: Routes = [
  { path: '', component: VideoConsoleBoardComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('videoconsoles', reducer),
    EffectsModule.forFeature([ VideoConsoleEffects ]),
  ],
  declarations: [
    VideoConsoleEditComponent,
    VideoConsoleListComponent,
    VideoConsoleBoardComponent
  ],
  providers: [
    VideoConsoleService
  ]
})
export class VideoConsolesModule { }
