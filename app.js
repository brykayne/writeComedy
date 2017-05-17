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

  // topicsCollection.on("value", function(snapshot) {
  //     var topics = snapshot.val();
  //     console.log(topics);
  //   }, function (errorObject) {
  //     console.log("The read failed: " + errorObject.code);
  //   });

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
      $('#app').on('dblclick','#topic', editTopic);
    };

    function createNewTopic(e) {
      e.preventDefault();
      console.log(e);
      console.log('check firebase, new topic added.');
      //Create new div on #topics for new topic
      var content = '';
      var id = _.uniqueId();

      //write new topic to firebase
      topicsCollection.push({
        id: id,
        content: content,
        jokeWritten: false
      });
      // $('#topicInput').show();

      // function (context) {
      //   context.render('templates/topic.template').appendTo("#app");
      // });

    };

    function editTopic(e) {
      e.stopPropagation();
      console.log('edit the topic now');
      //Get topic content
      var topicContent = $('#topicContent').text();
      console.log(topicContent);
      // $('#topicInput').show();
      //Add input class to this.topic

      //Put content in input
    };


    this.around(function(callback) {
      var context = this;
      // console.log(context);
      //console.log('Context var in data load function',context);

      //Put Firebase Database content loading here.

      topicsCollection.on("value", function(snapshot) {
          var topics = snapshot.val();
          console.log('topics',topics);
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });


      this.load('/data/topics.json').then(function(topics) {

        context.topics = topics;
        console.log('context.topics', context.topics);
      }).then(callback);
    });

    //topics view
    this.get('#/', function(context) {
      // console.log('Context var in topics view before swap', context);
      // console.log('event is = ', event);
      // console.log('this is = ', this);
      // console.log('this.topics is =', this.topics);
      context.app.swap('');
      // console.log('Context var in topics view after swap', context);
      context.render('templates/topics-view.template').appendTo("#app");



      $.each(context.topics, function(i, topic) {
        context.render('templates/topic.template', {id: i, topic: topic})
          .appendTo('#topics');
      });
      // console.log('after',context);
      bindEvents();

    });

    // this.before('.*', function() {
    //   var hash = document.location.hash;
    //   $('nav').find('a').removeClass('current');
    //   $("nav").find("a[href='"+hash+"']").addClass("current");
    // });

  });

  $(function() {
    App.run('#/');
  });
})(jQuery);
