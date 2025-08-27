export function addNoIndex() {
  const meta = document.createElement("meta");
  meta.name = "robots";
  meta.content = "noindex";
  document.getElementsByTagName("head")[0].appendChild(meta);
}
export function removeNoIndex() {
  const metas = document.getElementsByTagName("meta");
  for (let i = metas.length - 1; i >= 0; i--) {
    if (metas[i].name === "robots" && metas[i].content === "noindex") {
      metas[i].parentNode?.removeChild(metas[i]);
    }
  }
}
