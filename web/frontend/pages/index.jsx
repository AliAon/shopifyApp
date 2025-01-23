import { Card, Page, Layout, Text, Button } from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import style from "./style.module.css";
import { TitleBar } from "@shopify/app-bridge-react";
import useCreateAccount from "../features/account/useCreateAccount";
import useGetShop from "../features/shop/useGetShop";
import { LoaderIcon } from "react-hot-toast";
import { useState } from "react";
import useGetCurrentUser from "../features/account/useGetCurrentUser";
import { createApp } from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions";
import useGetDomain from "../features/shop/useGetDomain";
export default function HomePage() {
  const { t } = useTranslation();
  const app = createApp({
    apiKey: "fc224eb650734dff370cd36816975346",
    host: new URLSearchParams(window.location.search).get("host"),
  });

  const redirect = Redirect.create(app);  
  const { data, isLoadingShop } = useGetShop();
  // const {dataDomain,isLoadingDomain,refetchGetDomain}=useGetDomain(data[0]?.domain)
  const appUrl = window.location.origin;  // Get current base URL
  const handleConnect = async () => {
    app.getState().then((state) => {
      console.log("state", state);
    });
    redirect.dispatch(Redirect.Action.REMOTE,`http://localhost:3000/firstAuthFromShopify?shop=${data[0]?.domain}&email=${data[0]?.email}&appUrl=${appUrl}`)
  };

  // console.log("isLoadingDomain",isLoadingDomain)

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
                 Connect
              </Button>
            </center>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
