(function () {
  const grid = document.getElementById('project-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderCard(project, index) {
    const cover = project.images[0] || '';
    return `
      <article class="project-card" data-index="${index}" data-industry="${project.industry}">
        ${cover ? `<div class="project-card-img"><img src="${cover}" alt="${escapeHtml(project.brand)} cover" loading="lazy"></div>` : ''}
        <div class="project-card-body">
          <div class="project-card-meta">
            <span class="project-card-brand">${escapeHtml(project.brand)}</span>
            <span>${escapeHtml(project.year)}</span>
          </div>
          <h3 class="project-card-title">${escapeHtml(project.name)}</h3>
          <div class="project-card-tags">
            ${project.scope.map(s => `<span class="tag">${escapeHtml(s)}</span>`).join('')}
          </div>
        </div>
      </article>
    `;
  }

  function renderGrid(filter) {
    const items = PROJECTS
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => filter === 'All' || p.industry === filter);
    grid.innerHTML = items.map(({ p, i }) => renderCard(p, i)).join('');
    grid.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => openModal(Number(card.dataset.index)));
    });
  }

  function paragraphs(arr) {
    return arr.map(t => `<p>${escapeHtml(t).replace(/\n/g, '<br>')}</p>`).join('');
  }

  function solutionBlock(solution) {
    if (!solution.length) return '';
    const listItems = solution.filter(s => s.type !== 'text');
    const textItems = solution.filter(s => s.type === 'text');
    let html = textItems.map(s => `<p>${escapeHtml(s.text).replace(/\n/g, '<br>')}</p>`).join('');
    if (listItems.length) {
      html += `<ul>${listItems.map(s => `<li>${escapeHtml(s.text)}</li>`).join('')}</ul>`;
    }
    return html;
  }

  function extraSectionBlock(section) {
    return `
      <div class="modal-section">
        <h4>${escapeHtml(section.title)}</h4>
        ${section.items.map(item => {
          if (item.type === 'image') {
            return `<img class="idea-image" src="${item.src}" alt="${escapeHtml(section.title)} visual" loading="lazy">`;
          }
          if (item.type === 'heading') {
            return `<p class="idea-heading">${escapeHtml(item.text)}</p>`;
          }
          if (item.type === 'bulleted_list' || item.type === 'numbered_list') {
            return `<ul><li>${escapeHtml(item.text)}</li></ul>`;
          }
          return `<p>${escapeHtml(item.text).replace(/\n/g, '<br>')}</p>`;
        }).join('')}
      </div>
    `;
  }

  function openModal(index) {
    const p = PROJECTS[index];
    const [cover, ...rest] = p.images;
    modalContent.innerHTML = `
      ${cover ? `<img class="modal-hero-img" src="${cover}" alt="${escapeHtml(p.brand)}">` : ''}
      <div class="modal-body">
        <div class="modal-meta">
          <span>${escapeHtml(p.brand)}</span>
          <span class="dot">&middot;</span>
          <span class="year">${escapeHtml(p.year)}</span>
          <span class="dot">&middot;</span>
          <span>${escapeHtml(p.industry)}</span>
        </div>
        <h2 class="modal-title">${escapeHtml(p.name)}</h2>
        <div class="modal-tags">
          ${p.scope.map(s => `<span class="tag">${escapeHtml(s)}</span>`).join('')}
        </div>
        ${p.challenge.length ? `
        <div class="modal-section">
          <h4>Challenge</h4>
          ${paragraphs(p.challenge)}
        </div>` : ''}
        ${p.solution.length ? `
        <div class="modal-section">
          <h4>Solution</h4>
          ${solutionBlock(p.solution)}
        </div>` : ''}
        ${(p.extra_sections || []).map(extraSectionBlock).join('')}
        ${p.results.length ? `
        <div class="modal-section">
          <h4>Results</h4>
          ${paragraphs(p.results)}
        </div>` : ''}
        ${rest.length ? `
        <div class="modal-section">
          <h4>Gallery</h4>
          <div class="modal-gallery">
            ${rest.map(src => `<img src="${src}" alt="${escapeHtml(p.brand)} detail" loading="lazy">`).join('')}
          </div>
        </div>` : ''}
      </div>
    `;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGrid(btn.dataset.filter);
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  renderGrid('All');
})();
