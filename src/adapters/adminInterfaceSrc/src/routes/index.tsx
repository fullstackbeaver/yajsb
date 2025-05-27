import type { DocumentHead } from "@builder.io/qwik-city";
import      { component$ }   from "@builder.io/qwik";//RemoveduseStylesScoped$

// Optional: Add some global styles if needed, or ensure components are self-contained
// import styles from './global-layout.css?inline';

export default component$(() => {
  return (
    <>{
      window.location.href = "/projects"
    }
    </>
  );

});

export const head: DocumentHead = {
  meta: [
    {
      content: "Qwik site admin panel",
      name   : "description"
    },
  ],
  title: "Welcome to Qwik Admin"
};