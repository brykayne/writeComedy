//app.js

(function($) {

  var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

  //Initialize Firebase
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

    $('#app').on('click', '#addTopicBtn', create);
    // $('#app').on('dblclick','topicContent', showCardAction);
    $('#app').on('dblclick','#topic .topicContent', showTopicEdit);
    $('#app').on('click', '.saveBtn', update);
    $('#app').on('click', '.removeBtn', destroy);


    function create(e) {
      e.preventDefault();
      console.log(e);

      var contentPrompt = prompt("Enter your new topic yo.");

      //Pseudo-code to Create new div on #topics for new topic
      //1. Create a new card in #topics
      //2. Set the value of topicContent in the card to ' '
      //3. Set a class to 'editing' of the topic
      //4. Grab the value of the text that the user enters and put it as topicContent
      //5. Store that topicContent value in the database.

      // console.log('TopicTemplate', topicTemplate);

      var content = contentPrompt.toString();
      //write new topic to firebase
      topicsCollection.push({
        content: content,
        jokeWritten: false
      });
    };

    // function showCardAction(e) {}

    function showTopicEdit(e) {
      var el = e.target;
      var $el = $(el);
      console.log($el);
      var val = $el.text();
      console.log(val);

      $el.parent().parent().addClass('editing');

      // $('#topic div.view').hide()
      // $('#topic .edit').show()
    };



    function update(e) {
      e.stopPropagation();

      var el = e.target;
      var $el = $(el);

      //current value of topicContent:
      var newTopicContent = $el.parent().parent().find('textarea').val().trim();

      //topicContent paragraph tag from topic template
      var topicContentP = $el.parent().parent().find('.topicContent');

      //Set topicContentP equal to current value of newTopicContent
      topicContentP.text(newTopicContent);

      //Remove Editing Class
      $el.parent().parent().removeClass('editing');

      //dataId of topic to update Firebase
      var dataId = $el.parents().eq(1).data('id');

      if (!newTopicContent) {
        this.destroy;
        return;
      }

      if ($el.data('abort')) {
        $el.data('abort', false);
      } else {
        var id = dataId;
        topicsCollection.child(id).update({
          content: newTopicContent
        });
      }
    };

    function destroy(e) {
      var el = e.target;
      var $el = $(el);
      var dataId = $el.parents().eq(1).data('id');

      topicsCollection.child(dataId).remove();

    };

    //topics view
    this.get('#/topics/', function(context) {

      context.app.swap('');

      context.render('templates/topics-view.template').appendTo("#app");

      //old code from class --> value
      topicsCollection.on('value', renderTopics);

      // topicsCollection.on('child_added', renderTopics.);

      function renderTopics(response) {
          var responseVal = response.val();
          // console.log(responseVal);
          var responseKeys = Object.keys(responseVal);
          // console.log(responseKeys);
          var topics = _.map(responseKeys, function(id) {
            var firebaseTopicObj = responseVal[id];
            return {
              id: id,
              content: firebaseTopicObj.content,
              jokeWritten: firebaseTopicObj.jokeWritten
            };
          });
          //Lists all topics in db
          // console.log(topics);

          //Underscore Template instead of BS Sammy BS


          $.each(topics, function(i, topic) {
              // console.log('topic #'+i, topic);
              context.render('templates/topic.template', topic)
                  .appendTo('#topics');
          });

        };

    });

    //Jokes Route
    this.get('#/jokes/', function(context) {

      context.app.swap('');
      console.log('new route jokes added');
    });

    //Sets route

    this.get('#/sets/', function(context) {

      context.app.swap('');
      console.log('new route sets added');
    });

    // SAMMY TUTORIAL CODE:
    this.before('.*', function() {
      var hash = document.location.hash;
      $('nav').find('a').removeClass('current');
      $("nav").find("a[href='"+hash+"']").addClass("current");
    });

  });

  $(function() {
    App.run('#/topics/');
  });
})(jQuery);
