import { Injectable } from '@angular/core';
import {
  Auth, createUserWithEmailAndPassword,
  onAuthStateChanged, signInWithEmailAndPassword,
  signOut, updateProfile } from '@angular/fire/auth';
import { DataFireService } from './data-fire.service';
import {NGXLogger} from 'ngx-logger';
import { Observable, of } from 'rxjs';

const LOG_PREFIX = '[AuthFire-Service] ';

@Injectable({
  providedIn: 'root'
})
export class AuthFireService {

  userData: any; //dove salvo dati user
  // user$: Observable<User>;

  constructor(
    private auth: Auth,
    private datafire: DataFireService,
    private logger: NGXLogger
  ) {
      this.userData = this.getUserProfile();
      // this.user$ = of(this.auth.currentUser);
      // this.user$.subscribe(console.log);
   }

  async register({email, password, username},avatarBlob) {
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email, password);
      const avatarFineUrl = await this.datafire.uploadImageForUser(avatarBlob, true);
      await updateProfile(user.user, { displayName: username });
      this.userData = user;
      return user;
    } catch (error) {
      this.logger.error(LOG_PREFIX + ' error ', error.message);
      return null;
    }
  }

  async login({email, password}) {

    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      this.userData = user;
      return user;
    } catch (error) {
      return null;
    }
  }

  async logout() {
    return signOut(this.auth);
  }

  getUserProfile() {
    return this.auth.currentUser;
  }

  async updateUserName(user) {
    return updateProfile(this.auth.currentUser, {
      displayName: user.displayName,
    });
  }


}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}
