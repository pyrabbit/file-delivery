# frozen_string_literal: true

class ProductAttachmentsControllerTest < ActionController::TestCase
  include ShopifyApp::TestHelpers::ShopifySessionHelper

  setup do
    @shop = shops(:pizzabolt)
  end

  test 'list product files success' do
    setup_shopify_session session_id: '1', shop_domain: @shop.shopify_domain
    get :index
    assert_response :success
  end

  test 'query list for active storage attachment success' do
    setup_shopify_session session_id: '1', shop_domain: @shop.shopify_domain
    get :index
    assert_response :success
    json = JSON.parse(response.body)
    assert_equal 2, json.size
    active_storage_attachment_id = active_storage_attachments(:minion_attachment).id
    puts "active storage attachment id = #{active_storage_attachment_id}"
    get :index, params: { active_storage_attachment_id: }
    assert_response :success
    json = JSON.parse(response.body)
    assert_equal 1, json.size
  end

  test 'attaches product files success' do
    setup_shopify_session session_id: '1', shop_domain: @shop.shopify_domain
    active_storage_attachment_id = active_storage_attachments(:pb_attachment).id
    product_ids = %w[prod_8sdhfj238423423 prod_2349jkafu89sd]
    assert_difference -> { @shop.product_attachments.count }, 2 do
      post :create, params: { product_attachment: { active_storage_attachment_id:, product_ids: } }
    end
    assert_response :success
  end
  
  test 'detaches product files success' do
    
  end
end
