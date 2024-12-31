import { Card, Page, Layout, Text, Button } from "@shopify/polaris";
import { useTranslation, Trans } from "react-i18next";
import style from "./style.module.css";
import useCreateAccount from "../features/account/useCreateAccount";
import { LoaderIcon } from "react-hot-toast";
import useGetShop from "../features/shop/usegetShop";
import {TitleBar} from  "@shopify/app-bridge-react"
import { createApp } from "@shopify/app-bridge";
import {getSessionToken} from "@shopify/app-bridge-utils"
export default function HomePage() {
  const { t } = useTranslation();
  const { createAccount, isPending, isError, error,isSuccess } = useCreateAccount();
  const { data,isLoadingShop,refetchShopInfo}=useGetShop();
  const shopOrigin=new URLSearchParams(window.location.search).get("host");
  const app = createApp({
    apiKey: 'fc224eb650734dff370cd36816975346',
    host: shopOrigin,
  });
  async function getAccessToken(shop, sessionToken) {
    const response = await fetch('/get-access-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shop, sessionToken }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to get access token');
    }
  
    const data = await response.json();
    console.log('Access Token:', data.access_token);
    return data.access_token;
  }
  async function fetchSessionToken(app) {
    const token = await getSessionToken(app);
    console.log('Session Token:', token);
    return token;
  }

  const handleConnect = async () => {
    // await createAccount({
    //   shopName: data?.shop?.name,
    //   shopDomain: data?.shop?.primaryDomain?.host,
    //   accessToken: "testing",
    //   isActive: true,
    //   userId: data?.shop?.id
    // });

    // fetchSessionToken(app).then(async (sessionToken) => {
    //  const accessToken = await getAccessToken(shopOrigin, sessionToken);
    //  console.log("access token",accessToken);
    // });
    // refetchShopInfo()
    // console.log("data",data);

  };



  return (
    <Page narrowWidth>
      <TitleBar title={"My Wonport"} />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingLg" as="h2" alignment="center">
              Connect to Wonport App
            </Text>
            <center className={style.connect_button_top}>
              <Button primary onClick={handleConnect}>
                <span className={style.button_loader}>
                  {isPending && 
                    (<LoaderIcon style={{ marginRight: "4px" }}/>)
                   }
                  {isSuccess ? "Connected": "Connect"}
                </span>
              </Button>
            </center>
          </Card>
          {/* <Layout.Section>
            <ProductsCard/>
          </Layout.Section> */}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
