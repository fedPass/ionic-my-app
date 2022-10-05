import { Injectable } from '@angular/core';
import { Firestore, addDoc, updateDoc, deleteDoc, collection, collectionData, doc } from '@angular/fire/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { Geolocation } from '@capacitor/geolocation';
import { Observable, of } from 'rxjs';

import { Storage } from '@angular/fire/storage';
import { Auth, updateProfile } from '@angular/fire/auth';
import { CameraService } from './camera.service';
import { User } from './auth-fire.service';
import {NGXLogger} from 'ngx-logger';

const LOG_PREFIX = '[DataFire-Service] ';

@Injectable({
  providedIn: 'root'
})
export class DataFireService {

  userPositions$: Observable<Position[]>;
  user: User;
  user$: Observable<User>;

  constructor(
    private firestore: Firestore,
    private authFirebase: Auth,
    private storage: Storage,
    private cameraService: CameraService,
    private logger: NGXLogger

    ) {
      this.user = this.authFirebase.currentUser;
      this.userPositions$ = this.getUserPositions(this.user);

      // this.user$ = of(this.authFirebase.currentUser);
      // this.userPositions$ = this.getUserPositions(this.user$);
     }

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
        created: this.getNowISOString(),
        photoUrl: null
      });
      await this.cameraService.getPhotoByCamera()
      .then( async (blob) => {
          // const imgUrl = await this.uploadImageForUser(blob, false, position.name.replace(' ','_'),docRef);
          const imgUrl = await this.uploadImageForUser(blob, false, docRef);
      });
      this.logger.debug(LOG_PREFIX + 'Document written with ID: ', docRef);
    } catch (e) {
      this.logger.error(LOG_PREFIX + 'Error adding document: ', e);
    }
  }

  // #TODO: per aggiornare sia nome che foto positione dovrei fare:
  //updateNamePosition + prendere img e poi fare uploadImageForUser(blob, avatar = false, docRef)

  getUserPositions(user) {
    let data = null;
    try {
      // collectionData returns a stream of documents (query, options)
      data = collectionData(collection(this.firestore, `users/${user.uid}/positions`),{idField: 'id'});
    } catch (e) {
      this.logger.error(LOG_PREFIX + 'Error downloading positions: ', e);
    }
    return data as Observable<Position[]>;
    // return collectionData(
    //   //query
    //   collection(this.firestore, `users/${user.uid}/positions`),
    //   //options
    //   {idField: 'id'}
    // ) as Observable<Position[]>;
  }

  deletePosition(position,user) {
    deleteDoc(doc(this.firestore, `users/${user.uid}/positions/${position.id}`));
    deleteObject(ref(this.storage, `uploads/${user.uid}/${position.id}`));
  }

  updateNamePosition(position,user) {
    return updateDoc(doc(this.firestore, `users/${user.uid}/positions/${position.id}`), {
      name: position.name
    });
  }

  getNowISOString(){
    const date = new Date();
    const nowISOString = date.toISOString();
    return nowISOString;
  }

  async uploadImageForUser(blob, avatar = false, docRef = null) {
    //per le foto posizione il name sarà l'id della posizione
    const user = this.authFirebase.currentUser;
    let path = '';
    if (avatar) {
      path = `uploads/${user.uid}/profileImage`;
    } else {
      path = `uploads/${user.uid}/`+ docRef.id;
    }

    const metadata = {
      contentType: blob.format
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
        if (avatar) {
          await updateProfile(user,
            {
              photoURL: downloadURL
            }
            );
          } else {
            await updateDoc(doc(this.firestore,`users/${user.uid}/positions/${docRef.id}`), {
              photoUrl: downloadURL
            });
          }
        this.logger.debug(LOG_PREFIX + 'File available at', downloadURL);
        return downloadURL;
      });
    }
    );

  }

}

export interface Position {
  name: string;
  coords: Coords;
  photoUrl?: string;
  created?: string;
}

export interface Coords {
  alt?: string;
  lon: string;
  lat: string;
}
