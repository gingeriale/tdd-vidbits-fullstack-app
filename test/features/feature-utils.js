const setValuesAndSubmit = (title, url) => {
  browser.url('/videos/create');
  browser.setValue('#title', title);
  browser.setValue('#url', url);
  browser.click('#submit-button');
};

module.exports = {
  setValuesAndSubmit,
}
