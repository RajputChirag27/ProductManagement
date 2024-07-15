import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  constructor(private http: HttpClient) {}
  hello() {
    this.http.get('user/hello').subscribe(
      data => {
        console.log(data)
      },
      error => {
        console.error(error)
      }
    )
  }
}
