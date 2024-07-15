// dashboard.component.ts
import { Component, OnInit } from '@angular/core'
import {
  AgChartOptions,
  AgChartCaptionOptions,
  AgChartSubtitleOptions,
  AgBarSeriesOptions,
  AgLineSeriesOptions,
  AgCategoryAxisOptions,
  AgNumberAxisOptions,
  AgChartLegendOptions
} from 'ag-charts-community'

interface IData {
  month: string
  avgTemp: number
  iceCreamSales: number
}

interface IUserData {
  month: string
  users: number
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  products: any[] = []
  categories: any[] = []
  users: any[] = []

  public salesChartOptions: AgChartOptions
  public userGrowthOptions: AgChartOptions

  constructor() {
    this.salesChartOptions = {
      title: { text: 'Product Sales and Avg Temp' } as AgChartCaptionOptions,
      subtitle: { text: 'Data from 2022' } as AgChartSubtitleOptions,
      data: [
        { month: 'Jan', avgTemp: 2.3, iceCreamSales: 162000 },
        { month: 'Mar', avgTemp: 6.3, iceCreamSales: 302000 },
        { month: 'May', avgTemp: 16.2, iceCreamSales: 800000 },
        { month: 'Jul', avgTemp: 22.8, iceCreamSales: 1254000 },
        { month: 'Sep', avgTemp: 14.5, iceCreamSales: 950000 },
        { month: 'Nov', avgTemp: 8.9, iceCreamSales: 200000 }
      ] as IData[],
      series: [
        {
          type: 'bar',
          xKey: 'month',
          yKey: 'iceCreamSales',
          yName: 'Product Sales'
        } as AgBarSeriesOptions,
        {
          type: 'line',
          xKey: 'month',
          yKey: 'avgTemp',
          yName: 'Average Temperature (°C)'
        } as AgLineSeriesOptions
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom'
        } as AgCategoryAxisOptions,
        {
          type: 'number',
          position: 'left',
          keys: ['iceCreamSales'],
          label: {
            formatter: params => {
              return parseFloat(params.value).toLocaleString()
            }
          }
        } as AgNumberAxisOptions,
        {
          type: 'number',
          position: 'right',
          keys: ['avgTemp'],
          label: {
            formatter: params => {
              return params.value + ' °C'
            }
          }
        } as AgNumberAxisOptions
      ],
      legend: {
        position: 'bottom'
      } as AgChartLegendOptions
    }

    this.userGrowthOptions = {
      title: { text: 'User Growth' } as AgChartCaptionOptions,
      subtitle: {
        text: 'Monthly User growth in 2022'
      } as AgChartSubtitleOptions,
      data: [
        { month: 'Jan', users: 1000 },
        { month: 'Feb', users: 1200 },
        { month: 'Mar', users: 1500 },
        { month: 'Apr', users: 1800 },
        { month: 'May', users: 2200 },
        { month: 'Jun', users: 2600 }
      ] as IUserData[],
      series: [
        {
          type: 'line',
          xKey: 'month',
          yKey: 'users',
          yName: 'Users'
        } as AgLineSeriesOptions
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom'
        } as AgCategoryAxisOptions,
        {
          type: 'number',
          position: 'left',
          keys: ['users'],
          label: {
            formatter: params => {
              return parseFloat(params.value).toLocaleString()
            }
          }
        } as AgNumberAxisOptions
      ],
      legend: {
        position: 'bottom'
      } as AgChartLegendOptions
    }
  }

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    // ... (keep the existing loadData method)
  }
}
