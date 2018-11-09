import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShellComponent } from './home/shell.component';
import { WelcomeComponent } from './home/welcome.component';
import { PageNotFoundComponent } from './home/page-not-found.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        component: ShellComponent,
        children: [
          { path: 'welcome', component: WelcomeComponent },
          { path: 'games', loadChildren: './games/games.module#GamesModule' },
          { path: 'videoconsoles', loadChildren: './video-consoles/video-consoles.module#VideoConsolesModule' },
          { path: '', redirectTo: 'welcome', pathMatch: 'full' },
        ]
      },
      { path: '**', component: PageNotFoundComponent }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
