// import      { Resource, component$ }  from "@builder.io/qwik";
// import type { HomePageApiData }       from "@data/pages/pages.types";
// import      { Meta }                  from "@data/meta.constants";
// import type { StaticGenerateHandler } from "@builder.io/qwik-city";
// import      { fetchPageData }         from "@data/pages/pagesData";
// import      { getDataFromRoute }      from "@data/dataManager";
// import      { homeTemplate }          from "@pages/home/home";
// import      { routeLoader$ }          from "@builder.io/qwik-city";
// import      { supportedLocales }      from "@data/data.constants";

// /*
// TOD0 vérifier le bon chargement des données
// TOD0 vérifier la construction des données dans le dataManager
// TODO tester si le store fonctionne (vérifier dans l'affichage)
// TODO éviter de recharger plusieur fois le localStorgae (probablement avec Task)
// TOD0 tester en mode build si accès aux données
// TODO enregistrer dans le localStorage au changement de page
// TOD0 vérifier build généré avec bons fichiers
// TODO réparer can not fetch http://localhost:5174/fr/url
// TODO vérifier build, semble avoir un souci
// */

// export const onStaticGenerate: StaticGenerateHandler = () => {
//   return {
//     params: supportedLocales.map((lang) => {
//       return { lang };
//     }),
//   };
// };

// export const useHomeLoader = routeLoader$(async ({ request }) => {
//   const headers = request.headers;
//   const data    = await getDataFromRoute(headers, fetchPageData) as HomePageApiData;

//   return {
//     content    : data.content,
//     description: data.description || "Default Description",
//     title      : data.title       || "Default Title"
//   };
// });

// export default component$(() => {
//   const srcData = useHomeLoader();
//   return (
//     <Resource
//       value      = {srcData}
//       onPending  = {() => <p>Loading...</p>}
//       onResolved = {homeTemplate}
//       onRejected = {(error) => <p>Error loading data: {error.message}</p>}
//     />
//   );
// });

// export const head = ({ resolveValue }: any) => {
//   const { title, description } = resolveValue(useHomeLoader);

//   return {
//     meta: [
//       {
//         content: description,
//         name   : Meta.DESCRIPTION,
//       },
//     ],
//     title
//   };
// };