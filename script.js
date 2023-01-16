const form = document.querySelector('#bookmark-form');
const showFormButton = document.querySelector('#show-form');
const showBackupSystem = document.querySelector('#show-backup-system');
const BackupSystemform = document.querySelector('#backup-system');
const bookmarksContainer = document.querySelector('#bookmarks');
const deleteAllButton = document.querySelector('#delete-all');
const bookmarkstocheck = JSON.parse(localStorage.getItem('bookmarks')) || [];
const Downloadbtn = document.querySelector('#download');

let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];


function renderBookmarks() {
  bookmarksContainer.innerHTML = '';
  const groups = {};
  bookmarks.forEach((bookmark, index) => {
    if (!groups[bookmark.group]) {
      groups[bookmark.group] = document.createElement('div');
      groups[bookmark.group].classList.add('group');
      bookmarksContainer.appendChild(groups[bookmark.group]);
    }
    const bookmarkEl = document.createElement('div');
    bookmarkEl.classList.add('bookmark');
    bookmarkEl.style.backgroundColor = bookmark.color;
    bookmarkEl.classList.add('bookmark');
    bookmarkEl.innerHTML = `
      <h2>${bookmark.name}</h2>
      <p>${bookmark.description}</p>
      <a href="${bookmark.url}" target="_blank">Visit Now</a>
      <div class="DeleteEdit">
      <button data-index="${bookmarks.indexOf(bookmark)}">Delete</button>
      <button data-index="${bookmarks.indexOf(bookmark)}" class="edit">Edit</button>
      </div>
      <p class="group-card">${bookmark.group}</p>
    `;
    groups[bookmark.group].appendChild(bookmarkEl);  
  });
};
form.innerHTML = `

<input type="text" id="name" placeholder="Name" maxlength="20">
<input type="text" id="url" placeholder="URL">
<textarea id="description" placeholder="Description in Maximum 50 Letter (optional)" maxlength="50"></textarea>
<label>Background Color:(optional)</label>
<input type="color" id="color" value="#f1f1f1">
<select id="group">
</select>
<button type="submit">Add Website</button>
`;
let groups = JSON.parse(localStorage.getItem('groups')) || [];

const groupSelect = document.querySelector('#group');
const newGroupButton = document.querySelector('#new-group');

function renderGroups() {
  groupSelect.innerHTML = '<option value="">Select a Group (optional)</option>';
  groups.forEach(group => {
    const option = document.createElement('option');
    option.value = group;
    option.textContent = group;
    groupSelect.appendChild(option);
  });
}
const DownloadSelect = document.querySelector('#DownloadSelect');
function renderDownloadOptions() {
  DownloadSelect.innerHTML = '<option value="">All Group Backup</option>';
  groups.forEach(group => {
    const option = document.createElement('option');
    option.value = group;
    option.textContent = group;
    DownloadSelect.appendChild(option);
  });
}
renderDownloadOptions()
newGroupButton.addEventListener('click', () => {
  const group = prompt('Enter the name of the new group:');
  if (!group) return;
  groups.push(group);
  localStorage.setItem('groups', JSON.stringify(groups));
  renderGroups();
  renderDownloadOptions()
  showSuccessPopup()
});
renderGroups();
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.querySelector('#name').value;
  const url = document.querySelector('#url').value;
  const description = document.querySelector('#description').value;
  const color = document.querySelector('#color').value;
  const group = document.querySelector('#group').value;
  if (!name || !url) return alert('Please enter a name and URL');
if (!group) {
  const group = 'Primary';
  if (form.dataset.index) {
    const index = form.dataset.index;
    bookmarks[index] = { name, url, description, color, group, index };
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    form.removeAttribute('data-index');
  } else if (bookmarks.find(bookmark => bookmark.url === url)) {
    return alert('Bookmark already exists');
  } else {
    
    bookmarks.push({ name, url, description, color, group, index: bookmarks.length });
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
} else{
  if (form.dataset.index) {
    const index = form.dataset.index;
    bookmarks[index] = { name, url, description, color, group, index };
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    form.removeAttribute('data-index');
  } else if (bookmarks.find(bookmark => bookmark.url === url)) {
    return alert('Bookmark already exists');
  } else {
    
    bookmarks.push({ name, url, description, color, group, index: bookmarks.length });
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
}
  form.reset();
  form.style.display = 'none';
  renderBookmarks();
  showSuccessPopup()
});
showFormButton.addEventListener('click', () => {
  if (form.style.display !== 'flex') {
    form.style.display = 'flex';
  } else {
    form.style.display = 'none';
  }
  });
  
  showBackupSystem.addEventListener('click', () => {
    if (BackupSystemform.style.display !== 'flex') {
      BackupSystemform.style.display = 'flex';
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
      
    } else {
      BackupSystemform.style.display = 'none';
    }
  });
  
  bookmarksContainer.addEventListener('click', event => {
    if (event.target.tagName !== 'BUTTON') return;
    if (event.target.className === 'edit') {
      const index = event.target.dataset.index;
      const bookmark = bookmarks[index];
      form.querySelector('#name').value = bookmark.name;
      form.querySelector('#url').value = bookmark.url;
      form.querySelector('#description').value = bookmark.description;
      form.style.display = 'flex';
      form.setAttribute('data-index', index);
      window.scrollTo({
        top: 0,  // scroll to the top of the page
        left: 0, // scroll to the leftmost point of the page
        behavior: 'smooth'  // scroll smoothly
      });
    } else {
      const index = event.target.dataset.index;
      var responsedelete = confirm("Do you want to delete this Bookmark?");
      if (responsedelete == true) {
        bookmarks.splice(index, 1);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        renderBookmarks();
      }
    }
  });
  deleteAllButton.addEventListener('click', () => {
    var response = confirm("Do you want to delete all Bookmarks?");
    if (response == true) {
      bookmarks = [];
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      renderBookmarks();
      window.location.reload();
    }
  });


