import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class ToastService {

  constructor(public toastController: ToastController) {
    
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      animated: true,
      position: 'top',
      cssClass: 'toast'
    });
    toast.present();
  }
}