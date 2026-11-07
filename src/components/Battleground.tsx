import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useTheme } from '@/lib/theme';

export interface BattlegroundHandle {
  triggerDropship: () => void;
  triggerCrate: () => void;
}

interface Spark {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; streak: boolean;
}
interface Ember {
  x: number; y: number; vy: number; drift: number; size: number; phase: number;
}
interface Cloud {
  x: number; y: number; speed: number; w: number; h: number; opacity: number;
}
interface GrassBlade {
  x: number; phase: number; h: number;
}
interface RainDrop {
  x: number; y: number; speed: number; len: number;
}

interface SceneState {
  t: number;
  pointer: { x: number; y: number; tx: number; ty: number };
  sparks: Spark[];
  embers: Ember[];
  clouds: Cloud[];
  grass: GrassBlade[];
  drops: RainDrop[];
  dropship: { x: number; active: boolean; done: boolean };
  crate: { y: number; x: number; vy: number; active: boolean; sway: number };
}

const Battleground = forwardRef<BattlegroundHandle>(function Battleground(_props, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const stateRef = useRef<SceneState | null>(null);

  useImperativeHandle(ref, () => ({
    triggerDropship: () => {
      const s = stateRef.current;
      if (s) { s.dropship.active = true; s.dropship.x = -260; s.dropship.done = false; }
    },
    triggerCrate: () => {
      const s = stateRef.current;
      if (s && !s.crate.active) {
        s.crate.active = true;
        s.crate.y = -120;
        s.crate.x = window.innerWidth * (0.55 + Math.random() * 0.25);
        s.crate.vy = 0;
        s.crate.sway = 0;
      }
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    const initScene = (): SceneState => {
      const embers: Ember[] = [];
      const emberCount = reduced ? 24 : 60;
      for (let i = 0; i < emberCount; i++) {
        embers.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vy: -(0.15 + Math.random() * 0.4),
          drift: Math.random() * 0.6 - 0.3,
          size: 0.8 + Math.random() * 2.2,
          phase: Math.random() * Math.PI * 2,
        });
      }
      const clouds: Cloud[] = [];
      const cloudCount = reduced ? 2 : 4;
      for (let i = 0; i < cloudCount; i++) {
        clouds.push({
          x: Math.random() * W,
          y: 40 + Math.random() * (H * 0.3),
          speed: 0.15 + Math.random() * 0.25,
          w: 220 + Math.random() * 260,
          h: 50 + Math.random() * 30,
          opacity: 0.35 + Math.random() * 0.3,
        });
      }
      const grass: GrassBlade[] = [];
      const grassCount = Math.floor(W / 14);
      for (let i = 0; i < grassCount; i++) {
        grass.push({ x: i * 14 + Math.random() * 6, phase: Math.random() * Math.PI * 2, h: 12 + Math.random() * 22 });
      }
      const drops: RainDrop[] = [];
      const dropCount = reduced ? 0 : 30;
      for (let i = 0; i < dropCount; i++) {
        drops.push({ x: Math.random() * W, y: Math.random() * H, speed: 2 + Math.random() * 3, len: 6 + Math.random() * 8 });
      }
      return {
        t: 0,
        pointer: { x: 0, y: 0, tx: 0, ty: 0 },
        sparks: [],
        embers,
        clouds,
        grass,
        drops,
        dropship: { x: -200, active: true, done: false },
        crate: { y: -120, x: W * 0.7, vy: 0, active: false, sway: 0 },
      };
    };

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stateRef.current = initScene();
    };
    resize();
    window.addEventListener('resize', resize);

    const onPointer = (e: PointerEvent) => {
      const s = stateRef.current;
      if (!s) return;
      s.pointer.tx = (e.clientX / W - 0.5) * 2;
      s.pointer.ty = (e.clientY / H - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointer);

    const spawnSpark = (streak: boolean) => {
      const s = stateRef.current!;
      s.sparks.push({
        x: streak ? -40 : Math.random() * W,
        y: streak ? H * (0.2 + Math.random() * 0.5) : H * (0.55 + Math.random() * 0.4),
        vx: streak ? 9 + Math.random() * 6 : (Math.random() * 2 - 1) * 1.5,
        vy: streak ? -1 - Math.random() * 1.5 : -(1 + Math.random() * 2.5),
        life: 0,
        maxLife: streak ? 60 : 80 + Math.random() * 60,
        size: streak ? 2 + Math.random() * 2 : 1 + Math.random() * 1.8,
        streak,
      });
    };

    let sparkTimer = 0;
    let streakTimer = 180;

    const drawSky = (th: 'dark' | 'light') => {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      if (th === 'dark') {
        g.addColorStop(0, '#070b16');
        g.addColorStop(0.5, '#141d33');
        g.addColorStop(0.85, '#2a1c12');
        g.addColorStop(1, '#1a1408');
      } else {
        g.addColorStop(0, '#cfe6f2');
        g.addColorStop(0.45, '#f3e2c4');
        g.addColorStop(0.85, '#f6d49a');
        g.addColorStop(1, '#d9bf8e');
      }
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      const sx = W * 0.72, sy = H * 0.32;
      const sun = ctx.createRadialGradient(sx, sy, 0, sx, sy, H * 0.6);
      if (th === 'dark') {
        sun.addColorStop(0, 'rgba(255,140,60,0.28)');
        sun.addColorStop(0.4, 'rgba(255,90,40,0.10)');
        sun.addColorStop(1, 'rgba(0,0,0,0)');
      } else {
        sun.addColorStop(0, 'rgba(255,210,120,0.55)');
        sun.addColorStop(0.4, 'rgba(255,180,90,0.18)');
        sun.addColorStop(1, 'rgba(255,200,120,0)');
      }
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, W, H);

      ctx.beginPath();
      ctx.arc(sx, sy, th === 'dark' ? 28 : 40, 0, Math.PI * 2);
      ctx.fillStyle = th === 'dark' ? 'rgba(255,180,120,0.5)' : 'rgba(255,235,170,0.85)';
      ctx.fill();
    };

    const drawMountains = (th: 'dark' | 'light', px: number) => {
      const groundY = H * 0.78;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      const farPts = 8;
      for (let i = 0; i <= farPts; i++) {
        const x = (i / farPts) * W + px * 0.5;
        const y = groundY - 70 - Math.sin(i * 1.7) * 40 - Math.cos(i * 0.8) * 30;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.fillStyle = th === 'dark' ? '#0c1322' : '#c9b48a';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, groundY);
      for (let i = 0; i <= farPts; i++) {
        const x = (i / farPts) * W + px * 1.2;
        const y = groundY - 30 - Math.sin(i * 2.3 + 1) * 28 - Math.cos(i * 1.2) * 18;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.fillStyle = th === 'dark' ? '#080d18' : '#bda072';
      ctx.fill();
    };

    const drawClouds = (th: 'dark' | 'light') => {
      const s = stateRef.current!;
      for (const c of s.clouds) {
        const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.w / 2);
        const col = th === 'dark' ? `rgba(22,30,48,${c.opacity})` : `rgba(255,248,230,${c.opacity})`;
        g.addColorStop(0, col);
        g.addColorStop(1, th === 'dark' ? 'rgba(22,30,48,0)' : 'rgba(255,248,230,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        if (!reduced) {
          c.x += c.speed;
          if (c.x - c.w / 2 > W) c.x = -c.w / 2;
        }
      }
    };

    const drawSmoke = (th: 'dark' | 'light', t: number) => {
      const groundY = H * 0.82;
      for (let i = 0; i < 3; i++) {
        const cx = (W * (0.2 + i * 0.3) + Math.sin(t * 0.0003 + i) * 40);
        const cy = groundY + Math.cos(t * 0.0004 + i) * 20;
        const r = 120 + i * 40;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const col = th === 'dark' ? `rgba(30,22,14,0.4)` : `rgba(225,205,165,0.45)`;
        g.addColorStop(0, col);
        g.addColorStop(1, th === 'dark' ? 'rgba(30,22,14,0)' : 'rgba(225,205,165,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawGround = (th: 'dark' | 'light') => {
      const groundY = H * 0.82;
      const g = ctx.createLinearGradient(0, groundY, 0, H);
      if (th === 'dark') {
        g.addColorStop(0, '#1a1408');
        g.addColorStop(1, '#0a0804');
      } else {
        g.addColorStop(0, '#d9bf8e');
        g.addColorStop(1, '#c2a570');
      }
      ctx.fillStyle = g;
      ctx.fillRect(0, groundY, W, H - groundY);
    };

    const drawGrass = (th: 'dark' | 'light', t: number) => {
      const s = stateRef.current!;
      const groundY = H * 0.82;
      ctx.strokeStyle = th === 'dark' ? 'rgba(40,60,30,0.7)' : 'rgba(140,160,70,0.8)';
      ctx.lineWidth = 1.4;
      for (const blade of s.grass) {
        const sway = Math.sin(t * 0.002 + blade.phase) * 4;
        ctx.beginPath();
        ctx.moveTo(blade.x, groundY);
        ctx.quadraticCurveTo(blade.x + sway / 2, groundY - blade.h / 2, blade.x + sway, groundY - blade.h);
        ctx.stroke();
      }
    };

    const drawAvatar = (th: 'dark' | 'light', t: number, px: number) => {
      const baseX = W * 0.18 + px * 6;
      const baseY = H * 0.82;
      const bob = Math.sin(t * 0.002) * 2;
      ctx.save();
      ctx.translate(baseX, baseY + bob);

      ctx.beginPath();
      ctx.ellipse(0, 0, 26, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fill();

      ctx.fillStyle = th === 'dark' ? '#1a2030' : '#5a5448';
      ctx.fillRect(-12, -34, 9, 34);
      ctx.fillRect(3, -34, 9, 34);

      ctx.fillStyle = th === 'dark' ? '#283448' : '#6a6456';
      ctx.beginPath();
      ctx.moveTo(-16, -70);
      ctx.lineTo(16, -70);
      ctx.lineTo(13, -34);
      ctx.lineTo(-13, -34);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = th === 'dark' ? 'rgba(255,138,61,0.6)' : 'rgba(217,119,6,0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -68); ctx.lineTo(0, -38);
      ctx.stroke();

      ctx.fillStyle = th === 'dark' ? '#222a3a' : '#5a5448';
      ctx.fillRect(-22, -68, 8, 30);
      ctx.fillRect(14, -68, 8, 30);

      ctx.fillStyle = th === 'dark' ? '#2a3242' : '#6a6456';
      ctx.beginPath();
      ctx.arc(0, -78, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = th === 'dark' ? '#1a2030' : '#4a4438';
      ctx.fillRect(-11, -82, 22, 5);

      ctx.strokeStyle = th === 'dark' ? 'rgba(255,138,61,0.35)' : 'rgba(217,119,6,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, -55, 30, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    };

    let nextDropshipAt = 0;

    const drawDropship = (th: 'dark' | 'light') => {
      const s = stateRef.current!;
      if (!s.dropship.active) return;
      const y = H * 0.18;
      ctx.save();
      ctx.translate(s.dropship.x, y);
      ctx.fillStyle = th === 'dark' ? '#2a3142' : '#9aa6b8';
      ctx.beginPath();
      ctx.moveTo(-60, 0);
      ctx.lineTo(50, -10);
      ctx.lineTo(70, 6);
      ctx.lineTo(50, 16);
      ctx.lineTo(-60, 12);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = th === 'dark' ? 'rgba(255,160,80,0.8)' : 'rgba(220,150,60,0.8)';
      ctx.fillRect(40, -6, 14, 6);
      ctx.fillStyle = th === 'dark' ? '#1f2533' : '#8893a6';
      ctx.beginPath();
      ctx.moveTo(-50, 0); ctx.lineTo(-70, -18); ctx.lineTo(-40, 0); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgba(255,150,60,0.9)';
      ctx.fillRect(-64, 2, 6, 6);
      const g = ctx.createLinearGradient(-64, 5, -120, 5);
      g.addColorStop(0, th === 'dark' ? 'rgba(255,150,60,0.7)' : 'rgba(255,170,80,0.7)');
      g.addColorStop(1, 'rgba(255,150,60,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-64, 3); ctx.lineTo(-120, 8); ctx.lineTo(-120, 6); ctx.lineTo(-64, 8); ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Release one crate from the plane during every pass.
      if (!s.dropship.done && s.dropship.x > W * 0.56) {
        if (!s.crate.active) {
          s.crate.active = true;
          s.crate.x = s.dropship.x;
          s.crate.y = H * 0.18 + 55;
          s.crate.vy = 0;
          s.crate.sway = 0;
        }
        s.dropship.done = true;
      }

      s.dropship.x += 2.4;
      if (s.dropship.x > W + 260) {
        s.dropship.active = false;
        s.dropship.done = true;
        nextDropshipAt = performance.now() + 7000;
      }
    };

    const drawCrate = (th: 'dark' | 'light', t: number) => {
      const s = stateRef.current!;
      if (!s.crate.active) return;
      const x = s.crate.x + Math.sin(t * 0.0015) * 14;
      const y = s.crate.y;
      ctx.fillStyle = th === 'dark' ? 'rgba(220,90,60,0.85)' : 'rgba(200,80,50,0.9)';
      ctx.beginPath();
      ctx.moveTo(x - 34, y - 30);
      ctx.quadraticCurveTo(x, y - 78, x + 34, y - 30);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = th === 'dark' ? 'rgba(180,180,180,0.6)' : 'rgba(80,70,60,0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 30, y - 32); ctx.lineTo(x - 12, y);
      ctx.moveTo(x + 30, y - 32); ctx.lineTo(x + 12, y);
      ctx.stroke();
      ctx.fillStyle = th === 'dark' ? '#7a5320' : '#b8782a';
      ctx.fillRect(x - 14, y, 28, 24);
      ctx.strokeStyle = th === 'dark' ? '#5a3e18' : '#8a5a1c';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 14, y, 28, 24);
      ctx.beginPath();
      ctx.moveTo(x - 14, y + 12); ctx.lineTo(x + 14, y + 12);
      ctx.moveTo(x, y); ctx.lineTo(x, y + 24);
      ctx.stroke();

      s.crate.vy += 0.012;
      s.crate.y += s.crate.vy + 0.3;
      if (s.crate.y > H * 0.8) { s.crate.active = false; }
    };

    const drawEmbers = (th: 'dark' | 'light', t: number) => {
      const s = stateRef.current!;
      for (const e of s.embers) {
        e.y += e.vy;
        e.x += e.drift + Math.sin(t * 0.001 + e.phase) * 0.2;
        if (e.y < -10) { e.y = H + 10; e.x = Math.random() * W; }
        const flicker = 0.6 + Math.sin(t * 0.005 + e.phase) * 0.4;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = th === 'dark'
          ? `rgba(255,120,40,${0.5 * flicker})`
          : `rgba(230,150,40,${0.45 * flicker})`;
        ctx.fill();
      }
    };

    const drawRain = (th: 'dark' | 'light') => {
      const s = stateRef.current!;
      if (s.drops.length === 0) return;
      ctx.strokeStyle = th === 'dark' ? 'rgba(120,140,180,0.18)' : 'rgba(120,100,70,0.25)';
      ctx.lineWidth = 1;
      for (const d of s.drops) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.len);
        ctx.stroke();
        d.y += d.speed;
        if (d.y > H) { d.y = -d.len; d.x = Math.random() * W; }
      }
    };

    const drawSparks = (th: 'dark' | 'light') => {
      const s = stateRef.current!;
      for (let i = s.sparks.length - 1; i >= 0; i--) {
        const sp = s.sparks[i];
        sp.life++;
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.02;
        const alpha = 1 - sp.life / sp.maxLife;
        if (sp.streak) {
          ctx.strokeStyle = th === 'dark'
            ? `rgba(255,210,120,${alpha})`
            : `rgba(255,180,60,${alpha})`;
          ctx.lineWidth = sp.size;
          ctx.beginPath();
          ctx.moveTo(sp.x, sp.y);
          ctx.lineTo(sp.x - sp.vx * 4, sp.y - sp.vy * 4);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fillStyle = th === 'dark'
            ? `rgba(255,200,110,${alpha})`
            : `rgba(255,170,60,${alpha})`;
          ctx.fill();
        }
        if (sp.life >= sp.maxLife) s.sparks.splice(i, 1);
      }
    };

    let raf = 0;
    const render = (now: number) => {
      const s = stateRef.current!;
      const th = themeRef.current;
      s.t = now;
      s.pointer.x += (s.pointer.tx - s.pointer.x) * 0.06;
      s.pointer.y += (s.pointer.ty - s.pointer.y) * 0.06;
      const px = s.pointer.x;

      ctx.clearRect(0, 0, W, H);
      drawSky(th);
      drawClouds(th);
      drawMountains(th, px * 10);
      drawSmoke(th, now);
      drawGround(th);
      drawGrass(th, now);
      drawAvatar(th, now, px);
      drawCrate(th, now);

      // Start the next plane pass 10 seconds after the previous pass exits.
      if (!s.dropship.active && nextDropshipAt > 0 && now >= nextDropshipAt) {
        s.dropship.active = true;
        s.dropship.x = -260;
        s.dropship.done = false;
        nextDropshipAt = 0;
      }
      drawDropship(th);

      drawEmbers(th, now);
      drawRain(th);
      drawSparks(th);

      sparkTimer++;
      if (sparkTimer > 6) { sparkTimer = 0; spawnSpark(false); }
      streakTimer++;
      if (streakTimer > 360 + Math.random() * 240) {
        streakTimer = 0;
        spawnSpark(true);
      }

      raf = requestAnimationFrame(render);
    };

    if (reduced) {
      ctx.clearRect(0, 0, W, H);
      drawSky(themeRef.current);
      drawClouds(themeRef.current);
      drawMountains(themeRef.current, 0);
      drawSmoke(themeRef.current, 0);
      drawGround(themeRef.current);
      drawGrass(themeRef.current, 0);
      drawAvatar(themeRef.current, 0, 0);
      drawEmbers(themeRef.current, 0);
      drawSparks(themeRef.current);
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 h-full w-full" aria-hidden="true" />;
});

export default Battleground;

