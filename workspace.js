import { BLOCK_COLORS, instantiateBlock } from './blocks.js';

function blockTextWithInputs(block) {
  let t = block.text;
  for (const a of block.args || []) {
    t = t.replace(`[${a.value}]`, `<input class="input-inline" data-arg="${a.key}" value="${a.value}">`);
    t = t.replace('[ ]', `<input class="input-inline" data-arg="${a.key}" value="${a.value}">`);
  }
  return t;
}

export function renderWorkspace(root, target, onChange) {
  root.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'workspace';

  const addScriptBtn = document.createElement('button');
  addScriptBtn.className = 'small-btn';
  addScriptBtn.textContent = '+ Новый скрипт';
  addScriptBtn.onclick = () => {
    target.scripts.push({ id: crypto.randomUUID(), blocks: [] });
    onChange();
  };
  wrap.append(addScriptBtn);

  for (const script of target.scripts) {
    const stack = document.createElement('div');
    stack.className = 'script-stack';
    stack.dataset.scriptId = script.id;
    stack.ondragover = (e) => e.preventDefault();
    stack.ondrop = (e) => {
      const raw = e.dataTransfer.getData('application/x-block');
      if (!raw) return;
      const def = JSON.parse(raw);
      script.blocks.push(instantiateBlock(def));
      onChange();
    };

    for (const block of script.blocks) {
      stack.append(renderBlock(block, onChange, script));
    }
    wrap.append(stack);
  }

  root.append(wrap);
}

function renderBlock(block, onChange, script) {
  const el = document.createElement('div');
  el.className = 'workspace-block';
  el.style.background = BLOCK_COLORS[block.category] || '#999';
  el.draggable = true;
  el.innerHTML = `${blockTextWithInputs(block)} <span class="remove">✕</span>`;
  el.querySelector('.remove').onclick = () => {
    script.blocks = script.blocks.filter(b => b.uid !== block.uid);
    onChange();
  };
  for (const input of el.querySelectorAll('input[data-arg]')) {
    input.onchange = () => {
      const arg = block.args.find(a => a.key === input.dataset.arg);
      arg.value = input.value;
      onChange();
    };
  }

  if (block.shape === 'cblock' || block.shape === 'ifelse') {
    const sub = document.createElement('div');
    sub.className = 'substack';
    sub.ondragover = (e) => e.preventDefault();
    sub.ondrop = (e) => {
      const raw = e.dataTransfer.getData('application/x-block');
      if (!raw) return;
      block.substack.push(instantiateBlock(JSON.parse(raw)));
      onChange();
    };
    for (const b of block.substack) sub.append(renderNested(block, b, onChange));
    el.append(sub);

    if (block.shape === 'ifelse') {
      const sub2 = document.createElement('div');
      sub2.className = 'substack';
      sub2.ondragover = (e) => e.preventDefault();
      sub2.ondrop = (e) => {
        const raw = e.dataTransfer.getData('application/x-block');
        if (!raw) return;
        block.substack2.push(instantiateBlock(JSON.parse(raw)));
        onChange();
      };
      for (const b of block.substack2) sub2.append(renderNested(block, b, onChange, true));
      el.append(sub2);
    }
  }

  return el;
}

function renderNested(parent, block, onChange, second=false) {
  const el = document.createElement('div');
  el.className = 'workspace-block';
  el.style.background = BLOCK_COLORS[block.category] || '#888';
  el.innerHTML = `${blockTextWithInputs(block)} <span class="remove">✕</span>`;
  el.querySelector('.remove').onclick = () => {
    const arr = second ? parent.substack2 : parent.substack;
    const idx = arr.findIndex(b => b.uid === block.uid);
    if (idx >= 0) arr.splice(idx, 1);
    onChange();
  };
  for (const input of el.querySelectorAll('input[data-arg]')) {
    input.onchange = () => {
      const arg = block.args.find(a => a.key === input.dataset.arg);
      arg.value = input.value;
      onChange();
    };
  }
  return el;
}
