import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms'; // validation
import { AuthenticationService } from '../services/authentication.service'; //authenticate
import { NavController } from '@ionic/angular'; //navigation

import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage'; //storage module
import { AngularFirestore } from '@angular/fire/firestore';
interface NoteData {
  Title: string;
  Content: string;
}
export interface Image {
  id: string;
  image: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
//module import image / fire storage
  url: any;
    newImage: Image = {
      id: this.afs.createId(), image: ''};
    loading: boolean = false;

  noteList =[];
  noteData: NoteData;
  noteTitle : string;
  noteContent : string;
  isEdit : boolean = true;
  noteForm : FormGroup;
  userEmail : string; //authentication

  constructor(private afs : AngularFirestore,private storage : AngularFireStorage, private firebaseService : FirebaseService,private navCtrl : NavController, private authService : AuthenticationService) {
    this.noteData = {} as NoteData;
  }
  ngOnInit(){
    this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        this.userEmail = res.email;
        this.getAllNotes();
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    })
    
   
    
  }
  getAllNotes(){
    this.firebaseService.readNotes().subscribe((result) =>{
        this.noteList = result.map (element =>{
          return {
            id : element.payload.doc.id,
            isEdit: false,
            title : element.payload.doc.data()['Title'],
            content : element.payload.doc.data()['Content']
            
          }
          
             
        });


    });

  }
   createNote() {
     let element = {};
     element['Title'] = this.noteTitle;
     element['Content'] = this.noteContent;
    this.firebaseService.createNote(element).then(resp => {
      this.noteTitle = null;
      this.noteContent = null;
      this.isEdit = false;
    })
      .catch(error => {
        console.log(error);
      });
  }
  removeNote(id){
    this.firebaseService.deleteNote(id);

  }
  editNote(note){

    note.isEdit = true;
    this.isEdit = true;
    this.noteTitle = note.title;
    this.noteContent = note.content;
  }
  updateNote(note) {
    let record = {};
    record['Title'] = this.noteTitle;
    record['Content'] = this.noteContent;
    this.firebaseService.updateNote(note.id, record);
    note.isEdit = false;
  }
  logout() {
    this.authService.logoutUser()
      .then(res => {
        console.log(res);
        this.navCtrl.navigateBack('');
      })
      .catch(error => {
        console.log(error);
      })
  }

  //fire storage : uploat image
  uploadImage(event) {
    this.loading = true;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
     
      reader.readAsDataURL(event.target.files[0]);
      // For Preview Of Image
      reader.onload = (e:any) => { // called once readAsDataURL is completed
        this.url = e.target.result;
      
        // For Uploading Image To Firebase
        const fileraw = event.target.files[0];
        console.log(fileraw)
        const filePath = '/Image/' + this.newImage.id + '/' + 'Image' + (Math.floor(1000 + Math.random() * 9000) + 1);
        const result = this.SaveImageRef(filePath, fileraw);
        const ref = result.ref;
        result.task.then(a => {
          ref.getDownloadURL().subscribe(a => {
            console.log(a);
            
            this.newImage.image = a;
            this.loading = false;
          });

          this.afs.collection('Image').doc(this.newImage.id).set(this.newImage);
        });
      }, error => {
        alert("Error");
      }

    }
  }



  SaveImageRef(filePath, file) {

    return {
      task: this.storage.upload(filePath, file)
      , ref: this.storage.ref(filePath)
    };
  }

}
