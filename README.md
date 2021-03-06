<!-- PROJECT SHIELDS -->
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
* [Screenshots](#screenshots)
  * [Player](#player)
  * [Playlist detailed](#playlist-detailed)
  * [Playlist simple](#playlist-simple)
  * [Youtube search](#youtube-search)
  * [Youtube download](#youtube-download)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation and running](#installation)
* [Functionality](#usage)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project

This project is developed in my spare time after work as a proof of concept ionic 4 media player.

## Screenshots

### Player

![alt tag](https://github.com/pawelpaszki/ionic-4-media-player/blob/screenshots/screenshots/player.png)

### Playlist detailed

![alt tag](https://github.com/pawelpaszki/ionic-4-media-player/blob/screenshots/screenshots/list-detailed.png)

### Playlist simple

![alt tag](https://github.com/pawelpaszki/ionic-4-media-player/blob/screenshots/screenshots/list.png)

### Youtube search

![alt tag](https://github.com/pawelpaszki/ionic-4-media-player/blob/screenshots/screenshots/ytsearch.png)

### Youtube download

![alt tag](https://github.com/pawelpaszki/ionic-4-media-player/blob/screenshots/screenshots/ytsearch-downloaded.png)

## Getting started

### Prerequisites

Before running this app, node (and perhaps nvm), ionic 4 and angular (and possibly angular -cli) have to be installed

### Installation and running

1. Clone the repo
```sh
https://github.com/pawelpaszki/ionic-4-media-player.git
```
2. Install NPM packages
```sh
cd ionic-4-media-player && npm install
```
3. Run in the browser (limited functionality - probably overview only, as the majority of the functionality is only available on Android (did not test on on iOS -> more than likely file related stuff will not work))
```sh
ng serve
```
4. Run on device (-l -> live reload)
```sh
ionic cordova run android -l
```

<!-- USAGE EXAMPLES -->
## Functionality and its status

* loading and removing local media to/from the playlist
* playback of local media from the playlist
* rearranging the playlist song by song
* displaying the playlist in card with album image (if present) or in plain list
* marking songs as favourite
* renaming songs
* Persitence:
  * playlist with the info about the songs, including:
    * name
    * favourite flag
    * markedForDeletion flag
    * duration
    * thumbnail
    * and more
  * shuffle (on or off)
  * repeat mode:
    * none
    * song
    * favourite
    * selected songs (select option available in the player component)
    * all
    * part of the song (it can be set to loop through the part of the song by specifying start and end - TODO)
  * selected sort (if any)
* different repeat modes (see repeat mode in the Persistence above)
* turn off timer (specifies when the media playing is to be stopped) (TODO)
* search Youtube API
* remove file from device (TODO)
* download from Youtube

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**, if there is any value to the contribution. To contribute, please:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request with the reasoning behind it

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

pawelpaszki@gmail.com

[license-shield]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: https://choosealicense.com/licenses/mit
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/pawelpaszki
