(function() {
  var app = angular.module("Groundlevel", ['onsen', 'ngTouch']);
  function randInt(min, max) {
    if (typeof min === 'number' && typeof max === 'number') {
      return Math.floor(Math.random()*(max - min)) + min;
    } else {
      return new Error("randInt: Type Error.\n randInt requires two arguments that are numbers.");
    }
  }

  app.filter('Upstart', function() {
    return function(txt) {
      return txt.slice(0, 1).toUpperCase() + txt.slice(1, txt.length);
    };
  });

  app.factory('MusicPlayer', ['$http', '$timeout',function(h, t) {
    var service = {
      // Properties
      songs: [],
      playing: false,
      currentSong: {},
      nowPlaying: {},
      // Methods
      togglePlaylist: function(title) {
        var self = this;
        if (Object.keys(self.currentSong).length || self.playing) {
          self.currentSong.stop();
          self.currentSong.release();
        }
        self.songs = [];
        self.nowPlaying = {};
        var attempt = function() {
          h.get('http://thefullstackguy.com:2252/playlists/' + encodeURIComponent(title)).then(function(res) {
            console.log("Got the playlist songs");
            res.data.forEach(function(it, ind) {
              self.songs.push(it);
              if (ind === res.data.length -1) {
                self.playing = false;
                self.togglePlay();
              }
            });
          }, function(err) {
            t(attempt, 500);
            console.error(JSON.stringify(err));
          });
        };
        attempt();
      },
      togglePlay: function() {
        var self = this;
        if (self.songs.length === 0) {
          return false;
        } else if (self.playing) {
          self.currentSong.pause();
          self.playing = false;
        } else if (!Object.keys(self.nowPlaying).length) {
          var songInd = randInt(0, self.songs.length);
          console.log("Picked " + self.songs[songInd].title);
          self.currentSong = new Media(
            "http://thefullstackguy.com:2252/media/" +
            self.songs[songInd].id + ".mp3", function() {
              console.log("success");
            }, function(err) {
              console.error(err);
            }
          );
          self.nowPlaying = {
            title: self.songs[songInd].title,
            artist: self.songs[songInd].artist
          };
          // for stability, give some buffer time
          t(function() {
            self.currentSong.play();
            self.playing = true;
          }, 1000);
        } else {
          t(function() {
            self.currentSong.play();
            self.playing = true;
          }, 750);
        }
      }
    };
    return service;
  }]);

  app.controller('globalCtrl', ['$scope', '$http', '$timeout', 'MusicPlayer', function($scope, $http, t, mp) {
    console.log("globalCtrl loaded.");

    $scope.mp = mp;

    $scope.playerStat = function() {
      if (mp.playing) {
        return "fa-pause";
      } else {
        return "fa-play";
      }
    };

    // load the playlists

    var fetch = function() {
      $http.get('http://thefullstackguy.com:2252/playlists/all').then(function(res) {
        splash.hide();
        console.log("Retrieved playlists.");
        $scope.playlists = [];
        res.data.forEach(function(it) {
          $scope.playlists.push(it._id.playlist);
        });
      }, function(err) {
        t(fetch, 1000);
        console.log("Error in retrieving songs.\n" + JSON.stringify(err));
      });
    };
    t(fetch, 50);

  }]);

  document.addEventListener('deviceready', function() {
    console.log("Device is READY");
    angular.bootstrap(document, ["Groundlevel"]);
  }, false);
  document.addEventListener('pageinit', function() {
    splash.show();
  }, false);
  return app;
})();
