import Gifo from "./classes/Gifo.js";
import Giphy from "./classes/Giphy.js";
import { initializeDarkMode } from "./shared/darkMode.js";

const STAGE = {
  INITIAL: "initial",
  GETTING_PERMISSION: "getting permissions",
  BEFORE_RECORDING: "before recording",
  RECORDING: "recording",
  RECORDING_IN_PROGRESS: "recording in progress",
  FINISHED_RECORDING: "after recording",
  UPLOADING: "uploading",
  FINISHED_UPLOADING: "finished uploading",
};

const RECORDER_CONFIG = {
  type: "gif",
  frameRate: 1,
  quality: 10,
  width: 360,
  hidden: 240,
  onGifRecordingStarted: function () {
    stage = STAGE.RECORDING_IN_PROGRESS;
    console.log("started");
  },
};

const ICON = {
  LOADER: "./assets/loader.svg",
  CHECK: "./assets/check.svg",
};

const TEXT = {
  UPLOADING: "Estamos subiendo tu GIFO",
  UPLOADING_SUCCESS: "GIFO subido con éxito",
};

const API_KEY = "w5DZnpvGHBZdjQuJDW8TfKjyAtngoYnt";

const actionButtonEl = document.querySelector("#action-button");
const step1El = document.querySelector("#step-1");
const step2El = document.querySelector("#step-2");
const step3El = document.querySelector("#step-3");
const descriptionContainerEl = document.querySelector("#description-container");
const screenTitleEl = document.querySelector("#screen-title");
const screenSubtitleEl = document.querySelector("#screen-subtitle");
const videoContainerEl = document.querySelector("#video-container");
const videoEl = document.querySelector("#video");
const imgGifEl = document.querySelector("#img-gif");
const timerEl = document.querySelector("#timer");
const repeatRecordingButtonEl = document.querySelector(
  "#repeat-recording-button"
);
const videoOverlayEl = document.querySelector("#video-overlay");
const videoStatusContainerEl = document.querySelector(
  "#video-status-container"
);
const videoStatusIconEl = document.querySelector("#video-status-icon");
const videoStatusDescriptionEl = document.querySelector(
  "#video-status-description"
);
const buttonDownloadEl = document.querySelector("#button-download");
const buttonLinkEl = document.querySelector("#button-link");
const videoStatusButtonGroupEl = document.querySelector(
  "#video-status-button-group"
);

const giphy = new Giphy(API_KEY);

let stage = STAGE.INITIAL;
let stream = null;
let recorder = null;
let blob = null;
let timer = null;
let secondsCounter = 0;
let uploadedGifo = null;

// DOM MANIPULATION

/**
 *
 * @param {HTMLElement} stepEl
 */
const activateStepEl = function (stepEl = null) {
  document
    .querySelectorAll(".pagination-button")
    .forEach((el) => el.classList.remove("active"));

  if (stepEl) stepEl.classList.add("active");
};

const hideElement = function (htmlElement) {
  htmlElement.classList.add("display-none");
};

const showElement = function (htmlElement) {
  htmlElement.classList.remove("display-none");
};

const hideVisibilityElement = function (htmlElement) {
  htmlElement.classList.add("visibility-hidden");
};

const showVisibilityElement = function (htmlElement) {
  htmlElement.classList.remove("visibility-hidden");
};

// RECORDING

const getStreamAndRecord = function () {
  const constraints = {
    audio: false,
    video: {
      height: { max: 480 },
    },
  };

  return navigator.mediaDevices.getUserMedia(constraints);
};

const stopStream = function () {
  stream.getTracks().forEach((track) => track.stop());
};

// TIMER
const startTimer = function () {
  timer = setInterval(() => {
    secondsCounter += 1;
    timerEl.textContent = parseTime(secondsCounter);
  }, 1000);
};

const stopTimer = function () {
  clearInterval(timer);
  secondsCounter = 0;
  timerEl.textContent = parseTime(secondsCounter);
};

const parseTime = function (time) {
  const hours = Math.floor(time / 3600);
  time %= 3600;
  const minutes = Math.floor(time / 60);
  time %= 60;
  const seconds = time;

  const strHours = ("00" + hours).substr(-2, 2);
  const strMinutes = ("00" + minutes).substr(-2, 2);
  const strSeconds = ("00" + seconds).substr(-2, 2);

  return `${strHours}:${strMinutes}:${strSeconds}`;
};

//  STAGES

//    INITIAL
const startInitialStage = function () {
  stage = STAGE.INITIAL;
  stream = null;
  recorder = null;
  blob = null;
  timer = null;

  activateStepEl(null);
  actionButtonEl.textContent = "COMENZAR";
  showVisibilityElement(actionButtonEl);
  hideElement(videoContainerEl);
  showElement(descriptionContainerEl);
  screenTitleEl.innerHTML = `
    Aquí podrás<br />crear tus propios
    <span class="text-secondary">GIFOS</span>
  `;

  screenSubtitleEl.innerHTML = `¡Crea tu GIFO en sólo 3 pasos!<br />
  sólo necesitas una cámara para grabar un video`;
};

