import {Avatar, ResourceItem, ResourceList, Spinner} from "@shopify/polaris";
import {useState} from "react";
import {useAppQuery} from "../hooks/index.js";

export function ProductPickerList() {
    const [selectedItems, setSelectedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {
        data,
        isLoading: isLoadingProducts,
    } = useAppQuery({
        url: "/api/products",
        reactQueryOptions: {
            onSuccess: () => {
                setIsLoading(false);
            },
        },
    });
    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    if (isLoading) {
        return <Spinner size="small"/>;
    }

    if (data.body.data.products.edges.length > 1) {
        return (
            <ResourceList
                resourceName={resourceName}
                items={data.body.data.products.edges}
                renderItem={renderItem}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                selectable
            />
        );
    } else {
        return <p>You do not have any products.</p>;
    }
}

function renderItem(item) {
    const media = <Avatar customer size="medium" name={item.node.title} />;

    return (
        <ResourceItem
            id={item.node.title}
            url={item.node.title}
            media={media}
            accessibilityLabel={`View details for ${item.node.title}`}
        >
            <p>{item.node.title}</p>
            <div>{item.node.title}</div>
        </ResourceItem>
    );
}