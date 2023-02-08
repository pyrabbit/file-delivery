# frozen_string_literal: true
require 'test_helper'

class HealthControllerTest < ActionController::TestCase
  include ShopifyApp::TestHelpers::ShopifySessionHelper

  setup do
    @shop = shops(:pizzabolt)
  end

  test 'health check success' do
    setup_shopify_session session_id: '1', shop_domain: @shop.shopify_domain
    get :index
    assert_response :success
  end
end
