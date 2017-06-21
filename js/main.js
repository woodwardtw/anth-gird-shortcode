window.onload = function() {



  if (checkPostsDiv()!= null){ 
    var url = 'https://anth101.com/wp-json/wp/v2/posts?_embed&page=1&per_page=18';
    if (getRestrictions()){
      url = url + getRestrictions();
    }

    $(document).ready(function() {
      var def = new jQuery.Deferred();
      $.ajax({
        url: url,
        jsonp: "cb",
        dataType: 'json',
        success: function(data) {
            console.log(data); //dumps the data to the console to check if the callback is made successfully.
            $.each(data, function(index, item) {
              $('#anth-posts').append('<div class="anth-item"><div class="info"><div class="author-img"><img src="' + avatarUrl(item) + '"></div><div class="date">'+ dateDisplay(item) +'</div><a href="'+item.guid.rendered+'"><div class="anth-post-title">'+item.title.rendered+'</div><div class="author">'+authorName(item)+'</div></a><a href="'+item.guid.rendered+'"><div class="img-holder"' + backgroundImg(item)+'"></div></a><div class="anth-posts-social">'+iLike(item)+ shareMe(item) +'</div><div class="content">'+item.excerpt.rendered.substring(0,105)+'...</div></div></div></div>');
              clickAirplane(); //social media sharing action
            }); //each          
          } //success
      }); //ajax  
    }); //ready

}
    $(function(){

    //map two elements to scroll http://stackoverflow.com/a/16615769/3390935
     var $d = $($.map([$(window), $('#anth-posts')], function(el){return $.makeArray(el)})); //lets you read mouse position off two elements more easily

     var counter = 0;

      $d.on('scroll',function() {
        var scroll = getCurrentScroll();
        var pageHeight = $(document).height()-300;
        //console.log(pageHeight);
        //console.log(scroll);

          if ( $(window).scrollTop() + $(window).height() > pageHeight && autoLoad()!='false') {
               ++counter
               console.log('counter-'+counter);
               loadMore(counter, (24+ (counter*3)));
               console.log('foo!')
            }         
      });


     //scroll postion for triggering auto-load 
    function getCurrentScroll() {
        return window.pageYOffset || document.documentElement.scrollTop;
        }
    });

    function getDocHeight() {
        var D = document;
        return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
    }

//load more on scroll position
    function loadMore (counter, offset){
      var url = 'https://anth101.com/wp-json/wp/v2/posts?_embed&per_page=3&offset='+offset;
     if (getRestrictions()){
       url = url + getRestrictions();
      }

      $(document).ready(function() {
        var def = new jQuery.Deferred();
        $.ajax({
          url: url,
          jsonp: "cb",
          dataType: 'json',
          success: function(data) {
              console.log(data); //dumps the data to the console to check if the callback is made successfully.
              $.each(data, function(index, item) {
              $('#anth-posts').append('<div class="anth-item"><div class="info"><div class="author-img"><img src="' + avatarUrl(item) + '"></div><div class="date">'+ dateDisplay(item) +'</div><a href="'+item.guid.rendered+'"><div class="anth-post-title">'+item.title.rendered+'</div><div class="author">'+authorName(item) +'</div></a><a href="'+item.guid.rendered+'"><div class="img-holder"' + backgroundImg(item)+'"></div></a><div class="anth-posts-social">'+iLike(item)+ shareMe(item) +'</div><div class="content">'+item.excerpt.rendered.substring(0,105)+'...</div></div></div></div>');
              clickAirplane();//social media sharing action
              }); //each          
            } //success
        }); //ajax  
      }); //ready

    }

}

//VARIOUS FUNCTIONS

function checkPostsDiv(){
//see if we've got an anth-posts div before running all this stuff
  try {
  var element = document.getElementById('anth-posts');
  console.log(element);
    return element;
  }
  catch(err) {
      console.log(err.message);
      return 'false';
  }
}



//loading indicator
 var $loading = $('#loading').hide();
      $(document)
        .ajaxStart(function () {
          $loading.show();
        })
        .ajaxStop(function () {
          $loading.hide();
        });


