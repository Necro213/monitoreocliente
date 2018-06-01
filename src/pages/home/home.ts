import { Component,NgZone } from '@angular/core';
import { NavController,ToastController,ViewController } from 'ionic-angular';
import {BackgroundGeolocation,BackgroundGeolocationConfig,BackgroundGeolocationResponse} from '@ionic-native/background-geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  watch: any;
  idusr: any;
  constructor(public navCtrl: NavController, 
    private backgroundGeolocation: BackgroundGeolocation,
    private backgroundMode: BackgroundMode,
    private toastCtrl: ToastController,
    private geolocation: Geolocation,
    private http: Http,
    private zone: NgZone,
    private storage: Storage,
    private viewCtrl: ViewController
  ) {
    this.storage.get('idcli').then((val) => {
      if(val == null){
        this.navCtrl.push('LoginPage');
        viewCtrl.dismiss();
      }else{
        this.idusr = val;
      }
    });
    this.backgroundMode.enable();
    //this.backgroundMode.moveToBackground();
  }

  presentToast(mensaje) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  iniciar(){
    try{
      //this.presentToast(this.actViaje);
      //if(this.actViaje == true){
        let config = {
          desiredAccuracy: 0,
          stationaryRadius: 20,
          distanceFilter: 10,
          debug: false,
          interval: 20000
        };
    
        this.backgroundMode.enable();
       
        this.backgroundGeolocation.configure(config).subscribe((location) => {
          // Run update inside of Angular's zone
        }, (err) => {
          this.presentToast(err);
        });
       
        // Turn ON the background-geolocation system
        this.backgroundGeolocation.start();
    
        let options = {
          frequency: 1,
          timeout: 20000,
          maximumAge:0,
          enableHighAccuracy: false
        };
        let i = 0;
        let idv;
        this.watch = this.geolocation.watchPosition(options).subscribe((position: Geoposition) => {
          
          this.http.post("http://monitoreo.monitoreonay.online/reload/"+this.idusr,{
        params:{
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      }).subscribe(res => {
        let code = res['_body'];
        if(code == 200){
         
        }else{
          this.presentToast("Error en el Servidor");
        }
      });
    
        });
      }catch(exception){
        this.presentToast("Revise su conexion a internet");
      }
       
    }

    cancel(){
        this.watch.unsuscribe();
      this.http.post("http://monitoreo.monitoreonay.online/cancel/"+this.idusr,{
      }).subscribe(res => {
        let code = res['_body'];
        if(code == 200){
          this.presentToast("Termino el monitoreo");
        }else{
          this.presentToast("Error en el Servidor");
        }
      });
    }
}
