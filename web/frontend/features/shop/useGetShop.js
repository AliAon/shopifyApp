import { useQuery } from "react-query";
import {getShopInfo} from "../../services/shop-api"
export default function useGetShop() {
  const {
    data,
    refetch: refetchShopInfo,
    isLoading: isLoadingShop,
  } = useQuery({
    queryKey: ["shopInfo"],
    queryFn: async () => {
      const response = await getShopInfo();
      return  response;
    },
    refetchOnWindowFocus: false,
  });

  return {
    data,
    refetchShopInfo,
    isLoadingShop,
  };
}
