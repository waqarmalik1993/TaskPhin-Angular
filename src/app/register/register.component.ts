import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signupForm!: FormGroup;
  loading = false;
  submitted = false;
  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required,Validators.email]],
      password: ['', Validators.required]
    });
  }
  get f() { return this.signupForm.controls; }
  signupProcess() {
    const formdata = new FormData
    formdata.append('full_name', this.signupForm.get('full_name')?.value)
    formdata.append('email', this.signupForm.get('email')?.value)
    formdata.append('password', this.signupForm.get('password')?.value)
    this.submitted = true;
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
    }
    this.loading = true;
    this.authService.register(formdata)
      .subscribe((result: any) => {
        if (result.status == 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Account Registered',
            iconColor:"#d90000",
            confirmButtonColor:"#d90000",
            text: 'Your account has been registered successfully. Please login to continue.'
          }).then(() => {
            this.router.navigate(['/login'])
          });
        } else {
          Swal.fire({
            icon: 'error',
            iconColor:"#d90000",
            confirmButtonColor:"#d90000",
            title: 'Email Already Exists',
            text: result.message
          });
        }
      })
  }
}
