import { Notify } from 'notiflix/build/notiflix-notify-aio';

class PromisesGenerator {
  constructor(formRef) {
    this.formRef = formRef;
  }

  init() {
    this.addListeners();
  }

  addListeners() {
    this.formRef.addEventListener('submit', this.onSubmit.bind(this));
  }

  onSubmit(event) {
    event.preventDefault();

    const { delay, step, amount } = event.target.elements;

    for (let i = 1; i <= Number(amount.value); i += 1) {
      const callDelay = Number(delay.value) + (i - 1) * Number(step.value);

      this.createPromise(i, callDelay)
        .then(this.onSuccess)
        .catch(this.onFailure);
    }
  }

  createPromise(position, delay) {
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

  onSuccess({ position, delay }) {
    return Notify.success(`Fullfiled promise ${position} in ${delay} ms`);
  }

  onFailure({ position, delay }) {
    return Notify.failure(`Rejected promise ${position} in ${delay} ms`);
  }
}

const formRef = document.querySelector('.form');

new PromisesGenerator(formRef).init();
