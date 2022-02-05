import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  questionsList:any[]|any;
  constructor(private http:HttpClient) { }

  getAllQuestion(): Observable<any[]> {
    
    return this.http.get<any>(`https://localhost:44311/api/Question/GetAll`, {}).pipe(
      map(
        (response: any) => {
          this.questionsList = response
          return this.questionsList
        } 
      )
    );

}
}
