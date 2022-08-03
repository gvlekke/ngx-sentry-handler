import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NgxErrorHandler } from './ngx-error-handler';
import { SentryService } from './sentry.service';
import { OPTIONS } from './tokens';

describe('NgxErrorHandler', () => {
  let service: NgxErrorHandler;
  let sentryService: SentryService;
  let error: string;
  let consoleSpy: jasmine.Spy;
  let sentryServiceSpy: jasmine.Spy;

  describe('with options on', () => {
    beforeEach(() => {
      error = 'jikes, we got an error';

      TestBed.configureTestingModule({
        providers: [
          {
            provide: OPTIONS,
            useValue: {
              browserOptions: { enabled: true },
              logErrors: true,
            },
          },
        ],
      });
    });

    beforeEach(() => {
      service = TestBed.inject(NgxErrorHandler);
      sentryService = TestBed.inject(SentryService);
      sentryServiceSpy = spyOn(sentryService, 'captureException');

      consoleSpy = spyOn(console, 'error').and.returnValue(undefined);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    describe('handleError extracting the error', () => {
      let ngError: string;

      beforeEach(() => {
        ngError = 'jikes an ng error';
      });

      it('should return ngOriginalError', () => {
        service.handleError({ ngOriginalError: ngError });
        expect(sentryServiceSpy).toHaveBeenCalledWith(ngError);
      });

      it('should return instance of Error', () => {
        const errorInst = new Error(error);
        service.handleError(errorInst);
        expect(sentryServiceSpy).toHaveBeenCalledWith(errorInst);
      });

      describe(`when it's a instanceof HttpErrorResponse`, () => {
        it('should return error from instance of Error', () => {
          const errorInst = new Error(error);

          const httpErrorResponse = new HttpErrorResponse({
            error: errorInst,
          });

          service.handleError(httpErrorResponse);
          expect(sentryServiceSpy).toHaveBeenCalledWith(errorInst);
        });

        it('should return error from instance of ErrorEvent', () => {
          const errorInst = new ErrorEvent(error, {
            message: error,
          });

          const httpErrorResponse = new HttpErrorResponse({
            error: errorInst,
            url: 'http://we-like-ngx-error-handler.angular',
          });

          service.handleError(httpErrorResponse);
          expect(sentryServiceSpy).toHaveBeenCalledWith(error);
        });

        it('should return error string', () => {
          const httpErrorResponse = new HttpErrorResponse({
            error: error,
            url: 'http://we-like-ngx-error-handler.angular',
          });
          service.handleError(httpErrorResponse);
          expect(sentryServiceSpy).toHaveBeenCalledWith(
            'Server returned code 0 with body "jikes, we got an error"'
          );
        });

        it(`should return error.message when its doesn't know the option`, () => {
          const httpErrorResponse = new HttpErrorResponse({
            error: 1234,
            url: 'http://we-like-ngx-error-handler.angular',
          });
          service.handleError(httpErrorResponse);
          expect(sentryServiceSpy).toHaveBeenCalledWith(
            'Http failure response for http://we-like-ngx-error-handler.angular: undefined undefined'
          );
        });
      });

      describe(`when it doesn't match anything`, () => {
        it('should return null', () => {
          service.handleError(2);
          expect(sentryServiceSpy).toHaveBeenCalledWith(null);
        });
      });
    });
  });

  describe('params', () => {
    beforeEach(() => {
      error = 'jikes, we got an error';
    });

    describe('browserOptions', () => {
      it('should call captureException when true', () => {
        TestBed.configureTestingModule({
          providers: [
            {
              provide: OPTIONS,
              useValue: {
                browserOptions: { enabled: true },
                logErrors: true,
              },
            },
          ],
        });

        service = TestBed.inject(NgxErrorHandler);
        sentryService = TestBed.inject(SentryService);
        sentryServiceSpy = spyOn(sentryService, 'captureException');

        consoleSpy = spyOn(console, 'error').and.returnValue();

        service.handleError(error);
        expect(sentryServiceSpy).toHaveBeenCalledOnceWith(error);
      });

      it('should NOT call captureException when false', () => {
        TestBed.configureTestingModule({
          providers: [
            {
              provide: OPTIONS,
              useValue: {
                browserOptions: { enabled: false },
                logErrors: true,
              },
            },
          ],
        });

        service = TestBed.inject(NgxErrorHandler);
        sentryService = TestBed.inject(SentryService);
        sentryServiceSpy = spyOn(sentryService, 'captureException');

        consoleSpy = spyOn(console, 'error').and.returnValue(undefined);

        service.handleError(error);
        expect(sentryServiceSpy).not.toHaveBeenCalled();
      });
    });

    describe('extractError', () => {
      let extractorSpy: jasmine.Spy;
      let captureExceptionSpy: jasmine.Spy;

      beforeEach(() => {
        extractorSpy = jasmine.createSpy().and.callFake(() => {
          return 'hello';
        });

        TestBed.configureTestingModule({
          providers: [
            {
              provide: OPTIONS,
              useValue: {
                browserOptions: { enabled: true },
                logErrors: false,
                extractor: extractorSpy,
              },
            },
          ],
        });

        service = TestBed.inject(NgxErrorHandler);
        sentryService = TestBed.inject(SentryService);

        sentryServiceSpy = spyOn(sentryService, 'captureException');

        service.handleError(error);
      });
      it('should be called when filled and browserOptions enabled', () => {
        expect(extractorSpy).toHaveBeenCalledOnceWith(
          error,
          jasmine.any(Function) // could be improved to have reference to the same function
        );
      });

      it('should return custom value with custom extractor', () => {
        expect(sentryServiceSpy).toHaveBeenCalledWith('hello');
      });
    });

    describe('logging', () => {
      it('should log when browserOptions.logErrors is true', () => {
        TestBed.configureTestingModule({
          providers: [
            {
              provide: OPTIONS,
              useValue: {
                browserOptions: { enabled: false },
                logErrors: true,
              },
            },
          ],
        });

        service = TestBed.inject(NgxErrorHandler);
        sentryService = TestBed.inject(SentryService);
        sentryServiceSpy = spyOn(sentryService, 'captureException');

        consoleSpy = spyOn(console, 'error').and.returnValue(undefined);

        service.handleError(error);
        expect(consoleSpy).toHaveBeenCalledWith(error);
      });

      it('should log when browserOptions.logErrors is true', () => {
        TestBed.configureTestingModule({
          providers: [
            {
              provide: OPTIONS,
              useValue: {
                browserOptions: { enabled: true },
                logErrors: false,
              },
            },
          ],
        });

        service = TestBed.inject(NgxErrorHandler);
        sentryService = TestBed.inject(SentryService);
        sentryServiceSpy = spyOn(sentryService, 'captureException');

        consoleSpy = spyOn(console, 'error').and.returnValue(undefined);

        service.handleError(error);
        expect(consoleSpy).not.toHaveBeenCalled();
      });
    });
  });
});
