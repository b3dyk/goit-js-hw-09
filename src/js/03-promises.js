import { Notify } from 'notiflix/build/notiflix-notify-aio';

const formRef = document.querySelector('.form');

formRef.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();

  const { delay, step, amount } = event.target.elements;

  for (let i = 1; i <= Number(amount.value); i += 1) {
    const callDelay = Number(delay.value) + (i - 1) * Number(step.value);

    createPromise(i, callDelay)
      .then(({ position, delay }) =>
        Notify.success(`Fullfiled promise ${position} in ${delay}`)
      )
      .catch(({ position, delay }) =>
        Notify.failure(`Rejected promise ${position} in ${delay}`)
      );
  }
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
