/**
 * Service de stockage persistant pour les médias (images/vidéos)
 * Utilise IndexedDB pour garder les fichiers même après redémarrage
 */

interface StoredMedia {
  id: string;
  publicationId: string;
  fileName: string;
  fileType: string;
  data: ArrayBuffer;
  url?: string;
  createdAt: number;
}

class MediaStorageService {
  private dbName = 'PublicationsMediaDB';
  private storeName = 'media';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('publicationId', 'publicationId', { unique: false });
        }
      };
    });
  }

  async storeMedia(file: File, publicationId: string): Promise<{ id: string; url: string }> {
    if (!this.db) await this.init();
    
    const id = `${publicationId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const arrayBuffer = await file.arrayBuffer();
    
    const mediaData: StoredMedia = {
      id,
      publicationId,
      fileName: file.name,
      fileType: file.type,
      data: arrayBuffer,
      createdAt: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(mediaData);
      
      request.onsuccess = () => {
        // Créer une URL blob persistante (valable pour la session)
        const blob = new Blob([arrayBuffer], { type: file.type });
        const url = URL.createObjectURL(blob);
        resolve({ id, url });
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getMediaUrl(mediaId: string): Promise<string | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(mediaId);
      
      request.onsuccess = () => {
        const result = request.result as StoredMedia;
        if (result) {
          const blob = new Blob([result.data], { type: result.fileType });
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getAllMediaForPublication(publicationId: string): Promise<Array<{ id: string; url: string; type: string; name: string }>> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('publicationId');
      const request = index.getAll(publicationId);
      
      request.onsuccess = () => {
        const results = request.result as StoredMedia[];
        const mediaList = results.map(media => {
          const blob = new Blob([media.data], { type: media.fileType });
          const url = URL.createObjectURL(blob);
          return {
            id: media.id,
            url,
            type: media.fileType.startsWith('image/') ? 'image' : 'video',
            name: media.fileName
          };
        });
        resolve(mediaList);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteMedia(mediaId: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(mediaId);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllMedia(): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const mediaStorageService = new MediaStorageService();
export type { StoredMedia };