import { HttpInterceptor,HttpRequest,HttpHandler } from "@angular/common/http";
import {Injectable} from "@angular/core";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private authLoginService:AuthenticationService){

    }

    intercept(req:HttpRequest<any>,next:HttpHandler){
        const authToken = this.authLoginService.getToken();
        const authRequest = req.clone({
            headers:req.headers.set("Authorization","Bearer "+authToken)
        })
        return next.handle(authRequest);
    }
    
}