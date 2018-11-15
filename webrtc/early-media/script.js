var signalingChannel = new SignalingChannel();
var configuration = { iceServers: [{ urls: "stuns:stun.example.org" }] };
var pc;

// call start() to initiate
function start() {
  pc = new RTCPeerConnection(configuration);

  // send any ice candidates to the other peer
  pc.onicecandidate = function (evt) {
    signalingChannel.send(JSON.stringify({ candidate: evt.candidate }));
  };

  // let the "negotiationneeded" event trigger offer generation
  pc.onnegotiationneeded = function () {
    pc.createOffer().then(function (offer) {
      return pc.setLocalDescription(offer);
    })
      .then(function () {
        // send the offer to the other peer
        signalingChannel.send(JSON.stringify({ desc: pc.localDescription }));
      })
      .catch(logError);
  };

  // get a local stream, show it in a self-view and add it to be sent
  navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    .then(function (stream) {
      selfView.srcObject = stream;
      var remoteStream = new MediaStream();
      var audioSender = pc.addTrack(stream.getAudioTracks()[0], stream);
      var videoSender = pc.addTrack(stream.getVideoTracks()[0], stream);

      [audioSender, videoSender].forEach(function(sender) {
        remoteStream.addTrack(pc.getReceivers.find(function (receiver) {
          return receiver.mid == sender.mid;
        }).track);
      });

      // Render the media even before ontrack fires.
      remoteView.srcObject = remoteStream;
    })
    .catch(logError);
}

signalingChannel.onmessage = function (evt) {
  if (!pc)
    start();

  var message = JSON.parse(evt.data);
  if (message.desc) {
    var desc = message.desc;

    // if we get an offer, we need to reply with an answer
    if (desc.type == "offer") {
      pc.setRemoteDescription(desc).then(function () {
        return pc.createAnswer();
      })
        .then(function (answer) {
          return pc.setLocalDescription(answer);
        })
        .then(function () {
          var str = JSON.stringify({ desc: pc.localDescription });
          signalingChannel.send(str);
        })
        .catch(logError);
    } else
      pc.setRemoteDescription(desc).catch(logError);
  } else
    pc.addIceCandidate(message.candidate).catch(logError);
};

function logError(error) {
  log(error.name + ": " + error.message);
}
