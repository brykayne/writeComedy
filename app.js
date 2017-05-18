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
    // var currentTopics = [];

    $('#app').on('click', '#addTopicBtn', createNewTopic);
    // $('#app').on('dblclick','#topic', editTopic);



    function createNewTopic(e) {
      e.preventDefault();
      console.log(e);
      //Create new div on #topics for new topic
      var content = prompt("Enter your new topic yo.");
      //write new topic to firebase
      topicsCollection.push({
        content: content,
        jokeWritten: false
      });
    };



    function editTopic(e) {
      e.stopPropagation();

      var el = e.target;
      console.log(el);
      var clos = el.closest('div');

      console.log(clos.text());
      // var $el = $(el);
      // console.log($el);
      // var val = $el.val().trim();
      // console.log(val);

      // if (!val) {
      //   //destroy it!!! Need to add this in :)
      //   return;
      // }

      if ($el.data('abort')) {
        $el.data('abort', false);
      } else {
        var id = $('#topic').data('id');
        console.log(id);
      }

      //Put content in input
    };

    //topics view
    this.get('#/', function(context) {

      context.app.swap('');

      context.render('templates/topics-view.template').appendTo("#app");

      topicsCollection.on('value', renderTopics.bind());

      function renderTopics(response) {
          var responseVal = response.val();
          var responseKeys = Object.keys(responseVal);
          var topics = _.map(responseKeys, function(id) {
            var firebaseTopicObj = responseVal[id];
            return {
              id: id,
              content: firebaseTopicObj.content,
              jokeWritten: firebaseTopicObj.jokeWritten
            };
          });

          console.log(topics);

          $.each(topics, function(i, topic) {
            context.render('templates/topic.template', topic)
              .appendTo('#topics');
          });

        };

    });

    // SAMMY TUTORIAL CODE:
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
