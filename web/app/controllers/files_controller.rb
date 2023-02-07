# frozen_string_literal: true

class FilesController < AuthenticatedController
  def index
    Rails.logger.info 'Reaching index'
    # render :json, current_shop.files.attachments.to_json(include: :blob)
    render "[]"
  end
end
