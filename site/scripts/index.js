'use strict';

var reset = document.querySelector('#clearInput');
reset.addEventListener('click', clrLocStor);
function clrLocStor (){
  localStorage.clear();
}
