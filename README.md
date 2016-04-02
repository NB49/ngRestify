## Including the dependency in your project:

Inject the dependency into your app using it's name (don't forget to inject it into your controller, service or factory though) ;)

    angular.module('myApplication', ['ngRestify'])

## Making a GET request

By default **ngRestify** will not point anywhere, meaning that you can pass it full URL paths like this:

    var GetMyData = function () {
        return Restify.Get('http://www.example.com/api/mydata');
    };

## Setting the API Root 

However, if you want to set a default API URL root, you can use the provider at config stage:

    angular.module('myApplication', ['ngRestify'])
    .config(function (RestifyApiUrlProvider) {
        RestifyApiUrlProvider.SetApiUrl('http://www.example.com/');
    })

## Injecting a bearer token

You can also expect that a bearer token will be passed by using the provider at config stage too, this will expect that the bearer token actually comes from local storage and a variable called 'token' - i do plan on extending this functionality in the future to make it more scalable, but for now, i don't need it at all :) This is useful when using the OWIN .NET WebApi provider for bearer tokens.

    angular.module('myApplication', ['ngRestify'])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('RestifyBearerInjector');
    }])
