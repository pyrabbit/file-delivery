# frozen_string_literal: true

class FilesController < AuthenticatedController
  def index
    render json: current_shop.product_files.attachments.to_json(include: [:blob])
  end

  def create
    file_params[:product_files].each do |file|
      current_shop.product_files.attach file
    end
    render json: { message: 'Thanks for the files bro.' }.as_json
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

  def file_params
    params.require(:shop).permit(product_files: [])
  end
end
