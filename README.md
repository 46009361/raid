# Image Downloader for Reddit Achievements

On the mobile app for Reddit, when your account earns an achievement, Reddit generates an image for you to download and/or share. As of writing this, the URL for this image is [only documented in one place](https://www.google.com/search?q=%22show-user-info%3Dtrue%22&udm=14), as `https://share.redd.it/preview/user/<the-usename-here>/achievement/10?show-user-info=true` (source: [HackerOne report](https://hackerone.com/reports/2618486#:~:text=https%3A//share.redd.it/preview/user/%3Cthe%2Dusename%2Dhere%3E/achievement/10%3Fshow%2Duser%2Dinfo%3Dtrue)). For certain types of achievements, this can show you the unlock number of anyone else's achievement.

> [!NOTE]
> 
> Funny enough, the public Insecure Direct Object Reference (IDOR) vulnerability referenced in the original HackerOne report still works even if the achievement is hidden (unpinned) from the profile, provided the account username entered in isn't banned from Reddit. A banned account would return an `Unsupported Media Type` error. This may change at any time.

## Using the demo link

> [!IMPORTANT]
> 
> Because browsers are inconsistent on clearing memory blobs, and some browsers may clear it early, **the last step will immediately open up your device's built-in sharing popup and ask you to share it**. You can save it to a file manager if you don't want to share it now, or exit out of the popup, right-click/hold, and download. Depending on user feedback, I may implement a fix for this in the near future.

1. Enter a valid username into the first box.
2. Select the name of the achievement you want.
3. Choose the language.
   * These languages were tested against the "Joined Reddit" achievement, which is the most common one. Some languages are not fully translated and newer achievements may not have been translated at all; these are solely official translations from Reddit.
4. Choose whether you want to show the username and avatar in your image.
5. Press "Get & Share Image."

Basically, these URLs are not locked behind authentication, meaning you don't need to log into the actual Reddit account behind the username you enter in to retrieve these images.

Before I started making this project, I was digging around and realized it's possible to get the achievement in any major language by changing the `Accept-Language` header in the request sent; a `lang` URL parameter doesn't work, even though it would've avoided the need for a proxy apart from the sharing functionality. If this header is not included when requesting the image, Reddit guesses based on the rough geolocation of the IP address, according to my testing on [TestLocally](https://testlocal.ly/blog/view-website-from-another-country). This project tries to automatically select your browser language, but if it doesn't recognize yours, the default is English.

And yes, I'm aware that the name "raid" doesn't fit the intended tone of the project. 😂 I figured it would be easier to type this shorter repository name when cloning the project, even though the original title implied an AI "image generator" for the deterministic output of these achievements.

## Credits

* [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API) and the limited availability/browser compatibility
* [Navigator: share() method](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) and similar compatibility
* [URL.revokeObjectURL doesn't remove blobs from "Sources" panel and from chrome://blob-internals/](https://stackoverflow.com/questions/74958031/url-revokeobjecturl-doesnt-remove-blobs-from-sources-panel-and-from-chrome)
* Reddit for the achievements, their internal identifiers, and [legacy code for the link previewer](https://github.com/reddit-archive/reddit/blob/master/r2/r2/lib/media.py#L706-L774), so the OpenGraph thumbnail previews on Reddit itself
* The Google Search result and HackerOne report linked at the top, as well as TestLocally above
* [Scratch](https://scratch.mit.edu/) for the language list, with the capitalization of the country codes modified to meet the requirements of the browser header.
   * I had to remove many languages that fell back to English, as it wouldn't make sense to include them if they don't work on this project.
* The [r/Redditachievments wiki](https://www.reddit.com/r/Redditachievments/wiki/records/) for providing me with a list of accounts having the most achievements for me to test on. Without them, this project wouldn't be possible!
* At least one more source that I probably forgot when it came to writing the remaining parts of the code that I didn't already know