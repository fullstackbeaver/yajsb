// import { useSignal } from "@builder.io/qwik";

// export const currentProject = useSignal("");

// import { useStore } from "@builder.io/qwik";

// export function useJobStore(initialKey: string) {
//   const store = useStore( {} as any );

//   const jobResource = useResource$<any>(async ({ track }) => {
//     const key  = track(() => initialKey);
//     const data = {};

//     // Vérifier d'abord dans le store
//     if (store.value[key]) {
//       return store.value[key];
//     }

//     // Ensuite, vérifier dans le localStorage
//     const storedData = localStorage.getItem(TypePage.JOB);

//     if (storedData) {
//       const parsedData = JSON.parse(storedData);
//       if (parsedData[key]) {
//         store.value = { ...store.value, ...parsedData };
//         return parsedData[key];
//       }
//     }

//     // Si les données ne sont pas trouvées, les charger
//     const lang               = key.split("_")[0] as Language;
//     const { newData, newMenu } = await fetchJobData(key, hasMenu(lang, TypePage.JOB));
//     if (newMenu) setMenu(lang, TypePage.JOB, newMenu);
//     store.value[key] = newData;
//     localStorage.setItem(TypePage.JOB, JSON.stringify(store.value));
//     return data;
//   });

//   return { jobResource };
// }