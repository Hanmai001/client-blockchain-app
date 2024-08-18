import * as crypto from 'crypto';
import { AccountAccessToken } from '../account/acess-token';
import { RequestModule } from '../request/request';

export class LicenseModule {
  static saveLicense(id: string, license: string) {
    localStorage.setItem(`license_${id}`, license);
  }
  
  static removeAllLicenses() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('license_')) {
        localStorage.removeItem(key);
      }
    });
  }

  static async getLicense(payload: {tokenID: string}) {
    const existingLicense = localStorage.getItem(`license_${payload.tokenID}`);
    if (existingLicense) {
      return existingLicense;
    }
    const license = await RequestModule.post(`/api/v1/tokens/license`, payload);
    this.saveLicense(payload.tokenID, license.data);
    return license.data;
  }

  static async decrypt(license: string, src: string): Promise<any> {
   try {
      // Fetch the encrypted video from the URL
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`Failed to fetch video from ${src}`);
      }

      // Convert the response to an ArrayBuffer
      const encryptedVideoBuffer = await response.arrayBuffer();

      const accessToken = await AccountAccessToken.get();
      if (!accessToken) {
        throw new Error(`Failed to get access token`);
      }

      const algorithm = "aes256";
      const decipherKey = crypto.createDecipher(algorithm, accessToken);
      const decryptedKey =
        (decipherKey.update(license, "hex", "utf8")) + decipherKey.final("utf8");
   
      const encryptedVideoBufferArray = Buffer.from(encryptedVideoBuffer);
      const decipherVideo = crypto.createDecipher("aes-256-cbc", decryptedKey);
      let decryptedBytes = Buffer.concat([
        decipherVideo.update(encryptedVideoBufferArray),
        decipherVideo.final(),
      ]);

      return decryptedBytes;
  } catch (error) {
    console.error("Error decrypting video:", error);
    throw error;
  }
  }
}