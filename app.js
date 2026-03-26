import { createDefaultProject, ensureSelection } from './project-model.js';
import { loadProject, saveProject } from './storage.js';
import { StageRenderer } from './stage.js';
import { Runtime } from './runtime.js';
import { UI } from './ui.js';

const stored = loadProject();
const project = stored || createDefaultProject();
ensureSelection(project);

let ui;
const getProject = () => project;

const stageRenderer = new StageRenderer(document.getElementById('stage'), getProject);
const runtime = new Runtime(getProject, () => onChange(false), stageRenderer);

function onChange(shouldSave = true) {
  if (shouldSave) saveProject(project);
  ui.render();
}

ui = new UI(getProject, onChange, runtime);
onChange(false);

window.addEventListener('beforeunload', () => saveProject(project));
