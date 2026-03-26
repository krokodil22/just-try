const KEY = 'scratch_local_clone_v1';

export function saveProject(project) {
  localStorage.setItem(KEY, JSON.stringify(project));
}

export function loadProject() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
