import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

class Timer {
  constructor({ input, startBtn, days, hours, minutes, seconds }) {
    this.input = input;
    this.startBtn = startBtn;
    this.days = days;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  init() {
    this.disableBtn(this.startBtn);
    this.addListeners();
  }

  addListeners() {
    startBtn.addEventListener('click', this.onStartTimer.bind(this));
  }

  onStartTimer() {
    this.setTimer();

    const timerId = setInterval(() => {
      if (this.getDelta() < 0) {
        clearInterval(timerId);
        return;
      }

      this.setTimer();
    }, 1000);

    this.disableBtn(startBtn);
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

  setTimer() {
    const { ds, hrs, mins, secs } = this.getTimeComponents(this.getDelta());

    this.days.innerText = `${this.addLeadingZero(ds)}`;
    this.hours.innerText = `${this.addLeadingZero(hrs)}`;
    this.minutes.innerText = `${this.addLeadingZero(mins)}`;
    this.seconds.innerText = `${this.addLeadingZero(secs)}`;
  }

  addLeadingZero(x) {
    return String(x).padStart(2, '0');
  }

  disableBtn(btn) {
    return btn.setAttribute('disabled', 'disabled');
  }
}

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};
const { input, startBtn } = refs;

new Timer(refs).init();

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
    startBtn.classList.add('disabled');
    Notify.failure('Будь ласка, виберіть дату в майбутньому', {
      position: 'center-top',
    });
    return;
  }

  startBtn.removeAttribute('disabled');
  startBtn.classList.remove('disabled');
  Notify.success('Дату і час успішно обрано, запускаймо!', {
    position: 'center-top',
  });
});

datetimePicker.config.onOpen.push(() => {
  startBtn.classList.add('disabled');
  new Timer(refs).disableBtn(startBtn);
});
