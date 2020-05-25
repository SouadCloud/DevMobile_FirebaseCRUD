import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
interface NoteData {
  Title: string;
  Content: string;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  noteList =[];
  noteData: NoteData;
  noteTitle : string;
  noteContent : string;
  isEdit : boolean = true;
  noteForm : FormGroup;

  constructor(private firebaseService : FirebaseService) {
    this.noteData = {} as NoteData;
  }
  ngOnInit(){
    
    this.getAllNotes();
    
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

}
