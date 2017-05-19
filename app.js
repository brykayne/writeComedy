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
  //Put topics into an array here

  // //topic template Underscore
  // var topicTMPL = _.template("<div id=\"topic\" data-id=\"<%= id %>\" class=\"card darken-1\">   \
  //   <div class=\"card-content\">           \
  //     <p id=\"topicContent\"><%= content %></p>     \
  //   </div>  \
  //   <textarea class=\"card-content\" value=\"<%= content %\"></textarea>  \
  //   <div class=\"card-action\">   \
  //     <a class=\"saveBtn\" href=\"#\">Save</a>   \
  //     <a class=\"removeBtn\" href=\"#\">Remove</a>  \
  //     <a class=\"writeBtn\" href=\"#/joke/<%= id %>\">Write</a>  \
  //    </div>  \
  // </div>
  // ");

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
    $('#app').on('dblclick','#topic', showEdit);



    function createNewTopic(e) {
      e.preventDefault();
      console.log(e);
      //Create new div on #topics for new topic
      var contentPrompt = prompt("Enter your new topic yo.");
      var content = contentPrompt.toString();
      //write new topic to firebase
      topicsCollection.push({
        content: content,
        jokeWritten: false
      });
    };

    function showEdit(e) {
      var el = e.target;
      var $el = $(el);
      console.log($el);
      var val = $el.text();
      console.log(val);

      $el.parent().parent().addClass('editing');
      debugger;
      // $('#topic div.view').hide()
      // $('#topic .edit').show()
    }


    function editTopic(e) {
      e.stopPropagation();



      // var el = e.target;
      // var $el = $(el);
      // console.log($el);
      // var val = $el.text();
      // console.log(val);

      // if (!val) {
      //   //destroy it!!! Need to add this in :)
      //   return;
      // }
      //
      // //Get DATA ID of the card the user dblclicked on
      // dataId = $el.parent().parent().data('id')
      // console.log(dataId);
      //
      // if ($el.data('abort')) {
      //   $el.data('abort', false);
      // } else {
      //   var id = dataId;
      //   topicsCollection.child(id).update({
      //     content: val
      //   });
      //
      // }


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
          //Lists all topics in db
          console.log(topics);

          //Underscore Template instead of BS Sammy BS


          /////////////
          /////////////
          ////destroy from db if there’s no val!!
          ////////////
          $.each(topics, function(i, topic) {
              console.log('topic #'+i, topic);
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
