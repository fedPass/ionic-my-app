import { Injectable } from '@angular/core';
import { Firestore, addDoc, updateDoc, deleteDoc, collection, collectionData, doc } from '@angular/fire/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { Geolocation } from '@capacitor/geolocation';
import { Observable } from 'rxjs';

import { Storage } from '@angular/fire/storage';
import { Auth, updateProfile } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class DataFireService {

  userPositions = [];

  constructor(
    private firestore: Firestore,
    private authFirebase: Auth,
    private storage: Storage,

    ) { }

  async addPosition(position,user) {
    const coords = await Geolocation.getCurrentPosition();
    position.coords = {
      lat : coords.coords.latitude,
      lon : coords.coords.longitude,
      alt : coords.coords.altitude,
    };

    try {
      const docRef = await addDoc(collection(this.firestore, `users/${user.uid}/positions`), {
        name: position.name,
        coords: position.coords,
        created: this.getNowISOString()
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  getUserPositions(user) {
    // collectionData returns a stream of documents
    const userPosit = collectionData(
      collection(this.firestore, `users/${user.uid}/positions`),{idField: 'id'}
    ) as Observable<Position[]>;
    // console.log(userPosit.subscribe(console.log));
    return userPosit;
  }

  deletePosition(position,user) {
    deleteDoc(doc(this.firestore, `users/${user.uid}/positions/${position.id}`));
  }

  updateNamePosition(position,user) {
    return updateDoc(doc(this.firestore, `users/${user.uid}/positions/${position.id}`), {
      name: position.name
    });
  }

  getNowISOString(){
    const date = new Date();
    const nowUtc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), date.getUTCHours(),
                date.getUTCMinutes(), date.getUTCSeconds());
    const nowISOString = date.toISOString();
    return nowISOString;
  }

  async uploadImageForUser(blob, avatar = false) {
    console.log('blob',blob);
    const user = this.authFirebase.currentUser;
    const imgFormat = blob.type;
    let path = '';
    if (avatar) {
      path = `uploads/${user.uid}/profileImage`;
    } else {
      path = `uploads/${user.uid}/`+ new Date().getTime() + '.' + imgFormat;
    }

    const metadata = {
      contentType: imgFormat,
    };

    //creare referenza per il percorso dell'immagine
    const storageRef = ref(this.storage, path);

    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
    (snapshot) => {},
    (error) => {
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          alert('User non ha i permessi');
          break;
        case 'storage/canceled':
          // User canceled the upload
          alert('User ha annullato upload');
          break;

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          alert('Errore sconosciuto: ' + error.serverResponse);
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        console.log('File available at', downloadURL);
        if (avatar) {
          console.log('enter in if avatar!');
          await updateProfile(user,
            {
              photoURL: downloadURL
            }
          );
        }
        return downloadURL;
      });
    }
    );

  }

}

export interface Position {
  name: string;
  coords: Coords;
}

export interface Coords {
  alt?: string;
  lon: string;
  lat: string;
}
