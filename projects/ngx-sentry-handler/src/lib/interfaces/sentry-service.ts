import { EventHint, Scope } from '@sentry/browser';
import { CaptureContext } from '@sentry/types';

export interface SentryServiceI {
  captureException(exception: any, captureContext?: CaptureContext): string;

  sendExceptionToSentry(
    exception: any,
    captureContext?: CaptureContext
  ): string;
}
