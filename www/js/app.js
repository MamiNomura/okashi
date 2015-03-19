// Ionic okashi App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'okashi' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'okashi.controllers' is found in controllers.js
angular.module('okashi', ['ionic',  'ngCordova', 'okashi.controllers'])

// TODO: eventually we want to hide screen after
// we sign-in/get data, etc... 
// or better to do it  during resolve step within routing layer
// app.run(function(MyDataService) {
//   MyDataService.getThings().then(function(data) {
//     $cordovaSplashscreen.hide()
//   })
// })

.run(function($ionicPlatform, $rootScope, $ionicLoading, $cordovaSplashscreen) {
  // execute splashscreen at the begining of the app
  // hide splash screen after 1 sec.
  setTimeout(function() {
    // debugger;
    $cordovaSplashscreen.hide()
  }, 1000)

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  // register event to rootScope, used for loading screen
  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({template: '<ion-spinner class="spinner-dark" icon="dots">Loading...</ion-spinner>' })
    // $ionicLoading.show({template: 'Loading...' })

  });

  $rootScope.$on('loading:hide', function() {
    setTimeout(function() {
      $ionicLoading.hide();
    }, 5000)
  });
})
    


.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');


  // $httpProvider provider has the notion of interceptors, which allow us
  // to inject code before a request is sent, and before a response is processed by a controller.
  $httpProvider.interceptors.push(function($rootScope) {
    return {
      request: function(config) {
        $rootScope.$broadcast('loading:show')
        return config
      },
      response: function(response) {
        $rootScope.$broadcast('loading:hide')
        return response
      }
    }
  })

});
