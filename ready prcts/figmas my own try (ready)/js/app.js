var slidel = document.querySelector('.s-switch');
var slidel2 = document.querySelector('.s-2');
var slidel1 = document.querySelector('.s-1');
slidel.addEventListener('click', () => {
  slidel2.classList.toggle('active_slidel');
  slidel1.classList.toggle('active_slidel_color')
})

let button = $('.f-btn');

console.log(button);

for (let i = 0; i < button.length; ++i) {
  let item = button[i];
  item.addEventListener('click', () => {
    item.classList.toggle('active-btn');
  })
}

var fmmetro = document.querySelector('.fmetro');
var fmvariations = document.querySelector('.fmvariations');

fmmetro.addEventListener('click', () => {
  fmvariations.classList.toggle('active-fm');
})

var fdl = document.querySelector('.fdl');
var dlvar_1 = document.querySelector('.dlvar-1');

fdl.addEventListener('click', () => {
  dlvar_1.classList.toggle('active-fdl');
})

var ado = document.querySelector('.ado');
var adovar = document.querySelector('.adovar');

ado.addEventListener('click', () => {
  adovar.classList.toggle('active-ado');
})