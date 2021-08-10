"use strict";
// # classes
// % public: 不論在 class 內或外都可以讀取並且修改該變數的值
// ^ private: 只允許在 class 內讀取該、修改變數的值
// * readonly: 不允許修改變數的值，不論內外都可以讀取
var Invoice = /** @class */ (function () {
    // client: string;
    // details: string;
    // amount: number;
    function Invoice(client, details, amount) {
        this.client = client;
        this.details = details;
        this.amount = amount;
    }
    Invoice.prototype.format = function () {
        return this.client + " owes $" + this.amount + " for " + this.details;
    };
    return Invoice;
}());
var invOne = new Invoice('mario', 'work on the mario website', 250);
var invTwo = new Invoice('luigi', 'work on the luigi website', 300);
var invoices = [];
invoices.push(invOne);
invoices.push(invTwo);
// invOne.client = 'yoshi';
invTwo.amount = 400;
console.log('invoices => ', invoices);
