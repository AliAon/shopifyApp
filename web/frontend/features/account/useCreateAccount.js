import { useMutation } from "react-query";
import {createAccount as createAccountApi} from "../../services/account-api"
import toast from "react-hot-toast";

export default function useCreateAccount() {
  const { mutate: createAccount, isLoading:isPending, isError, data, error,isSuccess } = useMutation(createAccountApi, {

    onSuccess: (res) => {
      toast.success(
        `New user "${res.data.shopName} "connected successfully`
      );
      return res.data
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return {
    createAccount,
    isPending,
    isError,
    data,
    error,
    isSuccess
  }
};


