import React, { useState } from "react";
import {
    Card,
    IndexTable,
    useIndexResourceState,
    Link,
    SkeletonBodyText, Badge, Layout

} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery } from "../hooks";
import { FilesEmptyState } from "./FilesEmptyState.jsx";
import {humanFileSize} from "./helpers.js";

export function ProductsIndex() {
    const emptyToastProps = { content: null };
    const [isLoading, setIsLoading] = useState(true);
    const [toastProps, setToastProps] = useState(emptyToastProps);

    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const {
        data,
        refetch: refetchProducts,
        isLoading: isLoadingProducts,
        isRefetching: isRefetchingProducts,
    } = useAppQuery({
        url: "/api/products",
        reactQueryOptions: {
            onSuccess: () => {
                setIsLoading(false);
            },
            select: (response) => response.body.data.products
        },
    });
    const {selectedResources, allResourcesSelected, handleSelectionChange} =
        useIndexResourceState(data);

    const toastMarkup = toastProps.content && !isRefetchingProducts && (
        <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
    );

    const emptyStateMarkup = (
        <FilesEmptyState toastHandler={setToastProps}/>
    );

    if (isLoading) {
        return (
            <>
                <SkeletonBodyText/>
            </>
        );
    }

    const rowMarkup = data.edges.map(
        (x, index) => (
            <IndexTable.Row
                id={x.node.id}
                key={x.node.id}
                selected={selectedResources.includes(x.node.id)}
                position={index}
            >
                <IndexTable.Cell>{x.node.title}</IndexTable.Cell>
                <IndexTable.Cell>
                    {false
                        ? <Badge status="success">Attached</Badge>
                        : <Badge>Unattached</Badge>
                    }
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    return (
        <>
            {toastMarkup}
            <Card>
                <IndexTable
                    resourceName={resourceName}
                    itemCount={data.edges.length}
                    emptyState={emptyStateMarkup}
                    selectedItemsCount={
                        allResourcesSelected ? 'All' : selectedResources.length
                    }
                    onSelectionChange={handleSelectionChange}
                    headings={[
                        {title: 'Product'},
                        {title: 'Status'}
                    ]}
                >
                    {rowMarkup}
                </IndexTable>
            </Card>
        </>
    );
}

