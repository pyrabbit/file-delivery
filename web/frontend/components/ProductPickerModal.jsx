import {Modal, Stack} from "@shopify/polaris";
import React from "react";
import {ProductPickerList} from "./ProductPickerList.jsx";

export function ProductPickerModal(props) {
    return (
        <Modal
            open={props.active}
            onClose={props.handleChange}
            title="Attach one or more products to your file"
            primaryAction={{
                content: 'Attach products',
                onAction: props.handleChange,
            }}
            secondaryActions={[
                {
                    content: 'Cancel',
                    onAction: props.handleChange,
                },
            ]}
        >
            <Modal.Section>
                <Stack vertical>
                    <ProductPickerList/>
                </Stack>
            </Modal.Section>
        </Modal>
    );
}