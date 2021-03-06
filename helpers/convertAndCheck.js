const { format, differenceInYears } = require('date-fns');

const isArray = (arr) => Array.isArray(arr);
const isObject = (arg) => (typeof arg === 'object' || typeof arg === 'function') && arg !== null;
const toDate = (date) => format(new Date(date), 'dd/MM/yyyy');
const isMajor = (age) => differenceInYears(new Date(age), new Date()) >= 18;
const ucfirst = (name) => name.charAt(0).toUpperCase() + name.slice(1);
const isValidateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(String(email).toLowerCase());
};
const toFormData = (form = {}) => {
  const formData = new FormData();

  Object.keys(form).forEach((key) => formData.append(key, form[key]));

  return formData;
};
const toggleArray = (array, name) => {
  let found = false;

  if (!isArray(array) || (!name && name !== '0')) return array;

  const data = array.filter((elem) => {
    if (elem === name) found = true;

    return elem !== name;
  });

  if (!found) data.push(name);
  return data;
};
const pick = (object, keys) =>
  keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }

    return obj;
  }, {});

module.exports = {
  toDate,
  isMajor,
  isArray,
  isObject,
  ucfirst,
  toFormData,
  isValidateEmail,
  pick,
  toggleArray,
};
