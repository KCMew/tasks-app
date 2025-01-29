import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  constructor() {
    this.requestPermission();
  }

  async requestPermission() {
    const perm = await LocalNotifications.requestPermissions();
  }

  // Notification selon l'état des tâches
  async scheduleNotification(hasCompletedTask: boolean) {
    const notificationMessage = hasCompletedTask 
      ? 'Vous avez une tâche terminée, vous pouvez la supprimer !' 
      : 'Vous avez encore des tâches en cours ! Veuillez les terminer avant la date limite!';

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: 'Tasks App',
            body: notificationMessage,
            schedule: { at: new Date(new Date().getTime() + 1000) },
            sound: 'default',
          },
        ],
      });
    } catch (error) {
      console.error("Erreur d'envoi de la notification :", error);
    }
  }
}
