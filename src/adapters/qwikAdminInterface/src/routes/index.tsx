import { component$, useSignal, $ } from "@builder.io/qwik"; // Removed useStylesScoped$
import type { DocumentHead } from "@builder.io/qwik-city";
import { AdminPanel } from "~/components/admin-panel/AdminPanel";
import { LoginView } from "~/components/auth/LoginView";
import { authService } from "~/services/AuthService";

// Optional: Add some global styles if needed, or ensure components are self-contained
// import styles from './global-layout.css?inline'; 

export default component$(() => {
  // useStylesScoped$(styles); // If global styles are added

  // Initialize isAuthenticated signal by synchronously checking the auth state
  const isAuthenticated = useSignal(authService.getIsAuthenticatedSync());

  const updateAuthState = $(() => {
    isAuthenticated.value = authService.getIsAuthenticatedSync();
  });

  return (
    <>
      {isAuthenticated.value ? (
        <AdminPanel onLogout$={updateAuthState} />
      ) : (
        <LoginView onLoginSuccess$={updateAuthState} />
      )}
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik Admin",
  meta: [
    {
      name: "description",
      content: "Qwik site admin panel",
    },
  ],
};
