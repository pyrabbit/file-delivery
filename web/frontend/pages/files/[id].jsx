import {
    CalloutCard,
    Card, Checkbox,
    DataTable, DropZone,
    Layout,
    Modal,
    Page,
    SkeletonBodyText,
    SkeletonPage,
    Stack
} from "@shopify/polaris";
import React, {useCallback, useState} from "react";
import {useAppQuery} from "../../hooks/index.js";
import {useParams} from "react-router-dom";
import {humanFileSize} from "../../components/helpers.js";
import {ProductPickerModal} from "../../components/ProductPickerModal.jsx";
import {ProductsIndex} from "../../components/ProductsIndex.jsx";

export default function FileShow() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true)
    const [pickerIsActive, setPickerIsActive] = useState(false);
    const handleChange = useCallback(() => setPickerIsActive(!pickerIsActive), [pickerIsActive]);
    const routeParams = useParams();

    const {
        data,
        isLoading: isLoadingFiles,
    } = useAppQuery({
        url: "/api/files/" + routeParams.id,
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
        url: "/api/product_attachments?active_storage_attachment_id=" + routeParams.id,
        reactQueryOptions: {
            onSuccess: () => {
                setIsLoadingProducts(false);
            },
        },
    });


    if (isLoading || isLoadingProducts) {
        return <SkeletonPage/>;
    }

    if (productsData.length > 0) {
        return (
            <Page
                breadcrumbs={[{content: 'Files', url: '/'}]}
                title={data.blob.filename}
                subtitle={humanFileSize(data.blob.byte_size)}
                fullWidth
            >
                <Card>
                    <Card.Section title="Attached Products">
                        <ProductsIndex/>
                    </Card.Section>

                    <Card.Section title="The Numbers">

                    </Card.Section>
                </Card>
            </Page>
        );
    } else {
        return (
            <Page
                breadcrumbs={[{content: 'Files', url: '/'}]}
                title={data.blob.filename}
                subtitle={humanFileSize(data.blob.byte_size)}
                fullWidth
            >
                <ProductPickerModal handleChange={handleChange} active={pickerIsActive}/>

                <CalloutCard
                    title="Attach this file to a product"
                    illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                    primaryAction={{
                        content: 'Attach a product',
                        onAction: handleChange
                    }}
                >
                    <p>
                        Attach this file to a product so it can be digitally delivered to your customer.
                    </p>
                </CalloutCard>
                <ProductsIndex/>
            </Page>
        );
    }
}