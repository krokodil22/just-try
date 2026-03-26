export class StageRenderer {
  constructor(canvas, getProject) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.getProject = getProject;
    this.mouse = { x: 0, y: 0, down: false };
    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      const px = (e.clientX - r.left) * (canvas.width / r.width);
      const py = (e.clientY - r.top) * (canvas.height / r.height);
      this.mouse.x = Math.round(px - 240);
      this.mouse.y = Math.round(180 - py);
    });
    canvas.addEventListener('mousedown', () => this.mouse.down = true);
    canvas.addEventListener('mouseup', () => this.mouse.down = false);
    requestAnimationFrame(() => this.drawLoop());
  }

  spriteHit(sprite, x, y) {
    const w = 48 * (sprite.size / 100), h = 48 * (sprite.size / 100);
    return x >= sprite.x - w/2 && x <= sprite.x + w/2 && y >= sprite.y - h/2 && y <= sprite.y + h/2;
  }

  drawLoop() {
    const { ctx, canvas } = this;
    const project = this.getProject();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const sprite of project.sprites.filter(s => s.visible !== false)) {
      const c = sprite.costumes[sprite.costumeIndex] || sprite.costumes[0];
      const size = 48 * (sprite.size / 100);
      const x = 240 + sprite.x;
      const y = 180 - sprite.y;
      if (c?.src) {
        const img = new Image();
        img.src = c.src;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((90 - sprite.direction) * Math.PI / 180);
        ctx.drawImage(img, -size/2, -size/2, size, size);
        ctx.restore();
      } else {
        ctx.fillStyle = '#4c97ff';
        ctx.fillRect(x - size/2, y - size/2, size, size);
      }
    }

    requestAnimationFrame(() => this.drawLoop());
  }
}
