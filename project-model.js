export function createDefaultProject() {
  const cat = 'data:image/svg+xml;base64,' + btoa(`<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><rect width='96' height='96' fill='#f6fbff'/><circle cx='48' cy='45' r='28' fill='#ffb84d'/><circle cx='38' cy='40' r='4'/><circle cx='58' cy='40' r='4'/><path d='M36 55 Q48 66 60 55' stroke='#333' stroke-width='4' fill='none'/></svg>`);
  return {
    meta: { name: 'Без названия' },
    stage: { id: 'stage', name: 'Сцена', backdrops: [{name:'backdrop1', src:null}], currentBackdrop:0, scripts: [] },
    sprites: [{
      id: crypto.randomUUID(),
      name: 'Спрайт1', x: 0, y: 0, direction: 90, size: 100, visible: true, rotationStyle:'all around',
      costumeIndex: 0,
      costumes: [{ name: 'costume1', src: cat }],
      sounds: [],
      scripts: []
    }],
    selectedTarget: null,
    variables: { score: 0 },
    lists: { list: [] },
    broadcasts: ['message1']
  };
}

export function getSelectedTarget(project) {
  const id = project.selectedTarget ?? project.sprites[0]?.id;
  return project.sprites.find(s => s.id === id) || project.stage;
}

export function ensureSelection(project) {
  if (!project.selectedTarget && project.sprites[0]) project.selectedTarget = project.sprites[0].id;
}
