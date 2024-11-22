import React, { useState, useEffect } from "react";
import "./App.css"; // Optional: style the banner

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      // Prevent the mini-infobar from appearing
      event.preventDefault();
      // Save the event
      setDeferredPrompt(event);
      // Show the custom install banner
      setShowBanner(true);
    };

    // Listen for the 'beforeinstallprompt' event
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the native install prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null); // Clear the deferred prompt
        setShowBanner(false); // Hide the banner
      });
    }
  };

  const handleDismissClick = () => {
    setShowBanner(false);
  };

  if (!showBanner) {
    return null; // Do not render the banner if it's not needed
  }

  return (
    <div className="install-banner">
      <p>Install our app for a better experience!</p>
      <button onClick={handleInstallClick}>Install</button>
      <button onClick={handleDismissClick}>Dismiss</button>
    </div>
  );
};

export default InstallPrompt;
