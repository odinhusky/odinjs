// # classes

// % public: 不論在 class 內或外都可以讀取並且修改該變數的值
// ^ private: 只允許在 class 內讀取該、修改變數的值
// * readonly: 不允許修改變數的值，不論內外都可以讀取

class Invoice{
  // client: string;
  // details: string;
  // amount: number;

  constructor(
    readonly client: string,
    private details: string,
    public amount: number,
  ) {
  }

  format() {
    return `${this.client} owes $${this.amount} for ${this.details}`
  }
}

const invOne = new Invoice('mario', 'work on the mario website', 250)
const invTwo = new Invoice('luigi', 'work on the luigi website', 300)

let invoices: Invoice[] = [];

invoices.push(invOne);
invoices.push(invTwo);

// invOne.client = 'yoshi';
invTwo.amount = 400;

console.log('invoices => ', invoices);