//    GETTING_PERMISSIONS
const startGettingPermissionsStage = async function () {
  stage = STAGE.GETTING_PERMISSION;
  activateStepEl(step1El);
  hideVisibilityElement(actionButtonEl);

  hideElement(videoContainerEl);
  showElement(descriptionContainerEl);
  screenTitleEl.innerHTML = `¿Nos das acceso<br />a tu cámara?`;
  screenSubtitleEl.innerHTML = `El acceso a tu cámara será válido sólo<br />
  por el tiempo en el que estés creando el GIFO.`;

  try {
    stream = await getStreamAndRecord();
    startBeforeRecordingStage();
  } catch (err) {
    console.warn(err);
    alert(
      "La aplicacion necesita obtener permisos de la cámara para poder grabar el gifo."
    );
    startInitialStage();
  }
};

//    BEFORE_RECORDING
const startBeforeRecordingStage = function () {
  stage = STAGE.BEFORE_RECORDING;
  activateStepEl(step2El);

  actionButtonEl.textContent = "GRABAR";
  showVisibilityElement(actionButtonEl);
  hideElement(descriptionContainerEl);
  showElement(videoContainerEl);
  hideElement(timerEl);
  hideElement(repeatRecordingButtonEl);

  hideElement(imgGifEl);
  showElement(videoEl);

  videoEl.srcObject = stream;
  videoEl.play();
};

//    RECORDING
const startRecordingStage = function () {
  stage = STAGE.RECORDING;
  activateStepEl(step2El);

  actionButtonEl.textContent = "FINALIZAR";
  showVisibilityElement(actionButtonEl);
  hideElement(descriptionContainerEl);
  showElement(videoContainerEl);
  showElement(timerEl);

  recorder = RecordRTC(stream, RECORDER_CONFIG);
  recorder.startRecording();
  startTimer();
};

//    FINISHED RECORDING
const startFinishedRecordingStage = function () {
  stage = STAGE.FINISHED_RECORDING;
  activateStepEl(step2El);

  stopStream();

  actionButtonEl.textContent = "SUBIR GIFO";
  showVisibilityElement(actionButtonEl);
  hideElement(descriptionContainerEl);
  showElement(videoContainerEl);
  hideElement(timerEl);
  showElement(repeatRecordingButtonEl);

  recorder.stopRecording(() => {
    stopTimer();
    blob = recorder.getBlob();
    // invokeSaveAsDialog(blob);

    imgGifEl.src = URL.createObjectURL(blob);
    hideElement(videoEl);
    showElement(imgGifEl);
  });
};

//    UPLOADING
const startUploadingStage = async function () {
  stage = STAGE.UPLOADING;
  activateStepEl(step3El);

  videoStatusIconEl.setAttribute("src", ICON.LOADER);
  videoStatusDescriptionEl.textContent = TEXT.UPLOADING;
  showElement(videoOverlayEl);
  showElement(videoStatusContainerEl);
  hideVisibilityElement(actionButtonEl);
  hideElement(repeatRecordingButtonEl);

  const id = await giphy.uploadGif(blob);
  uploadedGifo = new Gifo(id);
  uploadedGifo.addToMyGifos();
  startFinishedUploadingStage();
};

//    FINISHED UPLOADING
const startFinishedUploadingStage = function () {
  stage = STAGE.FINISHED_UPLOADING;
  videoStatusIconEl.setAttribute("src", ICON.CHECK);
  videoStatusDescriptionEl.textContent = TEXT.UPLOADING_SUCCESS;
  showElement(videoStatusButtonGroupEl);
};

// HANDLERS
const handleActionButtonClick = function (e) {
  switch (stage) {
    case STAGE.INITIAL:
      startGettingPermissionsStage();
      break;
    case STAGE.BEFORE_RECORDING:
      startRecordingStage();
      break;
    case STAGE.RECORDING_IN_PROGRESS:
      startFinishedRecordingStage();
      break;
    case STAGE.FINISHED_RECORDING:
      startUploadingStage();
      break;
  }
};

const handleRepeatRecordingButtonClick = async function () {
  try {
    stream = await getStreamAndRecord();
    startBeforeRecordingStage();
  } catch (err) {
    console.warn(err);
    alert(
      "La aplicacion necesita obtener permisos de la cámara para poder grabar el gifo."
    );
    startInitialStage();
  }
};

const handleButtonDownloadClick = function () {
  invokeSaveAsDialog(blob);
};

const handleButtonLinkClick = function () {
  alert(uploadedGifo.getLink());
};

// INITIALIZERS

const initializeCreateGifoPage = function () {
  actionButtonEl.addEventListener("click", handleActionButtonClick);
  repeatRecordingButtonEl.addEventListener(
    "click",
    handleRepeatRecordingButtonClick
  );
  buttonDownloadEl.addEventListener("click", handleButtonDownloadClick);
  buttonLinkEl.addEventListener("click", handleButtonLinkClick);
  // startBeforeRecordingStage();
  giphy.getGifById("Rlxfht52POeHMUrner");
  giphy.getGifById("cE8GxM2AxzTfh1DnsO");
};

initializeDarkMode();
initializeCreateGifoPage();
