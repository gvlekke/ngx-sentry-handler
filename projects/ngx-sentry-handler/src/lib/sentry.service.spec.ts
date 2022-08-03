import { TestBed } from '@angular/core/testing';
import { SentryService } from './sentry.service';
import { CaptureContext } from '@sentry/types';
import * as Sentry from '@sentry/browser';
import { runOutsideAngular } from './zone';

describe('SentryService', () => {
  let service: SentryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SentryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#captureException', () => {
    it('should call sendExceptionToSentry', () => {
      const sendExceptionToSentrySpy = spyOn(service, 'sendExceptionToSentry');
      const context = {
        tags: { testing: true },
      } as CaptureContext;

      service.captureException('test', context);

      expect(sendExceptionToSentrySpy).toHaveBeenCalledWith('test', context);
    });
  });

  describe('#sendExceptionToSentry', () => {
    it('should call Sentry.captureException', () => {
      pending('find a way to spy on imported functions');
    });
  });
});
