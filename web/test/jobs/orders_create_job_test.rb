require 'test_helper'

class OrdersCreateJobTest < ActiveJob::TestCase
  include ActionMailer::TestHelper

  # test 'receives an order and fulfills the files associated with an order' do
  #   filepath = Rails.root.join('test/webhooks/shopify/orders_create.json')
  #   request_body = File.read(filepath)
  #   body = JSON.parse(request_body)
  #   body['id'] = rand(1_000_000)
  #   assert_difference 'ShopOrder.count', 1 do
  #     OrdersCreateJob.handle(topic: 'orders/create', shop: 'pizzabolt.myshopify.com', body: JSON.parse(request_body))
  #   end
  # end
end
