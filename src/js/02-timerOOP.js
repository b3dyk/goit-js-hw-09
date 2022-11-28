import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

class Timer {
  constructor({
    input,
    startBtn,
    stopBtn,
    resetBtn,
    days,
    hours,
    minutes,
    seconds,
  }) {
    this.input = input;
    this.startBtn = startBtn;
    this.stopBtn = stopBtn;
    this.resetBtn = resetBtn;
    this.days = days;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.timerId = 0;
  }

  init() {
    this.disableBtn(this.startBtn);
    this.disableBtn(this.stopBtn);
    this.disableBtn(this.resetBtn);
    this.addListeners();
  }

  addListeners() {
    this.startBtn.addEventListener('click', this.onStartTimer.bind(this));
    this.stopBtn.addEventListener('click', this.onStopTimer.bind(this));
    this.resetBtn.addEventListener('click', this.onResetTimer.bind(this));
  }

  onStartTimer() {
    this.setTimer(this.getDelta());

    this.timerId = setInterval(() => {
      if (this.getDelta() < 0) {
        clearInterval(this.timerId);
        this.disableBtn(this.stopBtn);
        return;
      }

      this.setTimer(this.getDelta());
    }, 1000);

    this.enableBtn(this.stopBtn);
    this.disableBtn(this.startBtn);
    this.disableBtn(this.resetBtn);
  }

  onStopTimer() {
    clearInterval(this.timerId);
    this.setTimer(this.getDelta());
    this.enableBtn(this.startBtn);
    this.enableBtn(this.resetBtn);
    this.disableBtn(this.stopBtn);
  }

  onResetTimer() {
    clearInterval(this.timerId);
    this.resetTimer();
    this.disableBtn(this.resetBtn);
    this.disableBtn(this.startBtn);

    Notify.info('Оберіть новий часовий інтервал', {
      position: 'center-top',
    });
  }

  getDelta() {
    return new Date(this.input.value) - Date.now();
  }

  getTimeComponents(time) {
    const ds = Math.floor(time / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((time % (1000 * 60)) / 1000);

    return { ds, hrs, mins, secs };
  }

  setTimer(delta) {
    const { ds, hrs, mins, secs } = this.getTimeComponents(delta);

    this.days.innerText = `${this.addLeadingZero(ds)}`;
    this.hours.innerText = `${this.addLeadingZero(hrs)}`;
    this.minutes.innerText = `${this.addLeadingZero(mins)}`;
    this.seconds.innerText = `${this.addLeadingZero(secs)}`;
  }

  resetTimer() {
    this.days.innerText = `00`;
    this.hours.innerText = `00`;
    this.minutes.innerText = `00`;
    this.seconds.innerText = `00`;
  }

  addLeadingZero(x) {
    return String(x).padStart(2, '0');
  }

  disableBtn(btn) {
    btn.setAttribute('disabled', 'disabled');
    btn.classList.add('disabled');
  }

  enableBtn(btn) {
    btn.removeAttribute('disabled');
    btn.classList.remove('disabled');
  }
}

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  stopBtn: document.querySelector('button[data-stop]'),
  resetBtn: document.querySelector('button[data-reset]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
  KEY: 'date',
};
const { input, startBtn, KEY } = refs;

const timer = new Timer(refs);
timer.init();

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
  },
};
const datetimePicker = flatpickr('#datetime-picker', options);

datetimePicker.config.onClose.push(() => {
  if (Date.now() > new Date(input.value)) {
    timer.disableBtn(startBtn);
    Notify.failure('Будь ласка, виберіть дату в майбутньому', {
      position: 'center-top',
    });
    return;
  }

  timer.enableBtn(startBtn);
  Notify.success('Дату і час успішно обрано, запускаймо!', {
    position: 'center-top',
  });
});

datetimePicker.config.onOpen.push(() => {
  timer.disableBtn(startBtn);
});
