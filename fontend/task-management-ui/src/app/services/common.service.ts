import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private httpClient: HttpClient, private router: Router) {
  
  }

  getApiUrl() {
    return environment.AUTH_API;
  }

  getToken() {
    return localStorage.getItem("token");
  }


  registerUser(userName: string, email: string, password: string, isAdmin: boolean, role: string) {
    const userData: any = { userName: userName, email: email, password: password, isAdmin: isAdmin, role: role }
    

    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    // return this.httpClient.post<any>(`${environment.AUTH_API}/user/education/add-user-education`, userData, { headers: reqHeader });
    
    return this.httpClient.post<{ status: string, message:string }>(this.getApiUrl() + '/admin/users/register-new-user', userData,{ headers: reqHeader })
    //   .subscribe({
    //     next: (response: any) => {
    //       const token = response.data.token;
          
    //     },
    //     error: (error) => {
    //       // this.authStatusListener.next(false);
    //     }
    //   },
    //   )
  }


}
