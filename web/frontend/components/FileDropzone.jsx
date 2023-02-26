import React, {useCallback, useState} from "react";
import {useAuthenticatedFetch} from "../hooks/index.js";
import {Card, DropZone, Stack, Thumbnail} from "@shopify/polaris";
import {NoteMinor} from "@shopify/polaris-icons";

export function FileDropzone(props) {
    const [files, setFiles] = useState([]);
    const fetch = useAuthenticatedFetch();

    const handleDropZoneDrop = useCallback(async (_dropFiles, acceptedFiles, _rejectedFiles) => {
            setFiles((files) => [...files, ...acceptedFiles]);
            let formData = new FormData();
            for (let i = 0; i < acceptedFiles.length; i++) {
                formData.append('shop[product_files][]', acceptedFiles[i])
            }
            const response = await fetch('/api/files', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                props.toastHandler({content: "Success! Your files were uploaded."});
                setFiles((files) => []);
                props.handleOnUpload();
            } else {
                props.toastHandler({content: "An error occurred while uploading your files.", error: true});
            }
        },
        [],
    );

    const validFileTypes = ['image/gif', 'image/jpeg', 'image/png', 'application/pdf'];

    const fileUpload = !files.length && <DropZone.FileUpload/>;
    const uploadedFiles = files.length > 0 && (
        <div style={{padding: '0'}}>
            <Stack>
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
        <DropZone outline={false} onDrop={handleDropZoneDrop} dropOnPage={true}>
            <Card sectioned>
                <DropZone>
                    {uploadedFiles}
                    {fileUpload}
                </DropZone>
            </Card>
        </DropZone>
    );
}