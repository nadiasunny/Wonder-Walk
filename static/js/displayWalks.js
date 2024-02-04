'use strict';

let forms = document.querySelectorAll('.infoForm');

// forms.forEach(form => {
//     form.addEventListener('submit', function(evt) {
//         evt.preventDefault();
//         let comments = form.querySelector('.inputComments').value;
//         let rating = form.querySelector('.inputRating').value;
//         let img = form.querySelector('.addFiles').value;
//         console.log(comments, rating, img);
//     });
// });

for (let form in forms){
    form.addEventListener('submit', sendInfoToServer(evt));
}
function sendInfoToServer(evt){
    evt.preventDefault();
    let comments = form.querySelector('.inputComments').value;
    let rating = form.querySelectorId('.inputRating').value;
    let img = form.querySelectorId('.addFiles').value;
    console.log(comments, rating, img);
}

//forms.forEach( form => {form.addEventListener('submit', sendInfoToServer)});
