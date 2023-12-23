import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: any;
  private tokenTimer: any;
  private userData: any;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  constructor(private httpClient: HttpClient, private router: Router,private toastr: ToastrService) {
  
  }

  getApiUrl() {
    return environment.AUTH_API;
  }

  
  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  login(userId: string, password: string) {
    const authData: any = { email: userId, password: password }
    this.httpClient.post<{ status: string, message:string, data: any }>(this.getApiUrl() + '/auth/login', authData)
      .subscribe({
        next: (response: any) => {
          const token = response.data.token;
          this.userData = JSON.stringify(response.data);
          this.token = token;
          if (token) {
            const expiresInDuration = response.data.expiresIn;
            this.setAuthTimer(expiresInDuration);

            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            
            this.toastr.success('success', response.message);
            console.log("your expiration date-time ", expirationDate);//check future time
            this.saveAuthData(token, expirationDate, this.userData);
            this.router.navigate(["dashboard"]);
          }

        },
        error: (error) => {
          this.authStatusListener.next(false);
        }
      },
      )
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userData = authInformation.userData;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }


  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userData = localStorage.getItem("userData");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userData: userData
    };
  }

  private saveAuthData(token: any, expirationDate: Date, userData: any) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userData", userData);

  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);

  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userData");
  }

  private setAuthTimer(duration: number) {
    console.log("Setting Timer " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  
}
