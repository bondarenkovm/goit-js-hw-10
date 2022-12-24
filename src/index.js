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
    renderMarkupCountryList(data);
  }
  if (data.length === 1) {
    renderMarkupCountryInfo(data);
  }
  // console.log(data);
}

function clearCountry() {
  ul.innerHTML = '';
  div.innerHTML = '';
}

function renderMarkupCountryList(fields) {
  const markup = fields
    .map(({ flags, name }) => {
      return `
        <li style='list-style: none; margin-bottom:10px; display: flex'>
          <img src='${flags.svg}' alt='flags' width='80'/>
          <p style='margin-left:20px; font-size:15px'><b>${name.official}</b></p>
        </li>`;
    })
    .join('');
  ul.innerHTML = markup;
}

function renderMarkupCountryInfo(fields) {
  const markup = fields
    .map(({ flags, name, capital, population, languages }) => {
      // const values = Object.values(languages);
      return `<div style='display: flex'>
        <img src='${flags.svg}' alt='flags' width='120'/>
        <p style='margin-left:10px; font-size: 30px'><b>${name.official}</b></p>
        </div>
        <p style='font-size: 20px'><b>Capital:</b> ${capital}</p>
        <p style='font-size: 20px'><b>Population:</b> ${population}</p>
        <p style='font-size: 20px'><b>Languages:</b> ${Object.values(
          languages
        )}</p>`;
    })
    .join('');
  div.innerHTML = markup;
}
