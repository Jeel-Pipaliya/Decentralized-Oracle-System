const counters = document.querySelectorAll("[data-count]");

counters.forEach((counter) => {
  const target = Number(counter.dataset.count || 0);
  let current = 0;
  const step = Math.max(1, Math.floor(target / 40));

  const tick = () => {
    current = Math.min(target, current + step);
    counter.textContent = current;
    if (current < target) {
      requestAnimationFrame(tick);
    }
  };

  tick();
});

const nodeCards = document.querySelectorAll(".node-card");
const apiCards = document.querySelectorAll(".api-card");
const consensusTemp = document.getElementById("consensus-temp");
const consensusRain = document.getElementById("consensus-rain");
const consensusHumidity = document.getElementById("consensus-humidity");
const confidenceScore = document.getElementById("confidence-score");
const outlierCount = document.getElementById("outlier-count");
const lastAgg = document.getElementById("last-agg");
const confidenceBar = document.getElementById("confidence-bar");

const medianInputs = [
  {
    range: document.getElementById("node1-range"),
    label: document.getElementById("node1-value"),
  },
  {
    range: document.getElementById("node2-range"),
    label: document.getElementById("node2-value"),
  },
  {
    range: document.getElementById("node3-range"),
    label: document.getElementById("node3-value"),
  },
];
const medianSorted = document.getElementById("median-sorted");
const medianOutput = document.getElementById("median-output");

const lineNode1 = document.getElementById("line-node1");
const lineNode2 = document.getElementById("line-node2");
const lineNode3 = document.getElementById("line-node3");

const formatNumber = (value, suffix = "") => `${value}${suffix}`;
const randomOffset = (range) => Math.round((Math.random() - 0.5) * range * 2);

const updateNode = (card) => {
  const trust = card.querySelector("[data-trust]");
  const latency = card.querySelector("[data-latency]");
  const uptime = card.querySelector("[data-uptime]");
  const bar = card.querySelector(".bar");

  const baseTrust = Number(trust.dataset.trust || 80);
  const baseLatency = Number(latency.dataset.latency || 200);
  const baseUptime = Number(uptime.dataset.uptime || 95);

  const newTrust = Math.max(70, Math.min(98, baseTrust + randomOffset(4)));
  const newLatency = Math.max(150, Math.min(360, baseLatency + randomOffset(30)));
  const newUptime = Math.max(90, Math.min(100, baseUptime + randomOffset(2)));

  trust.textContent = formatNumber(newTrust);
  latency.textContent = formatNumber(newLatency, " ms");
  uptime.textContent = formatNumber(newUptime, "%");
  bar.style.width = `${newTrust}%`;
};

const updateConsensus = () => {
  const temp = (25 + Math.random() * 4).toFixed(1);
  const rain = (6 + Math.random() * 8).toFixed(1);
  const humidity = Math.round(55 + Math.random() * 25);

  if (consensusTemp) consensusTemp.textContent = temp;
  if (consensusRain) consensusRain.textContent = rain;
  if (consensusHumidity) consensusHumidity.textContent = `${humidity}%`;
};

const updateApiCards = () => {
  apiCards.forEach((card) => {
    const status = card.querySelector(".status");
    const latency = card.querySelector("[data-latency]");
    const requests = card.querySelector("[data-req]");
    const updated = card.querySelector("[data-updated]");

    const nextLatency = Math.max(160, Math.min(420, Number(latency.dataset.latency || 200) + randomOffset(40)));
    const nextRequests = Math.max(520, Math.min(1600, Number(requests.dataset.req || 800) + randomOffset(120)));
    const nextUpdated = Math.max(6, Math.min(60, Number(updated.dataset.updated || 20) + randomOffset(12)));

    const roll = Math.random();
    let state = "Healthy";
    let className = "status online";
    if (roll > 0.82 && roll <= 0.94) {
      state = "Delayed";
      className = "status warning";
    } else if (roll > 0.94) {
      state = "Down";
      className = "status danger";
    }

    status.textContent = state;
    status.className = className;
    latency.textContent = formatNumber(nextLatency, " ms");
    requests.textContent = `${nextRequests.toLocaleString()} / hr`;
    updated.textContent = `${nextUpdated} sec ago`;
  });
};

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

const updateMedianLab = () => {
  const values = medianInputs.map((item) => Number(item.range.value));
  medianInputs.forEach((item, index) => {
    item.label.textContent = `${values[index]} C`;
  });
  const sorted = [...values].sort((a, b) => a - b);
  if (medianSorted) medianSorted.textContent = sorted.join(", ");
  const output = median(values);
  if (medianOutput) medianOutput.textContent = `${output} C`;
};

const buildPath = (data, width, height, min = 70, max = 98) => {
  const step = width / (data.length - 1 || 1);
  return data
    .map((value, index) => {
      const x = index * step;
      const normalized = (value - min) / (max - min);
      const y = height - normalized * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
};

const history = {
  node1: Array.from({ length: 24 }, () => 88 + randomOffset(4)),
  node2: Array.from({ length: 24 }, () => 84 + randomOffset(4)),
  node3: Array.from({ length: 24 }, () => 76 + randomOffset(5)),
};

const updateChart = () => {
  history.node1.push(Math.max(72, Math.min(98, history.node1.at(-1) + randomOffset(3))));
  history.node2.push(Math.max(70, Math.min(96, history.node2.at(-1) + randomOffset(3))));
  history.node3.push(Math.max(68, Math.min(92, history.node3.at(-1) + randomOffset(4))));

  history.node1 = history.node1.slice(-24);
  history.node2 = history.node2.slice(-24);
  history.node3 = history.node3.slice(-24);

  if (lineNode1) lineNode1.setAttribute("d", buildPath(history.node1, 320, 140));
  if (lineNode2) lineNode2.setAttribute("d", buildPath(history.node2, 320, 140));
  if (lineNode3) lineNode3.setAttribute("d", buildPath(history.node3, 320, 140));
};

const updatePulse = () => {
  const confidence = Math.max(84, Math.min(99, 92 + randomOffset(4)));
  const outliers = Math.max(1, Math.min(6, 3 + randomOffset(2)));
  const seconds = Math.max(12, Math.min(60, 32 + randomOffset(10)));

  if (confidenceScore) confidenceScore.textContent = `${confidence}%`;
  if (outlierCount) outlierCount.textContent = outliers.toString();
  if (lastAgg) lastAgg.textContent = `${seconds} sec ago`;
  if (confidenceBar) confidenceBar.style.width = `${confidence}%`;
};

medianInputs.forEach((item) => {
  if (item.range) {
    item.range.addEventListener("input", updateMedianLab);
  }
});

updateMedianLab();
updateChart();
updatePulse();

setInterval(() => {
  nodeCards.forEach(updateNode);
  updateConsensus();
  updateApiCards();
  updateChart();
  updatePulse();
}, 3200);
