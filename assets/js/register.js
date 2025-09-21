const swAllowedHostnames = ["localhost", "127.0.0.1", "about:blank"];
const dnsResolver = "8.8.8.8";

async function registerSW() {
  try {
    console.log("Bare server: " + self.__uv$config.bare);

    // Only allow HTTPS or localhost/about:blank
    if (
      location.protocol !== "https:" &&
      !swAllowedHostnames.includes(location.hostname)
    ) {
      console.warn(
        "⚠️ Service workers require HTTPS. Running without SW on this hostname."
      );
      return;
    }

    if (!("serviceWorker" in navigator)) {
      console.error("❌ Your browser does not support service workers.");
      return;
    }

    const registration = await navigator.serviceWorker.register("sw.js", {
      scope: __uv$config.prefix,
    });

    const scope = new URL(registration.scope).pathname;

    if (registration.active) {
      console.log("✅ Service worker registered with scope:", scope);
    } else {
      console.error("⚠️ Service worker registration failed!");
    }
  } catch (error) {
    console.error("❌ Error registering service worker:", error);
  }
}

window.addEventListener("load", registerSW);
