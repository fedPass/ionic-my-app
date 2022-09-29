import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { from } from 'rxjs';
import { AuthFireService } from 'src/app/services/auth-fire.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
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
      password: ['', [Validators.required, Validators.minLength(6)]],
      username:[''],
      avatarImg:['']
    });
  }

  async register() {
    const loading = await this.loading.create();
    await loading.present();
    const user = this.authService.register(this.credentials.value).then(
      (newUser) => {
        loading.dismiss();
        console.log('newUser', newUser);
        if (newUser) {
          this.router.navigateByUrl(`/home`,{replaceUrl: true});
          return newUser;
        } else {
          alert('Register error');
          return null;
        }
      }
    );
  }

}
