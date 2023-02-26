import React, {useState} from "react";
import {
    Card,
    IndexTable,
    useIndexResourceState,
    SkeletonBodyText,
    Badge,
    EmptyState
} from "@shopify/polaris";
import {Toast} from "@shopify/app-bridge-react";
import {useAppQuery, useAuthenticatedFetch} from "../hooks";

export function ProductsIndex(props) {
    const emptyToastProps = {content: null};
    const [pageInfo, setPageInfo] = useState({})
    const [toastProps, setToastProps] = useState(emptyToastProps);
    const attachmentId = props.attachmentId;
    const fetch = useAuthenticatedFetch();

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
            select: (response) => {
                let products = response.body.data.products.edges;
                for (let i = 0; i < products.length; i++) {
                    var x = props.attachments.filter(a => a.product_id === products[i].node.id)
                    if (x.length > 0) {
                        products[i]['attached'] = true;
                    } else {
                        products[i]['attached'] = false;
                    }
                    products[i]['id'] = products[i].node.id;
                }
                return products
            }
        },
    });

    const {
        selectedResources,
        allResourcesSelected,
        handleSelectionChange,
        clearSelection
    } = useIndexResourceState(data);

    const toastMarkup = toastProps.content && !isRefetchingProducts && (
        <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)}/>
    );

    if (isLoadingProducts) {
        return <SkeletonBodyText/>;
    }

    const rowMarkup = data.map(
        (x, index) => (
            <IndexTable.Row
                id={x.node.id}
                key={x.node.id}
                selected={selectedResources.includes(x.node.id)}
                position={index}
            >
                <IndexTable.Cell>{x.node.title}</IndexTable.Cell>
                <IndexTable.Cell>
                    {x.attached
                        ? <Badge status="success">Attached</Badge>
                        : <Badge>Unattached</Badge>
                    }
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    const emptyStateMarkup = (
        <EmptyState
            heading="Create your first product"
            action={{
                content: 'Learn more',
                url: 'https://help.shopify.com/en/manual/intro-to-shopify/initial-setup/setup-your-store#add-more-products-to-your-store',
            }}
            image="https://cdn.shopify.com/shopifycloud/web/assets/v1/67d1bd2ad29c4adc50fb195375f31fcb1674823604794398778c01f6c185d702.svg"
        >
            <p>Create your first product before attempting to attach any files. Only after you have created your first
                product will you be able to attach it to this file</p>
        </EmptyState>
    );

    const promotedBulkActions = [
        {
            content: 'Attach products',
            onAction: async () => {
                await attach(selectedResources)
                    .then(() => {
                        props.handleOnAttach();
                        clearSelection();
                    });
            },
        },
        {
            content: 'Detach products',
            onAction: async () => {
                await detach(selectedResources)
                    .then(() => {
                        props.handleOnAttach();
                        clearSelection();
                    })
            }
        }
    ];

    const attach = async (productIds) => {
        return await fetch('/api/product_attachments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                product_attachment: {
                    active_storage_attachment_id: attachmentId,
                    product_ids: productIds
                }
            })
        });
    };

    const detach = async (productIds) => {
        return await fetch('/api/product_attachments', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                product_attachment: {
                    active_storage_attachment_id: attachmentId,
                    product_ids: productIds
                }
            })
        })
    }

    return (
        <>
            {toastMarkup}
            <Card>
                <IndexTable
                    resourceName={resourceName}
                    itemCount={data.length}
                    emptyState={emptyStateMarkup}
                    promotedBulkActions={promotedBulkActions}
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

