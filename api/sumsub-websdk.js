import snsWebSdk from '@sumsub/websdk';

/**
 * @param accessToken - access token that you generated
 * on the backend with levelName: mtc
 */
function launchWebSdk(accessToken) {
  let snsWebSdkInstance = snsWebSdk.init(
      accessToken,
      // token update callback, must return Promise
      () => this.getNewAccessToken()
    )
    .withConf({
      //language of WebSDK texts and comments (ISO 639-1 format)
      lang: 'en',
    })
    .on('onError', (error) => {
      console.log('onError', payload)
    })
    .onMessage((type, payload) => {
      console.log('onMessage', type, payload)
    })
    .build();

  // you are ready to go:
  // just launch the WebSDK by providing the container element for it
  snsWebSdkInstance.launch('#sumsub-websdk-container')
}
