import axiosClient from "../utils/axiosClient";
import { handleError } from "../utils/helpers/";

export async function createAccount(data) {
  try {
    const res = await axiosClient.post(`/shopifyAccount/create`, data);
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
}
export async function getAccount() {
  try {
    const res = await axiosClient.get(`/shopifyAccount/getAccount`);
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function getCurrentUser() {
  try {
    const res = await fetch(`/api/get-current-user`);
    return await res.json();
  } catch (error) {
    throw handleError(error);
  }
}

export async function getShopDomain(domain) {
  try {
    const res = await axiosClient.get(`/shopifyAccount/findAll?shopDomain=${domain}`);
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
}







