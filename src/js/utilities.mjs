export function getURLParam(param) {
  const queryString = window.location.search;
  const urlParam = new URLSearchParams(queryString);
  return urlParam.get(param);
}

export function renderListWithTemplate(templateFunction, insertionElement, list, position="afterbegin", clear = true) {
  if(clear) {
    insertionElement.innerHTML = "";
  }
  const htmlString = list.map(templateFunction);
  insertionElement.insertAdjacentHTML(position, htmlString.join(""));
}

//why not just write the async function as the function itself?
//why do we need to "return" it?
export function loadSnippet(path) {
  return async function() {
    const response = await fetch(path);
    if (response.ok) {
      const template = await response.text();
      return template;
    }
  };
}

//what's the data parameter for, again? especially when passed to the templateFunction?
//also, do I need callback?
export async function renderWithTemplate(templateFunction, insertionElement, data, callback, position = "afterbegin", clear = true) {
  if(clear) {
    insertionElement.innerHTML = "";
  }
  const htmlString = await templateFunction(data);
  insertionElement.insertAdjacentHTML(position, htmlString);
  if(callback) {
    callback(data);
  }
}

function setMenuListener() {
  let parentElement = document.querySelector("header");
  let navElement = document.querySelector(".nav");
  const overlayElement = document.querySelector(".overlay");
  parentElement.addEventListener("click", function(e) {
    if(e.target && e.target.closest("#menu-button")) {
      e.target.closest("#menu-button").classList.toggle("change");
      navElement.classList.toggle("visible");
      overlayElement.classList.toggle("darken");
    }
  });
}

export async function addHeaderNavFooter() {
  const headerElement = document.querySelector("header");
  const navElement = document.querySelector(".nav");
  const footerElement = document.querySelector("footer");

  const headerFn = loadSnippet("/snippets/header.html");
  const navFn = loadSnippet("/snippets/nav.html");
  const footerFn = loadSnippet("/snippets/footer.html");

  renderWithTemplate(headerFn, headerElement);
  renderWithTemplate(navFn, navElement);
  renderWithTemplate(footerFn, footerElement);

  setMenuListener();
}