window.Posts = new Meteor.Collection('posts', { connection: null });

if(document.location.pathname === "/") {
  Session.set('currentPostName', 'patong');  
} else {
  Session.set('currentPostName', document.location.pathname.substring(1));
}


Meteor.startup(function() {
  $('#postModal').openModal();
})

HTTP.get('/posts.json', function(err, response) {
  var posts = JSON.parse(response.content);
  posts.forEach(function(post) {
    Posts.insert(post);
  });
})

Template.post.helpers({
  showPost: function() {
    var currentPostName = Session.get('currentPostName');

    if(!currentPostName) {
      return false;
    }

    var currentPost = Posts.findOne({
      name: currentPostName,
    });

    if(!currentPost) {
      return false;
    }

    return true;
  },
  content: function() {
    var currentPostName = Session.get('currentPostName');
    var currentPost = Posts.findOne({
      name: currentPostName,
    });

    if(currentPost && !currentPost.content) {
      HTTP.get(currentPost.contentUrl, function(err, response) {
        Posts.update({ name: currentPostName }, { $set: { content: response.content }});
      })
      return "";
    }

    return currentPost.content;
  }
});