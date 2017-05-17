//app.js

(function($) {

  //Initialize Firebase
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA6zyIOrnI5FVVXOCip53xVprtb57In7YU",
    authDomain: "writecomedy-bbb2e.firebaseapp.com",
    databaseURL: "https://writecomedy-bbb2e.firebaseio.com",
    projectId: "writecomedy-bbb2e",
    storageBucket: "writecomedy-bbb2e.appspot.com",
    messagingSenderId: "916288483609"
  };
  firebase.initializeApp(config);

  //get reference to Firebase's database
  var db = firebase.database();
  //Set aside collection for topics and get a ref for it
  var topicsCollection = db.ref("topics");

  topicsCollection.on("value", function(snapshot) {
      // console.log(snapshot.val());
    }, function (errorObject) {
      // console.log("The read failed: " + errorObject.code);
    });

  var Utils = {
    uuid: function () {
      /*jshint bitwise:false */
      var i, random;
      var uuid = '';

      for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
      }

      return uuid;
    }
  };

  var App = $.sammy('#app', function() {
    this.use('Template');
    var currentTopics = [];
    function bindEvents() {
      $('#app').on('click', '#addTopicBtn', createNewTopic);
      $('#app').on('dblclick','#topic', handleDoubleClickTopic);
    };

    function createNewTopic(e) {
      e.preventDefault();
      console.log('New Topic appear!');
      //Create new div on #topics for new topic
    };

    function handleDoubleClickTopic(e) {
      e.stopPropagation();
      console.log('edit the topic now');
      //Get topic content
      var topicContent = $('#topicContent').text();
      console.log(topicContent);
      //Add input class to this.topic

      //Put content in input
    };



    // $('#app').on('click', '.saveBtn', function(event) {
    //   event.preventDefault();
    //   console.log('it worked yo');
    // });

    //On Click of addtopicbtn, add a new topic
    // $('#app').on('click', '#addTopicBtn', function(event) {
    //   event.preventDefault();
    //   console.log('button click successful');
    //   //Create new div on #topics for new topic
    //
    // });

    //After new div is created, then let user edit text


    this.around(function(callback) {
      var context = this;
      // console.log(context);
      this.load('/data/topics.json').then(function(topics) {
        context.topics = topics;
        // console.log(context.topics);
      }).then(callback);
    });

    //topics view
    this.get('#/', function(context) {
      context.app.swap('');

      context.render('templates/topics-view.template').appendTo("#app");

      $.each(context.topics, function(i, topic) {
        context.render('templates/topic.template', {id: i, topic: topic})
          .appendTo('#topics');
      });

      bindEvents();

    });

    this.before('.*', function() {
      var hash = document.location.hash;
      $('nav').find('a').removeClass('current');
      $("nav").find("a[href='"+hash+"']").addClass("current");
    });

  });

  $(function() {
    App.run('#/');
  });
})(jQuery);
