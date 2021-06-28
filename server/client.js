module.exports = class Client {
  constructor(id) {
    //this.id = shortid.generate();
    this.id = id;
    this.idSocket = id;
    this.idGroup = null;
    this.ready = false;
    this.state = 0
    this.personal = {
      name: this.generateName()
    }
  }

  generateName () {
    let a = ["Skojfrisk", "Spexig", "Underlig", "Fundersam", "Allvarlig", "Innovativ", "Beundransvärd", "Smart", "Trixig", "Händig"];
    let n = ["Filur", "Detektiv", "Person", "Karaktär", "Figur", "Individ", "Varelse", "Själ", "Prick", "Gestalt"];
    return this.r(a) + " " + this.r(n)
  }

  r(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

};
