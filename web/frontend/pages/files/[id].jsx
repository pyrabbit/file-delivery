import {
    Card,
    Layout,
    Page,
    SkeletonPage
} from "@shopify/polaris";
import {useAppQuery} from "../../hooks/index.js";
import {useParams} from "react-router-dom";
import {humanFileSize} from "../../components/helpers.js";
import {ProductsIndex} from "../../components/index.js";

export default function FileShow() {
    const routeParams = useParams();

    const {
        data: file,
        isLoading: isLoadingFile,
    } = useAppQuery({
        url: "/api/files/" + routeParams.id
    });

    const {
        data: attachments,
        refetch: refetchAttachments,
        isLoading: isLoadingAttachments
    } = useAppQuery({
        url: "/api/product_attachments?active_storage_attachment_id=" + routeParams.id
    });

    if (isLoadingFile || isLoadingAttachments) {
        return <SkeletonPage/>;
    }

    return (
        <Page
            breadcrumbs={[{content: 'Files', url: '/'}]}
            title={file.blob.filename}
            subtitle={humanFileSize(file.blob.byte_size)}
            fullWidth
        >
            <Layout>
                <Layout.AnnotatedSection
                    id='productAttachments'
                    title={'Attach this file to one or more products'}
                    description={'Attach ' + file.blob.filename + ' to your products. When orders are placed ' +
                        'the order will be automatically fulfilled and download instructions will be sent to the ' +
                        'customer\'s email address.'}
                >
                    <ProductsIndex attachments={attachments}
                                   attachmentId={routeParams.id}
                                   handleOnAttach={refetchAttachments}/>
                </Layout.AnnotatedSection>
            </Layout>
        </Page>
    );
}