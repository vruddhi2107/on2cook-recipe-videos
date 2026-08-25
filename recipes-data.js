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
  title: 'Deep Fry Like a Pro',
  function: 'Deep Fry',
  thumbnail: 'assets/recipes/deep-fy.jpg',
  videoUrl: 'https://player.vimeo.com/video/1212001865',
  // chef: '',
  duration: '3:07'
},
{
  title: 'Perfect Cake Every Time',
  function: 'bake',
  thumbnail: 'assets/recipes/cake.jpg',
  videoUrl: 'https://player.vimeo.com/video/1212002256',
  // chef: '',
  duration: '2:27'
},
{
  title: 'Perfect Chicken Biryani Every Time',
  function: 'microwave + induction',
  thumbnail: 'assets/recipes/biryani.jpg',
  videoUrl: 'https://player.vimeo.com/video/1212002332',
  // chef: '',
  duration: '2:52'
},
{
  title: 'Perfect Grilled Sandwich Every Time',
  function: 'grill',
  thumbnail: 'assets/recipes/sandwich.jpg',
  videoUrl: 'https://player.vimeo.com/video/1212003033',
  // chef: '',
  duration: '2:53'
},
{
  title: 'Perfect Momos Every Time',
  function: 'steam',
  thumbnail: 'assets/recipes/momos.jpg',
  videoUrl: 'https://player.vimeo.com/video/1212003052',
  // chef: '',
  duration: '2:07'
},
{
  title: 'Perfect Moong Dal Halwa Every Time',
  function: 'sauteing',
  thumbnail: 'assets/recipes/halwa.jpg',
  videoUrl: 'https://player.vimeo.com/video/1212003081',
  // chef: '',
  duration: '1:47'
},
{
  title: 'The Perfect Gravy Every Time',
  function: 'sauteing',
  thumbnail: 'assets/recipes/gravy.jpg',
  videoUrl: 'https://player.vimeo.com/video/1212003270',
  // chef: '',
  duration: '3:39'
},
];
