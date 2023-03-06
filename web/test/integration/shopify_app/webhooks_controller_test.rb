# frozen_string_literal: true
require 'test_helper'

module ShopifyApp
  class WebhooksControllerTest < ActionDispatch::IntegrationTest
    include ShopifyApp::TestHelpers::ShopifySessionHelper
    include ActiveJob::TestHelper

    test 'accepts orders_create webhook' do
      filepath = Rails.root.join('test/webhooks/shopify/orders_create.json')
      request_body = File.read(filepath)
      ShopifyApp::PayloadVerification.stubs(:hmac_valid?).returns(true) do
        assert_enqueued_jobs 1, only: OrdersCreateJob do
          post '/api/webhooks/orders_create', params: JSON.parse(request_body), as: :json, headers: {
            'HTTP_X_SHOPIFY_SHOP_DOMAIN' => 'pizzabolt.myshopify.com'
          }
          assert_response :success
        end
      end
    end
  end
end
