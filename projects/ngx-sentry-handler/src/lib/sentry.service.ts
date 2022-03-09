import { Injectable } from '@angular/core';
import { CaptureContext } from '@sentry/types';
import { runOutsideAngular } from './zone';
import * as Sentry from '@sentry/browser';
import { SentryServiceI } from './interfaces/sentry-service';

@Injectable({
  providedIn: 'root',
})
export class SentryService implements SentryServiceI {
  constructor() {}

  public captureException(
    exception: any,
    captureContext?: CaptureContext
  ): string {
    return this.sendExceptionToSentry(exception, captureContext);
  }

  public sendExceptionToSentry(
    exception: any,
    captureContext?: CaptureContext
  ): string {
    return runOutsideAngular(() => {
      return Sentry.captureException(exception, captureContext);
    });
  }
}
