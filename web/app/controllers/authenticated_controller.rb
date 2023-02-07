# frozen_string_literal: true

class AuthenticatedController < ApplicationController
  include ShopifyApp::EnsureHasSession
  def current_shop
    Rails.logger.info 'Entering current shop'
    @current_shop ||= Shop.find_by shopify_domain: current_shopify_domain
    Rails.logger.info 'Exiting current shop'
    @current_shop
  end
  helper_method :current_shop
end
