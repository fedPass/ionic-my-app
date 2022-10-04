import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthFireService } from 'src/app/services/auth-fire.service';
import { CameraService } from 'src/app/services/camera.service';
import {NGXLogger} from 'ngx-logger';

const LOG_PREFIX = '[Register-page] ';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  credentials: FormGroup;
  userPhoto: Blob | null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthFireService,
    private loading: LoadingController,
    private router: Router,
    private cameraService: CameraService,
    private alertController: AlertController,
    private logger: NGXLogger
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
      // avatarImg:['']
    });
  }

  async register() {
    this.logger.debug(LOG_PREFIX + ' user info at register click ', this.credentials.value, this.userPhoto);
    const loading = await this.loading.create();
    await loading.present();
    const user = this.authService.register(this.credentials.value,this.userPhoto).then(
      (newUser) => {
        loading.dismiss();
        this.logger.debug(LOG_PREFIX + 'new user info', newUser);
        if (newUser) {
          this.router.navigateByUrl(`/home`,{replaceUrl: true});
          return newUser;
        } else {
          this.logger.error(LOG_PREFIX + 'Register error');
          alert('Register error');
          return null;
        }
      }
    );
  }

  async getPhoto(){
    await this.cameraService.getPhotoByCamera().then(
      async (blob) => {
        this.userPhoto = blob;
        const alert = await this.alertController.create({
          header: 'Avviso',
          message: 'Foto acquisita correttamente!',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }

}
