# frozen_string_literal: true

class OrdersCreateJob < ActiveJob::Base
  extend ShopifyAPI::Webhooks::Handler

  class << self
    def handle(topic:, shop:, body:)
      perform_later(topic:, shop_domain: shop, webhook: body)
    end
  end

  def perform(topic:, shop_domain:, webhook:)
    shop = Shop.find_by(shopify_domain: shop_domain)
    if shop.nil?
      logger.error("#{self.class} failed: cannot find shop with domain '#{shop_domain}'")
      raise ActiveRecord::RecordNotFound, 'Shop Not Found'
    end
    shop_order = shop.shop_orders.create!(order_id: webhook.fetch('id'))
    customer_email = webhook.fetch('contact_email')
    shop.with_shopify_session do
      FileDeliveryMailer.with(shop_domain:, customer_email:, download_id: shop_order.token).send_files.deliver_later
    end
  end
end
