import { ObjectUtils } from "@/share/utils";
import axios, { AxiosRequestConfig } from "axios";
import { AccountAccessToken } from "../account/acess-token";
import { getChainId, getConfig } from "../configs/context";

export class RequestModule {
  static getURL(subURL: string) {
    return `${getConfig('URL_MAIN_API')}${subURL}`
  }
  
  static async getConfigs(params = {}): Promise<AxiosRequestConfig> {
    let headers = {} as any;
    headers['chain-id'] = getChainId();

    if (typeof window !== undefined) {
      const accessToken = await AccountAccessToken.get();
      // console.log("accessToken: ", accessToken)
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    return {
      params: Object.assign(ObjectUtils.cleanObj(params), {}),
      timeout: 1000 * 60 * 30,
      headers
    }
  }

  static async get(subUrl: string, params = {}) {
    const configs = await this.getConfigs(params);
    try {
      const res = await axios.get(this.getURL(subUrl), configs);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  static async post(subURL: string, payload = {}, headers?: any) {
    let configs = await this.getConfigs();
    if (headers) {
      configs.headers = {...configs.headers, headers};
    }
    
    try { 
      const res = await axios.post(this.getURL(subURL), ObjectUtils.cleanObj(payload), configs);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  static async delete(subURL: string, payload = {}) {
    const configs = await this.getConfigs();
    try {
      const res = await axios.delete(this.getURL(subURL), {...configs, data: payload});
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  static async put(subURL: string, payload = {}) {
    const configs = await this.getConfigs();
    try {
      const res = await axios.put(this.getURL(subURL), ObjectUtils.cleanObj(payload), configs);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  static async patch(subURL: string, payload = {}) {
    const configs = await this.getConfigs();
    try {
      const res = await axios.patch(this.getURL(subURL), ObjectUtils.cleanObj(payload), configs);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  static async uploadMedia(subURL: string, file: File, limitSize?: number, key?: string) {
    const configs = await this.getConfigs();
    const formData = new FormData();
    formData.append(key || "file", file);

    // console.log("form data: ", file)

    if (limitSize) formData.append("limitWitdh", limitSize.toString());

    return axios.post(this.getURL(subURL), formData, {
      ...configs,
      headers: {
        ...configs.headers,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => res.data.data)
      .catch(err => { throw err });
  }
}