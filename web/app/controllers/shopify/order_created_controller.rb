# frozen_string_literal: true

module Shopify
  class OrderCreatedController < WebhooksController
    def create
      @webhook.inspect
    end
  end
end

