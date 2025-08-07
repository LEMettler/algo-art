let currentIndex = 0;
let currentImages = [];
let projectData = {};


function loadProject(topicName, projectName) {

  let imageGrid = document.getElementById('image-grid');
  let description = document.getElementById('project-description');
  let { count, columns, description: descHtml } = projectData[projectName];


  imageGrid.innerHTML = '';
  imageGrid.style.display = 'grid';
  imageGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

  currentImages = [];
  currentProject = projectName;

  for (let i=0; i<count; i++) {

    let img = document.createElement('img');
    let imgSrc = `${topicName}/${projectName}/img${i}.jpg`;

    img.src = imgSrc;
    img.alt = `${projectName} image ${i}`;
    
    img.onclick = () => openModal(i);
    imageGrid.appendChild(img);
    currentImages.push(imgSrc);
  }

  description.innerHTML = descHtml;
}


function openModal(index) {
  currentIndex = index;
  
  let modal = document.getElementById('modal');
  let modalImg = document.getElementById('modal-img');
  modal.style.display = 'flex';
  modalImg.src = currentImages[currentIndex];
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function showNext(direction) {
  currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
  document.getElementById('modal-img').src = currentImages[currentIndex];
}

