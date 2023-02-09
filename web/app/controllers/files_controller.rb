# frozen_string_literal: true

class FilesController < AuthenticatedController
  def index
    render json: current_shop.product_files.attachments.to_json(include: [:blob])
  end

  def create
    if current_shop.update product_files: params[:product_files]
      render json: { message: 'Thanks for the file dude.' }.as_json
    else
      render json: { message: 'Failed to update shop.' }.as_json, status: :unprocessable_entity
    end
  end

  def destroy
    product = current_shop.product_files.find(params[:id])
    if product.purge
      render json: { message: 'The file is totally gone now.' }.as_json
    else
      render json: { message: 'Failed to delete file.' }.as_json, status: :unprocessable_entity
    end
  end
end
