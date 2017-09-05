# node-spotify-listenbrainz
Intercept Last.fm scrobbles from Spotify and send them to Listenbrainz

It goes without saying you need Spotify, Node and a Listenbrainz account. You don't need a Last.fm
account because you can enter any old fake details in the Spotify preferences.

### One time setup instructions

First you need to edit your hosts file like this.

```
127.0.0.1    post.audioscrobbler.com
127.0.0.1    post2.audioscrobbler.com
```

Instead of submitting to Last.fm, Spotify will now be submitting to our local Node server.

Either clone the repo or if you don't use Git, download and extract the files from [this archive](https://github.com/19379/node-spotify-listenbrainz/archive/master.zip).

Using your file browser, navigate to the folder containing `server.js` and create a file named `token.json`
and format it exactly like this.

```
{
    "token" : "abc123"
}
```

Obviously, replace the `abc123` with your actual Listenbrainz token. You can get that here...

https://listenbrainz.org/user/info

To install required dependencies, open a command prompt and run

`npm install`

---

Now that setup is complete, you should used this command to start the server before opening Spotify.

`node server.js`

You'll need to configure Spotify with a Last.fm username/password but these don't need to be real. Listen
to some music and the command prompt should report the submissions/Listenbrainz server status as it goes.
