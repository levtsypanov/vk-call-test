/* eslint-disable prettier/prettier */
const logsBlock = document.querySelector('#logs');
function log(message) {
  logsBlock.innerHTML += `${message}\n`;
}

const sp = new URLSearchParams(window.location.search);
if (sp.has('app')) {
  document.querySelector('#appkey').value = sp.get('app');
}

function createVideo(name, stream, size) {
  const video = document.createElement('video');
  video.srcObject = stream;
  video.height = size;
  document.body.appendChild(video);
  video.play();
  video.id = name;

  return video;
}

async function run() {
  const appKey = document.querySelector('#appkey').value;
  const userToken = document.querySelector('#usertoken').value;
  const callToken = document.querySelector('#calltoken').value;

  log(`app key: ${appKey}`);
  log(`user token: ${userToken}`);
  log(`call token: ${callToken}`);

  VKCallsSDK.init({
    apiKey: appKey,
    authToken: userToken,
    onRemoteStream: (userId, stream) => {
      console.log('onRemoteStream', userId, stream);
      createVideo(userId.toString(), stream, 300)
    },
    /* ... */
    onStatistics: (stats) => {
      console.log('onStatistics', stats);
    },
  })
    .then(() => {
      return VKCallsSDK.authorize();
    })
    .then(() => {
      VKCallsSDK.joinCallByLink(
        callToken,
        navigator.mediaDevices ? ['VIDEO', 'AUDIO'] : []
      );
    })
    .catch((err) => {
      log(`[error] ${err.message}`)
      console.error(err);
    });
}


navigator.mediaDevices?.getUserMedia({ video: true })
.then((mediaStream) => createVideo('local', mediaStream, 200));
