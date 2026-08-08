import { useState, useEffect } from 'react';
import { notificationApi } from '../services/api';
import toast from 'react-hot-toast';

// Convert VAPID key to Uint8Array
const urlB64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// Hardcoded Public Key matching application.properties
const VAPID_PUBLIC_KEY = 'BNBo5HbezRgcki-_dpiBI-EBzsBpKq82Y7SlIe3d9-u63C2dF6XWNOwN4Si4Tbkf2kBngGPVDj_RyF7GevL3jRQ';

export const useWebPush = (user) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!user) return; // Only subscribe when logged in
    
    const subscribeToPush = async () => {
      try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
          console.warn('Push messaging is not supported in this browser.');
          return;
        }

        // Ask for permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('Push notifications permission denied.');
          return;
        }

        // Register Service Worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        // Wait until service worker is active
        await navigator.serviceWorker.ready;

        // Check if already subscribed
        let subscription = await registration.pushManager.getSubscription();
        
        if (!subscription) {
          // Subscribe the user
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY)
          });
        }

        // Send subscription to backend
        const subscriptionData = JSON.parse(JSON.stringify(subscription));
        await notificationApi.subscribePush(subscriptionData);
        
        setIsSubscribed(true);
      } catch (err) {
        console.error('Error during push subscription:', err);
      }
    };

    subscribeToPush();
  }, [user]);

  return { isSubscribed };
};
