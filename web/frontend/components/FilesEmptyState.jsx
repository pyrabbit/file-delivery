import {EmptyState} from '@shopify/polaris';
import React from 'react';
import {FileDropzone} from "./FileDropzone.jsx";


export function FilesEmptyState(props) {
    return (
        <>
            <EmptyState
                heading="Upload a file to get started"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                fullWidth
            >
                <p style={{marginBottom: 20}} className="p-font-size-200">
                    Welcome 🎉 Get started by dropping your first file in the box below. Afterwards,
                    you can map it to one or more of your products.
                </p>
                <>
                    <FileDropzone toastHandler={props.toastHandler}/>
                </>
            </EmptyState>
        </>
    );
}