const fileInput = document.querySelector('#file-input');
const uploadButton = document.querySelector('#upload');

uploadButton.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = event => {
    
    const bookmarks = event.target.result.split('\n').map(line => {
      const [name, url, description, color, group] = line.split(' - ');
      return { name, url, description, color, group};
    });
    const datatosave = bookmarkstocheck.concat(bookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(datatosave));
    // Refresh the page to display the updated bookmarks
    window.location.reload();
  };
  reader.readAsText(file);
});
if ( localStorage.getItem('bookmarks') === null || localStorage.getItem('bookmarks') === []){
  bookmarksforfirsttimer = [
    { name: 'YouTube', url: 'https://www.youtube.com', description: 'To Watch great video Content', group: "Primary", color:"#ff0000"},
    { name: 'Facebook', url: 'https://www.facebook.com', description: 'Connect with your friends and family', group: "Primary", color:"#0d89ef"},
    { name: 'Instagram', url: 'https://www.instagram.com', description: 'Discover and share photos', group: "Primary", color:"#fbbc04"},
    { name: 'Gmail', url: 'https://mail.google.com', description: 'Explore Email from Google', group: "Primary", color:"#34a853"},
    { name: 'Google Drive', url: 'https://www.google.com/drive/', description: 'Best For Store and access files', group: "Primary", color:"#e71384"}
  ];
  localStorage.setItem('bookmarks', JSON.stringify(bookmarksforfirsttimer));
  window.location.reload();
}
if (bookmarkstocheck.length== 0) {
  Downloadbtn.style.display = 'none';
  deleteAllButton.style.display = 'none';
};
function showSuccessPopup() {
  var popup = document.createElement("div");
  popup.className = "success-popup";
  popup.innerHTML = `
    <div class="icon">
      <i class="fas fa-check"></i>
    </div>
    <p>Success!</p>
  `;
  document.body.appendChild(popup);

  setInterval(function() {
      popup.remove();
  }, 1500);
};
const backToTopButton = document.querySelector('.back-to-top-button');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    backToTopButton.classList.add('visible');
  } else {
    backToTopButton.classList.remove('visible');
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Get the modal
var modal = document.getElementById("modal");

// Get the button that opens the modal
var btn = document.getElementById("open-modal-button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-button")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

const DownloadOption = document.querySelector('#DownloadOption')
const FinalDownload = document.querySelector('#FinalDownload')
FinalDownload.addEventListener('click', () => {
 if (!DownloadSelect.value){
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  const data = bookmarks.map(bookmark => `${bookmark.name} - ${bookmark.url} - ${bookmark.description} - ${bookmark.color} - ${bookmark.group}`).join('\n');
  FinalDownload.href = `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`;
  FinalDownload.download = 'Bookmarks List';
 }else {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  const selectedgroup = DownloadSelect.value;
  const filteredResults = bookmarks.filter(obj => obj.group == selectedgroup);
  if(filteredResults.length == 0) {return alert("There is nothing to take backup")};
  const data = filteredResults.map(bookmark => `${bookmark.name} - ${bookmark.url} - ${bookmark.description} - ${bookmark.color} - ${bookmark.group}`).join('\n');
  FinalDownload.href = `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`;
  FinalDownload.download = 'Bookmarks Backup Created by GDLink';
 }
 
});











const welcomeScreen = document.querySelector('#welcome-screen');

if (bookmarks.length == 5) {
  welcomeScreen.style.display = 'flex';
} else {
  welcomeScreen.style.display = 'none';
}


renderBookmarks();
  