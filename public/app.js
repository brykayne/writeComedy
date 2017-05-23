//app.js

(function($) {

  var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;


  var App = $.sammy('#app', function(context) {
    this.use('Template');

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
    //Firebase Authentication
    var firebaseAuth = firebase.auth();
    //Setting provider to Google for Authentication
    var provider = new firebase.auth.GoogleAuthProvider();
    var topicsCollection;

    //Set an observer on Auth object because this is asynchronus
    firebaseAuth.onAuthStateChanged(function(user) {
      if (user) {
        console.log(user);
        //user is signed in
        //Use user's uid to create topicsCollection
        topicsCollection = db.ref("users/" + user.uid + "/topics");
        debugger;
        App.run('#/topics/');
        App.trigger('reloadTopics', App);

      } else {
        //Google Sign-In
        firebaseAuth.signInWithPopup(provider).then(function(result) {
          // App.trigger('reloadTopics', App);
        }).catch(function(error) {
          console.log(error);
        });
      }
    });


    //Topics Events
    $('#app').on('click', '#addTopicBtn', createTopic);
    $('#app').on('dblclick','#topic .topicContent', showTopicEdit);
    $('#app').on('click', '.saveBtn', updateTopic);
    $('#app').on('click', '.removeBtn', destroyTopic);
    $('#app').on('click', '#logoutBtn', logoutUser);
    //Jokes Events
    // $('#app').on('click', '.writeJokeBtn', createJoke);

    function logoutUser(e) {
      $('#topics').text(' ');
      topicsCollection = null;
      firebase.auth().signOut();

      debugger;

    };

    function createTopic(e) {
      e.preventDefault();

      var contentPrompt = prompt("Enter your new topic yo.");

      //Pseudo-code to Create new div on #topics for new topic
      //1. Create a new card in #topics
      //2. Set the value of topicContent in the card to ' '
      //3. Set a class to 'editing' of the topic
      //4. Grab the value of the text that the user enters and put it as topicContent
      //5. Store that topicContent value in the database.


      var content = contentPrompt;
      //write new topic to firebase
      topicsCollection.push({
        content: content,
        jokeWritten: false
      });

      //Reload topics route so that new child is rendered in DOM
      App.trigger('reloadTopics', App);

    };

    function showTopicEdit(e) {
      var el = e.target;
      var $el = $(el);
      var val = $el.text();

      $el.parent().parent().addClass('editing');

      $el.parent().parent().find('.card-action').show()
    };

    function updateTopic(e) {
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

    function destroyTopic(e) {
      var el = e.target;
      var $el = $(el);
      var dataId = $el.parents().eq(1).data('id');

      topicsCollection.child(dataId).remove();

    };

    // function createJoke(e) {
    //   e.preventDefault();
    //   console.log('writeJokeButton event worked!');
    //   console.log(this);
    //
    //   //1. Store topic ID and topicContent
    //   var topicID, topicContent;
    //   //1a. Store topicID
    //   topicID = $(this).parents().eq(1).data('id');
    //   console.log(topicID);
    //   //1b. Store topicContent
    //   topicContent = $(this).parent().parent().find('p').text();
    //   console.log(topicContent);
    //
    //   //2. Onclick of 'write joke button', move to jokes route
    //   // App.setLocation('#/jokes/');
    //   //2a. Display jokesForm
    //   //already displayed through css
    //
    //  //change topic to topicContent
    //
    //  //
    //  //Attempted to store a topic and display on joke form -
    //  //Going to stop being a hero and just allow user to create
    //  //a joke when clicking the action button in bottom right
    //  //corner of screen.
    //
    //
    //
    //
    //
    //
    //
    //   //Hide Jokes View, Display Jokes Form
    //   // $('jokesView').hide()
    //   // $('jokesEdit').show();
    //
    //
    // }

    //topics view
    this.get('#/topics/', function(context) {

      context.app.swap('');

      context.render('templates/topics-view.template').appendTo("#app");

      renderTopics(context);

    });

    //Jokes Route
    this.get('#/jokes/', function(context) {

      context.app.swap('');
      context.log('Jokes VIEW!');

      context.render('templates/jokes-view.template').appendTo("#app");

    });

    //Sets route
    this.get('#/sets/', function(context) {

      context.app.swap('');
      console.log('new route sets added');
    });

    //Shows navbar as highlighted depending on route clicked:
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

    function renderTopics(context) {
        // topicsCollection.on('child_added', function(snapshot) {
        //   var snapshotVal = snapshot.val();
        //   var responseKeys = Object.keys(snapshotVal);
        //   debugger;
        //   var topics = _.map(responseKeys, function(id) {
        //       var firebaseTopicObj = snapshotVal[id];
        //       return {
        //         id: id,
        //         content: firebaseTopicObj.content,
        //         jokeWritten: firebaseTopicObj.jokeWritten
        //       };
        //   });
        //
        //
        //
        //   $.each(topics, function(i, topic) {
        //       console.log('topic #'+i, topic);
        //       debugger;
        //       context.render('templates/topic.template', topic)
        //           .appendTo('#topics');
        //   });
        // });

        topicsCollection.on('value', function(response) {
          var responseVal = response.val();
          var responseIdentifiers = _.keys(responseVal);
          var topics = _.map(responseIdentifiers, function(id) {
            var topicObj = responseVal[id];
            return {
              id: id,
              content: topicObj.content,
              jokeWritten: topicObj.jokeWritten
            };
          });

            $.each(topics, function(i, topic) {
                // console.log('topic #'+i, topic);
                context.render('templates/topic.template', topic)
                    .appendTo('#topics');
            });

        })
      };

  });
})(jQuery);
