import { useQuery } from "react-query";
import { getShopDomain } from "../../services/account-api";
export default function useGetDomain() {
  const {
    data: dataDomain,
    refetch: refetchGetDomain,
    isLoading: isLoadingDomain,
  } = useQuery({
    queryKey: ["shopInfo"],
    queryFn: async () => {
      const response = await getShopDomain();
      return  response.data;
    },
    refetchOnWindowFocus: false,
  });

  return {
    dataDomain,
    refetchGetDomain,
    isLoadingDomain,
  };
}
