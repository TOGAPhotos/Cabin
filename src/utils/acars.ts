const worker = new SharedWorker("./acars-proxy.js");

export function uploadFetchLog(p: PerformanceResourceTiming | undefined) {
  if (!p) return;
  console.log(p);
  const domainLookup = (p.domainLookupEnd - p.domainLookupStart).toFixed(0);
  const TCPHandshake = (p.connectEnd - p.connectStart).toFixed(0);
  const ttfb = (p.responseStart - p.requestStart).toFixed(0);
  const total = p.duration.toFixed(0);
  const log = {
    level: "warn",
    related_url: p.name,
    message: JSON.stringify({
      domainLookup,
      TCPHandshake,
      ttfb,
      total,
    }),
    timestamp: new Date().toISOString(),
  };
  worker.port.postMessage({
    type: "log",
    payload: log,
  });
}

export function uploadReqErrorLog(url: string, code: number, msg: string) {
  worker.port.postMessage({
    type: "log",
    payload: {
      related_url: url,
      message: `Error Code: ${code}, Server Message: ${msg}`,
      timestamp: new Date().toISOString(),
      level: "error",
    },
  });
}
