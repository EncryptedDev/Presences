const presence = new Presence({
		clientId: "768710795449335818",
	}),
	strings = presence.getStrings({
		play: "presence.playback.playing",
		pause: "presence.playback.paused",
		live: "presence.activity.live",
	});

/**
 * Get the current state text
 * @param {boolean} paused Is the video paused
 * @param {boolean} live Is it a live video
 */
function getStateText(paused: boolean, live: boolean) {
	return live ? "Live Broadcast" : paused ? "Paused" : "Watching";
}

let elapsed: number, oldUrl: string;

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "starz-logo",
		},
		{ href, pathname: path } = window.location;

	if (href !== oldUrl) {
		oldUrl = href;
		elapsed = Math.floor(Date.now() / 1000);
	}

	const video: HTMLVideoElement = document.querySelector(
		".bitmovinplayer-container video"
	);

	if (video) {
		const title = document.querySelector("title")?.textContent,
			[startTimestamp, endTimestamp] = presence.getTimestamps(
				Math.floor(video.currentTime),
				Math.floor(video.duration)
			),
			live = endTimestamp === Infinity;

		presenceData.details = title;
		presenceData.state = getStateText(video.paused, live);
		presenceData.smallImageKey = live
			? "live"
			: video.paused
			? "pause"
			: "play";
		presenceData.smallImageText = live
			? (await strings).live
			: video.paused
			? (await strings).pause
			: (await strings).play;
		presenceData.startTimestamp = live ? elapsed : startTimestamp;
		if (!live) presenceData.endTimestamp = endTimestamp;
		if (live) delete presenceData.endTimestamp;
		if (video.paused) {
			delete presenceData.startTimestamp;
			delete presenceData.endTimestamp;
		}

		if (title) presence.setActivity(presenceData, !video.paused);
	} else {
		presenceData.details = "Browsing...";
		if (path.includes("/series")) presenceData.details = "Browsing Series";

		if (path.includes("/movies")) presenceData.details = "Browsing Movies";

		if (path.includes("/playlist")) presenceData.details = "Browsing Playlist";

		if (path.includes("/schedule")) presenceData.details = "Browsing Schedule";

		if (path.includes("/search")) presenceData.details = "Searching...";

		presenceData.startTimestamp = elapsed;
		presence.setActivity(presenceData);
	}
});
