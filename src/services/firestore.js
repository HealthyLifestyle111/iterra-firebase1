/**
 * Firebase Firestore Service
 * Replaces Base44 SDK database operations with Firebase Firestore
 */

import { db } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';

/**
 * Generic Firestore operations
 */
class FirestoreService {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.collection = collection(db, collectionName);
  }

  /**
   * Create a new document
   */
  async create(data) {
    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(this.collection, docData);
    return { id: docRef.id, ...docData };
  }

  /**
   * Get a document by ID
   */
  async get(id) {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  }

  /**
   * Update a document
   */
  async update(id, data) {
    const docRef = doc(db, this.collectionName, id);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    await updateDoc(docRef, updateData);
    return { id, ...updateData };
  }

  /**
   * Delete a document
   */
  async delete(id) {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
    return { id };
  }

  /**
   * Get all documents
   */
  async getAll(options = {}) {
    let q = this.collection;
    
    if (options.where) {
      q = query(q, where(options.where.field, options.where.operator, options.where.value));
    }
    
    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
    }
    
    if (options.limit) {
      q = query(q, limit(options.limit));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  /**
   * Query documents
   */
  async query(conditions) {
    let q = this.collection;
    
    conditions.forEach(condition => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

/**
 * Entity Services - Replaces Base44 Entities
 */

// Wellness Intake
export const WellnessIntake = new FirestoreService('wellnessIntakes');

// Services
export const Service = new FirestoreService('services');

// Consultations
export const Consultation = new FirestoreService('consultations');

// Manifestations
export const Manifestation = new FirestoreService('manifestations');

// Training Content
export const TrainingContent = new FirestoreService('trainingContent');

// Monthly Updates
export const MonthlyUpdate = new FirestoreService('monthlyUpdates');

// Specialized Intake
export const SpecializedIntake = new FirestoreService('specializedIntakes');

// Associates (existing)
export const Associate = new FirestoreService('associates');

export default {
  WellnessIntake,
  Service,
  Consultation,
  Manifestation,
  TrainingContent,
  MonthlyUpdate,
  SpecializedIntake,
  Associate
};
