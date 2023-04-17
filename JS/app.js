// All The Important Const For Program

const form = document.querySelector('#book-form');
const summaryDiv = document.querySelector('#summary');
const searchInput = document.querySelector('#book-name');
const loaderContainer = document.querySelector('.loader-container');
const navbar = document.querySelector('.center-nav');
const copyButton = document.querySelector('#copy-button');
const theallh = document.querySelector("#thesecondh");
const thespan = document.querySelector("#theendh");
const theshareicon = document.querySelector("#share-buttons");
const thefnl = document.querySelector("#thefnlh");


const googleBooksApi = 'AIzaSyD9HSO1vtKh1fp6RfjsCm54FbA7B8t_kUk';
const nyTimesBooksApi = '9h61g6mAFoBmQe0XuH1KzHTOYxm4Gmd7';



// Set up options for fuzzy search
const fuseOptions =
{
  includeScore: true,
  threshold: 0.4,
  keys: ['volumeInfo.title'],
};

const link = encodeURI(window.location.href);
const msg = encodeURIComponent('Hey, I Found This Brilliant Tool to Get Books Summary Free All CopyRight Reserved to Mehroz Khan 🎁');
const title = encodeURIComponent('The Best Book Summarizer Online 🔥');

const fb = document.querySelector('.facebook');
fb.href = `https://www.facebook.com/share.php?u=${link}`;

const twitter = document.querySelector('.twitter');
twitter.href = `http://twitter.com/share?&url=${msg}&hashtags=BookSummarizer,BookSummaryOnline`;

const linkedIn = document.querySelector('.linkedin');
linkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${link}`;

const reddit = document.querySelector('.reddit');
reddit.href = `http://www.reddit.com/submit?url=${link}&title=${title}`;

const whatsapp = document.querySelector('.whatsapp');
whatsapp.href = `https://api.whatsapp.com/send?text=${msg}: ${link}`;

const telegram = document.querySelector('.telegram');
telegram.href = `https://telegram.me/share/url?url=${link}&text=${msg}`;


form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Show the loader
  navbar.style.display = 'none';
  loaderContainer.style.display = 'flex';

  // Clear previous summary
  summaryDiv.innerHTML = '';

  // Get the book name
  const bookName = searchInput.value;

  // Search for books using fuzzy search
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookName}&key=${googleBooksApi}`)
    .then(response => response.json())
    .then(data => {
      const fuse = new Fuse(data.items, fuseOptions);
      const results = fuse.search(bookName);

      loaderContainer.style.display = 'none';
      navbar.style.display = 'flex';

      if (results.length === 0) {
        throw alert('No results found. Please try again with a different keyword.');
      }

      const topResult = results[0].item;

      // Fetch the book summary from the NY Times Books API
      fetch(`https://api.nytimes.com/svc/books/v3/reviews.json?title=${encodeURIComponent(topResult.volumeInfo.title)}&api-key=${nyTimesBooksApi}`)
        .then(response => response.json())
        .then(data => {

          // Hide the loader
          navbar.style.display = 'flex';
          loaderContainer.style.display = 'none';

          // Make summary container visible
          summaryDiv.style.display = 'block';
          thefirsth.style.display = 'block';

          // Make Share icons visible
          theshareicon.style.display = "block";

          // Display the summary and author name
          const authorName = extractAuthor(topResult.volumeInfo.authors);
          const summaryText = data.results[0]?.summary || topResult.volumeInfo.description;
          summaryDiv.innerHTML = `
            <h2>${topResult.volumeInfo.title}</h2>
            <h3>Author: ${authorName}</h3>
            <p>${summaryText}</p>
            <input type="submit" id="copy-button" value="Copy"><i class="bi bi-clipboard-check-fill" id="copy-btn"></i></input>
          `;

          // Add the copy button functionality
          const copyButton = document.querySelector('#copy-button');
          copyButton.addEventListener('click', () => {
            const textToCopy = summaryDiv.innerText;
            navigator.clipboard.writeText(textToCopy);
            alert('Summary copied to clipboard!');
          });

          // Make heading container visible
          theallh.style.display = "block";

        });
    })

    .catch(error => {
      console.log(error);
      summaryDiv.innerHTML = `<p>Unable to fetch summary.</p>`;
    });
})

function extractAuthor(authors) {
  if (!authors || authors.length === 0) {
    return 'Unknown';
  }

  let authorName = authors[0];
  if (authors.length > 1) {
    authorName = authors.join(', ');
  }
  return authorName;

}