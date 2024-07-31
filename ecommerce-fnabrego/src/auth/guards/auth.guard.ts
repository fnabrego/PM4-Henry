import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Role } from "src/roles/role.enum";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) throw new UnauthorizedException('Token no encontrado');

        try {
            const secret = process.env.JWT_SECRET;
            const user = this.jwtService.verify(token, { secret });
            if (!user) throw new UnauthorizedException('Error de validacion TOKEN');

            user.exp = new Date(user.exp * 1000);
            user.roles = user.isAdmin ? [Role.Admin] : [Role.User];
            request.user = user;

            return true;
        } catch (error) {
            throw new UnauthorizedException('Token invalido')
        }
    }
}
