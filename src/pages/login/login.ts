import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username: any;
  password: any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage, 
    private http: Http) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  doLogin(){
    this.http.post("http://monitoreo.monitoreonay.online/logincli",{
      params:{
        username: this.username,
        password: this.password
      }
    }).subscribe(res => {
      let code = res['_body'];
      if(code == 300){
        alert("Usuario o Contraseña Incorrecta");
        return;
      }
      if(code == 500){
        alert("Error en el servidor");
        return;
      }
      this.storage.set("idcli",code);
      this.navCtrl.push(HomePage);
    });
}

}
