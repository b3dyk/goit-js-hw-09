import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};
const { input, startBtn, days, hours, minutes, seconds } = refs;

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

disableBtn(startBtn);

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
  disableBtn(startBtn);
});

startBtn.addEventListener('click', onStartTimer);

function onStartTimer() {
  setTimer();

  const timerId = setInterval(() => {
    if (getDelta() < 0) {
      clearInterval(timerId);
      return;
    }

    setTimer();
  }, 1000);

  disableBtn(startBtn);
}

function getDelta() {
  return new Date(input.value) - Date.now();
}

function getTimeComponents(time) {
  const ds = Math.floor(time / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((time % (1000 * 60)) / 1000);

  return { ds, hrs, mins, secs };
}

function setTimer() {
  const { ds, hrs, mins, secs } = getTimeComponents(getDelta());

  days.innerText = `${addLeadingZero(ds)}`;
  hours.innerText = `${addLeadingZero(hrs)}`;
  minutes.innerText = `${addLeadingZero(mins)}`;
  seconds.innerText = `${addLeadingZero(secs)}`;
}

function addLeadingZero(x) {
  return String(x).padStart(2, '0');
}

function disableBtn(btn) {
  return btn.setAttribute('disabled', 'disabled');
}
