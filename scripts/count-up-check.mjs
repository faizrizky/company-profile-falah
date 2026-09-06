// Self-check for the scramble/count-up algorithm.
// Keep the simulate() core in sync with tick() in components/ui/count-up.tsx.

const SCRAMBLE_SHARE = 0.7;
const RANDOM_STEP = 50;
const DURATION = 1100;
const FRAME = 16;

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function simulate({ value, prefix = "", suffix = "" }, rand) {
  const s = String(value);
  const i = s.indexOf(".");
  const decimals = i === -1 ? 0 : s.length - i - 1;
  const finalText = `${prefix}${value.toFixed(decimals)}${suffix}`;
  const shown = [];
  let lastRandom = 0;
  let t = 0;
  for (;;) {
    const now = 1000 + t;
    if (now - 1000 >= DURATION) {
      shown.push(finalText);
      break;
    }
    const k = (now - 1000) / DURATION;
    const chance = k < SCRAMBLE_SHARE ? 1 : (1 - k) / (1 - SCRAMBLE_SHARE);
    if (rand() < chance) {
      if (now - lastRandom >= RANDOM_STEP) {
        lastRandom = now;
        shown.push(
          `${prefix}${(rand() * Math.max(value, 99)).toFixed(decimals)}${suffix}`,
        );
      }
    } else {
      shown.push(finalText);
    }
    t += FRAME;
  }
  return { shown, finalText };
}

const cases = [
  { value: 50, suffix: "+", final: "50+" },
  { value: 10, suffix: "K+ Hour", final: "10K+ Hour" },
  { value: 99.4, suffix: "%", final: "99.4%", decimals: 1 },
  { value: 0, suffix: "", final: "0" },
];

let failures = 0;
for (const c of cases) {
  let sawRandom = false;
  for (let seed = 1; seed <= 20; seed++) {
    const { shown, finalText } = simulate(c, mulberry32(seed));
    if (finalText !== c.final) {
      console.error(`FAIL seed=${seed} finalText ${finalText} !== ${c.final}`);
      failures++;
    }
    if (shown[shown.length - 1] !== c.final) {
      console.error(`FAIL seed=${seed} last shown ${shown[shown.length - 1]} !== ${c.final}`);
      failures++;
    }
    if (shown.some((v) => v !== c.final)) sawRandom = true;
    for (const v of shown) {
      const p = (c.prefix ?? "").replace("+", "\\+");
      const num = v.replace(new RegExp(`^${p}`), "").replace(c.suffix, "");
      const n = Number(num);
      if (Number.isNaN(n) || n < 0 || n > Math.max(c.value, 99) + 1e-9) {
        console.error(`FAIL seed=${seed} out of range: ${v}`);
        failures++;
      }
      if (c.decimals !== undefined && !new RegExp(`^\\d+\\.\\d{${c.decimals}}$`).test(num)) {
        console.error(`FAIL seed=${seed} decimal mismatch: ${v}`);
        failures++;
      }
    }
  }
  if (!sawRandom) {
    console.error(`FAIL ${c.final}: no random values ever shown`);
    failures++;
  }
}

if (failures > 0) {
  console.error(`${failures} failure(s)`);
  process.exit(1);
}
console.log("count-up check: OK (4 cases x 20 seeds, exact final lock, range & decimals verified)");
