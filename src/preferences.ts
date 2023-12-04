import DefaultPreference from 'react-native-default-preference';

const networkStatus = 'NetworkStatus';

export default class Preferences {
  static saveNetworkStatus(value: boolean) {
    return new Promise(resolve => {
      DefaultPreference.set(networkStatus, value ? 'TRUE' : 'FALSE').then(
        () => {
          console.log('save Network Status' + networkStatus);
          resolve(networkStatus);
        },
      );
    });
  }
  static getNetworkStatus() {
    return new Promise(resolve => {
      DefaultPreference.get(networkStatus).then(
        (value: String | null | undefined) => {
          if (value === undefined) {
            value = 'TRUE';
          }
          resolve(value === 'TRUE' ? true : false);
        },
      );
    });
  }
}
