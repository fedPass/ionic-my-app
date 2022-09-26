import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { from } from 'rxjs';
import { AuthFireService } from 'src/app/services/auth-fire.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthFireService,
    private loading: LoadingController,
    private router: Router
  ) { }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async login() {
    const loading = await this.loading.create();
    await loading.present();
    // const user = await this.authService.login(this.credentials.value);
    const user$ = from(this.authService.login(this.credentials.value));
    const user = user$.subscribe(
      (userCurr) => {
        loading.dismiss();
        console.log(userCurr);
        if (userCurr) {
          this.router.navigateByUrl(`/home`,{replaceUrl: true});
        } else {
          alert('Login error');
        }
      }
    );
    // await loading.dismiss();
    // if (user) {
    //   this.router.navigateByUrl(`/home`,{replaceUrl: true});
    // } else {
    //   alert('Login error');
    // }
  }

}
