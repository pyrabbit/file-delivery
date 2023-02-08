import { useState } from "react";
import {
    Card,
    Heading,
    TextContainer,
    DisplayText,
    TextStyle,
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import {FilesEmptyState} from "./FilesEmptyState.jsx";
import {FilesDataTable} from "./FilesDataTable.jsx";

export function FilesIndex() {
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

    const toastMarkup = toastProps.content && !isRefetchingFiles && (
        <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
    );


}
