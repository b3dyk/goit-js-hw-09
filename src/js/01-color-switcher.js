class BodyBGChange {
  constructor({ startBtn, stopBtn }) {
    this.startBtn = startBtn;
    this.stopBtn = stopBtn;
    this.timerId = null;
  }

  init() {
    this.addListeners();
    this.switchDisableBtn(this.stopBtn);
  }

  addListeners() {
    this.startBtn.addEventListener('click', this.onStart.bind(this));
    this.stopBtn.addEventListener('click', this.onStop.bind(this));
  }

  onStart() {
    this.setBGColor();

    this.timerId = setInterval(() => {
      this.setBGColor();
    }, 1000);

    this.switchDisableBtn(this.startBtn, this.stopBtn);
  }

  onStop() {
    clearInterval(this.timerId);

    this.switchDisableBtn(this.stopBtn, this.startBtn);
  }

  setBGColor() {
    document.body.style.backgroundColor = `${this.getRandomHexColor()}`;
  }

  getRandomHexColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  switchDisableBtn(disableBtn, enableBtn) {
    disableBtn.setAttribute('disabled', 'disabled');

    if (enableBtn) {
      enableBtn.removeAttribute('disabled');
    }
  }
}

const refs = {
  startBtn: document.querySelector('[data-start]'),
  stopBtn: document.querySelector('[data-stop]'),
};

new BodyBGChange(refs).init();
