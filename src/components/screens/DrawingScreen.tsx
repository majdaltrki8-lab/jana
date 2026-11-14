import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VirtualTeacher } from '../VirtualTeacher';
import { SpeakButton } from '../SpeakButton';
import { playSoundEffect, speakText, triggerConfetti } from '../../utils/audio';
import {
  Paintbrush,
  PaintBucket,
  Eraser,
  Undo2,
  Trash2,
  Save,
  ArrowRight,
  Download,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

interface DrawingScreenProps {
  onAddStars: (amount: number) => void;
  onCompleteLesson: (lessonId: string) => void;
  onBack: () => void;
}

type TemplateId = 'butterfly' | 'flower' | 'house' | 'sun' | 'fish' | 'free';
type ToolMode = 'fill' | 'brush' | 'eraser';

interface SavedDrawing {
  id: string;
  templateId: TemplateId;
  title: string;
  dataUrl: string;
  createdAt: string;
}

const STORAGE_KEY = 'jana_saved_drawings';
const CANVAS_W = 600;
const CANVAS_H = 450;

const COLOR_PALETTE = [
  { name: 'أحمر', hex: '#ef4444' },
  { name: 'برتقالي', hex: '#f97316' },
  { name: 'أصفر', hex: '#facc15' },
  { name: 'أخضر', hex: '#22c55e' },
  { name: 'سماوي', hex: '#06b6d4' },
  { name: 'أزرق', hex: '#3b82f6' },
  { name: 'بنفسجي', hex: '#a855f7' },
  { name: 'وردي', hex: '#ec4899' },
  { name: 'بني', hex: '#92400e' },
  { name: 'أسود', hex: '#1e293b' },
  { name: 'أبيض', hex: '#ffffff' },
];

const TEMPLATES: Array<{ id: TemplateId; title: string; emoji: string }> = [
  { id: 'butterfly', title: 'فراشة جميلة', emoji: '🦋' },
  { id: 'flower', title: 'زهرة مبتسمة', emoji: '🌸' },
  { id: 'house', title: 'بيت جنى', emoji: '🏠' },
  { id: 'sun', title: 'شمس وسحابة', emoji: '☀️' },
  { id: 'fish', title: 'سمكة في البحر', emoji: '🐟' },
  { id: 'free', title: 'رسم حر', emoji: '🎨' },
];

function drawTemplateOutline(ctx: CanvasRenderingContext2D, templateId: TemplateId) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  if (templateId === 'free') return;

  ctx.save();
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (templateId === 'butterfly') {
    // Upper wings
    ctx.beginPath();
    ctx.ellipse(205, 165, 110, 82, -0.35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(395, 165, 110, 82, 0.35, 0, Math.PI * 2);
    ctx.stroke();
    // Lower wings
    ctx.beginPath();
    ctx.ellipse(225, 290, 85, 72, 0.35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(375, 290, 85, 72, -0.35, 0, Math.PI * 2);
    ctx.stroke();
    // Wing circles
    ctx.beginPath();
    ctx.arc(190, 155, 28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(410, 155, 28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(218, 295, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(382, 295, 22, 0, Math.PI * 2);
    ctx.stroke();
    // Body (fill interior white on outline layer? No, keep hollow stroke so it can be colored!)
    ctx.beginPath();
    ctx.ellipse(300, 235, 26, 105, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Head
    ctx.beginPath();
    ctx.arc(300, 112, 30, 0, Math.PI * 2);
    ctx.stroke();
    // Eyes & Smile
    ctx.beginPath();
    ctx.arc(290, 106, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(310, 106, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(300, 116, 12, 0.2, Math.PI - 0.2);
    ctx.stroke();
    // Antennae
    ctx.beginPath();
    ctx.moveTo(286, 86);
    ctx.quadraticCurveTo(255, 42, 240, 58);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(236, 62, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(314, 86);
    ctx.quadraticCurveTo(345, 42, 360, 58);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(364, 62, 8, 0, Math.PI * 2);
    ctx.stroke();
  } else if (templateId === 'flower') {
    // Pot
    ctx.beginPath();
    ctx.moveTo(230, 345);
    ctx.lineTo(370, 345);
    ctx.lineTo(350, 425);
    ctx.lineTo(250, 425);
    ctx.closePath();
    ctx.stroke();
    ctx.strokeRect(218, 322, 164, 23);
    // Stem
    ctx.strokeRect(292, 215, 16, 107);
    // Leaves
    ctx.beginPath();
    ctx.ellipse(246, 272, 46, 20, -0.35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(354, 258, 46, 20, 0.35, 0, Math.PI * 2);
    ctx.stroke();
    // Petals around center (6 clean closed petals)
    const cx = 300;
    const cy = 148;
    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI) / 3;
      const px = cx + Math.cos(ang) * 68;
      const py = cy + Math.sin(ang) * 68;
      ctx.beginPath();
      ctx.arc(px, py, 38, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Flower Center Circle
    ctx.beginPath();
    ctx.arc(cx, cy, 46, 0, Math.PI * 2);
    ctx.stroke();
    // Cute smiling face in center
    ctx.beginPath();
    ctx.arc(cx - 15, cy - 10, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 15, cy - 10, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy + 4, 18, 0.2, Math.PI - 0.2);
    ctx.stroke();
  } else if (templateId === 'house') {
    // Ground line
    ctx.beginPath();
    ctx.moveTo(40, 395);
    ctx.lineTo(560, 395);
    ctx.stroke();
    // House body
    ctx.strokeRect(160, 210, 280, 185);
    // Roof triangle
    ctx.beginPath();
    ctx.moveTo(130, 210);
    ctx.lineTo(300, 82);
    ctx.lineTo(470, 210);
    ctx.closePath();
    ctx.stroke();
    // Chimney
    ctx.strokeRect(375, 108, 36, 52);
    // Door
    ctx.beginPath();
    ctx.moveTo(265, 395);
    ctx.lineTo(265, 295);
    ctx.arc(300, 295, 35, Math.PI, 0);
    ctx.lineTo(335, 395);
    ctx.closePath();
    ctx.stroke();
    // Door knob
    ctx.beginPath();
    ctx.arc(322, 345, 5, 0, Math.PI * 2);
    ctx.stroke();
    // Windows
    ctx.strokeRect(190, 250, 55, 55);
    ctx.beginPath();
    ctx.moveTo(217, 250);
    ctx.lineTo(217, 305);
    ctx.moveTo(190, 277);
    ctx.lineTo(245, 277);
    ctx.stroke();

    ctx.strokeRect(355, 250, 55, 55);
    ctx.beginPath();
    ctx.moveTo(382, 250);
    ctx.lineTo(382, 305);
    ctx.moveTo(355, 277);
    ctx.lineTo(410, 277);
    ctx.stroke();
    // Sun in corner
    ctx.beginPath();
    ctx.arc(85, 85, 36, 0, Math.PI * 2);
    ctx.stroke();
  } else if (templateId === 'sun') {
    // Sun center
    const sx = 200;
    const sy = 160;
    ctx.beginPath();
    ctx.arc(sx, sy, 68, 0, Math.PI * 2);
    ctx.stroke();
    // Smiling face on Sun
    ctx.beginPath();
    ctx.arc(sx - 20, sy - 12, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(sx + 20, sy - 12, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(sx, sy + 6, 26, 0.2, Math.PI - 0.2);
    ctx.stroke();
    // Sun rays (triangular petals for easy coloring)
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const a1 = a - 0.16;
      const a2 = a + 0.16;
      ctx.beginPath();
      ctx.moveTo(sx + Math.cos(a1) * 76, sy + Math.sin(a1) * 76);
      ctx.lineTo(sx + Math.cos(a) * 116, sy + Math.sin(a) * 116);
      ctx.lineTo(sx + Math.cos(a2) * 76, sy + Math.sin(a2) * 76);
      ctx.closePath();
      ctx.stroke();
    }
    // Fluffy Cloud
    ctx.beginPath();
    ctx.moveTo(315, 325);
    ctx.bezierCurveTo(280, 325, 275, 270, 322, 264);
    ctx.bezierCurveTo(332, 212, 412, 208, 434, 250);
    ctx.bezierCurveTo(476, 238, 522, 275, 502, 315);
    ctx.bezierCurveTo(514, 338, 488, 355, 464, 352);
    ctx.lineTo(335, 352);
    ctx.bezierCurveTo(318, 352, 305, 338, 315, 325);
    ctx.closePath();
    ctx.stroke();
    // Raindrops
    for (const [rx, ry] of [
      [355, 385],
      [405, 398],
      [455, 385],
    ]) {
      ctx.beginPath();
      ctx.moveTo(rx, ry - 18);
      ctx.quadraticCurveTo(rx + 18, ry + 8, rx, ry + 18);
      ctx.quadraticCurveTo(rx - 18, ry + 8, rx, ry - 18);
      ctx.closePath();
      ctx.stroke();
    }
  } else if (templateId === 'fish') {
    // Fish Body
    ctx.beginPath();
    ctx.ellipse(275, 225, 138, 86, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Tail fin
    ctx.beginPath();
    ctx.moveTo(410, 225);
    ctx.lineTo(505, 148);
    ctx.quadraticCurveTo(480, 225, 505, 302);
    ctx.closePath();
    ctx.stroke();
    // Top fin
    ctx.beginPath();
    ctx.moveTo(235, 142);
    ctx.quadraticCurveTo(285, 78, 335, 146);
    ctx.closePath();
    ctx.stroke();
    // Bottom fin
    ctx.beginPath();
    ctx.moveTo(255, 308);
    ctx.quadraticCurveTo(290, 358, 325, 304);
    ctx.closePath();
    ctx.stroke();
    // Face divider curve
    ctx.beginPath();
    ctx.arc(235, 225, 86, 0.72 * Math.PI, 1.28 * Math.PI);
    ctx.stroke();
    // Eye
    ctx.beginPath();
    ctx.arc(185, 200, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(182, 198, 6, 0, Math.PI * 2);
    ctx.stroke();
    // Smile
    ctx.beginPath();
    ctx.arc(172, 232, 16, 0.2, Math.PI * 0.75);
    ctx.stroke();
    // Stripes on body
    ctx.beginPath();
    ctx.arc(295, 225, 80, -0.45 * Math.PI, 0.45 * Math.PI);
    ctx.stroke();
    // Water bubbles
    for (const [bx, by, br] of [
      [112, 155, 16],
      [92, 112, 11],
      [124, 82, 8],
    ]) {
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function hexToRgba(hex: string): [number, number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return [r, g, b, 255];
}

export const DrawingScreen: React.FC<DrawingScreenProps> = ({
  onAddStars,
  onCompleteLesson,
  onBack,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('butterfly');
  const [selectedColor, setSelectedColor] = useState<string>('#ec4899');
  const [toolMode, setToolMode] = useState<ToolMode>('fill');
  const [brushSize, setBrushSize] = useState<number>(14);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [savedDrawings, setSavedDrawings] = useState<SavedDrawing[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedDrawing[]) : [];
    } catch {
      return [];
    }
  });

  const paintCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const outlineCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const historyRef = useRef<ImageData[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  const pushHistorySnapshot = useCallback(() => {
    const paintCanvas = paintCanvasRef.current;
    if (!paintCanvas) return;
    const ctx = paintCanvas.getContext('2d');
    if (!ctx) return;
    const snap = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
    historyRef.current = [...historyRef.current.slice(-11), snap];
    setCanUndo(historyRef.current.length > 0);
  }, []);

  const initWhiteCanvas = useCallback(() => {
    const paintCanvas = paintCanvasRef.current;
    if (!paintCanvas) return;
    const ctx = paintCanvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    historyRef.current = [];
    setCanUndo(false);
  }, []);

  useEffect(() => {
    initWhiteCanvas();
  }, [initWhiteCanvas]);

  useEffect(() => {
    const outlineCanvas = outlineCanvasRef.current;
    if (!outlineCanvas) return;
    const ctx = outlineCanvas.getContext('2d');
    if (!ctx) return;
    drawTemplateOutline(ctx, selectedTemplate);
  }, [selectedTemplate]);

  const getCanvasPoint = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = outlineCanvasRef.current || paintCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const touch = 'touches' in e ? e.touches[0] : null;
    const clientX = touch ? touch.clientX : 'clientX' in e ? e.clientX : 0;
    const clientY = touch ? touch.clientY : 'clientY' in e ? e.clientY : 0;
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    return {
      x: Math.round((clientX - rect.left) * scaleX),
      y: Math.round((clientY - rect.top) * scaleY),
    };
  };

  // Offline flood fill bounded by outline lines and painted color boundaries
  const performFloodFill = (startX: number, startY: number, fillHex: string) => {
    const paintCanvas = paintCanvasRef.current;
    const outlineCanvas = outlineCanvasRef.current;
    if (!paintCanvas || !outlineCanvas) return;
    const pCtx = paintCanvas.getContext('2d');
    const oCtx = outlineCanvas.getContext('2d');
    if (!pCtx || !oCtx) return;

    const sx = Math.max(0, Math.min(CANVAS_W - 1, startX));
    const sy = Math.max(0, Math.min(CANVAS_H - 1, startY));

    const oData = oCtx.getImageData(0, 0, CANVAS_W, CANVAS_H).data;
    // Do not flood-fill starting directly on a dark outline stroke
    const startIdx = (sy * CANVAS_W + sx) * 4;
    if (oData[startIdx + 3] > 120) return;

    const pImg = pCtx.getImageData(0, 0, CANVAS_W, CANVAS_H);
    const pData = pImg.data;

    const targetR = pData[startIdx];
    const targetG = pData[startIdx + 1];
    const targetB = pData[startIdx + 2];
    const [fillR, fillG, fillB, fillA] = hexToRgba(fillHex);

    if (
      Math.abs(targetR - fillR) < 8 &&
      Math.abs(targetG - fillG) < 8 &&
      Math.abs(targetB - fillB) < 8
    ) {
      return;
    }

    pushHistorySnapshot();

    const visited = new Uint8Array(CANVAS_W * CANVAS_H);
    const stack: number[] = [sx, sy];
    const tol = 38;

    while (stack.length > 0) {
      const y = stack.pop()!;
      const x = stack.pop()!;
      const pos = y * CANVAS_W + x;
      if (visited[pos]) continue;

      const idx = pos * 4;
      // Stop at black template outline pixels
      if (oData[idx + 3] > 110) continue;

      const dr = Math.abs(pData[idx] - targetR);
      const dg = Math.abs(pData[idx + 1] - targetG);
      const db = Math.abs(pData[idx + 2] - targetB);
      if (dr > tol || dg > tol || db > tol) continue;

      visited[pos] = 1;
      pData[idx] = fillR;
      pData[idx + 1] = fillG;
      pData[idx + 2] = fillB;
      pData[idx + 3] = fillA;

      if (x > 0) stack.push(x - 1, y);
      if (x < CANVAS_W - 1) stack.push(x + 1, y);
      if (y > 0) stack.push(x, y - 1);
      if (y < CANVAS_H - 1) stack.push(x, y + 1);
    }

    pCtx.putImageData(pImg, 0, 0);
    playSoundEffect.pop();
  };

  const handlePointerDown = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const pt = getCanvasPoint(e);
    if (toolMode === 'fill') {
      performFloodFill(pt.x, pt.y, selectedColor);
      return;
    }

    pushHistorySnapshot();
    isDrawingRef.current = true;
    const pCtx = paintCanvasRef.current?.getContext('2d');
    if (!pCtx) return;

    pCtx.beginPath();
    pCtx.moveTo(pt.x, pt.y);
    pCtx.lineTo(pt.x + 0.01, pt.y + 0.01);
    pCtx.strokeStyle = toolMode === 'eraser' ? '#ffffff' : selectedColor;
    pCtx.lineWidth = brushSize;
    pCtx.lineCap = 'round';
    pCtx.lineJoin = 'round';
    pCtx.stroke();
  };

  const handlePointerMove = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawingRef.current || toolMode === 'fill') return;
    const pt = getCanvasPoint(e);
    const pCtx = paintCanvasRef.current?.getContext('2d');
    if (!pCtx) return;
    pCtx.lineTo(pt.x, pt.y);
    pCtx.stroke();
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const handleUndo = () => {
    if (historyRef.current.length === 0) return;
    playSoundEffect.click();
    const pCtx = paintCanvasRef.current?.getContext('2d');
    if (!pCtx) return;
    const prev = historyRef.current[historyRef.current.length - 1];
    historyRef.current = historyRef.current.slice(0, -1);
    pCtx.putImageData(prev, 0, 0);
    setCanUndo(historyRef.current.length > 0);
  };

  const handleClearCanvas = () => {
    playSoundEffect.click();
    pushHistorySnapshot();
    const pCtx = paintCanvasRef.current?.getContext('2d');
    if (!pCtx) return;
    pCtx.fillStyle = '#ffffff';
    pCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    speakText('تم مسح الألوان، يمكنكِ التلوين من جديد يا جنى!', 'ar');
  };

  const handleSelectTemplate = (tpl: (typeof TEMPLATES)[0]) => {
    playSoundEffect.click();
    setSelectedTemplate(tpl.id);
    initWhiteCanvas();
    speakText(`اخترتِ رسمة ${tpl.title}. اختاري الألوان الجميلة وابدئي بالتلوين!`, 'ar');
  };

  const handleSaveDrawing = () => {
    const paintCanvas = paintCanvasRef.current;
    const outlineCanvas = outlineCanvasRef.current;
    if (!paintCanvas || !outlineCanvas) return;

    const merged = document.createElement('canvas');
    merged.width = CANVAS_W;
    merged.height = CANVAS_H;
    const mCtx = merged.getContext('2d');
    if (!mCtx) return;

    mCtx.fillStyle = '#ffffff';
    mCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    mCtx.drawImage(paintCanvas, 0, 0);
    mCtx.drawImage(outlineCanvas, 0, 0);

    const dataUrl = merged.toDataURL('image/png');
    const tplObj = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];

    const newItem: SavedDrawing = {
      id: `draw_${Date.now()}`,
      templateId: selectedTemplate,
      title: tplObj.title,
      dataUrl,
      createdAt: new Date().toLocaleDateString('ar-YE'),
    };

    const next = [newItem, ...savedDrawings].slice(0, 12);
    setSavedDrawings(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota warning gracefully
    }

    playSoundEffect.fanfare();
    triggerConfetti();
    onAddStars(5);
    onCompleteLesson(`drawing_${selectedTemplate}`);
    setSaveMessage('تم حفظ لوحتكِ الجميلة محليًا يا جنى! ⭐ +5 نجوم');
    speakText('ممتازة يا جنى! تم حفظ لوحتكِ الرائعة بنجاح في معرضكِ الخاص!', 'ar');
    setTimeout(() => setSaveMessage(null), 3500);
  };

  const handleLoadSavedDrawing = (item: SavedDrawing) => {
    playSoundEffect.click();
    setSelectedTemplate(item.templateId);
    const img = new Image();
    img.onload = () => {
      const pCtx = paintCanvasRef.current?.getContext('2d');
      if (!pCtx) return;
      pCtx.fillStyle = '#ffffff';
      pCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      pCtx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
    };
    img.src = item.dataUrl;
    speakText(`تم فتح لوحة ${item.title} المحفوظة!`, 'ar');
  };

  const handleDeleteSaved = (id: string) => {
    playSoundEffect.click();
    const next = savedDrawings.filter((d) => d.id !== id);
    setSavedDrawings(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto space-y-3 select-none">
      {/* Top Back Button + Banner */}
      <div className="relative bg-gradient-to-r from-fuchsia-600 via-pink-500 to-amber-500 rounded-3xl p-3 text-white shadow-lg flex items-center justify-between border-2 border-amber-300">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow">
            🎨
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black tracking-wide text-white drop-shadow">
                الرسم والتلوين
              </h2>
              <SpeakButton
                text="قسم الرسم والتلوين: اختاري رسمة ولونيها واحفظي إبداعاتكِ بدون إنترنت"
                size="xs"
                className="bg-white/30 text-white"
              />
            </div>
            <p className="text-xs text-white/95 font-medium">ألوان زاهية ورسومات جميلة للأطفال</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 bg-white text-purple-950 hover:bg-amber-100 rounded-xl text-xs font-black flex items-center gap-1 shadow active:scale-95 transition cursor-pointer shrink-0"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>الرئيسية</span>
        </button>
      </div>

      <VirtualTeacher
        speechText="أهلاً بكِ في مرسم جنى الجميل! اختاري رسمة لتلوينها بدلو الألوان أو الفرشاة، ثم احفظي لوحتكِ لتكسبي نجوم الإبداع!"
        lang="ar"
        compact={true}
      />

      {/* Template Selector */}
      <div className="bg-white rounded-2xl p-3 border-2 border-fuchsia-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-purple-950">١. اختاري الرسمة للتلوين:</span>
          <SpeakButton text="اختاري الرسمة التي تحبين تلوينها يا جنى" size="xs" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleSelectTemplate(tpl)}
              className={`px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap flex items-center gap-1.5 border transition cursor-pointer active:scale-95 ${
                selectedTemplate === tpl.id
                  ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white border-amber-300 shadow-md'
                  : 'bg-fuchsia-50 text-purple-900 border-fuchsia-200 hover:bg-fuchsia-100'
              }`}
            >
              <span className="text-base">{tpl.emoji}</span>
              <span>{tpl.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Coloring Canvas Workspace */}
      <div className="bg-white rounded-3xl p-3 border-2 border-purple-300 shadow-lg space-y-3">
        {/* Stacked Canvases: Paint Layer below, Crisp Outline Layer above */}
        <div className="relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-purple-300 overflow-hidden bg-white shadow-inner">
          <canvas
            ref={paintCanvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
          <canvas
            ref={outlineCanvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
          />
        </div>

        {/* Color Palette */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-black text-purple-950">٢. اختاري اللون:</span>
            <span className="text-[11px] font-bold text-purple-600">
              اللون المختار: {COLOR_PALETTE.find((c) => c.hex === selectedColor)?.name || ''}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => {
                  playSoundEffect.click();
                  setSelectedColor(c.hex);
                  if (toolMode === 'eraser') setToolMode('brush');
                }}
                style={{ backgroundColor: c.hex }}
                aria-label={`لون ${c.name}`}
                title={c.name}
                className={`w-8 h-8 rounded-full border-2 transition cursor-pointer shadow-sm ${
                  selectedColor === c.hex && toolMode !== 'eraser'
                    ? 'border-purple-950 ring-2 ring-amber-400 scale-115 shadow-md'
                    : 'border-purple-200 hover:scale-105'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tools & Brush Sizes */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-purple-100">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                playSoundEffect.click();
                setToolMode('fill');
              }}
              className={`px-2.5 py-2 rounded-xl text-xs font-black flex items-center gap-1 transition cursor-pointer ${
                toolMode === 'fill'
                  ? 'bg-purple-700 text-white shadow'
                  : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
              }`}
            >
              <PaintBucket className="w-3.5 h-3.5" />
              <span>تعبئة</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSoundEffect.click();
                setToolMode('brush');
              }}
              className={`px-2.5 py-2 rounded-xl text-xs font-black flex items-center gap-1 transition cursor-pointer ${
                toolMode === 'brush'
                  ? 'bg-pink-600 text-white shadow'
                  : 'bg-pink-100 text-pink-900 hover:bg-pink-200'
              }`}
            >
              <Paintbrush className="w-3.5 h-3.5" />
              <span>فرشاة</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSoundEffect.click();
                setToolMode('eraser');
              }}
              className={`px-2.5 py-2 rounded-xl text-xs font-black flex items-center gap-1 transition cursor-pointer ${
                toolMode === 'eraser'
                  ? 'bg-amber-500 text-white shadow'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>ممحاة</span>
            </button>
          </div>

          {/* Brush Size selector when using Brush / Eraser */}
          {toolMode !== 'fill' && (
            <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-xl border border-purple-200">
              {[
                { label: 'صغير', size: 6 },
                { label: 'وسط', size: 14 },
                { label: 'كبير', size: 24 },
              ].map((s) => (
                <button
                  key={s.size}
                  type="button"
                  onClick={() => setBrushSize(s.size)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer ${
                    brushSize === s.size ? 'bg-purple-700 text-white' : 'text-purple-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions: Undo, Clear, Save */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            disabled={!canUndo}
            onClick={handleUndo}
            className="py-2.5 bg-purple-100 hover:bg-purple-200 disabled:opacity-40 text-purple-900 rounded-xl text-xs font-black flex items-center justify-center gap-1 active:scale-95 transition cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
            <span>تراجع</span>
          </button>

          <button
            type="button"
            onClick={handleClearCanvas}
            className="py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-black flex items-center justify-center gap-1 active:scale-95 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>مسح الكل</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDrawing}
            className="py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow active:scale-95 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>حفظ الرسمة</span>
          </button>
        </div>

        {saveMessage && (
          <div className="p-2.5 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}
      </div>

      {/* Saved Local Drawings Gallery */}
      <div className="bg-white rounded-3xl p-4 border-2 border-amber-300 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-black text-purple-950">
              معرض رسومات جنى المحفوظة ({savedDrawings.length})
            </h3>
          </div>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>

        {savedDrawings.length === 0 ? (
          <p className="text-xs text-purple-600 font-medium text-center py-3 bg-purple-50/60 rounded-2xl">
            لوني أي رسمة واضغطي على «حفظ الرسمة» لتظهر هنا على جهازكِ بدون إنترنت 🎨
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {savedDrawings.map((item) => (
              <div
                key={item.id}
                className="bg-purple-50/60 rounded-2xl p-2 border border-purple-200 flex flex-col gap-1.5"
              >
                <img
                  src={item.dataUrl}
                  alt={item.title}
                  onClick={() => handleLoadSavedDrawing(item)}
                  className="w-full aspect-[4/3] object-cover rounded-xl bg-white border border-purple-100 cursor-pointer hover:opacity-90 transition"
                />
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black text-purple-950 truncate">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-1">
                    <a
                      href={item.dataUrl}
                      download={`jana-${item.templateId}.png`}
                      className="p-1 bg-white text-emerald-700 rounded-lg border border-emerald-200 hover:bg-emerald-50"
                      title="تنزيل الصورة"
                    >
                      <Download className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeleteSaved(item.id)}
                      className="p-1 bg-white text-rose-600 rounded-lg border border-rose-200 hover:bg-rose-50 cursor-pointer"
                      title="حذف الرسمة"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
