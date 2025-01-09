import { useQuery } from "react-query";
import { getCurrentUser as getCurrentUserApi } from "../../services/account-api";

export default function useGetCurrentUser() {
  const {
    data: currentUser,
    refetch: refetchCurrentUser,
    isLoading: isLoadingUser,
    isError:isErrorUser,
    error:errorUser,
    isSuccess:isSuccessUser,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await getCurrentUserApi();
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  return {
    currentUser,
    refetchCurrentUser,
    isLoadingUser,
    isErrorUser,
    errorUser,
    isSuccessUser
  };
}
