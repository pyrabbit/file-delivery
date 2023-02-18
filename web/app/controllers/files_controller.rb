# frozen_string_literal: true

class FilesController < AuthenticatedController
  before_action :set_file, only: [:show, :destroy]

  def index
    render json: current_shop.product_files.attachments.to_json(include: [:blob])
  end

  def show
    render json: @file.as_json(include: [:blob])
  end

  def create
    file_params[:product_files].each do |file|
      current_shop.product_files.attach file
    end
    render json: { message: 'Thanks for the files bro.' }.as_json
  end

  def destroy
    if @file.purge
      render json: { message: 'The file is totally gone now.' }.as_json
    else
      render json: { message: 'Failed to delete file.' }.as_json, status: :unprocessable_entity
    end
  end

  private

  def file_params
    params.require(:shop).permit(product_files: [])
  end

  def set_file
    @file = current_shop.product_files.find(params[:id])
  end
end
