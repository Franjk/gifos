let link =
  "https://media0.giphy.com/media/26xBwdIuRJiAIqHwA/giphy.mp4?cid=e9eef115hrxw8wgy11lfntuldltoergfxn0355ppm60wec4p&rid=giphy.mp4&ct=g";
console.log("intentando descargar", link);

let link2 = "https://i.giphy.com/media/26xBwdIuRJiAIqHwA/giphy.mp4";

function download(url) {
  const a = document.createElement("a");
  a.href = url;
  a.download = url.split("/").pop();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
