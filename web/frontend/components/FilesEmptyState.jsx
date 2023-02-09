import {Card, DropZone, EmptyState, Stack, Thumbnail} from '@shopify/polaris';
import React, {useCallback, useEffect, useState} from 'react';
import {NoteMinor} from "@shopify/polaris-icons";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import {Toast} from "@shopify/app-bridge-react";


export function FilesEmptyState() {
    const emptyToastProps = { content: null };
    const [toastProps, setToastProps] = useState(emptyToastProps);

    const toastMarkup = toastProps.content && (
        <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
    );

    return (
        <>
            {toastMarkup}
            <Card sectioned>
                <EmptyState
                    heading="Upload a file to get started"
                    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                    fullWidth
                >
                    <p style={{marginBottom: 20}} className="p-font-size-200">
                        Welcome 🎉  Get started by dropping your first file in the box below. Afterwards,
                        you can map it to one or more of your products.
                    </p>
                    <>
                        <DropZoneExample toastHandler={setToastProps}/>
                    </>

                </EmptyState>
            </Card>
        </>
    );
}
function DropZoneExample(props) {
    const [files, setFiles] = useState([]);
    const fetch = useAuthenticatedFetch();

    const handleDropZoneDrop = useCallback( async (_dropFiles, acceptedFiles, _rejectedFiles) => {
            setFiles((files) => [...files, ...acceptedFiles]);
            let formData = new FormData();
            for(let file in acceptedFiles) {
                formData.append('product_files[]', file)
            }
            var response = await fetch('/api/files', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.ok) {
                props.toastHandler({ content: "We successfully uploaded your files." });
                setFiles((files) => []);
            } else {
                props.toastHandler({ content: "An error occurred while uploading your files.", error: true });
            }
        },
        [],
    );
    const validFileTypes = ['image/gif', 'image/jpeg', 'image/png'];

    const fileUpload = !files.length && <DropZone.FileUpload />;
    const uploadedFiles = files.length > 0 && (
        <div style={{padding: '0'}}>
            <Stack vertical>
                {files.map((file, index) => (
                    <Stack alignment="center" key={index}>
                        <Thumbnail
                            size="small"
                            alt={file.name}
                            source={
                                validFileTypes.includes(file.type)
                                    ? window.URL.createObjectURL(file)
                                    : NoteMinor
                            }
                        />
                        <div>
                            {file.name}{' '}
                            {file.size} bytes
                        </div>
                    </Stack>
                ))}
            </Stack>
        </div>
    );

    return (
        <DropZone onDrop={handleDropZoneDrop} dropOnPage={true}>
            {uploadedFiles}
            {fileUpload}
        </DropZone>
    );
}