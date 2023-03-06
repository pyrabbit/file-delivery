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
    download_id = SecureRandom.base58(24)
    customer_email = 'user@example.com'
    shop.with_shopify_session do
      FileDeliveryMailer.with(shop_domain:, customer_email:, download_id:).send_files.deliver_later
    end
  end
end
