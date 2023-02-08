# frozen_string_literal: true

class FilesController < AuthenticatedController
  def index
    render json: current_shop.product_files.attachments.to_json(include: [:blob])
  end

  def create
    current_shop.product_files.attach(params[:files])
    render json: {message: 'Thanks for the file dude.'}.as_json
  end

  def destroy
    product = current_shop.product_files.find(params[:id])
    product.purge_later
    render json: {message: 'The file is totally gone now.'}.as_json
  end

  private

  def file_params
    params.permit(files: [])
  end
end
