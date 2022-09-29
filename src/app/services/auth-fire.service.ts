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
    if (this.auth.currentUser)
    {
      this.userData = this.auth.currentUser;
    }
    // console.log('user data in authFire',this.userData);
   }

  async register({email, password, username, avatarUrl}) {
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email, password);
      updateProfile(user.user,
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

  async getAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('User auth',user);
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
        return user;
      } else {
        // User is signed out
        console.log('User NOT auth');
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user'));
        return null;
      }
    });
  }

  async logout() {
    return signOut(this.auth);
  }

  getUserProfile() {
    const user = this.auth.currentUser;
    console.log('user get profile', user);
    return user;
  }

  updateUserInfo(user) {
    updateProfile(this.auth.currentUser, {
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
