import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators'


import { HTTP_DATA_LOGGER } from '../core/http-data-logger.service';
import { HTTP_ERROR_HANDLER } from '../core/http-error-handler.service';


import { VideoConsoleModel } from './video-console.model';

@Injectable()
export class VideoConsoleService {
  private videoconsolesUrl = 'api/videoconsoles';
  // private videoConsoles: VideoConsoleModel[];

  constructor(
    private http: HttpClient,
    @Inject(HTTP_DATA_LOGGER) private logger,
    @Inject(HTTP_ERROR_HANDLER) private errorHandler
  ) { }

  private selectedVideoConsoleSource = new BehaviorSubject<VideoConsoleModel | null>(null);
  selectedVideoConsoleChanges$ = this.selectedVideoConsoleSource.asObservable();

  changeSelectedVideoConsole(selectedVideoConsole: VideoConsoleModel) {
    this.selectedVideoConsoleSource.next(selectedVideoConsole);
  }

  getVideoConsoles(): Observable<VideoConsoleModel[]> {
    // if (this.videoConsoles) {
    //   return of(this.videoConsoles);
    // }
    return this.http.get<VideoConsoleModel[]>(this.videoconsolesUrl)
      .pipe(
        tap(this.logger.logJSON),
        // tap(data => this.videoConsoles = data),
        catchError(this.errorHandler.handleError),
      )
  }

  newVideoConsole = (): VideoConsoleModel => ({
    id: 0,
    name: '',
    code: 'new',
    description: '',
    rating: 0
  });

  createVideoConsole(videoConsole: VideoConsoleModel): Observable<VideoConsoleModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    videoConsole.id = null;
    return this.http.post<VideoConsoleModel>(
      this.videoconsolesUrl,
      videoConsole,
      { headers }
    ).pipe(
      tap(this.logger.logJSON),
      // tap(data => {
      //   this.videoConsoles.push(data);
      // }),
      catchError(this.errorHandler.handleError)
    );
  }

  deleteVideConsole(id: number): Observable<VideoConsoleModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.videoconsolesUrl}/${id}`;
    return this.http.delete<VideoConsoleModel>(
      url,
      { headers }
    ).pipe(
      tap(this.logger.logJSON),
      // tap(_ => {
      //   const foundIndex = this.videoConsoles.findIndex(item => item.id === id);
      //     if (foundIndex > -1) {
      //       this.videoConsoles.splice(foundIndex, 1);
      //     }
      // }),
      catchError(this.errorHandler.handleError)
    )
  }

  updateVideoConsole(videoConsole: VideoConsoleModel): Observable<VideoConsoleModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.videoconsolesUrl}/${videoConsole.id}`;
    return this.http.put<VideoConsoleModel>(url, videoConsole, { headers })
      .pipe(
        tap(this.logger.logJSON),
        // tap(() => {
        //   const foundIndex = this.videoConsoles.findIndex(item => item.id === videoConsole.id);
        //   if (foundIndex > -1) {
        //     this.videoConsoles[foundIndex] = videoConsole;
        //   }
        // }),
        map(() => videoConsole),
        catchError(this.errorHandler.handleError)
      );
  }
}
