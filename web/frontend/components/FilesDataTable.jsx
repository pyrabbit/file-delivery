import {Page, Card, DataTable, Link} from '@shopify/polaris';
import { humanFileSize } from "./helpers";
import React from 'react';

export function FilesDataTable(props) {
    const rows = props.files.map(x => {
        const created_at = new Date(x.created_at)
        return [
            <Link
                removeUnderline
                url={"/files/" + x.id}
                key={x.id}
            >
                {x.blob.filename}
            </Link>,
            x.blob.content_type, 
            humanFileSize(x.blob.byte_size), 
            created_at.toLocaleString(),
        ]
    });

    return (
        <Page fullWidth>
            <Card>
                <DataTable
                    columnContentTypes={[
                        'text',
                        'text',
                        'text',
                        'text'
                    ]}
                    headings={[
                        'Filename',
                        'Type',
                        'Size',
                        'Uploaded At'
                    ]}
                    rows={rows}
                    footerContent={`Showing ${rows.length} of ${rows.length} results`}
                />
            </Card>
        </Page>
    );
}