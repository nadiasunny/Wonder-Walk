'use strict';

let forms = document.querySelectorAll('.infoForm');

console.log(forms)
// looping over form class infoForm, to attach event listener
//to each individual form and access that forms values through
//class logic
for (let i = 0; i < forms.length; i++){

    console.log(i)
    forms[i].addEventListener('submit', function(evt){
        
        evt.preventDefault();
        // evt.target.querySelector(skjdngjkdf)
        let comments = forms[i].querySelector('.inputComments').value;
        let rating = forms[i].querySelector('.inputRating').value;
        let walkIndex = forms[i].querySelector('.index').value;
        console.log(walkIndex)
        let walkInfo = {comments, rating, walkIndex};
        fetch('/updateUserWalk', {
            method:'POST',
            body: JSON.stringify(walkInfo),
            headers: {
            'Content-Type': 'application/json',
            },
          })
          .then((response) => response.json())
          .then((responseJson) => {
       
            console.log(responseJson.success);
          });
    });
}

