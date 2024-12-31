import { format } from "date-fns";
export function handleError(error) {
  if (!error.response) {
    return new Error("Network error: Unable to reach the server. ");
  }

  if (error.response && error.response.data && error.response.data.detail) {
    if (typeof error.response.data.detail === "string")
      return new Error(error.response.data.detail);
  }

  return new Error("An unexpected error occurred. Please try again.");
}


export const dateFormated=(date)=>{
  return format(new Date(date), "dd-mm-yyyy")
}