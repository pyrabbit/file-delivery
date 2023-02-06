# frozen_string_literal: true
require "test_helper"
require "shopify_app/test_helpers/shopify_session_helper"

class HealthControllerTest < ActionController::TestCase
  test "does not redirect when there is a valid session" do
    shop_domain = "pizzabolt.myshopify.com"
    setup_shopify_session session_id: "1", shop_domain: shop_domain

    get :index

    assert_response :ok
  end
end
