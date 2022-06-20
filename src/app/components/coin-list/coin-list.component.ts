import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { Crypto } from 'src/app/interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss'],
})
export class CoinListComponent implements OnInit {
  bannerData: Crypto[] = [];
  tableData: any;
  currency = 'UAH';
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'symbol',
    'current_price',
    'price_change_percentage_24h',
    'market_cap',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private crypto: CryptoService,
    private router: Router,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.getBannerData();
    this.getAllTableData();
    this.currencyService.getCurrency().subscribe((val) => {
      this.currency = val;
      this.getBannerData();
      this.getAllTableData();
    });
  }
  getBannerData() {
    this.crypto.getTrendingCurrency(this.currency).subscribe((coin) => {
      this.bannerData = coin;
    });
  }
  getAllTableData() {
    this.crypto.getCurrencyData(this.currency).subscribe((coin) => {
      this.dataSource = new MatTableDataSource(coin);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  goToDetails(id: string) {
    this.router.navigate(['/coin', id]);
  }
}
