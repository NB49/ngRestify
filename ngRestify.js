//  Easy to use module that creates a factory to make GET/POST/PUT/DELETE requests to a named API and return a PROMISE. 
//  This is just sugar for the developer to use here. It save's us writing out all this boiler plate every time.
//  There is a provider setting that allows the user to inject a bearer token too, useful for .NET web API :)  

(function () {
    angular.module('ngRestify', []) 
        .factory('Restify', _serviceCallers)
        .factory('RestifyBearerInjector', _bearerInjector)
        .provider('RestifyApiUrl', _urlProvider);

    //  The factory that is used to inject the bearer token into each and every request, this expects that the token is stored where the provier told it that it was
    function _bearerInjector () {
        var bearerInjector = {
            request: function (config) {
                config.headers['Content-Type'] = 'application/json';
                config.headers['Authorization'] = 'Bearer ' + localStorage.getItem("token");
                return config;
            }
        };
        return bearerInjector;
    };

    //  By default, the URL is set to a slash, meaning the root of the application, this can be overrided with this provider
    function _urlProvider () {     
        var url = '';
        return {
                SetApiUrl: function (value) {
                    url = value;
            },
            $get: function () {
                return {
                    url: url
                }
            }
        }
    };

    //  The factory that is used to provide the GET, POST, PUT and DELETE commands
    function _serviceCallers ($http, $q, RestifyApiUrl) {
        
        //  Create the GET request
        var Get = function (url) {
            var deferred = $q.defer();
            var result = $http.get(RestifyApiUrl.url + url);
            result.then(function (response) {
                deferred.resolve(response.data);
            })
            .catch(function (e) {
                deferred.reject(e);
            });
            return deferred.promise;
        };
        
        //  Create the DELETE request
        var Delete = function (url) {
            var deferred = $q.defer();
            var result = $http.delete(RestifyApiUrl.url + url);
            result.then(function (response) {
                deferred.resolve(response.data);
            })
            .catch(function (e) {
                deferred.reject(e);
            });
            return deferred.promise;
        };

        //  Create the POST request wrapper that is going to be used system wide
        var Post = function (url, data) {
            return _withBody(url, data, 'POST');
        };
                
        //  Create the PUT request wrapper that is going to be used system wide
        var Put = function (url, data) {
            return _withBody(url, data, 'PUT');
        };
        
        //  Makes a post with a BODY
        var _withBody = function (url, data, method) {
            var deferred = $q.defer();
            var result = $http({
                url: RestifyApiUrl.url + url,
                dataType: 'json',
                method: method,
                data: data
            });
            result.then(function (response) {
                deferred.resolve(response.data);
            })
            .catch(function (e) {
                deferred.reject(e);
            });
            return deferred.promise;
        };

        return {
            //  Revealing module pattern reveals the function
            Get: Get,
            Post: Post,
            Put: Put,
            Delete: Delete
        };
    };
})();
