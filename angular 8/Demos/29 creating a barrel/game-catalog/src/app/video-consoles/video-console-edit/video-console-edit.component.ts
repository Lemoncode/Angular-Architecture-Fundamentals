import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { VideoConsoleModel } from '../video-console.model';

import { takeWhile } from 'rxjs/operators';

import { GenericValidator } from '../../shared/generic.validator';
import { NumberValidators } from '../../shared/number.validator';
import { VideoConsoleService } from '../video-console.service';

/*NgRx*/
import { Store, select } from '@ngrx/store';
import * as fromVideoConsole from '../state';
import * as videoConsoleActions from '../state/video-consoles.actions';


@Component({
  selector: 'app-video-console-edit',
  templateUrl: './video-console-edit.component.html',
  styleUrls: ['./video-console-edit.component.css']
})
export class VideoConsoleEditComponent implements OnInit, OnDestroy {
  errorMessage = '';
  videoConsoleForm: FormGroup;
  videoConsole: VideoConsoleModel | null;
  // sub: Subscription;
  componentActive = true;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private store: Store<fromVideoConsole.State>,
    private fb: FormBuilder,
    private videoConsoleService: VideoConsoleService
  ) {
    this.validationMessages = {
      videoConsoleName: {
        required: 'Name is required',
        minLength: 'Three or more characters',
        maxLength: 'No bigger than fifty characters',
      },
      videoConsoleCode: {
        required: 'Code is required',
      },
      rating: {
        range: 'Rate between 1 and 5'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.videoConsoleForm = this.fb.group({
      videoConsoleName: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)]],
      videoConsoleCode: ['', Validators.required],
      rating: ['', NumberValidators.range(1, 5)],
      description: ''
    });

    this.store.pipe(
      select(fromVideoConsole.getCurrentVideoConsole),
      takeWhile(() => this.componentActive)
    )
      .subscribe(
        currentVideoConsole => this.displayVideoConsole(currentVideoConsole),
      );

    this.videoConsoleForm.valueChanges
        .subscribe(
          (value) => this.displayMessage = this.genericValidator.processMessages(this.videoConsoleForm)
        );
  }

  ngOnDestroy(): void {
    // this.sub.unsubscribe();
    this.componentActive = false;
  }

  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.videoConsoleForm);
  }

  displayVideoConsole(videoConsole: VideoConsoleModel | null): void {
    this.videoConsole = videoConsole;
    if (this.videoConsole) {
      this.videoConsoleForm.reset();
      this.videoConsoleForm.patchValue({
        videoConsoleName: this.videoConsole.name,
        videoConsoleCode: this.videoConsole.code,
        rating: this.videoConsole.rating,
        description: this.videoConsole.description,
      })
    }
  }

  cancelEdit(): void {
    this.displayVideoConsole(this.videoConsole);
  }

  deleteVideoConsole(): void {
    if (this.videoConsole && this.videoConsole.id) {
      this.videoConsoleService.deleteVideConsole(this.videoConsole.id)
        .subscribe(
          // () => this.videoConsoleService.changeSelectedVideoConsole(null),
          () => this.store.dispatch(new videoConsoleActions.ClearCurrentVideoConsole()),
          (err: any) => this.errorMessage = err.error
        )
    } else {
      this.videoConsoleService.changeSelectedVideoConsole(null);
    }
  }

  saveVideoConsole(): void {
    if (this.videoConsoleForm.valid && this.videoConsoleForm.dirty) {
      const vc = this.map(this.videoConsoleForm.value, this.videoConsole.id);

      if (vc.id === 0) {
        this.videoConsoleService.createVideoConsole(vc)
          .subscribe(
            // (vc) => this.videoConsoleService.changeSelectedVideoConsole(vc),
            (vc) => this.store.dispatch(new videoConsoleActions.SetCurrentVideoConsole(vc)),
            (err: any) => this.errorMessage = err.error,
          );
      } else {
        this.store.dispatch(
          new videoConsoleActions.UpdateVideoConsole(vc)
        )
      }
    } else {
      this.errorMessage = 'Please correct the validation errors'
    }
  }

  private map = (formValues: any, id: number): VideoConsoleModel => ({
    id: id,
    name: formValues.videoConsoleName,
    code: formValues.videoConsoleCode,
    rating: formValues.rating,
    description: formValues.description,
  });
}
