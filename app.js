//app.js

(function($) {

  var app = $.sammy('#app', function() {
    this.use('Template');
    this.use('Handlebars', 'hb');

    this.around(function(callback) {
      var context = this;
      this.load('data/topics.json').then(function(topics) {
        context.topics = topics;
        console.log(context.topics);
      }).then(callback);
    });
//Need to take what's in topic.template and put it into a larger topics view which displays in nice format with columns.
    this.get('#/', function(context) {
      context.app.swap('');

      context.render('templates/topic-view.template', context.topics)

      // $.each(context.topics, function(i, topic) {
      //   context.render('templates/topic.template', {id: i, topic: topic})
      //     .appendTo(context.$element());
      });

    this.get('#/topic/:id', function(context) {
      this.topic = this.topics[this.params['id']];
      if (!this.item) { return this.notFound(); }
      this.partial('templates/topics-view.template');
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
