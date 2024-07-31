import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class DateAdderInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const now = new Date();
        const date = now.toLocaleDateString()
        const time = now.toLocaleTimeString()
        const request = context.switchToHttp().getRequest();

        request.now = `${date} + ${time}`;

        return next.handle()
    }
}