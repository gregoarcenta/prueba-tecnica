import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

import { authorIdInterceptor } from './author-id.interceptor';
import { SpinnerService } from '../services/spinner.service';
import { EMPTY, Observable, of, throwError } from 'rxjs';

describe('authorIdInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authorIdInterceptor(req, next));

  const req = new HttpRequest('GET', '/url');
  let next = (request: HttpRequest<any>) => new Observable<HttpEvent<any>>();

  let spinnerService: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpinnerService],
    });

    spinnerService = TestBed.inject(SpinnerService);
  });

  it('Debe de iniciar el spinner cuando se haga la peticion', () => {
    spinnerService.active.set = jest.fn();

    interceptor(req, next);

    expect(spinnerService.active.set).toHaveBeenCalledWith(true);
  });

  it('Debe de detener el spinner cuando se acabe la peticion', fakeAsync(() => {
    spinnerService.active.set = jest.fn();

    next = jest.fn().mockReturnValue(EMPTY);

    interceptor(req, next).subscribe();

    tick();

    expect(spinnerService.active.set).toHaveBeenLastCalledWith(false)
  }));
});
