var bambinioApp = angular.module('bambinioApp', ['ngRoute','ui.bootstrap','ngFileUpload']);

bambinioApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {templateUrl: 'partials/profile.html', controller:'profileController'})
    .otherwise("/");

}]);

bambinioApp.filter('dateFilter', function(){
    return function(array, jumpDate){
        // console.log('array', array);
        // console.log('scope', jumpDate);
        var filteredArray = [];
        if(!jumpDate){
            return array;
        }
        else{
            // console.log(jumpDate.toISOString());
            for(var i = 0 ; i<array.length ; i++){
                console.log(array[i].postedAt);
                if(String((array[i].postedAt)).substring(0,10) == (jumpDate.toISOString()).substring(0,10)){
                    filteredArray.push(array[i]);
                }
            }
        }
        if(filteredArray.length===0){
            filteredArray = array;
        }
        return filteredArray;
    };
});

// using jQuery here to clear out forms
$('#postModal').on('hide.bs.modal', function() { 
    $('#postModal textarea, #postModal input').val('');
 });


// Use this to close that particular modal farom anywhere
// $('#postModal').trigger('hide.bs.modal');


bambinioApp.controller('profileController', function($scope, $http, $timeout, $route, Upload){
    $scope.users=[{userFirst: "Jennifer", userLast: "Bassett", childFirst: "Miles", childLast: "Bassett"}, {userFirst: "Heather", userLast: "Eistein", childFirst: "Max", childLast: "Einstein"}];
    $scope.postsLimit = 3;
    // $scope.searchTerm = '';
    $scope.posts=[];
    // AWS scope calls
    $scope.sizeLimit = 10585760; // 10MB in Bytes
    $scope.uploadProgress = 0;
    $scope.creds = {};

    var getPosts = function(){
        $http.get('/api/posts')
        .success(function(data){
            // console.log(data);
            $scope.posts=data;
            // console.log('POSTS', $scope.posts);
        })
        .error(function(data){
            console.log(data);
        });
    };

    getPosts();

    $scope.createStory = function(){
        console.log($scope.storyForm.postText);
        var postType = "glyphicon glyphicon-comment";
        if(!$scope.storyForm.postText){
            var postText = $scope.quickForm.postText;
        }
        else{
            var postText = $scope.storyForm.postText;
        }
        $http.post('/api/posts', {postText: postText, postType: postType})
        .success(function(data){
            console.log(data);
            // Not ideal as $route.reload() resets the routers, but wasn't working in modal with just gePosts().  getPosts() does work just done from the quick status form.
            // getPosts();
            $scope.storyForm.$setPristine();
            $route.reload();
        })
        .error(function(data){
            console.log(data);
        });
    };

    $scope.createMilestone = function(){
        console.log($scope.milestoneForm.postText);
        console.log($scope.milestoneForm.milestone);
        var postType = "glyphicon glyphicon-map-marker";
        $http.post('/api/posts', {postText: $scope.milestoneForm.postText, milestone: $scope.milestoneForm.milestone, postType: postType})
        .success(function(data){
            console.log(data);
            // Not ideal as $route.reload() resets the routers, but wasn't working in modal with just gePosts().  getPosts() does work just done from the quick status form.
            // getPosts();
            $route.reload();
        })
        .error(function(data){
            console.log(data);
        });
    };

    $scope.upVote = function(id){
        console.log(id);
        $http.put('/api/post/'+id)
        .success(function(data){
            console.log(data);
            // commented out getPosts() b/c used 2 way data-bnding to handle that in the ng-click.  Seemed cleaner than re-rendering posts on page each time
            // getPosts();
        })
        .error(function(data){
            console.log(data);
        });
    };

    $scope.leaveComment = function(id,comment){
        console.log(comment);
        $http({
            method: 'PUT',
            url: '/api/post/'+id,
            data: {comment: comment}
            
        })
        .success(function(data){
            console.log(data);
            getPosts();
        })
        .error(function(data){
            console.log(data);
        });
    };

    $scope.runCamera = function(){
        Webcam.set({
          width: 320,
          height: 240,
          image_format: 'jpeg',
          jpeg_quality: 90
        });
        Webcam.attach( '#my_camera' );
    };


        var data_uri='';
    $scope.take_snapshot = function() {
      // take snapshot and get image data
      Webcam.snap( function(data_uri) {
        console.log(data.uri);
        data_uri = data_uri;
        // display results in page
        document.getElementById('results').innerHTML = 
          '<h2>Here is your image:</h2>' + 
          '<img src="'+data_uri+'"/>';
      } );
    };

    $scope.webcamPost = function(){
        console.log($scope.postText);
        console.log($scope.webcamImage);
        $http.post('/api/posts', {postText: $scope.postText, webcamImage: $scope.webcamImage})
        .success(function(data){
            console.log(data);
            // Not ideal as $route.reload() resets the routers, but wasn't working in modal with just gePosts().  getPosts() does work just done from the quick status form.
            // getPosts();
            // $route.reload();
        })
        .error(function(data){
            console.log(data);
        });
    };

    // AWS Controller:
    $scope.upload = function() {
        console.log($scope.file);
        $('#uploadPost').button('loading');
        Upload.upload({
            url: "/api/uploads",
            fields: {postText: $scope.postText, postedAt: $scope.imageDate},
            file: $scope.file
        }).success(function(data){
            console.log(data);
            $('#uploadPost').button('reset');
            $('#postModal').modal('toggle');
            $route.reload();
        });

        // $http.post('/api/uploads', {file: $scope.imageDateForm.file})
        // .success(function(data){
        //     console.log(data);

        //     $route.reload();
        // })
        // .error(function(data){
        //     console.log(data);
        // });
    };

});

