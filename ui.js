import { BLOCK_LIBRARY, BLOCK_COLORS, CATEGORIES } from './blocks.js';
import { getSelectedTarget } from './project-model.js';
import { renderWorkspace } from './workspace.js';

export class UI {
  constructor(projectRef, onChange, runtime) {
    this.projectRef = projectRef;
    this.onChange = onChange;
    this.runtime = runtime;
    this.activeCategory = 'events';
    this.activeTab = 'code';

    this.catRoot = document.getElementById('blockCategories');
    this.paletteRoot = document.getElementById('blockPalette');
    this.contentRoot = document.getElementById('centerContent');
    this.spriteListRoot = document.getElementById('spriteList');
    this.propsRoot = document.getElementById('spriteProps');

    this.bindTop();
    this.bindTabs();
    this.render();
  }

  get project() { return this.projectRef(); }

  bindTop() {
    document.getElementById('greenFlag').onclick = () => this.runtime.greenFlag();
    document.getElementById('stopAll').onclick = () => this.runtime.stopAll();
    document.getElementById('addSprite').onclick = () => {
      this.project.sprites.push({
        id: crypto.randomUUID(), name: `Спрайт${this.project.sprites.length+1}`,
        x:0,y:0,direction:90,size:100,visible:true,rotationStyle:'all around',
        costumeIndex:0,costumes:[{name:'costume1',src:null}],sounds:[],scripts:[]
      });
      this.project.selectedTarget = this.project.sprites.at(-1).id;
      this.onChange();
    };

    const nameInput = document.getElementById('projectName');
    nameInput.onchange = () => { this.project.meta.name = nameInput.value; this.onChange(); };

    document.getElementById('exportBtn').onclick = () => {
      const blob = new Blob([JSON.stringify(this.project, null, 2)], { type:'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${this.project.meta.name || 'project'}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    };

    const inp = document.getElementById('importInput');
    document.getElementById('importBtn').onclick = () => inp.click();
    inp.onchange = async () => {
      const f = inp.files[0];
      if (!f) return;
      const text = await f.text();
      const data = JSON.parse(text);
      Object.keys(this.project).forEach(k => delete this.project[k]);
      Object.assign(this.project, data);
      this.onChange();
    };
  }

  bindTabs() {
    document.querySelectorAll('.tab').forEach(t => t.onclick = () => {
      document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      this.activeTab = t.dataset.tab;
      this.renderCenter();
    });
  }

  renderCategories() {
    this.catRoot.innerHTML = '';
    for (const [key, label] of CATEGORIES) {
      const b = document.createElement('button');
      b.className = 'cat-btn' + (this.activeCategory === key ? ' active' : '');
      b.textContent = label;
      b.style.borderLeft = `4px solid ${BLOCK_COLORS[key]}`;
      b.onclick = () => { this.activeCategory = key; this.renderPalette(); this.renderCategories(); };
      this.catRoot.append(b);
    }
  }

  renderPalette() {
    this.paletteRoot.innerHTML = '';
    for (const def of BLOCK_LIBRARY[this.activeCategory] || []) {
      const b = document.createElement('div');
      b.className = 'palette-block';
      b.style.background = BLOCK_COLORS[this.activeCategory];
      b.textContent = def.text;
      b.draggable = true;
      b.ondragstart = (e) => e.dataTransfer.setData('application/x-block', JSON.stringify(def));
      this.paletteRoot.append(b);
    }
  }

  renderCenter() {
    const target = getSelectedTarget(this.project);
    if (this.activeTab === 'code') {
      renderWorkspace(this.contentRoot, target, this.onChange);
      return;
    }
    if (this.activeTab === 'costumes') {
      this.renderCostumes(target);
      return;
    }
    this.renderSounds(target);
  }

  renderCostumes(target) {
    this.contentRoot.innerHTML = `<div class='tab-panel'><h3>Костюмы — ${target.name || 'Сцена'}</h3><input id='costumeUpload' type='file' accept='image/*'><div id='costumeList'></div></div>`;
    const list = this.contentRoot.querySelector('#costumeList');
    const draw = () => {
      list.innerHTML = '';
      (target.costumes || []).forEach((c, i) => {
        const row = document.createElement('div');
        row.className = 'list-row';
        row.innerHTML = `<span>${i+1}. <input value='${c.name}' data-i='${i}'></span><div><button class='small-btn' data-act='sel'>Выбрать</button><button class='small-btn' data-act='dup'>Дубль</button><button class='small-btn' data-act='del'>Удалить</button></div>`;
        row.querySelector('input').onchange = (e)=>{ c.name = e.target.value; this.onChange(); };
        row.querySelectorAll('button').forEach(btn => btn.onclick = () => {
          const act = btn.dataset.act;
          if (act==='sel') target.costumeIndex = i;
          if (act==='dup') target.costumes.splice(i+1,0,{...c,name:c.name+'_copy'});
          if (act==='del') target.costumes.splice(i,1);
          this.onChange(); draw();
        });
        list.append(row);
      });
    };
    draw();
    this.contentRoot.querySelector('#costumeUpload').onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const src = await fileToDataURL(file);
      target.costumes.push({ name: file.name, src });
      this.onChange(); draw();
    };
  }

  renderSounds(target) {
    target.sounds ||= [];
    this.contentRoot.innerHTML = `<div class='tab-panel'><h3>Звуки — ${target.name || 'Сцена'}</h3><input id='soundUpload' type='file' accept='audio/*'><div id='soundList'></div></div>`;
    const list = this.contentRoot.querySelector('#soundList');
    const draw = () => {
      list.innerHTML = '';
      target.sounds.forEach((s, i) => {
        const row = document.createElement('div');
        row.className = 'list-row';
        row.innerHTML = `<span><input value='${s.name}'></span><div><button class='small-btn' data-act='play'>Play</button><button class='small-btn' data-act='stop'>Stop</button><button class='small-btn' data-act='del'>Удалить</button></div>`;
        const audio = new Audio(s.src);
        row.querySelector('input').onchange = (e)=>{ s.name = e.target.value; this.onChange(); };
        row.querySelector('[data-act=play]').onclick = ()=>audio.play();
        row.querySelector('[data-act=stop]').onclick = ()=>{audio.pause(); audio.currentTime=0;};
        row.querySelector('[data-act=del]').onclick = ()=>{target.sounds.splice(i,1); this.onChange(); draw();};
        list.append(row);
      });
    };
    draw();
    this.contentRoot.querySelector('#soundUpload').onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      target.sounds.push({ name: file.name, src: await fileToDataURL(file) });
      this.onChange(); draw();
    };
  }

  renderSprites() {
    this.spriteListRoot.innerHTML = '';
    this.project.sprites.forEach(s => {
      const c = s.costumes[s.costumeIndex] || s.costumes[0] || {};
      const card = document.createElement('div');
      card.className = 'sprite-card' + (this.project.selectedTarget === s.id ? ' active' : '');
      card.innerHTML = `<img class='sprite-thumb' src='${c.src || ''}'><div contenteditable='true'>${s.name}</div><div>x:${Math.round(s.x)} y:${Math.round(s.y)}</div>`;
      card.onclick = () => { this.project.selectedTarget = s.id; this.onChange(); };
      card.querySelector('[contenteditable]').onblur = (e) => { s.name = e.target.textContent.trim() || s.name; this.onChange(); };
      this.spriteListRoot.append(card);
    });
  }

  renderProps() {
    const t = getSelectedTarget(this.project);
    if (!t || t.id === 'stage') { this.propsRoot.innerHTML = 'Свойства сцены'; return; }
    this.propsRoot.innerHTML = `
      <label>X <input id='pX' type='number' value='${Math.round(t.x)}'></label>
      <label>Y <input id='pY' type='number' value='${Math.round(t.y)}'></label>
      <label>Размер <input id='pS' type='number' value='${Math.round(t.size)}'></label>
      <label>Направление <input id='pD' type='number' value='${Math.round(t.direction)}'></label>
      <label><input id='pV' type='checkbox' ${t.visible ? 'checked' : ''}> Видим</label>
    `;
    this.propsRoot.querySelector('#pX').onchange = (e)=>{ t.x = Number(e.target.value); this.onChange(); };
    this.propsRoot.querySelector('#pY').onchange = (e)=>{ t.y = Number(e.target.value); this.onChange(); };
    this.propsRoot.querySelector('#pS').onchange = (e)=>{ t.size = Number(e.target.value); this.onChange(); };
    this.propsRoot.querySelector('#pD').onchange = (e)=>{ t.direction = Number(e.target.value); this.onChange(); };
    this.propsRoot.querySelector('#pV').onchange = (e)=>{ t.visible = e.target.checked; this.onChange(); };
  }

  render() {
    document.getElementById('projectName').value = this.project.meta.name || 'Без названия';
    this.renderCategories();
    this.renderPalette();
    this.renderCenter();
    this.renderSprites();
    this.renderProps();
  }
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
