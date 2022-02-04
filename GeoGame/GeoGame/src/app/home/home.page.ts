import { QuestionService } from './../sevices/qustion/question.service';
import { Geolocation } from '@capacitor/geolocation';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ModalController } from '@ionic/angular';
import { AddCoordinatesComponent } from '../add-coordinates/add-coordinates.component';
 
declare var google;
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  locations: Observable<any>;
  locationsCollection: AngularFirestoreCollection<any>;
 
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  path:[];
  markers = [];
  position: any;
  loc: any;
  isTracking = false;
  watch: string;
  pos:any;
  user = null;
  historyLocation:any;
  paths:Array<{lat: number, lng: number}> = [];  
  questionList:any[]|any;
 
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, public modalController: ModalController, private questionService:QuestionService) {
    this.anonLogin();
    this.questionService.getAllQuestion().subscribe((data:any)=>{
      console.log(data);
    })
  }
 
  ionViewWillEnter() {
    this.loadMap();
    this.questionService.getAllQuestion().subscribe((data:any)=>{
      console.log(data);
    })
  }
 
  async add(){
    // this.checkNetwork();
    const modal = await this.modalController.create({
      component: AddCoordinatesComponent,
    });

    modal.onDidDismiss().then(returnedData=>{
      const current = new Date();
      returnedData.data.forEach(data => {
        console.log(data);
        let show = true;
        const timestamp = current.getTime();
        this.addNewLocation(data.name, data.latitude, data.longitude,timestamp, show );
      });
    })

    return await modal.present();
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
    console.log(this.mapElement.nativeElement)
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
  let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: latLng
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

show(lat, lng){
  console.log(lat, lng)
  let position = new google.maps.LatLng(lat, lng);
  this.map.setCenter(position);
  this.map.setZoom(15);
}
 
deleteLocation(pos) {
  this.locationsCollection.doc(pos.id).delete();
}
 
updateMap(locations) {
    this.markers.map(marker => marker.setMap(null));
    this.markers = [];
    console.log(locations);
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

      let path = new google.maps.Polyline({
            path: this.paths,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });

      this.markers.push(marker);
      //path.setMap(this.map)
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




// draw() {
//   this.paths = [];
//   this.loc = Geolocation.getCurrentPosition().then((data:any)=>{
//     const map = new google.maps.Map(
//       document.getElementById("map") as HTMLElement,
//       {
//         zoom: 10,
//         center: { lat: data.coords.latitude, lng: data.coords.longitude },
//         mapTypeId: "roadmap",
//       }
//     );

//     this.locations.subscribe(locations => {
//       this.updateMap(locations, true);
//     });
//   console.log(this.paths)
//   const flightPath = new google.maps.Polyline({
//     path: this.paths,
//     geodesic: true,
//     strokeColor: "#FF0000",
//     strokeOpacity: 1.0,
//     strokeWeight: 2,
//   });

//   flightPath.setMap(this.map);
//   })
 
// }
}

