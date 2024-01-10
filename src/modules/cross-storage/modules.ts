import {CrossStorageClient} from 'cross-storage';
import {CrossStorageKey} from './types'
import { ENV, getConfig } from '../configs/context';

export class CrossStorageModule {
  static isConnected = false
  static storage =
    typeof window !== 'undefined'
      ? new CrossStorageClient(getConfig('URL_CROSS_STORAGE'), {
          timeout: 1000 * 60 * 10,
        })
      : ({} as any)

  static async initStorage() {
    if (this.isConnected) return;
    await this.storage.onConnect();
  }

  static getKey(key: CrossStorageKey) {
    return `BLOCKCLIP_${ENV}-${key}`
  }

  static async get(key: CrossStorageKey): Promise<string | null> {
    await this.initStorage();
    console.log("storage: ", this.storage)
    const data = await this.storage
      .get(this.getKey(key))
      .then((res: any) => res || null)
    return data
  }

  static async set(key: CrossStorageKey, value: string) {
    await this.initStorage()
    return this.storage.set(this.getKey(key), value)
  }

  static async del(key: CrossStorageKey) {
    await this.initStorage()
    return this.storage.del(this.getKey(key)).catch(() => false)
  }
}
