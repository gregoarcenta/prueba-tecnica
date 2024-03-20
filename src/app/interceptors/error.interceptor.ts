import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from "@angular/core";
import { catchError, throwError } from 'rxjs';
import { ModalMessageService } from "../services/modal-message.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const modalMessageService = inject(ModalMessageService)
  return next(req).pipe(
    catchError(({error}) => {
      console.error(error);

      modalMessageService.alert({
        title:'Error',
        detail:"Lo sentimos, hubo un error interno",
        type:"error"
      })

      return throwError(() => error);
    })
  );
};
