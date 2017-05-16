//app.js

(function($) {

  var app = $.sammy('#app', function() {
    this.use('Template');
    
    $('#app').on('click', '.saveBtn', function(event) {
      event.preventDefault();
      console.log('it worked yo');
    });

    this.around(function(callback) {
      var context = this;
      this.load('data/topics.json').then(function(topics) {
        context.topics = topics;
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
    });

    this.before('.*', function() {
      var hash = document.location.hash;
      $('nav').find('a').removeClass('current');
      $("nav").find("a[href='"+hash+"']").addClass("current");
    });

  });

  $(function() {
    app.run('#/');
  });
})(jQuery);
