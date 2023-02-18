# frozen_string_literal: true

class Shop < ActiveRecord::Base
  include ShopifyApp::ShopSessionStorageWithScopes
  has_many_attached :product_files
  has_many :product_attachments, dependent: :destroy

  def api_version
    ShopifyApp.configuration.api_version
  end
end
