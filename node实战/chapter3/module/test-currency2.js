var Currenty = function(canadianDollar){
    this.canadianDollar = canadianDollar;
}

Currenty.prototype.roundTwoDecimals = function(amount){
    return Math.round(amount * 100)/100;
}

Currenty.prototype.canadianToUS = function(canadian){
    return this.roundTwoDecimals(canadian * this.canadianDollar);
}

Currenty.prototype.USToCanadian = function(us){
    return this.roundTwoDecimals(us/this.canadianDollar);
}

module.exports = Currenty;


