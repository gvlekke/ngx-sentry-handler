import { NgModule } from '@angular/core';
import { ErrorHandler, Injectable, ModuleWithProviders } from '@angular/core';
import { init, showReportDialog } from '@sentry/browser';
import { ModuleOptions } from './interfaces/module-options';
import { NgxErrorHandler } from './ngx-error-handler';
import { INITIALIZER, OPTIONS } from './tokens';

/**
 * Initializer function to setup sentry logging.
 *
 * @param - The module options
 * @returns - A promise for waiting to be resolved
 */
export function initializer(options: ModuleOptions): void {
  // configure sentry's browser library
  if (options.browserOptions.enabled) {
    // show report dialog
    if (options.dialogEnabled) {
      options.browserOptions.beforeSend = (event) => {
        if (event.exception) {
          showReportDialog(options.dialogOptions);
        }
        return event;
      };
    }

    init(options.browserOptions);
  }
}

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
})
export class NgxSentryHandlerModule {
  /**
   * Provides all necessary providers for sentry connection.
   *
   * @param - The module options
   * @returns - The module with all providers
   */
  public static forRoot(
    options: ModuleOptions
  ): ModuleWithProviders<NgxSentryHandlerModule> {
    return {
      ngModule: NgxSentryHandlerModule,
      providers: [
        {
          provide: OPTIONS,
          useValue: options,
        },
        {
          provide: INITIALIZER,
          useFactory: initializer,
          deps: [OPTIONS],
        },
        {
          provide: ErrorHandler,
          useClass: NgxErrorHandler,
          deps: [OPTIONS, INITIALIZER],
        },
      ],
    };
  }
}
