import { Injectable, Inject, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ModuleOptions } from './interfaces/module-options';
import { OPTIONS, SENTRY_SERVICE } from './tokens';
import { runOutsideAngular } from './zone';
import { SentryService } from './sentry.service';

/**
 * Injectable error handler for Sentry.
 */
@Injectable({
  providedIn: 'root',
})
export class NgxErrorHandler extends ErrorHandler {
  /**
   * Initializes the sentry connected error handler.
   *
   * @param - The module options.
   */
  public constructor(
    private sentryService: SentryService,
    @Inject(OPTIONS) private options: ModuleOptions
  ) {
    super();
  }

  /**
   * Method called for every value captured through the ErrorHandler
   */
  public handleError(error: unknown): void {
    if (!this.sentryService) {
      throw new Error(
        'You must provide a sentry service, you can use the default ServiceService'
      );
    }

    const extractedError = this._extractError(error);

    // // Capture handled exception and send it to Sentry.
    // const eventId = runOutsideAngular(() =>
    //   Sentry.captureException(extractedError)
    // );

    if (this.options.browserOptions.enabled) {
      this.sentryService.captureException(extractedError);
    }

    // When in development mode, log the error to console for immediate feedback.
    if (this.options.logErrors) {
      // eslint-disable-next-line no-console
      console.error(extractedError);
    }
  }

  /**
   * Used to pull a desired value that will be used to capture an event out of the raw value captured by ErrorHandler.
   */
  protected _extractError(error: unknown): unknown {
    // Allow custom overrides of extracting function
    if (this.options.extractor) {
      const defaultExtractor = this._defaultExtractor.bind(this);
      return this.options.extractor(error, defaultExtractor);
    }

    return this._defaultExtractor(error);
  }

  /**
   * Default implementation of error extraction that handles default error wrapping, HTTP responses, ErrorEvent and few other known cases.
   */
  protected _defaultExtractor(errorCandidate: unknown): unknown {
    let error = errorCandidate;

    // Try to unwrap zone.js error.
    // https://github.com/angular/angular/blob/master/packages/core/src/util/errors.ts
    if (error && (error as { ngOriginalError: Error }).ngOriginalError) {
      error = (error as { ngOriginalError: Error }).ngOriginalError;
    }

    // We can handle messages and Error objects directly.
    if (typeof error === 'string' || error instanceof Error) {
      return error;
    }

    // If it's http module error, extract as much information from it as we can.
    if (error instanceof HttpErrorResponse) {
      // The `error` property of http exception can be either an `Error` object, which we can use directly...
      if (error.error instanceof Error) {
        return error.error;
      }

      // ... or an`ErrorEvent`, which can provide us with the message but no stack...
      if (error.error instanceof ErrorEvent && error.error.message) {
        return error.error.message;
      }

      // ...or the request body itself, which we can use as a message instead.
      if (typeof error.error === 'string') {
        return `Server returned code ${error.status} with body "${error.error}"`;
      }

      // If we don't have any detailed information, fallback to the request message itself.
      return error.message;
    }

    // Nothing was extracted, fallback to default error message.
    return null;
  }
}
