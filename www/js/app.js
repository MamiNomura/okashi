// Ionic okashi App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'okashi' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'okashi.controllers' is found in controllers.js
angular.module('okashi', [
  'ionic',  
  'ngCordova', 
  'auth0',
  'angular-storage',
  'angular-jwt',
  'okashi.constants',
  'okashi.controllers'
  ])

// TODO: eventually we want to hide screen after
// we sign-in/get data, etc... 
// or better to do it  during resolve step within routing layer
// app.run(function(MyDataService) {
//   MyDataService.getThings().then(function(data) {
//     $cordovaSplashscreen.hide()
//   })
// })

.run(function($ionicPlatform, $rootScope, $ionicLoading, $cordovaSplashscreen, auth, store, jwtHelper, $location) {
  // This hooks all auth events to check everything as soon as the app starts
  auth.hookEvents();

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

    $ionicLoading.hide();

  });

  // This events gets triggered on refresh or URL change
  $rootScope.$on('$locationChangeStart', function() {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          auth.authenticate(store.get('profile'), token);
        } else {
          // Either show Login page or use the refresh token to get a new idToken
          $location.path('/');
        }
      }
    }
  });
})
    


.config(function($stateProvider, $urlRouterProvider, $httpProvider, 
  authProvider, jwtInterceptorProvider, okashiConstants) {
  $stateProvider

  // This is the state where you'll show the login
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl',
  })

  // every app is required for login
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AccountCtrl',
    data: { 
      requiresLogin: true
    }
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
  });

  authProvider.init({
    domain: okashiConstants.authDomain,
    clientID: okashiConstants.authClientID,
    loginState: okashiConstants.authLoginState
  });

  jwtInterceptorProvider.tokenGetter = function(store, jwtHelper, auth) {
    var idToken = store.get('token');
    var refreshToken = store.get('refreshToken');
    // If no token return null
    if (!idToken || !refreshToken) {
      return null;
    }
    // If token is expired, get a new one
    if (jwtHelper.isTokenExpired(idToken)) {
      return auth.refreshIdToken(refreshToken).then(function(idToken) {
        store.set('token', idToken);
        return idToken;
      });
    } else {
      return idToken;
    }
  }

  $httpProvider.interceptors.push('jwtInterceptor');

});