//build out the like button for the iLike plugin
function iLike(item){
      var count = item.meta._recommended;
      return '<a href="#" class="dot-irecommendthis" id="dot-irecommendthis-'+item.id+'" title="Recommend this"><span class="dot-irecommendthis-count">'+count+'</span> <span class="dot-irecommendthis-suffix"></span></a>'
    }


//get avatar from json but reliant on function update to write to that field for older 
function avatarUrl (item){
  if (item.meta.bp_avatar.length > 0 && item.meta.bp_avatar.substring(0,4)=="http"){
    var avatarUrl = item.meta.bp_avatar;
    console.log(avatarUrl);
    return avatarUrl;
  }
   else {
    var avatarUrl = item.meta.bp_avatar;
    return 'https:'+avatarUrl;
  }
}  

//sets the background image based on the featured image or returns a default image
    function backgroundImg (item) {
      try {
        if ( item._embedded['wp:featuredmedia'][0]){
         var imgUrl = item._embedded['wp:featuredmedia'][0].media_details.sizes.thumbnail.source_url;
         return 'style="background-image:url('+imgUrl+'); background-size:cover;"';
        } else {
         var imgUrl = item._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url;
         return 'style="background-image:url('+imgUrl+');"';
        }
      }
    catch(err) {
        return 'style="background-image:url(https://anth101.com/wp-content/uploads/2017/05/still_looking.jpg); background-size:cover;"';
      }
    }

//chops up the date item a bit
    function dateDisplay(item){
      return item.date.substring(5,10);
    }

function authorName (item){
  if (item._embedded.author[0].name){
    var name = item._embedded.author[0].name;
    return name;
  } else {
    return '';
  }
}

//get the category restriction in data-cats or data-authors if either or both exists
function getRestrictions(){
    var element = document.getElementById('anth-posts'); 
    if(element && element.dataset.cats){
      var cats = '&categories='+element.dataset.cats;
    } else {
      cats = "";
    }
    if(element && element.dataset.authors){
      var authors = '&author='+element.dataset.authors;
    }else {
      authors = "";
    }
    /*if(element.dataset.posts){
      var posts = '&per_page='+element.dataset.posts;
    } else {
      posts = "&per_page=18";
    }*/
    return  cats + authors;
}  

function autoLoad(){
    var element = document.getElementById('anth-posts'); 
    if(element && element.dataset.load){
        var load = element.dataset.load;
        return load;
    } else {
      load = 'true';
      return load;
    }

}

function shareMe(item){
    var postUrl = item.guid.rendered;
    var postTitle = encodeURIComponent(item.title.rendered);
    //var postThumb =  item._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
   
    var twitterURL = 'https://twitter.com/intent/tweet?text='+postTitle+'&amp;url='+postUrl;
    var facebookURL = 'https://www.facebook.com/sharer/sharer.php?u='+postUrl;
    var googleURL = 'https://plus.google.com/share?url='+postUrl;
    var linkedInURL = 'https://www.linkedin.com/shareArticle?mini=true&url='+postUrl+'&amp;title='.$shareTitle;
    //var pinterestURL = 'https://pinterest.com/pin/create/button/?url='+postUrl+'&amp;media='+postThumb+'&amp;description='+postTitle;

    var twitterIcon = '<a class="anth-link share-twitter" href="' + twitterURL + '" target="_blank"><i class="fa fa-twitter"></i></a>';
    var fbIcon = '<a class="anth-link share-facebook" href="' + facebookURL +'" target="_blank"><i class="fa fa-facebook-official"></i></a>';
    var googleIcon = '<a class="anth-link share-googleplus" href="' + googleURL + '" target="_blank"><i class="fa fa-google"></i></a>' ;
    //var linkedIcon = ;
    //var pinterestIcon = '<a class="anth-link share-pinterest" href="' + pinterestURL + '" target="_blank"><i class="fa fa-pinterest"></i></a>';

    var shareRow = '<div class="airplane"><i class="fa fa-paper-plane"></i><span class="share-icons" style="display:none">' + twitterIcon + fbIcon + googleIcon +'</span></div>';
    return shareRow;
}

function clickAirplane(){
  $( ".airplane" ).click(function() {
    $(this).children().show("slow","swing");
  });
}

