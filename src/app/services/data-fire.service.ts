import { Injectable } from '@angular/core';
import { Firestore, addDoc, getDocs, deleteDoc, collection, collectionData, doc } from '@angular/fire/firestore';
import { Geolocation } from '@capacitor/geolocation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataFireService {

  userPositions = [];

  constructor(
    private firestore: Firestore
    ) { }

  async addPosition(position,user) {
    console.log('position received', position);
    const coords = await Geolocation.getCurrentPosition();
    position.coords = {
      lat : coords.coords.latitude,
      lon : coords.coords.longitude,
      alt : coords.coords.altitude,
    };
    try {
      const docRef = await addDoc(collection(this.firestore, `users/${user.uid}/positions`), {
        name: position.name,
        coords: position.coords
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
