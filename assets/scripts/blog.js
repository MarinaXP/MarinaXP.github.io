// Variables globales
let articlesData = { fr: [], en: [] };
let currentLang = 'fr';
let currentSort = 'date-desc';
let currentTagFilter = '';
let isDataLoaded = false;

// Fonction pour charger les données depuis le JSON
async function loadArticlesData() {
  try {
    const response = await fetch('assets/datas/articles.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    articlesData = data;
    isDataLoaded = true;
    return data;
  } catch (error) {
    console.error('Erreur lors du chargement des données articles:', error);
    // Données de fallback en cas d'erreur
    articlesData = {
      fr: [{
        id: 1,
        title: "Erreur de chargement",
        tags: ["erreur"],
        date: "2024-07-20",
        layout: "full",
        text: "Impossible de charger les articles."
      }],
      en: [{
        id: 1,
        title: "Loading Error",
        tags: ["error"],
        date: "2024-07-20",
        layout: "full",
        text: "Unable to load articles."
      }]
    };
    isDataLoaded = true;
    return articlesData;
  }
}

// Fonction d'initialisation principale
async function initializeApp() {
  // Afficher un indicateur de chargement
  showLoadingIndicator();
  
  try {
    // Charger les données
    await loadArticlesData();
    
    // Masquer l'indicateur de chargement
    hideLoadingIndicator();
    
    // Initialiser l'application
    setupEventListeners();
    populateTagFilter();
    renderArticles();
    
    // Animation d'apparition au scroll
    setTimeout(() => {
      animateOnScroll();
    }, 500);
    
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    hideLoadingIndicator();
    showErrorMessage();
  }
}

// Fonctions d'indicateurs de chargement
function showLoadingIndicator() {
  const container = document.getElementById('articlesContainer');
  if (container) {
    const loadingText = currentLang === 'fr' ? 'Chargement des articles...' : 'Loading articles...';
    container.innerHTML = `
      <div class="loading-indicator">
        <div class="spinner"></div>
        <p>${loadingText}</p>
      </div>
    `;
  }
}

function hideLoadingIndicator() {
  const loadingIndicator = document.querySelector('.loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
}

function showErrorMessage() {
  const container = document.getElementById('articlesContainer');
  if (container) {
    const errorText = currentLang === 'fr' 
      ? 'Erreur lors du chargement des articles. Veuillez rafraîchir la page.' 
      : 'Error loading articles. Please refresh the page.';
    container.innerHTML = `
      <div class="error-message">
        <p>${errorText}</p>
        <button onclick="location.reload()" class="retry-btn">
          ${currentLang === 'fr' ? 'Réessayer' : 'Retry'}
        </button>
      </div>
    `;
  }
}

function animateOnScroll() {
  const elements = document.querySelectorAll('.blog-title, .blog-subtitle, .blog-controls');
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, index * 200);
  });
}

function setupEventListeners() {
  // Language toggle - modifié pour s'intégrer au système existant
  document.querySelectorAll('.language-selector a').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      // Vérifier que les données sont chargées
      if (!isDataLoaded) {
        await loadArticlesData();
      }
      
      document.querySelectorAll('.language-selector a').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentLang = e.target.dataset.lang;
      populateTagFilter();
      renderArticles();
    });
  });

  // Sort buttons
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      // Vérifier que les données sont chargées
      if (!isDataLoaded) {
        await loadArticlesData();
      }
      
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentSort = e.target.dataset.sort;
      renderArticles();
    });
  });

  // Tag filter
  const tagFilterElement = document.querySelector('.tag-filter');
  if (tagFilterElement) {
    tagFilterElement.addEventListener('change', async (e) => {
      // Vérifier que les données sont chargées
      if (!isDataLoaded) {
        await loadArticlesData();
      }
      
      currentTagFilter = e.target.value;
      renderArticles();
    });
  }
}

