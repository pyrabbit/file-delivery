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

export function FilesCard() {
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

    return (
        <>
            {toastMarkup}
            <Card
                title="Nice work on building a Shopify app 🎉"
                sectioned
            >
                <TextContainer spacing="loose">
                    <p>
                        Sample products are created with a default title and price. You can
                        remove them at any time.
                    </p>
                </TextContainer>
            </Card>
        </>
    );
}
