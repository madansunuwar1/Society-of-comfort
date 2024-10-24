// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNL7gacGZFURA81j1u1GZAFBlk1NgK4yU",
  authDomain: "westar-fac44.firebaseapp.com",
  projectId: "westar-fac44",
  storageBucket: "westar-fac44.appspot.com",
  messagingSenderId: "495151915757",
  appId: "1:495151915757:web:75cf527d31cf3ad0a722e4",
  measurementId: "G-1LX271P2NL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const initializeFirebaseMessaging = async () => {
  // Check if messaging is supported
  const supported = await isSupported();

  if (!supported) {
    console.warn("Firebase Messaging is not supported in this browser.");
    return null; // Skip further initialization
  }

  const messaging = getMessaging(app);

  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      console.log("Service Worker registered");
      return messaging;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return null;
    }
  } else {
    console.warn(
      "Service Worker or PushManager is not supported in this browser."
    );
    return null;
  }
};

const generateToken = async (messaging) => {
  if (!messaging) {
    console.warn("Messaging is not initialized. Unable to generate token.");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BM7B3sv7P7Ja9rW9CudaGEEkk0KpgbTr6C9gYPhV5E0eXUKuXaEw794-TuOn3r0qTNfDjDL7wY5v68RGPPVzKWI",
      });
      console.log("FCM Token:", token);
      return token;
    }
  } catch (error) {
    console.error("Error generating token:", error);
  }
  return null;
};

export { initializeFirebaseMessaging, generateToken };
