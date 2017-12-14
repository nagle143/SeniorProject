

export default class Money {
  constructor(money) {
    this.money = money;
    this.interestRate = 1.10;
    this.interest = 0;
    this.income = 3;
    this.timer = 180;
  }

  calculateInterest() {
    this.interest = Math.round(this.money * this.interestRate);
    this.money += this.interest;
  }

  changeIncome(delta) {
    this.income += delta;
  }

  changeInterest(bool) {
    if(bool === 'up') {
      this.interest += 0.05;
    }
    else {
      this.interest -= 0.05;
    }
  }

  update() {
    this.timer--;
    if(this.timer === 0) {
      this.money += this.income;
      this.timer = 180;
    }
  }
}
