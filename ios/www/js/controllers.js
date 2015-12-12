var card_lists = [];

angular.module('starter.controllers', [])

.controller('SigninCtrl', function($scope, $ionicPlatform, $timeout, $interval, $state, SigninService, currentUserService, ionLoading) {
  // Form data for the login modal
  $scope.loginData = {
    username : "mike",
    password : "123456"
  };

  $scope.msg = "";

  $scope.doLogin = function(data) {
  	
  	$scope.msg = "";

	if(!data.username) {
		$scope.msg = "Please input your username!";
		return;
	}

	if(!data.password) {
		$scope.msg = "Please input your password!";
		return;
	}

    ionLoading.showLoading('Sign in');

	SigninService.login(data.username, data.password)
	.success(function(data) {
		ionLoading.hideLoading();
		if (data['success'] == 1) {
			var resp =  data['resp'];

			window.localStorage['user'] = resp;
			
			currentUserService.id = resp.id;
			currentUserService.username = resp.username;
			currentUserService.firstname = resp.firstname;
			currentUserService.lastname = resp.lastname;
			currentUserService.email = resp.email;
			currentUserService.password = resp.password;

			$state.go("home");
			
		} else {
			$scope.msg = data['err'];
		}
	})
	.error(function(error) {
		ionLoading.hideLoading();
		$scope.msg = "Network Connection Error!";
	});
	
  };
})

.controller('SignupCtrl', function($scope, $timeout, $ionicHistory, $state, SignupService, ionLoading, REGX) {

  // Form data for the login modal
  $scope.signupData = {
  	firstname : "Mike",
  	lastname : "Floyd",
  	username : "mike",
    email : "mike.floyd@hotmail.com",
    password : "123456",
    confirmpassword : "123456"
  };

  $scope.goBack = function() {
    //alert($ionicHistory.backTitle());
    $ionicHistory.goBack();
  };

  $scope.doSignup = function(data) {
  	$scope.msg = "";

	if(!data.firstname) {
		$scope.msg = "Please input your first name!";
		return;
	}

	if(!data.lastname) {
		$scope.msg = "Please input your last name!";
		return;
	}

	if(!data.email) {
		$scope.msg = "Please input your email!";
		return;
	}

	if(!REGX.validEmail(data.email)) {
		$scope.msg = "Please input your valid email!";
		return;
	}

	if(!data.username) {
		$scope.msg = "Please input your username!";
		return;
	}

	if(!data.password) {
		$scope.msg = "Please input your password!";
		return;
	}

	if(!data.confirmpassword) {
		$scope.msg = "Please input your confirm password!";
		return;
	}

	if(data.password != data.confirmpassword) {
		$scope.msg = "Password does not matched!";
		return;
	}

    ionLoading.showLoading('Sign Up');

	SignupService.signup(data)
	.success(function(data) {
		ionLoading.hideLoading();
		if (data['success'] == 1) {
			$state.go("signin");
		} else {
			$scope.msg = data['err'];
		}
	})
	.error(function(error) {
		ionLoading.hideLoading();
		$scope.msg = "Network Connection Error!";
	});
  };
})

.controller('HomeCtrl', function($scope, $timeout, $ionicHistory, $state) {

})

.controller('myCardCtrl', function($scope, $timeout, $ionicHistory, $ionicPlatform, ionLoading, $state, MyCardListService, currentUserService, CARD_IMG_URL) {

	$scope.cards = [];
	$scope.CARD_IMG_URL = CARD_IMG_URL;
	$scope.msg = "";
	
	$scope.goBack = function() {
		$ionicHistory.goBack();
	};

	$scope.$on('$ionicView.enter', function() {
		$scope.refresh_list();
  	});

	$scope.refresh_list = function() {
		try{
			card_lists = [];

			ionLoading.showLoading('Get My Cards');

			var id = currentUserService.id;
			$scope.msg = "";
			MyCardListService.getMyCards(id)
			.success(function(data) {
				ionLoading.hideLoading();

				if (data['success'] == 1) {
					$scope.cards = data['resp'];
					card_lists = data['resp'];
				} else {
					$scope.msg = data['err'];
				}
			})
			.error(function(error) {
				ionLoading.hideLoading();
				$scope.msg = "Network Connection Error!";
			});
		}
		catch(err){
			console.log(err.message);
		}
	};

})

.controller('cardDetailCtrl', function($scope, $stateParams, $timeout, $ionicHistory, $ionicPlatform, $ionicLoading, $state, currentUserService, CARD_IMG_URL) {
	
	$scope.card = card_lists[$stateParams.cardId];
	$scope.CARD_IMG_URL = CARD_IMG_URL;
	
	var timestamp = $scope.card['expire_date'];

	var d = new Date(timestamp * 1000);
	var dateString = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
	$scope.card['expire_date'] = dateString;

	$scope.goBack = function() {
		$ionicHistory.goBack();
	};

})

.controller('redeemCtrl', function($scope, $timeout, ionLoading, $ionicHistory, $state, $cordovaBarcodeScanner, SerialRedeemService) {
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };

  $scope.scanQrcode = function() {
  	document.addEventListener("deviceready", function () {
		$cordovaBarcodeScanner
		.scan()
		.then(function(barcodeData) {
              var sn = barcodeData['text'];
              console.log(JSON.stringify(barcodeData));
              if(sn) {
              	
              	ionLoading.showLoading('Redeem New Card');

	              SerialRedeemService.redeem(sn)
	              .success(function(data) {
	              			ionLoading.hideLoading();
	                       if (data['success'] == 1) {
		                       alert("Successfully New Card Redeemed!")
		                       $state.go("home");
	                       } else {
	                       		alert(data['err']);
	                       		$state.go("redeemCard");
	                       }
	              })
	              .error(function(error) {
	              		ionLoading.hideLoading();
	                     alert("Network Connection Error!");
	                     $state.go("redeemCard");
	              });
              }
		}, function(error) {
			alert(error);
			$state.go("redeemCard");
		});
    });
  };
})

.controller('serialRedeemCtrl', function($scope, $timeout, ionLoading, $ionicHistory, $state, currentUserService, SerialRedeemService) {
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };

  $scope.msg = "";
  $scope.serial_number = "";

  $scope.serial_redeem = function(sn) {
  	$scope.msg = "";
  	console.log(currentUserService.id);
  	if(sn == "") {
  		$scope.msg = "Please enter serial key for new card redeem!";
  		return;
  	} else {

	    ionLoading.showLoading('Redeem New Card');

		SerialRedeemService.redeem(sn)
		.success(function(data) {
			ionLoading.hideLoading();
			if (data['success'] == 1) {
				alert("Successfully New Card Redeemed!")
				$state.go("home");
			} else {
				$scope.msg = data['err'];
			}
		})
		.error(function(error) {
			$ionicLoading.hideLoading();
			$scope.msg = "Network Connection Error!";
		});
  	}
  }
});

