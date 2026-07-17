/* ================================================================
   RECIPE_VIDEOS — data for the recipe grid in index.html
   This file must load BEFORE script.js (see the <script> order at the
   bottom of index.html). script.js reads this array; if it's empty,
   the grid falls back to "Coming soon" placeholder cards by design.

   Add one object per recipe video, shaped like this:

   {
     title:     'Butter Garlic Naan',      // shown as the card title
     function:  'bake',                    // one of: bake, steam, grill, microwave, induction, fry
     thumbnail: 'assets/recipes/naan.jpg', // path or URL to a poster image
     videoUrl:  'https://youtu.be/XXXXXXXXXXX', // YouTube, Vimeo, or a direct .mp4/.webm/.mov link
     chef:      'Chef Rahul',              // optional
     duration:  '4:32'                     // optional
   }
   ================================================================ */

const RECIPE_VIDEOS = [
  {
    title: 'Cake',
    function: 'bake',
    thumbnail: 'assets/recipes/cake.png',
    videoUrl: 'https://player.vimeo.com/video/1210082457',
    // chef: 'Chef Rahul',
    duration: '2:27'
  },
  {
    title: 'Moong Dal Halwa',
    function: 'induction',
    thumbnail: 'assets/recipes/halwa.png',
    videoUrl: 'https://player.vimeo.com/video/1210082459',
    // chef: 'Chef Rahul',
    duration: '1:47'
  },
  {
    title: 'Chicken Biryani',
    function: 'microwave',
    thumbnail: 'assets/recipes/biryani.png',
    videoUrl: 'https://player.vimeo.com/video/1210082458',
    // chef: 'Chef Rahul',
    duration: '2:52'
  },
  {
    title: 'Momos',
    function: 'steam',
    thumbnail: 'assets/recipes/momos.png',
    videoUrl: 'https://player.vimeo.com/video/1210082461',
    // chef: 'Chef Rahul',
    duration: '2:07'
  },
];
