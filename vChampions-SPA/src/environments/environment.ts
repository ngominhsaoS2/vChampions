// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://139.180.134.199/api/',
  pageSize: 10,
  defaultAvatar: {
    publicId: 'vChampions/default/_default-user.jpg',
    version: '1574318630'
  },
  defaultLogo: {
    publicId: 'vChampions/default/_default-logo.png',
    version: '1574398775'
  },
  defaultStadium: {
    publicId: 'vChampions/default/_default-stadium.jpg',
    version: '1575427287'
  },
  folderUser: 'user',
  folderStadium: 'stadium',
  folderLogo: 'logo',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
