# frozen_string_literal: true

module Shopify
  class CreatedOrdersController < WebhooksController
    def process
      @webhook.inspect
    end
  end
end

