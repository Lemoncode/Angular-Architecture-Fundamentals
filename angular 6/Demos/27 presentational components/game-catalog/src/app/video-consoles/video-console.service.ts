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
    return this.http.get<VideoConsoleModel[]>(this.videoconsolesUrl)
      .pipe(
        tap(this.logger.logJSON),
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
      catchError(this.errorHandler.handleError)
    )
  }

  updateVideoConsole(videoConsole: VideoConsoleModel): Observable<VideoConsoleModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.videoconsolesUrl}/${videoConsole.id}`;
    return this.http.put<VideoConsoleModel>(url, videoConsole, { headers })
      .pipe(
        tap(this.logger.logJSON),
        map(() => videoConsole),
        catchError(this.errorHandler.handleError)
      );
  }
}
