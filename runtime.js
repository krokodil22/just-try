import { getSelectedTarget } from './project-model.js';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export class Runtime {
  constructor(getProject, onProjectChange, stageRenderer) {
    this.getProject = getProject;
    this.onProjectChange = onProjectChange;
    this.stage = stageRenderer;
    this.running = false;
    this.threads = [];
    this.startMs = performance.now();
  }

  stopAll() { this.running = false; this.threads = []; }

  greenFlag() {
    this.stopAll();
    this.running = true;
    const p = this.getProject();
    for (const target of p.sprites.concat([p.stage])) {
      for (const script of target.scripts || []) {
        const first = script.blocks?.[0];
        if (first?.opcode === 'event_whenflagclicked') {
          this.runScript(target, script.blocks.slice(1));
        }
      }
    }
  }

  broadcast(message) {
    const p = this.getProject();
    for (const target of p.sprites.concat([p.stage])) {
      for (const script of target.scripts || []) {
        const first = script.blocks?.[0];
        if (first?.opcode === 'event_whenbroadcastreceived') {
          this.runScript(target, script.blocks.slice(1));
        }
      }
    }
  }

  runScript(target, blocks) {
    const thread = this.execBlocks(target, blocks);
    this.threads.push(thread);
  }

  async execBlocks(target, blocks) {
    for (const b of blocks) {
      if (!this.running) return;
      await this.execBlock(target, b);
      this.onProjectChange();
    }
  }

  arg(b, key, fallback=0) {
    return Number(b.args?.find(a=>a.key===key)?.value ?? fallback);
  }

  txt(b, key, fallback='') {
    return String(b.args?.find(a=>a.key===key)?.value ?? fallback);
  }

  edgeBounce(s) {
    if (s.x > 240) { s.x = 240; s.direction = 180 - s.direction; }
    if (s.x < -240) { s.x = -240; s.direction = 180 - s.direction; }
    if (s.y > 180) { s.y = 180; s.direction = -s.direction; }
    if (s.y < -180) { s.y = -180; s.direction = -s.direction; }
  }

  async execBlock(target, b) {
    const p = this.getProject();
    switch (b.opcode) {
      case 'motion_movesteps': {
        const n = this.arg(b, 'steps', 10);
        const rad = (90 - target.direction) * Math.PI / 180;
        target.x += Math.cos(rad) * n;
        target.y += Math.sin(rad) * n;
        break;
      }
      case 'motion_turnright': target.direction += this.arg(b, 'deg', 15); break;
      case 'motion_turnleft': target.direction -= this.arg(b, 'deg', 15); break;
      case 'motion_gotoxy': target.x = this.arg(b, 'x'); target.y = this.arg(b, 'y'); break;
      case 'motion_changexby': target.x += this.arg(b, 'x', 10); break;
      case 'motion_setx': target.x = this.arg(b, 'x', 0); break;
      case 'motion_changeyby': target.y += this.arg(b, 'y', 10); break;
      case 'motion_sety': target.y = this.arg(b, 'y', 0); break;
      case 'motion_ifonedgebounce': this.edgeBounce(target); break;
      case 'control_wait': await sleep(this.arg(b, 'secs', 1) * 1000); break;
      case 'control_repeat': {
        for (let i=0;i<this.arg(b, 'times', 10);i++) await this.execBlocks(target, b.substack || []);
        break;
      }
      case 'control_forever': {
        while (this.running) await this.execBlocks(target, b.substack || []);
        break;
      }
      case 'control_if': {
        if (this.evaluateCondition(target, b)) await this.execBlocks(target, b.substack || []);
        break;
      }
      case 'control_if_else': {
        if (this.evaluateCondition(target, b)) await this.execBlocks(target, b.substack || []);
        else await this.execBlocks(target, b.substack2 || []);
        break;
      }
      case 'event_broadcast': this.broadcast(this.txt(b, 'message', 'message1')); break;
      case 'event_broadcastandwait': this.broadcast(this.txt(b, 'message', 'message1')); await sleep(20); break;
      case 'looks_show': target.visible = true; break;
      case 'looks_hide': target.visible = false; break;
      case 'looks_nextcostume': target.costumeIndex = (target.costumeIndex + 1) % target.costumes.length; break;
      case 'looks_changesizeby': target.size += this.arg(b, 'v', 10); break;
      case 'looks_setsizeto': target.size = this.arg(b, 'v', 100); break;
      case 'data_setvariableto': {
        const key = 'score';
        p.variables[key] = Number(this.txt(b, 'value', '0'));
        break;
      }
      case 'data_changevariableby': {
        const key = 'score';
        p.variables[key] = (Number(p.variables[key]) || 0) + 1;
        break;
      }
      case 'sensing_resettimer': this.startMs = performance.now(); break;
      default:
        break;
    }
  }

  evaluateCondition(target, block) {
    return this.stage.mouse.down || Math.abs(target.x) > 200;
  }

  sensingValue(op) {
    if (op === 'timer') return (performance.now() - this.startMs) / 1000;
    return 0;
  }
}
