import {
  Page,
  Layout,
  SkeletonPage,
  CalloutCard,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {FilesIndex} from "../components";
import {useState} from "react";
import {useAppQuery, useAuthenticatedFetch} from "../hooks/index.js";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  useAuthenticatedFetch();

  const {
    data,
    refetch: refetchFiles,
    isLoading: isLoadingFiles,
    isRefetching: isRefetchingFiles,
  } = useAppQuery({
    url: "/api/files",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const {
    data: productsData,
    isLoadingProducts: isLoadingPs
  } = useAppQuery({
    url: "/api/product_attachments",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoadingProducts(false);
      },
    },
  });

  if (isLoading || isLoadingProducts) {
    return <SkeletonPage/>
  }

  const calloutMarkup = () => (
      <Layout.Section>
        <CalloutCard
            title="Attach your first file to a product"
            illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
            primaryAction={{
              content: 'Add ' + data[0]['blob']['filename'] + ' to a product',
              url: '/files/' + data[0]['id'],
            }}
        >
          <p>
            Attach files to your products so they can be delivered to your customers when they complete their order.
          </p>
        </CalloutCard>
      </Layout.Section>
  );

  return (
      <Page fullWidth>
        <TitleBar title={data.length > 0 ? 'Files' : 'Getting Started'} primaryAction={null} />
        <Layout>
          {productsData.length < 1 && data.length > 0 ? calloutMarkup : null}
          <Layout.Section>
            <FilesIndex files={data}/>
          </Layout.Section>
        </Layout>
      </Page>
  );
}
