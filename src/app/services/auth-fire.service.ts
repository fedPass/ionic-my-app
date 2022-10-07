import { Injectable } from '@angular/core';
import {
  Auth, createUserWithEmailAndPassword,
  onAuthStateChanged, signInWithEmailAndPassword,
  signOut, updateProfile } from '@angular/fire/auth';
import { DataFireService } from './data-fire.service';
import {NGXLogger} from 'ngx-logger';
import { BehaviorSubject, Observable, of } from 'rxjs';

const LOG_PREFIX = '[AuthFire-Service] ';

@Injectable({
  providedIn: 'root'
})
export class AuthFireService {

  userData: any; //dove salvo dati user
  userSub = new BehaviorSubject<User>(null);

  constructor(
    private auth: Auth,
    private datafire: DataFireService,
    private logger: NGXLogger
  ) {
      this.userSub.next(this.getUserProfile());
      this.userData = this.getUserProfile();
   }

  async register({email, password, username},avatarBlob) {
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email, password);
      const avatarFineUrl = await this.datafire.uploadImageForUser(avatarBlob, true);
      await updateProfile(user.user, { displayName: username });
      this.userData = user;
      this.userSub.next(user.user);
      this.logger.debug(LOG_PREFIX + 'New user register: ', user);
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
      this.userSub.next(user.user);
      this.logger.debug(LOG_PREFIX + 'User Logged: ', user);

      return user;
    } catch (error) {
      return null;
    }
  }

  async logout() {
    this.userSub.next(null);
    this.userData = null;
    return signOut(this.auth);
  }

  getUserProfile() {
    return this.auth.currentUser;
  }

  async updateUserName(newInfo) {
    return updateProfile(this.auth.currentUser, {
      displayName: newInfo.displayName,
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
