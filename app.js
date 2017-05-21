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
  //REMEMBER TO SWITCH REF BACK TO 'TOPICS'
  // var topicsCollection = db.ref("topics");
    var dbRef = db.ref();
    var topicsCollection = db.ref('topics');



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

      // var context =

      var content = contentPrompt.toString().trim();
      //write new topic to firebase
      topicsCollection.push({
        content: content,
        jokeWritten: false
      });

      App.trigger('reloadTopics', App);

      //new topic is sent to database debugger:
      // debugger;

    };

    function showTopicEdit(e) {
      var el = e.target;
      var $el = $(el);
      console.log($el);
      var val = $el.text();
      console.log(val);

      $el.parent().parent().addClass('editing');

      $el.parent().parent().find('.card-action').show()
      // $cardActionSection.show();
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

      //Hide Card Action class
      $el.parent().parent().find('.card-action').hide();

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

      //Moving this to the beginning of the App method.
      dbRef.on('child_added', function(snapshot) {
        var snapshotVal = snapshot.val();
          // console.log(snapshotVal);
          var responseKeys = Object.keys(snapshotVal);
          // console.log(responseKeys);

          var topics = _.map(responseKeys, function(id) {
            var firebaseTopicObj = snapshotVal[id];
            return {
              id: id,
              content: firebaseTopicObj.content,
              jokeWritten: firebaseTopicObj.jokeWritten
            };
          });

          $.each(topics, function(i, topic) {
              // console.log('topic #'+i, topic);
              context.render('templates/topic.template', topic)
                  .appendTo('#topics');
          });
        });

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

    // Shows navbar as highlighted depending on route clicked:
    this.before('.*', function() {
      var hash = document.location.hash;
      $('nav').find('a').removeClass('current');
      $("nav").find("a[href='"+hash+"']").addClass("current");
    });

    // Do this when no route defined:
    this.get('', function(context) {
    // No route defined, set location to '#/' to trigger app automatically:
    document.location.hash = '/topics/';
    });

    // Catch-all for 404 errors:
    this.get(/.*/, function() {
    console.log('404... come on, really?');
    });

    //trigger reload when user adds topic
    this.bind('reloadTopics', function(e, data) {
      this.redirect('#/topics/');
    });

  });

  $(function() {
    App.run('#/topics/');
  });
})(jQuery);
