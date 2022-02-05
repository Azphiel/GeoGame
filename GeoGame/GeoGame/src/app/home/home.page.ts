import { QuestionService } from './../sevices/qustion/question.service';
import { Geolocation } from '@capacitor/geolocation';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ModalController } from '@ionic/angular';
import { AddCoordinatesComponent } from '../add-coordinates/add-coordinates.component';
import { PolylineOptions } from '@capacitor-community/capacitor-googlemaps-native/dist/esm/types/shapes/polyline.interface';
 
declare var google;
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  locations: Observable<any>;
  locationsCollection: AngularFirestoreCollection<any>;
  polylinesCollection: AngularFirestoreCollection<any>
 
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  path:[];
  markers = [];
  polylines = [];
  position: any;
  latitude:any;
  longitude:any;
  loc: any;
  isTracking = false;
  watch: string;
  pos:any;
  user = null;
  error:boolean = false;
  historyLocation:any;
  paths:Array<{lat: number, lng: number}> = [];  
  questionList:any[];
  list:boolean = false;
 
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, public modalController: ModalController, private questionService:QuestionService) {
    this.anonLogin();
    this.questionService.getAllQuestion().subscribe((data:any)=>{
      const result = []
      data.forEach(x => {
        x.Question.forEach(y => {
          result.push(y);
        });   
      });
      this.questionList = result
      console.log(this.questionList)
    })
  }
 
  ionViewWillEnter() {
    this.loadMap();
  }

  checkValue(value:boolean, location:any, question:any){
    const current = new Date();
    const timestamp = current.getTime();
    if(value==true)
    {
      let show = true;
      if(question.id == 1){
        Geolocation.getCurrentPosition().then((data:any)=>{
          let name1 = "Twoja Pozycja"
          console.log(data);
          if (data) {
            this.addNewLocation(name1, data.coords.latitude, data.coords.longitude, timestamp, show );
          }
          this.error = false
          let name = "Przystanek" +" "+ question.id;
          var x = location.latitude
          var latitude: number = +x;
          this.latitude = latitude;
          var x = location.longitude
          var longitude: number = +x;
          this.longitude = longitude;
          this.addNewLocation(name, this.latitude, this.longitude, timestamp, show );

          const poly = [
            { lat: data.coords.latitude, lng: data.coords.longitude },
            { lat: this.latitude, lng: this.longitude },
          ];
          const newPoly = new google.maps.Polyline({
            path: poly,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });
          this.addNewLine(newPoly);
          newPoly.setMap(this.map);
          this.polylines.push(newPoly);
        });
      
      }
      else{
        var x = location.latitude
        var latitude: number = +x;
        var x = location.longitude
        var longitude: number = +x;
        const poly = [
          { lat: this.latitude, lng: this.longitude },
          { lat: latitude, lng: longitude },
        ];
        this.error = false
        let name = "Przystanek" +" "+ question.id;
        this.latitude = latitude;
        this.longitude = longitude;
        var marker = this.addNewLocation(name, this.latitude, this.longitude, timestamp, show );
        this.locations

        const newPoly = new google.maps.Polyline({
          path: poly,
          geodesic: true,
          strokeColor: "#FF0000",
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });
        this.addNewLine(newPoly);
        newPoly.setMap(this.map);
        this.polylines.push(newPoly);
      }

    }
    else{
      this.error = true
    }
  }
 
deleteCollection(){
  this.afAuth.signInAnonymously().then(res => {
    this.user = res.user; 
    this.locationsCollection = this.afs.collection(
      `locations/${this.user.uid}/track`,
      ref => ref.orderBy('timestamp')
    );
    this.locations = this.locationsCollection.snapshotChanges().pipe(
      map(actions =>       
        actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    
    if(this.locations !=null){
      this.locations.forEach(pos=>{
        pos.forEach(x => {
          this.locationsCollection.doc(x.id).delete();
        });
      });
    }
  });
}
  anonLogin() {
    this.afAuth.signInAnonymously().then(res => {
      this.user = res.user; 
      this.locationsCollection = this.afs.collection(
        `locations/${this.user.uid}/track`,
        ref => ref.orderBy('timestamp')
      );
      this.locations = this.locationsCollection.snapshotChanges().pipe(
        map(actions =>       
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
      
      this.locations.subscribe(locations => {
        this.updateMap(locations);
      });
    });
  }
 
  loadMap() {
    this.loc = Geolocation.getCurrentPosition().then((data:any)=>{
      console.log(data.coords);
      let latLng = new google.maps.LatLng("50.274786", "19.126646");
 
    let mapOptions = {
      center: latLng,
      zoom:10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    });
    
    
  }
  // findLocation(){
  //   this.locations.subscribe(locations => {
  //     this.updateMap(locations);
  //     console.log(locations)
  //     locations.forEach(location => {
  //       if(location.name = "Twoja Pozycja"){
  //         console.log(location);
  //         //this.locationsCollection.doc(location.id).delete();
  //       }
  //       else{
  //         console.log("dupa")
  //       }
  //     });
  //   });
  // }

startTracking() {
  //this.isTracking = true;
  Geolocation.getCurrentPosition().then((data:any)=>{
    let name = "Twoja Pozycja"
    let show = false;
    if (data) {
      this.historyLocation = this.showMyPosition(
        name,
        data.coords.latitude,
        data.coords.longitude,
        data.timestamp,
        show
      );
    }
  })
}
 
showMyPosition(name, lat, lng, timestamp, show){
  let position = new google.maps.LatLng(lat, lng);
  this.map.setCenter(position);
  this.map.setZoom(20);
  let latLng = new google.maps.LatLng(lat, lng);
  console.log(this.markers)
  const image =
  "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
  let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: latLng,
    icon: image
  });
  console.log(marker)
  this.markers.push(marker);
}


addNewLocation(name, lat, lng, timestamp, show) {
  this.locationsCollection.add({
    name,
    lat,
    lng,
    timestamp,
    show
  });
 
  let position = new google.maps.LatLng(lat, lng);
  this.map.setCenter(position);
  this.map.setZoom(20);
}

addNewLine(poly:any){
  console.log(poly)
  //this.polylinesCollection.add({});
}

show(lat, lng){
  console.log(lat, lng)
  let position = new google.maps.LatLng(lat, lng);
  this.map.setCenter(position);
  this.map.setZoom(15);
}
 
deleteLocation(pos) {
  console.log(pos)
  //this.locationsCollection.doc(pos.id).delete();
}
 
updateMap(locations) {
    this.markers.map(marker => marker.setMap(null));
    this.markers = [];
    for (let loc of locations) {
  
      if(loc.show == true){
          let lat = loc.lat;
          let lng = loc.lng
          this.paths.push({lat, lng});
        
      let latLng = new google.maps.LatLng(loc.lat, loc.lng);
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });
      }
      
    }

    function addMarker(position) {
      const marker = new google.maps.Marker({
        position,
        map,
      });
    
      this.markers.push(marker);
    }
}
positionList(){
  if(this.list == true){
    this.list = false
  }
  else{
    this.list = true;
  }
}
}

