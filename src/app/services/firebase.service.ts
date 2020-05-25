import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  collectionName = 'Notes';

  constructor(private firestore : AngularFirestore) { }

  createNote(note){
    return this.firestore.collection(this.collectionName).add(note);
  }
  updateNote(noteID,note){
    this.firestore.doc(this.collectionName + '/' + noteID).update(note);

  }
  deleteNote(noteID) {
    this.firestore.doc(this.collectionName + '/' + noteID).delete();
  }
  readNotes() {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }
  readOneNote(noteID) {
    return this.firestore.collection(this.collectionName).doc(noteID);
  }

}
