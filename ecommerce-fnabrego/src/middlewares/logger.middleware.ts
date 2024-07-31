import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LogginMiddleware implements NestMiddleware {
    use(req: Request, rest: Response, next: NextFunction) {
        console.log(`Estas ejecutando un ${req.method} en la ruta ${req.baseUrl}`)
        next();
    }
}

export function LoggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const nowDate = new Date();
    const date = nowDate.toLocaleDateString();
    const time = nowDate.toLocaleTimeString();

    console.log(`${req.url} ${req.method} - ${date} - ${time}`)
    next();
}