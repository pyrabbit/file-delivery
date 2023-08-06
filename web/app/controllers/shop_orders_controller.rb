# frozen_string_literal: true

class ShopOrdersController < ApplicationController
  before_action :set_shop_order
  def show
    render plain: 'Hello File'
  end

  private

  def set_shop_order
    @shop_order = ShopOrder.find_by(token: params[:token])
  end
end
