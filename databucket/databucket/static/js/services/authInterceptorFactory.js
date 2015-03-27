angular.module('uploadApp')
       .factory('authInterceptor',

function ($rootScope, $q, $window, $location) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      return response || $q.when(response);
    },
    responseError: function(responseError) {
      
      if (responseError.status === 401) {
         $location.path('/login');
      }

      

      throw responseError;
    }
  };
});

// https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/

