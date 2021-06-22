const presence = new Presence({
    clientId: "617741834701242406"
  }),
  strings = presence.getStrings({
    play: "presence.playback.playing",
    pause: "presence.playback.paused",
    live: "presence.activity.live"
  });

/**
 * Get Timestamps
 * @param {Number} videoTime Current video time seconds
 * @param {Number} videoDuration Video duration seconds
 */
function getTimestamps(
  videoTime: number,
  videoDuration: number
): Array<number> {
  const startTime = Date.now(),
   endTime = Math.floor(startTime / 1000) - videoTime + videoDuration;
  return [Math.floor(startTime / 1000), endTime];
}

presence.on("UpdateData", async () => {
  let video: HTMLVideoElement = document.querySelector(
    "#main-container > div > video"
  ),

   description;

  if (video && !isNaN(video.duration)) {
    const title = document.querySelector(
      "#player-video-overlay .player-title .player-title-name"
    ).textContent;
    if (document.location.pathname.includes("/live")) {
      description = document.querySelector(
        "#player-video-overlay .player-title div span"
      ).textContent;
    } else {
      description = document.querySelector(
        "#player-video-overlay .player-title div"
      ).textContent;
    }

    if (description == null || description.trim() == title) 
      description = "Movie";
    

    let timestamps = getTimestamps(
      Math.floor(video.currentTime),
      Math.floor(video.duration)
    ),

     currentState, smallImageKey, smallImageText;
    if (description.includes("ON NOW")) {
      currentState = "Live TV";
      timestamps[0] = 0;
      timestamps[1] = 0;
      smallImageKey = "live";
      smallImageText = (await strings).live;
    } else {
      currentState = description.substring(description.lastIndexOf("  ") + 1);
      smallImageKey = video.paused ? "pause" : "play";
      smallImageText = video.paused
        ? (await strings).pause
        : (await strings).play;
    }

    const data: PresenceData = {
      details: title,
      state: currentState,
      largeImageKey: "showtime-logo",
      smallImageKey,
      smallImageText,
      startTimestamp: timestamps[0],
      endTimestamp: timestamps[1]
    };

    if (video.paused) {
      delete data.startTimestamp;
      delete data.endTimestamp;
    }

    if (title !== null) 
      presence.setActivity(data, !video.paused);
    
  } else {
    const browsingPresence: PresenceData = {
      details: "Browsing...",
      largeImageKey: "showtime-logo"
    };
    presence.setActivity(browsingPresence);
  }
});
