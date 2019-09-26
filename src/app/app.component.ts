import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private http: Http) {}

  page = 1;
  showBankList;
  ifsc: String = '';
  bankId: String = '';
  branch: String = '';
  address: String = '';
  city: String = '';
  district: String = '';
  state: String = '';
  bankName: String = '';
  noOfRecords = 5;
  totalRecords = 0;
  banklist;

  comboCity: String = 'MUMBAI';

  ngOnInit() {
    this.displayBank();
  }

  displayBank() {
    var url = 'https://vast-shore-74260.herokuapp.com/banks?city=' + this.comboCity;

    if (localStorage.getItem(this.comboCity.toString()) != null) {
      this.banklist = JSON.parse(localStorage.getItem(this.comboCity.toString()));
      this.showBankList = JSON.parse(localStorage.getItem(this.comboCity.toString()));
      this.totalRecords = this.banklist.length;
    } else {
      this.http.get(url).subscribe(
        res => {
          this.banklist = res.json();
          this.showBankList = res.json();
          this.totalRecords = this.banklist.length;
          localStorage.setItem(this.comboCity.toString(), JSON.stringify(res.json()));
        },
        err => {}
      );
    }
  }

  onChecked(data) {
    var fav = JSON.parse(localStorage.getItem('fav'));
    if (fav != null) if (fav.indexOf(data) != -1) return true;
    return false;
  }
  onCheckBox(event, i, data) {
    if (event.target.checked) {
      if (localStorage.getItem('fav') != null) {
        var fav = JSON.parse(localStorage.getItem('fav'));
        fav.push(data);
        localStorage.setItem('fav', JSON.stringify(fav));
      } else {
        var uniqueFav = [];
        uniqueFav.push(data);
        localStorage.setItem('fav', JSON.stringify(uniqueFav));
      }
    } else {
      var fav = JSON.parse(localStorage.getItem('fav'));
      fav = fav.filter(entry => entry != data);
      localStorage.setItem('fav', JSON.stringify(fav));
    }
  }
  onComboChange(event) {
    this.comboCity = event;
    this.ifsc = '';
    this.bankName = '';
    this.bankId = '';
    this.city = '';
    this.district = '';
    this.address = '';
    this.state = '';
    this.branch = '';
    this.displayBank();
  }
  filter(event) {
    this.showBankList = this.banklist;
    this.showBankList = this.showBankList.filter(entry => {
      if (
        entry.ifsc.toLowerCase().includes(this.ifsc.toLowerCase()) &&
        entry.bank_id
          .toString()
          .toLowerCase()
          .includes(this.bankId.toLowerCase()) &&
        entry.branch.toLowerCase().includes(this.branch.toLowerCase()) &&
        entry.address.toLowerCase().includes(this.address.toLowerCase()) &&
        entry.city.toLowerCase().includes(this.city.toLowerCase()) &&
        entry.district.toLowerCase().includes(this.district.toLowerCase()) &&
        entry.state.toLowerCase().includes(this.state.toLowerCase()) &&
        entry.bank_name.toLowerCase().includes(this.bankName.toLowerCase())
      )
        return true;
    });
    this.totalRecords = this.showBankList.length;
  }
  forward() {
    return this.totalRecords / Number(this.noOfRecords) > Number(this.page);
  }
  back() {
    return Number(this.page) > 1;
  }

  pageNext(input) {
    if (input == '-') this.page = this.page - 1;
    else this.page = this.page + 1;
  }
}
