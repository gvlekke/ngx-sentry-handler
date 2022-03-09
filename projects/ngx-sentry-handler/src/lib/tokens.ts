import { InjectionToken } from '@angular/core';
import { ModuleOptions } from './interfaces/module-options';
import { SentryService } from './sentry.service';

export const INITIALIZER = new InjectionToken<void>('initializer');
export const OPTIONS = new InjectionToken<ModuleOptions>('options');
export const SENTRY_SERVICE = new InjectionToken<SentryService>(
  'Sentry service token'
);
