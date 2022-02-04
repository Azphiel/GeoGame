import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  questionsList:any[]|any;
  constructor(private http:HttpClient) { }

  getAllQuestion(): Observable<any[]> {
    
    return this.http.get<any>(`${environment.baseWebApiUrl}/api/Items/GetAll`, {}).pipe(
      map(
        (response: any) => {
          this.questionsList = response
          return this.questionsList
        } 
      )
    );

}
}
