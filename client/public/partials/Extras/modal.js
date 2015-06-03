// var app = angular.module('app', ['angularModalService']);

// app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
//     $routeProvider
//     // .when('/', {templateUrl: 'partials/profile.html', controller:'profileController'})
//     .otherwise("/");

// app.controller('Controller', function($scope, ModalService) {
    
//     $scope.show = function() {
//         ModalService.showModal({
//             templateUrl: 'modal.html',
//             controller: "ModalController"
//         }).then(function(modal) {
//             modal.element.modal();
//             modal.close.then(function(result) {
//                 $scope.message = "You said " + result;
//             });
//         });
//     };
    
// });

// app.controller('ModalController', function($scope, close) {
  
//  $scope.close = function(result) {
//   close(result, 500); // close, but give 500ms for bootstrap to animate
//  };

// });




// angular.module('bambinioApp', ['ui.bootstrap']);
// angular.module('bambinioApp').controller('ModalDemoCtrl', function ($scope, $modal, $log) {

//   $scope.items = ['item1', 'item2', 'item3'];

//   $scope.animationsEnabled = true;

//   $scope.open = function (size) {

//     var modalInstance = $modal.open({
//       animation: $scope.animationsEnabled,
//       templateUrl: 'myModalContent.html',
//       controller: 'ModalInstanceCtrl',
//       size: size,
//       resolve: {
//         items: function () {
//           return $scope.items;
//         }
//       }
//     });

//     modalInstance.result.then(function (selectedItem) {
//       $scope.selected = selectedItem;
//     }, function () {
//       $log.info('Modal dismissed at: ' + new Date());
//     });
//   };

//   $scope.toggleAnimation = function () {
//     $scope.animationsEnabled = !$scope.animationsEnabled;
//   };

// });

// // Please note that $modalInstance represents a modal window (instance) dependency.
// // It is not the same as the $modal service used above.

// angular.module('bambinioApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

//   $scope.items = items;
//   $scope.selected = {
//     item: $scope.items[0]
//   };

//   $scope.ok = function () {
//     $modalInstance.close($scope.selected.item);
//   };

//   $scope.cancel = function () {
//     $modalInstance.dismiss('cancel');
//   };
// });