function populateTagFilter() {
  const tagFilter = document.querySelector('.tag-filter');
  if (!tagFilter || !isDataLoaded) return;
  
  const allTags = new Set();
  
  if (articlesData[currentLang]) {
    articlesData[currentLang].forEach(article => {
      if (article.tags) {
        article.tags.forEach(tag => allTags.add(tag));
      }
    });
  }
  
  // Textes multilingues pour les éléments
  const texts = {
    fr: {
      allProjects: 'Tous les projets',
      blogTitle: 'Quoi de neuf ?',
      dateDesc: 'Plus récent',
      dateAsc: 'Plus ancien',
      author: 'Auteur > Marina XP',
      footerDescription: 'Trash2Tech est une expérience pour rendre la robotique accessible, prouvant qu\'il est possible de concevoir des outils électroniques fonctionnels à partir de matériel de récupération et de composants économiques.',
      githubTitle: 'Rejoignez-moi sur GitHub'
    },
    en: {
      allProjects: 'All projects',
      blogTitle: 'What\'s new ?',
      dateDesc: 'Newest first',
      dateAsc: 'Oldest first',
      author: 'Author > Marina XP',
      footerDescription: 'Trash2Tech is an experience to make robotics accessible, proving that it is possible to design functional electronic tools from salvaged materials and economical components.',
      githubTitle: 'Join me on GitHub'
    }
  };
  
  const currentTexts = texts[currentLang];
  
  // Mise à jour du filtre de tags
  tagFilter.innerHTML = `<option value="">${currentTexts.allProjects}</option>`;
  [...allTags].sort().forEach(tag => {
    tagFilter.innerHTML += `<option value="${tag}">${tag}</option>`;
  });
  
  // Mise à jour des autres éléments textuels
  const blogTitle = document.getElementById('blog-title');
  if (blogTitle) blogTitle.textContent = currentTexts.blogTitle;
  
  const dateDesc = document.getElementById('date-desc');
  if (dateDesc) dateDesc.textContent = currentTexts.dateDesc;
  
  const dateAsc = document.getElementById('date-asc');
  if (dateAsc) dateAsc.textContent = currentTexts.dateAsc;
  
  const author = document.getElementById('author');
  if (author) author.textContent = currentTexts.author;
  
  const footerDescription = document.getElementById('footer-description');
  if (footerDescription) footerDescription.textContent = currentTexts.footerDescription;
  
  const githubTitle = document.getElementById('github-title');
  if (githubTitle) githubTitle.textContent = currentTexts.githubTitle;
}

function filterAndSortArticles() {
  if (!isDataLoaded || !articlesData[currentLang]) {
    return [];
  }
  
  let articles = [...articlesData[currentLang]];

  if (currentTagFilter) {
    articles = articles.filter(article => 
      article.tags && article.tags.includes(currentTagFilter)
    );
  }

  articles.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return currentSort === 'date-desc' ? dateB - dateA : dateA - dateB;
  });

  return articles;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return currentLang === 'fr' 
    ? date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
    : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function createArticleHTML(article) {
  // Le nom du projet vient maintenant du premier tag
  const projectName = article.tags && article.tags.length > 0 ? article.tags[0] : 'Projet';

  const contentClass = article.layout === 'full' 
    ? 'content-layout-full' 
    : `content-layout-${article.layout}`;

  let iconHTML = '';
  if (article.icon) {
    iconHTML = `
      <div class="article-icon">
        <img src="${article.icon}" alt="Pictogramme ${projectName}" />
      </div>
    `;
  }

  let mediaHTML = '';
  if (article.media) {
    const mediaClass = `media-${article.media.format}`;
    if (article.media.type === 'video') {
      mediaHTML = `
        <div class="article-media ${mediaClass}">
          <video controls preload="metadata" poster="${article.media.thumbnail || ''}">
            <source src="${article.media.src}" type="video/mp4">
            <source src="${article.media.src}" type="video/webm">
            <source src="${article.media.src}" type="video/ogg">
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        </div>
      `;
    } else {
      mediaHTML = `
        <div class="article-media ${mediaClass}">
          <img src="${article.media.src}" alt="${article.title}" />
        </div>
      `;
    }
  }

  let actionsHTML = '';
  if (article.download || article.cta) {
    actionsHTML = '<div class="article-actions">';
    if (article.download) {
      actionsHTML += `<a href="${article.download.url}" class="download-btn">${article.download.text}</a>`;
    }
    if (article.cta) {
      actionsHTML += `<a href="${article.cta.url}" class="cta-btn">${article.cta.text}</a>`;
    }
    actionsHTML += '</div>';
  }

  // NOTE : La structure est modifiée ici pour correspondre à l'image
  return `
    <article class="article">
      <div class="article-header">
        ${iconHTML}
        <div class="article-meta">
          <span class="tag">${projectName}</span>
          <div class="article-date">${formatDate(article.date)}</div>
        </div>
      </div>

      <div class="article-content">
        <div class="${contentClass}">
          ${mediaHTML}
          <div class="article-text">
            <h3 class="article-title">${article.title}</h3>
            <p>${article.text}</p>
            ${actionsHTML}
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderArticles() {
  const container = document.getElementById('articlesContainer');
  if (!container || !isDataLoaded) return;
  
  const articles = filterAndSortArticles();

  if (articles.length === 0) {
    const noResultsText = currentLang === 'fr' 
      ? 'Aucun article trouvé pour ces critères.' 
      : 'No articles found for these criteria.';
    container.innerHTML = `<div class="no-articles">${noResultsText}</div>`;
    return;
  }

  container.innerHTML = articles.map(article => createArticleHTML(article)).join('');
  
  // Animation d'apparition des articles
  setTimeout(() => {
    document.querySelectorAll('.article').forEach((article, index) => {
      setTimeout(() => {
        article.classList.add('visible');
      }, index * 100);
    });
  }, 100);
}

// Fonction utilitaire pour recharger les données (si besoin)
async function reloadArticlesData() {
  isDataLoaded = false;
  await loadArticlesData();
  populateTagFilter();
  renderArticles();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', initializeApp);