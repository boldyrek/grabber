(function($){
 $(function() {

   $('span.jQtooltip1').each(function() {
     var title = $(this).attr('title');
     if (title && title != '') {
       $(this).attr('title', '').append('<div>' + title + '</div>');
       var width = $(this).find('div').width();
       var height = $(this).find('div').height();
       $(this).hover(
         function() {
           $(this).find('div')
             .clearQueue()
             .animate({width: width + 20, height: height + 20}, 200).show(200)
             .animate({width: width, height: height}, 200);
         },
         function() {
           $(this).find('div')
             .animate({width: width + 20, height: height + 20}, 150)
             .animate({width: 'hide', height: 'hide'}, 150);
         }
       )
     }
   })

})
})(jQuery)