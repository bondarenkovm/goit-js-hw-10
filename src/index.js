import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const ul = document.querySelector('.country-list');
const div = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInputSearchCountry, DEBOUNCE_DELAY));

function onInputSearchCountry(evt) {
  clearCountry();

  const name = evt.target.value.trim();
  if (!name) {
    return;
  }
  fetchCountries(name)
    .then(renderMarkup)
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}
function renderMarkup(data) {
  if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
  if ((data.length <= 10) & (data.length > 1)) {
    const markup = data
      .map(dat => {
        return `
        <li style='list-style: none; margin-bottom:10px'>
          <img src='${dat.flags.svg}' alt='flags' width='50'/>
          <b style='margin-left:10px; font-size:15px'>${dat.name.official}</b>
        </li>`;
      })
      .join('');
    ul.innerHTML = markup;
  }
  if (data.length === 1) {
    const markup = data
      .map(dat => {
        // const values = Object.values(dat.languages);
        return `
        <img src='${dat.flags.svg}' alt='flags' width='100'/>
        <b style='margin-left:10px; font-size: 30px'>${dat.name.official}</b>
        <p style='font-size: 20px'><b>Capital:</b> ${dat.capital}</p>
        <p style='font-size: 20px'><b>Population:</b> ${dat.population}</p>
        <p style='font-size: 20px'><b>Languages:</b> ${Object.values(
          dat.languages
        )}</p>`;
      })
      .join('');
    div.innerHTML = markup;
  }
  //   console.log(data);
}

function clearCountry() {
  ul.innerHTML = '';
  div.innerHTML = '';
}
