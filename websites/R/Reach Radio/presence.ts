const presence = new Presence({
		clientId: "748698437720997888",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "reach2",
		},
		[info, elapsed, format1, format2] = await Promise.all([
			presence.getSetting<boolean>("sInfo"),
			presence.getSetting<boolean>("tElapsed"),
			presence.getSetting<string>("sFormat1"),
			presence.getSetting<string>("sFormat2"),
		]),
		paused =
			document.querySelector<HTMLImageElement>(
				"#react-listen-content > div > div > div.pt-4.startpause.col > button > img"
			).src ===
			"https://radiopanel.s3.nl-ams.scw.cloud/c9a65443-eed1-41ed-b9d2-743223b5ee75/a01dadcd-df3d-484b-8d20-4923156ce77a.svg";

	if (info && paused) {
		if (elapsed) presenceData.startTimestamp = browsingTimestamp;

		if (document.querySelector("#message > div")) {
			presenceData.details = "Requesting a song";
			presenceData.smallImageKey = "writing";
		} else if (document.location.pathname.includes("/about")) {
			presenceData.details = "Reading about Reach Radio";
			presenceData.smallImageKey = "reading";
		} else if (document.location.pathname.includes("/timetable")) {
			presenceData.details = "Viewing the timetable";
			presenceData.smallImageKey = "reading";
		} else if (document.location.pathname.includes("/team")) {
			presenceData.details = "Viewing the team";
			presenceData.smallImageKey = "reading";
		} else if (document.location.pathname.includes("/privacy")) {
			presenceData.details = "Reading Privacy Policy";
			presenceData.smallImageKey = "reading";
		} else if (document.location.pathname.includes("/alexa-terms")) {
			presenceData.details = "Reading Alexa Policy";
			presenceData.smallImageKey = "reading";
		} else if (document.location.pathname.includes("/contact")) {
			presenceData.details = "Writing to Reach Radio";
			presenceData.smallImageKey = "writing";
		} else if (document.location.pathname.includes("/all-news")) {
			presenceData.details = "Viewing the news";
			presenceData.smallImageKey = "reading";
		} else if (document.location.pathname.includes("/news/")) {
			presenceData.details = "Reading article:";
			presenceData.state = document.querySelector(
				"#news3 > section > div > div > div > h4"
			).textContent;
			presenceData.smallImageKey = "reading";
		} else if (document.location.pathname.includes("/podcasts")) {
			presenceData.details = "Viewing podcasts";
			presenceData.smallImageKey = "reading";
		} else if (document.location.pathname.includes("/podcast/")) {
			presenceData.details = "Viewing podcast:";
			presenceData.state = document.querySelector(".pod-name").textContent;
			presenceData.smallImageKey = "reading";
		} else if (document.location.pathname.includes("/listen-to-podcast/")) {
			presenceData.details = "Listening to podcast:";
			presenceData.state = document.querySelector(".pod-name").textContent;

			if (
				document.querySelector(
					"#__layout > div > div.page > section > div > div.pod-player > div > div > div > button:nth-child(1)"
				).className === "plyr__controls__item plyr__control"
			) {
				presenceData.smallImageKey = "pause";
				delete presenceData.startTimestamp;
				delete presenceData.endTimestamp;
			} else {
				presenceData.smallImageKey = "play";
				let podcastDuration = 0;
				const timeArray = document
					.querySelector(".plyr__time")
					.textContent.split(":");

				switch (timeArray.length) {
					case 3: {
						podcastDuration =
							parseInt(timeArray[2]) +
							parseInt(timeArray[1].replace("-", "")) * 60 +
							parseInt(timeArray[0].replace("-", "")) * 60 * 60;

						break;
					}
					case 2: {
						podcastDuration =
							parseInt(timeArray[1]) +
							parseInt(timeArray[0].replace("-", "")) * 60;

						break;
					}
					case 1:
						{
							podcastDuration = parseInt(timeArray[1]);
							// No default
						}
						break;
				}

				presenceData.startTimestamp = Math.floor(Date.now() / 1000);
				presenceData.endTimestamp =
					Math.floor(Date.now() / 1000) + podcastDuration;
			}
		} else if (document.location.pathname === "/") {
			presenceData.details = "Browsing...";
			presenceData.smallImageKey = "reading";
			presenceData.smallImageText =
				document.querySelector("#current_song").textContent;
		}
	} else {
		if (paused) {
			presenceData.smallImageKey = "pause";
			delete presenceData.startTimestamp;
			delete presenceData.endTimestamp;
		} else {
			presenceData.smallImageKey = "play";
			if (elapsed) presenceData.startTimestamp = browsingTimestamp;
		}

		const [artist, title] = document
				.querySelector("#current_song")
				.textContent.split(" - "),
			presenter = document.querySelector(".show_time").textContent;

		presenceData.details = format1
			.replace("%title%", title)
			.replace("%artist%", artist)
			.replace("%presenter%", presenter);
		presenceData.state = format2
			.replace("%title%", title)
			.replace("%artist%", artist)
			.replace("%presenter%", presenter);

		if (document.querySelector("#message > div"))
			presenceData.smallImageText = "Requesting a song";
		else if (document.location.pathname.includes("/about"))
			presenceData.smallImageText = "Reading about Reach Radio";
		else if (document.location.pathname.includes("/timetable"))
			presenceData.smallImageText = "Viewing the timetable";
		else if (document.location.pathname.includes("/team"))
			presenceData.smallImageText = "Viewing the team";
		else if (document.location.pathname.includes("/privacy"))
			presenceData.smallImageText = "Reading Privacy Policy";
		else if (document.location.pathname.includes("/alexa-terms"))
			presenceData.smallImageText = "Reading Alexa Policy";
		else if (document.location.pathname.includes("/contact"))
			presenceData.smallImageText = "Writing to Reach Radio";
		else if (document.location.pathname.includes("/all-news"))
			presenceData.smallImageText = "Viewing the news";
		else if (document.location.pathname.includes("/news/")) {
			presenceData.smallImageText = `Reading article: ${
				document.querySelector("#news3 > section > div > div > div > h4")
					.textContent
			}`;
		} else if (document.location.pathname.includes("/podcasts"))
			presenceData.smallImageText = "Viewing podcasts";
		else if (document.location.pathname.includes("/podcast/")) {
			presenceData.smallImageText = `Viewing podcast: ${
				document.querySelector(".pod-name").textContent
			}`;
		} else if (document.location.pathname.includes("/listen-to-podcast/")) {
			presenceData.smallImageText = `Listening to podcast: ${
				document.querySelector(".pod-name").textContent
			}`;
		} else if (document.location.pathname === "/")
			presenceData.smallImageText = "Browsing...";
	}

	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
