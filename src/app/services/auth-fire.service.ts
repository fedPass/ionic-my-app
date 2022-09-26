import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthFireService {

  constructor(
    private auth: Auth
  ) { }

  register({email, password}) {
    createUserWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('ERROR:',errorMessage);
      return null;
    });
  }

  async login({email, password}) {

    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (error) {
      return null;
    }
  }

  getAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        alert('Login');
        // ...
      } else {
        // User is signed out
        alert('Logout');
      }
    });
  }

  logout() {
    return signOut(this.auth);
  }
}
