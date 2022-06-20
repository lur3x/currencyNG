import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Coin } from 'src/app/interface';
import { CryptoService } from '../../services/crypto.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss'],
})
export class CoinDetailComponent implements OnInit {
  coinData!: Coin;
  coinId!: string;
  days = 1;
  currency = 'UAH';
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: `Price Trends`,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: '#1a5276',
        pointBackgroundColor: '#1a5276',
        pointBorderColor: '#1a5276',
        pointHoverBackgroundColor: '#1a5276',
        pointHoverBorderColor: '#1a5276',
      },
    ],
    labels: [],
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1,
      },
    },
    plugins: {
      legend: { display: true },
    },
  };
  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) myLineChart!: BaseChartDirective;

  constructor(
    private crypto: CryptoService,
    private route: ActivatedRoute,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((val) => {
      this.coinId = val['id'];
    });
    this.getCoinData();
    this.getGraphData(this.days);
    this.currencyService.getCurrency().subscribe((val) => {
      this.currency = val;
      this.getGraphData(this.days);
      this.getCoinData();
    });
  }

  getCoinData() {
    return this.crypto.getCurrencyById(this.coinId).subscribe((res) => {
      this.coinData = res;
      if (this.currency === 'USD') {
        res.market_data.current_price.uah = res.market_data.current_price.usd;
        res.market_data.market_cap.uah = res.market_data.market_cap.usd;
      }
      res.market_data.current_price.uah = res.market_data.current_price.uah;
      res.market_data.market_cap.uah = res.market_data.market_cap.uah;
      this.coinData = res;
    });
  }
  getGraphData(days: number) {
    this.days = days;
    this.crypto
      .getGraphData(this.coinId, this.currency, this.days.toString())
      .subscribe((res) => {
        setTimeout(() => {
          this.myLineChart.chart?.update();
        }, 200);
        this.lineChartData.datasets[0].data = res.prices.map((a: any) => {
          return a[1];
        });
        this.lineChartData.labels = res.prices.map((a: any) => {
          let date = new Date(a[0]);
          let time =
            date.getHours() > 12
              ? `${date.getHours() - 12}: ${date.getMinutes()} PM`
              : `${date.getHours()}: ${date.getMinutes()} AM`;
          return this.days === 1 ? time : date.toLocaleDateString();
        });
      });
  }
}
