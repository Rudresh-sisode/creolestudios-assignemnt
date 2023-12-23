import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'task-management-ui';
  isLoggedIn$!: Observable<boolean>;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.getAuthStatusListener();
    this.authService.autoAuthUser();
  }

}
