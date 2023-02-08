import {
  Page,
  Layout,
  SkeletonPage,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {FilesDataTable, FilesEmptyState} from "../components";
import {useState} from "react";
import {useAppQuery, useAuthenticatedFetch} from "../hooks/index.js";

export default function HomePage() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();

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

  if (isLoading) {
    return <SkeletonPage/>
  }

  if (data && data.length > 0) {
    return (
        <Page narrowWidth>
          <TitleBar title="Files" primaryAction={null} />
          <Layout>
            <Layout.Section>
              <FilesDataTable files={data} />
            </Layout.Section>
          </Layout>
        </Page>
    );
  } else {
    return (
        <Page narrowWidth>
          <TitleBar title="Getting Started" primaryAction={null} />
          <Layout>
            <Layout.Section>
              <FilesEmptyState />
            </Layout.Section>
          </Layout>
        </Page>
    );
  }
}
