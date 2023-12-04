import axios from 'axios';
import Network from './Network';

export default class Api {
  static postData(apiURL: string, body: any, tokenRequired = true) {
    return new Promise((resolve, reject) => {
      Network.getInstace()
        .fetchCurrentNetworkStatus()
        .then(isconnected => {
          if (isconnected) {
            var headers = {
              secretkey: '',
            };
            axios
              .post(apiURL, body, {
                method: 'POST',
                headers: headers,
                timeout: 1000 * 120,
              })
              .then(function (response: any) {
                console.log('API response->', response);
                resolve(response.data);
              })
              .catch(async function (error: any) {
                if (error.response) {
                  if (
                    error.status === 401 &&
                    error.message === 'invalid_token'
                  ) {
                  } else {
                    reject(error);
                  }
                } else {
                  reject(error);
                }
              });
          } else {
            reject('no internet connected, please try again later.');
          }
        });
    });
  }
}
