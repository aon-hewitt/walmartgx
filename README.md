# walmartgx
What is a Guided Experience?
	Guided Experience is an interactive video experience that serves to educate the user, solicit input from the user and usually make recommendations based on user input. It often uses humor and a very personable actor to make the experience engaging, and in the background it can leverage sophisticated logic to help the user make an informed choice.
Structurally it’s an interconnected network of videos, some of which may never be seen by the user – depending on the choices the user makes throughout the experience. The video player is embedded in a web page and often the two work together through the Brightcove API, with the page displaying supplemental information supporting the choices the user made in the video. 
A GX doesn’t have to depend completely on user input, you could pass user specific data through an SSO connection or query string for example and tailor the experience based on this info.
Guided Experience has traditionally leveraged an interactive HTML layer generated by the Rapt Media solution. Moving forward we intend to use (wherever possible) this new approach which uses a JSON configuration file and the Brightcove API to build this interactive HTML layer.
The Walmart GX represents the latest version of the Raptless GX. It features two players on the page rather than one. The second player hosts the wait sequence of the video loaded into player 1. This provides for a seamless transition from main video to wait sequence. It also includes support for closed captioning with the cc state maintained across all videos. This frees the user from having to reselect their cc preferences with each new video. The Walmart GX is a demo. Not all menu items are clickable.
This project is on Github and in addition to exploring the file set you are encouraged to fork the code, enhance the tool and submit pull requests.
