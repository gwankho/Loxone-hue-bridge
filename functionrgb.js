// Function: temp + hsv support, off bij brightness = 0
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
function toNum(x) {
  x = ('' + x).replace(',', '.');
  const n = parseFloat(x);
  return isFinite(n) ? n : NaN;
}
// HSV → RGB helper
function hsv2rgb(h, s, v) {
  s /= 100;
  v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  const R = Math.round((r + m) * 255);
  const G = Math.round((g + m) * 255);
  const B = Math.round((b + m) * 255);
  return [R, G, B];
}

// Input als string
let inp = ('' + msg.payload).trim();
let out = {};

// ——— temp(brightness, kelvin) ———
let mTMP = inp.match(/^temp\(\s*([0-9.,]+)\s*[,;]\s*([0-9.,]+)\s*\)$/i);
if (mTMP) {
  let bri = toNum(mTMP[1]);
  let kelvin = toNum(mTMP[2]);
  if (!isFinite(bri) || !isFinite(kelvin)) {
    node.warn("temp parse failed: " + inp);
    return null;
  }
  // Bij brightness = 0 → uit
  if (bri <= 0) {
    msg.payload = { on: false };
    return msg;
  }
  bri = clamp(bri, 0, 100);
  let mired = Math.round(1000000 / kelvin);
  mired = clamp(mired, 153, 500);
  out.on = true;
  out.brightness = bri;
  out.colorTemp = mired;
  msg.payload = out;
  msg.topic = msg.topic || "setLightState";
  return msg;
}

// ——— hsv(h, s, v) ———
let mHSV = inp.match(/^hsv\(\s*([0-9.,]+)\s*[,;]\s*([0-9.,]+)\s*[,;]\s*([0-9.,]+)\s*\)$/i);
if (mHSV) {
  let h = toNum(mHSV[1]);
  let s = toNum(mHSV[2]);
  let v = toNum(mHSV[3]);
  if (!isFinite(h) || !isFinite(s) || !isFinite(v)) {
    node.warn("hsv parse failed: " + inp);
    return null;
  }
  if (v <= 0) {
    msg.payload = { on: false };
    return msg;
  }
  // Als v in 0–1 schaal zit
  if (v <= 1) v = v * 100;
  v = clamp(v, 0, 100);
  const rgb = hsv2rgb(h, s, v);
  out.on = true;
  out.brightness = v;
  out.rgb = rgb;
  // Optioneel: voeg hex toe
  let hex = `#${((1 << 24) | (rgb[0] << 16) | (rgb[1] << 8) | rgb[2]).toString(16).slice(1)}`;
  out.hex = hex;
  msg.payload = out;
  msg.topic = msg.topic || "setLightState";
  return msg;
}

// ——— fallback: onbekend formaat ———
node.warn("Invalid input format: " + inp);
return null;
