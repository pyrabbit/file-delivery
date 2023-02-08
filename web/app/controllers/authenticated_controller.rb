# frozen_string_literal: true

class AuthenticatedController < ApplicationController
  include ShopifyApp::EnsureHasSession
  def current_shop
    @current_shop ||= Shop.find_by shopify_domain: current_shopify_domain
  end
  helper_method :current_shop
end
