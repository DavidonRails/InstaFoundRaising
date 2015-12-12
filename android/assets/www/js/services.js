
function toparams(obj) {
  var p = [];
  for (var key in obj) {
      p.push(key + '=' + encodeURIComponent(obj[key]));
  }

  return p = p.join('&');
}

function cat_subs(menus) {
  cats = [];
  for (i in menus) {
      category = menus[i];
      cats.push({category_id: category['category_id'], products: category['products']});
      if (category['categories'] && category['categories'].length > 0) {
          cats = cats.concat(cat_subs(category['categories']));
      }
  }
  return cats;
}

app.service('currentUserService', function() {
  this.id = null;
  this.username = "";
  this.first_lname = "";
  this.last_name = "";
  this.email = "";
});

app.service('ionLoading', function($state, $http, $ionicPlatform, $ionicHistory, $ionicLoading, $interval) {
  var self  = this;

  self.showLoading = function(message) {
    message = message || "...";

    // Show the loading overlay and text
    $ionicLoading.show({

      // The text to display in the loading indicator
      template: '<div><ion-spinner icon="android"></ion-spinner><p>' + message + '</p></div>',

      // The animation to use
      animation: 'fade-in',

      // Will a dark overlay or backdrop cover the entire view
      showBackdrop: true,

      // The maximum width of the loading indicator
      // Text will be wrapped if longer than maxWidth
      maxWidth: 200,

      // The delay in showing the indicator
      showDelay: 0
    });
  };

  self.hideLoading = function() {
    $ionicLoading.hide();
  };
});

angular.module('starter.services', [])
.factory('REGX', function() {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return {
    validEmail : function(email) {
      return re.test(email);
    }
  }
})

.service('SigninService', function($http, currentUserService, API_URL, HEADERS, $ionicLoading) {

  this.login = function(username, password) {
    var data = toparams({
      username : username,
      password : password
    });

    return $http({
      method: 'POST',
      url: API_URL + 'login',
      headers : HEADERS,
      data: data
    });
  };

})

.service('SignupService', function($http, currentUserService, API_URL, HEADERS, $ionicLoading) {

  this.signup = function(data) {
   
    var params = toparams({
      firstname : data.firstname,
      lastname : data.lastname,
      email : data.email,
      username : data.username,
      password : data.password
    });

    return $http({
      method: 'POST',
      url: API_URL + 'signup',
      headers : HEADERS,
      data: params
    });

  };

})

.service('SerialRedeemService', function($http, currentUserService, API_URL, HEADERS, $ionicLoading) {

  this.redeem = function(sn) {
   
    var params = toparams({
      id : currentUserService.id,
      serial : sn
    });

    return $http({
      method: 'POST',
      url: API_URL + 'redeem',
      headers : HEADERS,
      data: params
    });

  };
})

.service('MyCardListService', function($http, currentUserService, API_URL, HEADERS, $ionicLoading) {
 
  this.getMyCards = function(id) {
   
    var params = toparams({
      id : id
    });

    return $http({
      method: 'POST',
      url: API_URL + 'getMyCards',
      headers : HEADERS,
      data: params
    });

  };
})

;















