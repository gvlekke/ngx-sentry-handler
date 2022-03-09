import { BrowserOptions, ReportDialogOptions } from '@sentry/browser';

export interface ModuleOptions {
  browserOptions: BrowserOptions;
  logErrors: boolean;
  dialogEnabled?: boolean;
  dialogOptions?: ReportDialogOptions;
  extractor?(
    error: unknown,
    defaultExtractor: (error: unknown) => unknown
  ): unknown;
}
