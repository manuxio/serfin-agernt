const { ipcRenderer } = require('electron');
const { BrowserWindow } = require('electron').remote;

// window.addEventListener('beforeunload', (ev) => {
//   // Setting any value other than undefined here will prevent the window
//   // from closing or reloading
//   // alert('OK');
//   ev.returnValue = true;
// });

let openvidu;
let session;
let publisher;
let sessionReady;
let showingDesktop;
let showingAudio;
let desktopPublisher;
// let mySessionId;

function serfinJoinSession() {
  openvidu = new window.OpenVidu();
  session = openvidu.initSession();
  session.on('streamCreated', (event) => {
    session.subscribe(event.stream, 'subscriber');
  });

  const { token } = window.sessionData;
  session
    .connect(token, { clientData: 'TEST' })
    .then(() => {
      // console.log('Creating publisher');
      // publisher = openvidu.initPublisher(undefined, {
      //   videoSource: `screen:screen:0:0`,
      //   publishVideo: true,
      //   publishAudio: false,
      // });
      // session.publish(publisher);
      sessionReady = true;
      if (showingDesktop) {
        desktopPublisher = openvidu.initPublisher(undefined, {
          videoSource: `screen:screen:0:0`,
          publishVideo: true,
          publishAudio: false,
        });
        session.publish(desktopPublisher);
      }
      return true;
    })
    .catch((e) => {
      console.log('Error', e);
    });
}

function republish() {
  if (showingDesktop) {
    if (!desktopPublisher) {
      desktopPublisher = openvidu.initPublisher(undefined, {
        videoSource: `screen:screen:0:0`,
        publishVideo: true,
        publishAudio: false,
      });
    }
    session.publish(desktopPublisher);
  }
}

function leaveSession() {
  session.disconnect();
  window.close();
}

ipcRenderer.on('store-session-data', (event, data) => {
  // console.log(data);
  window.sessionData = data;
  serfinJoinSession();
});

ipcRenderer.on('show-desktop', (event) => {
  console.log('Must show desktop!');
  showingDesktop = true;
  republish();
});

ipcRenderer.on('pause-desktop', (event) => {
  showingDesktop = false;
  republish();
});
