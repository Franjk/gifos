const btnDownload = document.querySelector("#btn-download");
let link =
  "https://media0.giphy.com/media/26xBwdIuRJiAIqHwA/giphy.mp4?cid=e9eef115hrxw8wgy11lfntuldltoergfxn0355ppm60wec4p&rid=giphy.mp4&ct=g";
console.log("intentando descargar", link);

let link2 = "https://i.giphy.com/media/26xBwdIuRJiAIqHwA/giphy.mp4";

const link3 =
  "https://media2.giphy.com/media/Rlxfht52POeHMUrner/giphy.gif?cid=e9eef11545a25745fb72a6bc9ae5f68591d367b9bed640ae&rid=giphy.gif&ct=g";

const mp4 =
  "https://media2.giphy.com/media/Rlxfht52POeHMUrner/giphy.mp4?cid=e9eef11545a25745fb72a6bc9ae5f68591d367b9bed640ae&rid=giphy.mp4&ct=g";

function downloadBlob(blob, name = "file.txt") {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  // Remove link from body
  document.body.removeChild(link);
}

const handleBtnDownload = async function () {
  // Usage
  // let jsonBlob = new Blob(['{"name": "test"}']);
  // downloadBlob(jsonBlob, "myfile.json");
  console.log("click");

  let blob = await fetch(link3).then((res) => res.blob());
  downloadBlob(blob, "file2.gif");
};

async function downloadImage() {
  const imageSrc = link3;
  const image = await fetch(imageSrc);
  const imageBlog = await image.blob();
  const imageURL = URL.createObjectURL(imageBlog);

  const link = document.createElement("a");
  link.href = imageURL;
  link.download = "image file name here.mp4";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

btnDownload.addEventListener("click", downloadImage);
