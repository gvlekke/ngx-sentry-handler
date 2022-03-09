import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CaptureContext } from '@sentry/types';
import {
  NgxSentryHandlerModule,
  SentryService,
  SENTRY_SERVICE,
} from 'ngx-sentry-handler';

@Injectable({ providedIn: 'root' })
export class YourSentryService extends SentryService {
  captureException(exception: any, captureContext?: CaptureContext): string {
    throw new Error('hello world');
    // this.sendExceptionToSentry(exception, { tags: {'test': 'test'} });
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSentryHandlerModule.forRoot({
      browserOptions: { enabled: true },
      logErrors: true,
    }),
  ],
  providers: [{ provide: SENTRY_SERVICE, useExisting: YourSentryService }],
  bootstrap: [AppComponent],
})
export class AppModule {}