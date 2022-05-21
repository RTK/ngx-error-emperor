import {Component, OnInit} from '@angular/core';

import {HttpService} from './services/http.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public constructor(private readonly httpService: HttpService) {}

    public async ngOnInit(): Promise<void> {
        await this.httpService.getAll().toPromise();
    }
}
