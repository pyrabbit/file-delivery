# frozen_string_literal: true

class FilesController < AuthenticatedController
  def index
    render json: current_shop.product_files.attachments.to_json(include: [:blob])
  end

  def create
    if current_shop.update(shop_params)
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

  private

  def shop_params
    params.fetch(:shop, {}).permit(product_files: [])
  end
end
