import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  async getPhotoByCamera(){
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });
    if (photo) {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      return blob;
    } else {
      alert('error');
      return null;
    }
  }
}
