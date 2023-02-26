# frozen_string_literal: true

class ProductAttachmentsController < AuthenticatedController
  def index
    product_attachments = current_shop.product_attachments
    if params[:active_storage_attachment_id]
      active_storage_attachment_id = params[:active_storage_attachment_id].to_i
      product_attachments = product_attachments.where(active_storage_attachment_id:)
    end
    render json: product_attachments.as_json
  end

  def create
    active_storage_attachment_id = product_attachment_params[:active_storage_attachment_id]
    errors = []
    product_attachment_params[:product_ids].each do |product_id|
      attachment = current_shop.product_attachments.build(active_storage_attachment_id:)
      attachment.product_id = product_id
      attachment.save if attachment.valid?
      errors += attachment.errors.full_messages
    end

    if errors.any?
      render json: {
        message: 'Some errors occurred during when attaching the file to your products.',
        errors: errors.flatten
      }
    else
      render json: { message: 'Your products are totally associated with files now.' }
    end
  end

  def destroy
    active_storage_attachment_id = product_attachment_params[:active_storage_attachment_id]
    errors = []
    product_attachment_params[:product_ids].each do |product_id|
      current_shop.product_attachments.where(active_storage_attachment_id:, product_id:).destroy_all
    end

    if errors.any?
      render json: {
        message: 'Some errors occurred during when attaching the file to your products.',
        errors: errors.flatten
      }
    else
      render json: { message: 'Your products are totally associated with files now.' }
    end
  end

  private

  def product_attachment_params
    params.require(:product_attachment).permit(:active_storage_attachment_id, product_ids: [])
  end
end
