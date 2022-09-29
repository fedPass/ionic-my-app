import { Injectable } from '@angular/core';
import {
  Auth, createUserWithEmailAndPassword,
  onAuthStateChanged, signInWithEmailAndPassword,
  signOut, updateProfile } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthFireService {

  userData: any; //dove salvo dati user
  constructor(
    private auth: Auth
  ) {
      this.userData = this.getUserProfile();
   }

  async register({email, password, username, avatarUrl}) {
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email, password);
      await updateProfile(user.user,
        {
          displayName: username,
          photoURL: avatarUrl
        }
      );
      return user;
    } catch (error) {
      console.log('ERROR:',error.message);
      return null;
    }
  }

  async login({email, password}) {

    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
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
      // photoURL: "https://example.com/jane-q-user/profile.jpg"
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
