import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;

  constructor(public fb: FormBuilder,
    private router: Router,
    private authService: CommonService,private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      isAdmin: [false],
      role: ['user']
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  submitForm() {
    debugger;
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.toastr.error('Error',"Invalid Form");
      //clear the form
      this.registerForm.reset();
      return;
    }

    const userName: string = this.registerForm.value.userName;
    const email: string = this.registerForm.value.email;
    const password: string = this.registerForm.value.password;
    const isAdmin: boolean = this.registerForm.value.isAdmin;
    const role: string = this.registerForm.value.role;

    debugger;

    this.authService.registerUser(userName, email, password, isAdmin, role)
    .subscribe({
      next: (response: any) => {
        console.log(response);
        this.toastr.success('success',response.message);
        this.router.navigate(["/login"]);
      },
      error: (error) => {
        console.log(error);
      }
    });

  }
}