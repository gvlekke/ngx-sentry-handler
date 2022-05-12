import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CaptureContext } from '@sentry/types';
import { NgxSentryHandlerModule, SentryService } from 'ngx-sentry-handler';

@Injectable({ providedIn: 'root' })
export class YourSentryService extends SentryService {
  captureException(exception: any, captureContext?: CaptureContext): string {
    return this.sendExceptionToSentry(exception, captureContext);
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
  providers: [{ provide: SentryService, useClass: YourSentryService }],
  bootstrap: [AppComponent],
})
export class AppModule {}