// AWS S3 Directive
bambinioApp.directive('file', function() {
  return {
    restrict: 'AE',
    scope: {
      file: '@'
    },
    link: function(scope, el, attrs){
      el.bind('change', function(event){
        var files = event.target.files;
        var file = files[0];
        scope.file = file;
        scope.$parent.file = file;
        scope.$apply();
      });
    }
  };
});



//  *** End AWS code


// Below is the AWS code, in case I break it when I try to send it to the back end.
// $scope.upload = function() {
//     AWS.config.update({ accessKeyId: 'enter accesss key', secretAccessKey: 'enter secret key' });
//     var bucket = new AWS.S3({ params: { Bucket: 'enter bucket' } });
//     if($scope.file) {
//         // Perform File Size Check First
//         var fileSize = Math.round(parseInt($scope.file.size));
//         if (fileSize > $scope.sizeLimit) {
//           toastr.error('Sorry, your attachment is too big. <br/> Maximum '  + $scope.fileSizeLabel() + ' file attachment allowed','File Too Large');
//           return false;
//         }
//         // Prepend Unique String To Prevent Overwrites
//         var uniqueFileName = $scope.uniqueString() + '-' + $scope.file.name;

//         var params = { Key: uniqueFileName, ContentType: $scope.file.type, Body: $scope.file, ServerSideEncryption: 'AES256' };

//         var createPost = function(){                
//             if(!$scope.imageDate){
//                 $scope.imageDate = Date.now();
//             }
//             var postType = "glyphicon glyphicon-picture";
//             console.log($scope.imageDate);
//             $http.post('/api/posts', {postText: $scope.postText, s3Link: uniqueFileName, postedAt: $scope.imageDate, postType: postType})
//             .success(function(data){
//                 console.log(data);

//                 $route.reload();
//             })
//             .error(function(data){
//                 console.log(data);
//             });
//             $scope.imageDateForm.$setPristine();
//         };

        

//         bucket.putObject(params, function(err, data) {
//           if(err) {
//             toastr.error(err.message,err.code);
//             return false;
//           }
//           else {
//             // Upload Successfully Finished
//             toastr.success('File Uploaded Successfully', 'Done');

            
//             createPost();

//             // Reset The Progress Bar
//             setTimeout(function() {
//               $scope.uploadProgress = 0;
//               $scope.$digest();
//             }, 5000);
//           }
//           $('#postModal').modal('toggle');
//         })
//         .on('httpUploadProgress',function(progress) {
//           $scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
//           $scope.$digest();
//         });

//       }
//       else {
//         // No File Selected
//         toastr.error('Please select a file to upload');
//       }
//     };

//     $scope.fileSizeLabel = function() {
//     // Convert Bytes To MB
//     return Math.round($scope.sizeLimit / 1024 / 1024) + 'MB';
//   };

// $scope.uniqueString = function() {
//   var text     = "";
//   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

//   for( var i=0; i < 8; i++ ) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// };