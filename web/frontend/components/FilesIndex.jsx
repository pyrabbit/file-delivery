import React, {useState} from "react";
import {
    Card,
    Layout,
    IndexTable,
    useIndexResourceState,
    Link,
    EmptySearchResult,
    SkeletonPage
} from "@shopify/polaris";
import {Toast} from "@shopify/app-bridge-react";
import {useAppQuery, useAuthenticatedFetch} from "../hooks";
import {humanFileSize} from "./helpers.js";
import {FileDropzone} from "./FileDropzone.jsx";

export function FilesIndex() {
    const emptyToastProps = {content: null};
    const [toastProps, setToastProps] = useState(emptyToastProps);
    const fetch = useAuthenticatedFetch();

    const resourceName = {
        singular: 'file',
        plural: 'files',
    };

    const {
        data,
        refetch: refetchFiles,
        isLoading: isLoadingFiles,
        isRefetching: isRefetchingFiles,
    } = useAppQuery({url: "/api/files"});

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
        useIndexResourceState(data);

    const toastMarkup = toastProps.content && !isRefetchingFiles && (
        <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)}/>
    );

    const rowMarkup = data.map(
        (x, index) => (
            <IndexTable.Row
                id={x.id}
                key={x.id}
                selected={selectedResources.includes(x.id)}
                position={index}
            >
                <IndexTable.Cell>
                    <Link
                        removeUnderline
                        url={"/files/" + x.id}
                        key={x.id}
                    >
                        {x.blob.filename}
                    </Link>
                </IndexTable.Cell>
                <IndexTable.Cell>{x.blob.content_type}</IndexTable.Cell>
                <IndexTable.Cell>{humanFileSize(x.blob.byte_size)}</IndexTable.Cell>
                <IndexTable.Cell>{new Date(x.created_at).toLocaleString()}</IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    if (isLoadingFiles) {
        return <SkeletonPage/>;
    }

    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No files found'}
            description={'Drag files on to the page or click "Add files" above to upload your first files.'}
            withIllustration
        />
    );

    const promotedBulkActions = [
        {
            content: 'Delete files',
            onAction: async () => {
                let message = 'Are you sure you want to delete the selected file?';
                if (selectedResources.length > 1) {
                    message = 'Are you sure you want to delete the ' + selectedResources.length + ' selected files?'
                }
                const confirmed = confirm(message);
                if (confirmed) {
                    let promises = [];
                    for (let i = 0; i < selectedResources.length; i++) {
                        const p = await fetch('/api/files/' + selectedResources[i], {
                            method: 'DELETE'
                        });
                        promises += p;
                    }
                    Promise.all(promises).then(() => refetchFiles())
                }
            },
        },
    ];

    return (
        <>
            {toastMarkup}
            <Layout>
                <Layout.AnnotatedSection
                    id='fileUploads'
                    title='Upload Files'
                    description='Drag files on to the page or click "Add files" to browse files on your computer.'
                >
                    <FileDropzone toastHandler={setToastProps} handleOnUpload={refetchFiles}/>
                </Layout.AnnotatedSection>
                <Layout.AnnotatedSection
                    id='listFiles'
                    title='List Files'
                    description={'Click on a file name to attach the file to products or to see further details ' +
                        'about the file. Select one or more files to delete them.'}
                >
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
                                {title: 'Filename'},
                                {title: 'Type'},
                                {title: 'Size'},
                                {title: 'Uploaded At'},
                            ]}
                        >
                            {rowMarkup}
                        </IndexTable>
                    </Card>
                </Layout.AnnotatedSection>
            </Layout>
        </>
    );
}

