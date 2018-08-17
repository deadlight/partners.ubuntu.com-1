if (typeof core === 'undefined') {
  var core = {};
}

//Provides basic templating for strings
String.prototype.format = function () {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};

var yuiOptions = {
  comboBase: 'https://yui-s.yahooapis.com/combo?',
  combine: true
};

YUI(yuiOptions).use('node', "event-resize", "transition", "event", function (Y) {
  core.setupAccordion = function() {
    Y.all('.row-project li').each(function(node) {
      node.one('h3').append('<span></span>');
      node.one('a').on('click',function(e) {
        e.preventDefault();
        this.toggleClass('active');
        this.next('div').toggleClass('active');
      });
    });
  };

  core.rssLoader = {
    "outputFeed" : function(el) {
      var element = document.getElementById(el);
      return function(result){
        if (!result.error){
          var output = '';
          var thefeeds = result.feed.entries;
          var spinner = document.getElementById('spinner');
          if(spinner !== null){
            spinner.style.display = 'none';
          }
          if(element.className.indexOf('with-total') != -1){
            output += '<li>We currently have '+thefeeds.length+' vacancies';
          }
          for (var i = 0; i < thefeeds.length; i++){
            output += '<li><a href="{0}">{1} &rsaquo;</a></li>'.format(thefeeds[i].link, thefeeds[i].title);
          }
          element.innerHTML = element.innerHTML + output;
          return output;
        }
      }
    },

    "getFeed" : function(url, numItems, el){
      var feedpointer = new google.feeds.Feed(url); //Google Feed API method
      if(numItems !== null){
        feedpointer.setNumEntries(numItems); //Google Feed API method
      }else{
        feedpointer.setNumEntries(250); //Google Feed API method
      }
      feedpointer.load(this.outputFeed(el)); //Google Feed API method
    }
  };

  loadRSSFeed = function(id, tag, limit, url, title) {
    var feedURL = "https://insights.ubuntu.com/feed/";
    if (tag) {
      feedURL += "?tag=" + tag;
    }

    if (limit) {
      var feedLimit = limit | 5;
    }
    $.getFeed({
      url: feedURL,
      success: function(feed) {
        var html = "<ul class='list'>";
        for(var i = 0; i < feed.items.length && i < feedLimit; i++) {
          var item = feed.items[i];
          html += "<li><a href='" + item.link + "'>" + item.title + "&nbsp;&rsaquo;</a></li>";
        }
        html += "</ul>";
        if ($('#' + id)) {
          $('#' + id).append(html);
        }
      }, failure: function () {

      }
    });
  }

  core.setupAccordion();
});
