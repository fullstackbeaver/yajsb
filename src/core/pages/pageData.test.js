import { merge } from './pageData';

// describe('extractSharedDataFromData', () => {
//   it('should extract correctly elements',  () => {
//     const testData = {
//       pageSettings: {
//         title: "My super article",
//         description: "My super description",
//         keywords: "My super keywords",
//       },
//       blog: {
//         title: "My super article",
//         description: "My super description",
//         keywords: "My super keywords",
//       },
//       footer: {
//         shared_link1: {
//           label: "link1",
//           url: "url1"
//         }
//       }
//     };
//     const { extractedData, extractedShared } =  extractSharedDataFromData(testData);
//     expect(extractedShared).toEqual({
//       footer: { shared_link1: { label: "link1", url: "url1" } }
//     });
//     expect(extractedData).toEqual({
//       blog: testData.blog,
//       pageSettings: testData.pageSettings
//     });
//   });
// });

describe('merge', () => {
  it('should add a new node',  () => {
    const srcData = {
      pageSettings: {
        title: "My super article",
        description: "My super description",
        keywords: "My super keywords",
      },
      blog: {
        title: "My super article",
        description: "My super description",
        keywords: "My super keywords",
      },
      footer: {
        shared_link1: {
          label: "link1",
          url: "url1"
        }
      }
    };
    const dataToAdd = {
      footer: {
        shared_link2: {
          label: "link2",
          url: "url2"
        }
      }
    }
    expect(merge(srcData, dataToAdd)).toEqual({
      pageSettings: {
        title: "My super article",
        description: "My super description",
        keywords: "My super keywords",
      },
      blog: {
        title: "My super article",
        description: "My super description",
        keywords: "My super keywords",
      },
      footer: {
        shared_link1: {
          label: "link1",
          url: "url1"
        },
        shared_link2: {
          label: "link2",
          url: "url2"
        }
      }
    });
  });
});