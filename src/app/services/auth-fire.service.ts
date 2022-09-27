import { Injectable } from '@angular/core';
import {
  Auth, createUserWithEmailAndPassword,
  onAuthStateChanged, signInWithEmailAndPassword,
  signOut, updateProfile } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthFireService {

  constructor(
    private auth: Auth
  ) { }

  async register({email, password, username, avatarUrl}) {
    // createUserWithEmailAndPassword(this.auth, email, password)
    // .then((userCredential) => {
    //   // Signed in
    //   const user = userCredential.user;
    //   return user;
    // })
    // .catch((error) => {
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   console.log('ERROR:',errorMessage);
    //   return null;
    // });
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
        return user;
      } else {
        // User is signed out
        console.log('User NOT auth');
        return null;
      }
    });
  }

  logout() {
    return signOut(this.auth);
  }

  getUserProfile() {
    const user = this.auth.currentUser;
    // console.log('user get profile', user);
    return user;
  }
}
