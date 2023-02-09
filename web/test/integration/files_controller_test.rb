# frozen_string_literal: true
require 'test_helper'

class FilesControllerTest < ActionController::TestCase
  include ShopifyApp::TestHelpers::ShopifySessionHelper

  setup do
    @shop = shops(:pizzabolt)
  end

  def after_teardown
    super
    FileUtils.rm_rf(ActiveStorage::Blob.service.root)
  end

  test 'list files success' do
    setup_shopify_session session_id: '1', shop_domain: @shop.shopify_domain
    get :index
    assert_response :success
  end

  test 'file upload success' do
    setup_shopify_session session_id: '1', shop_domain: @shop.shopify_domain
    product_files = [fixture_file_upload('/earth.gif', 'image/gif')]
    assert_difference -> { @shop.product_files.count }, 1 do
      post :create, params: { shop: { product_files: } }
    end
    assert_response :success
  end

  test 'file deletion success' do
    setup_shopify_session session_id: '1', shop_domain: @shop.shopify_domain
    product_files = [fixture_file_upload('/earth.gif', 'image/gif')]
    assert_difference -> { @shop.product_files.count }, 1 do
      post :create, params: { shop: { product_files: } }
    end
    assert_response :success
    assert_difference -> { ActiveStorage::Attachment.count }, -1 do
      delete :destroy, params: { id: @shop.product_files.attachments.first.id }
    end
    assert_response :success
  end
end
