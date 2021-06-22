const iframe = new iFrame();
iframe.on("UpdateData", async () => {
  if (document.querySelector(".bilibili-player-video video") !== null) {
    const video: HTMLVideoElement = document.querySelector(
      ".bilibili-player-video video"
    );

    if (video != undefined && !isNaN(video.duration)) {
      const test = video.paused;
      iframe.send({
        iframe_video: {
          iFrameVideo: true,
          test,
          currTime: video.currentTime,
          dur: video.duration,
          pause: test
        }
      });
    }
  }
});
