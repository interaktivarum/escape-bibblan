module.exports = class CodeHandler {

  static generateCode () {
    let a = ["Skojig", "Spexig", "Rolig", "Underlig", "Fundersam", "Allvarlig", "Smart", "Trixig"];
    let n = [
    "Hund", "Katt", "Hamster", "Krokodil", "Delfin", "Elefant", "Apa", "Gris", "Ko",
    "Skog", "Blomma", "Maskros", "Flod",
    "Morot", "Pannkaka",
    "Bok", "Hylla", "Byxa"];
    return this.r(a) + this.r(n) + (Math.floor(Math.random()*90)+10)
  }

  static r(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

};
