import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // setup your signature endpoint here: https://github.com/zoom/websdk-sample-signature-node.js
  signatureEndpoint = 'http://localhost:4000'
  apiKey = 'rDP8F22hT52n2iCpKros-A'
 
  role = 0
  leaveUrl = 'http://localhost:4210'
  userName = 'Angular test' // replace with logged in user name
  userEmail = '' // replace with logged in user email
  
  // to store on database  -> exposant meetingNumber + meetingPassword
  meetingNumber = '93158318234' // example: exposant1 meeting id
  meetingNumber2 = '92126715220' // example: exposant2 meeting id
  meetingPassword = 'uhj2Fv' // example: exposant1 meeting password
  meetingPassword2 = 'w4680A' // example: exposant2 meeting password

  constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document) {

  }

  ngOnInit() {

  }

  /**
   * 
   * @param meetingNumber 
   * @param password 
   */
  getSignature(meetingNumber: string, password) {
    console.log("getting signature......", meetingNumber)
    this.httpClient.post(this.signatureEndpoint, {
	    meetingNumber: meetingNumber,
	    role: this.role
    }).toPromise().then((data: any) => {
      if(data.signature) {
        console.log(data.signature)
        this.startMeeting(data.signature, meetingNumber, password)
      } else {
        console.log(data)
      }
    }).catch((error) => {
      console.log(error)
    })
  }


  /**
   * 
   * @param signature
   * @param meetingNumber 
   * @param password 
   */
  startMeeting(signature, meetingNumber, password) {

    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      leaveUrl: this.leaveUrl,
      isSupportAV: true,
      success: (success) => {
        console.log(success)

        ZoomMtg.join({
          signature: signature,
          meetingNumber: meetingNumber,
          userName: this.userName,
          apiKey: this.apiKey,
          userEmail: this.userEmail,
          passWord: password,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}
