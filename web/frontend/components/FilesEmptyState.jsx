import {Card, DropZone, EmptyState, Stack, Thumbnail} from '@shopify/polaris';
import React, {useCallback, useEffect, useState} from 'react';
import {NoteMinor} from "@shopify/polaris-icons";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
export function FilesEmptyState() {
    return (
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
                    <DropZoneExample/>
                </>

            </EmptyState>
        </Card>
    );
}
function DropZoneExample() {
    const [files, setFiles] = useState([]);
    const fetch = useAuthenticatedFetch();

    const handleDropZoneDrop = useCallback( async (_dropFiles, acceptedFiles, _rejectedFiles) => {
            setFiles((files) => [...files, ...acceptedFiles]);
            let formData = new FormData();
            formData.append('files', acceptedFiles)
            let options = {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            await fetch('/api/files', options);
        },
        [],
    );
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

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
                                validImageTypes.includes(file.type)
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