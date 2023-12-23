import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userForm!: FormGroup
  submitted = false;

  constructor(public fb: FormBuilder,
    private router: Router,
    private authLoginService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      userId: ['', Validators.required],
      userPassword: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  submitForm() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
   

    const userId: string = this.userForm.value.userId;
    const password: string = this.userForm.value.userPassword;
    this.authLoginService.login(userId, password);
    console.log(JSON.stringify(this.userForm.value, null, 2));
  }

  onReset(): void {
    this.submitted = false;
    this.userForm.reset();
  }

}
