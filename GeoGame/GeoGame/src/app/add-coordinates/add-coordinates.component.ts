import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-add-coordinates',
  templateUrl: './add-coordinates.component.html',
  styleUrls: ['./add-coordinates.component.scss'],
})
export class AddCoordinatesComponent implements OnInit {

  modalTitle: string|any;
  modelId: number|any;
  networkAlert:any;
  name!:string;
  lat!:string;
  long!:string;
  form!: FormGroup;
  variable:any;
  data:Array<{name: any, latitude: any, longitude: any}> = []; 
  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
  ) { }

  get formControls() {
    return this.form.controls;
  }


  ngOnInit() {
    console.table(this.navParams);
    this.modelId = this.navParams.data.paramID;
    this.modalTitle = this.navParams.data.paramTitle;
  }
  onGetName(event:any) {
    this.name = (<HTMLInputElement>event.target).value;
    console.log(this.name);
  }
  onGetLat(event:any) {
    this.lat = (<HTMLInputElement>event.target).value;
    console.log(this.lat);
  }
  onGetLong(event:any) {
    this.long = (<HTMLInputElement>event.target).value;
    console.log(this.long);
  }

  async addSession(){
    const name = this.name
    const longitude = this.long
    const latitude = this.lat;
    this.data.push({name, latitude, longitude});
    this.modalController.dismiss(this.data);
    }
  async closeModal() {
    await this.modalController.dismiss();
  }
}
