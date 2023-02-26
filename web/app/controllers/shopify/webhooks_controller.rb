# frozen_string_literal: true

module Shopify
  class WebhooksController < ApplicationController
    before_action :validate_webhook

    def validate_webhook
      ShopifyAPI::Webhooks::Registry.process(
        @webhook = ShopifyAPI::Webhooks::Request.new(raw_body: request.raw_post, headers: request.headers.to_h)
      )
    end
  end
end
