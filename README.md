# BrainBoard

TODO
### About
Minimal app to capture and share small notes, thoughts, and ideas. It serves as a digital space where users can jot down their fleeting inspirations, organize their musings, and engage with a community of like-minded individuals.
### Primary Libraries Used

* <b>NLTK</b>
  * Valence Aware Dictionary and sEntiment Reasoner (VADER) for sentiment analysis of user text entry.
* <b>Pandas</b>
  * Storage of scraped song data and Boolean indexing for quick recall.
 - - - -
### Contents
* <b>sentiment.py</b>
  * Evaluates the sentiment of a given body of text.
* <b>spotify_scraper.py</b>
  * Scrapes Spotify API for song information and contains details in a pd.DataFrame.
* <b>audio_thera.py</b>
  * main() function that runs scripts developed in the other .py files.
* <b>secrets.py</b> (<i>.gitignore</i>)
  * Contains user credentials including username, scope, client_id, client_secret, and redirect_uri for the app.
- - - -
### Example
TODO: Add screen recording of script in action
- - - -
### Next Steps
- [ ] Host application on Flask or Django.
- [ ] Create SQLite database to store sentiment analysis results / recommended songs.
- [ ] Improve method of analyzing song sentiment through Spotify's metrics.
- - - -
### License
TODO: Add MIT license data here.
