//  Easy to use module that creates a factory to make GET/POST/PUT/DELETE requests to a named API and return a PROMISE. 
//  This is just sugar for the developer to use here. It save's us writing out all this boiler plate every time.
//  There is a provider setting that allows the user to inject a bearer token too, useful for .NET web API :)  

//  STILL TO DO: Put and delete commands........

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

        //  Create the post request that is going to be used system wide
        var Post = function (url, data) {
            var deferred = $q.defer();
            var result = $http({
                url: RestifyApiUrl.url + url,
                dataType: 'json',
                method: 'POST',
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
            Post: Post
        };
    };
})();
