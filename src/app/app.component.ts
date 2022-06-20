import { Component } from '@angular/core';
import { CurrencyService } from './services/currency.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  selectedCurrency = 'UAH';
  constructor(private currencyService: CurrencyService) {}
  sendCurrency(event: string) {
    this.currencyService.setCurrency(event);
  }
}
